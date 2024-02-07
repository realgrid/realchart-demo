////////////////////////////////////////////////////////////////////////////////
// PieSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { absv, cos, pickNum, sin } from "../../common/Common";
import { ElementPool } from "../../common/ElementPool";
import { PathBuilder } from "../../common/PathBuilder";
import { RcElement } from "../../common/RcControl";
import { Align, fixnum } from "../../common/Types";
import { CircleElement } from "../../common/impl/CircleElement";
import { LabelElement } from "../LabelElement";
import { ISectorShape, SectorElement } from "../../common/impl/SectorElement";
import { TextAnchor } from "../../common/impl/TextElement";
import { PointItemPosition } from "../../model/Series";
import { PieSeries, PieSeriesGroup, PieSeriesLabel, PieSeriesPoint } from "../../model/series/PieSeries";
import { IPointView, PointLabelContainer, PointLabelLine, PointLabelLineContainer, PointLabelView, SeriesView, WidgetSeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class SectorView extends SectorElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: PieSeriesPoint;
    // saveVal: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setPieSector(labels: PointLabelContainer, lines: PointLabelLineContainer, newSector: ISectorShape): void {
        this._assignShape(newSector, false);
    }
}

export class PieSeriesView extends WidgetSeriesView<PieSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _circle: CircleElement;
    private _sectors = new ElementPool(this._pointContainer, SectorView, null, 0.5);
    private _textView: LabelElement;
    private _lineContainer: PointLabelLineContainer;

    private _cx = 0;
    private _cy = 0;
    private _rd = 0;
    private _rdInner = 0;
    private _slicedOff = 0;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-pie-series')

        this.add(this._circle = new CircleElement(doc));
        this._circle.setStyles({
            stroke: '#aaa',
            fill: 'none',
            strokeDasharray: '2'
        });

        this.add(this._textView = new LabelElement(doc, 'rct-pie-series-inner'));
        this._textView._text.anchor = TextAnchor.MIDDLE;
        this.add(this._lineContainer = new PointLabelLineContainer(doc));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._sectors;
    }

    protected _setPointColor(v: RcElement, color: string): void {
        v.setFill(color);
    }

    protected _prepareSeries(doc: Document, model: PieSeries): void {
        super._prepareSeries(doc, model);
        
        this.$_prepareSectors(doc, model, this._visPoints as PieSeriesPoint[]);
        this._lineContainer.prepare(model);

        if (this._textView.setVis(model.hasInner() && model.innerText.isVisible())) {
            this._textView.setModel(doc, model.innerText, null, null);
            model.innerText.buildSvg(this._textView._text, this._textView._outline, NaN, NaN, model, null);
        }
    }

    protected _renderSeries(width: number, height: number): void {
        if (!isNaN(this.model._groupPos)) {
            this.$_calcGroup(width, height);
        } else {
            this.$_calcNormal(width, height);
        }

        this.$_layoutSectors(this._visPoints as PieSeriesPoint[], width, height);
    }

    private $_calcNormal(width: number, height: number): void {
        this._rd = this.model.getRadius(width, height);
        this._rdInner = this.model.getInnerRadius(this._rd);
    }

    private $_calcGroup(width: number, height: number): void {
        const m = this.model;
        const g = m.group as PieSeriesGroup;
        // const sz = Math.floor(g ? g.getPolarSize(width, height) / 2 : m.getRadius(width, height));
        // const szInner = g ? g.getInnerRadius(sz) * sz : m.getInnerRadius(sz);
        const sz = Math.floor(g.getPolarSize(width, height) / 2);
        const szInner = g.getInnerRadius(sz) * sz;
        const len = sz - szInner;

        this._rd = szInner + (m._groupPos + m._groupSize) * len;
        this._rdInner = (szInner + m._groupPos * len) / this._rd;
    }

    protected _runShowEffect(firstTime: boolean): void {
        if (firstTime) {
            SeriesAnimation.grow(this, ani => {
                const v = this._sectors.find(s => s.point.sliced);

                if (v) {
                    v.trans(0, 0);
                    this.$_slice(v, true, false);
                }
            });
        }
    }

    protected _doPointClicked(view: IPointView): void {
        if (view instanceof SectorView) {
            const v = this._sectors.find(s => s.point.sliced);

            if (v) {
                this.$_slice(v, false, true);
            }
            if (view !== v) {
                this.$_slice(view, true, true);
            }
            !this.model.autoSlice && this.invalidate();
        }
    }

    protected _doViewRateChanged(rate: number): void {
        this.$_layoutSectors(this._visPoints as PieSeriesPoint[], this.width, this.height)
    }

    _resizeZombie(): void {
        this._renderSeries(this.width, this.height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    getClipContainer(): RcElement {
        return null;
    }

    private $_prepareSectors(doc: Document, model: PieSeries, points: PieSeriesPoint[]): void {
        this._sectors.prepare(points.length, (sector, i) => {
            const p = sector.point = points[i];
            this._preparePoint(doc, model, p, sector);
        })
    }

    private $_calcAngles(pts: PieSeriesPoint[]): void {
        const cnt = pts.length;
        const cw = this.model.clockwise ? 1 : -1; // [주의]sector들의 배치를 위해 음수로 사용하고, setPieSector()에는 abs로 전달한다.
        const sum = pts.filter(p => (p.visible || p === this._zombie) && !p.isNull)
                          .map(p => p === this._zombie ? p.yValue * this._zombieRate : p.yValue)
                          .reduce((a, c) => a + c, 0);
        const total = this.model._totalRad * this._getGrowRate();
        let start = this.model._startRad;

        if (cnt > 1 || (cnt > 0 && !this._zombie)) {
            pts.forEach(p => {
                if (!p.isNull) {
                    p.yRate = fixnum(p === this._zombie ? p.yValue * this._zombieRate : p.yValue) / sum || 0;
                    p.startAngle = start;
                    start += p.angle = cw * p.yRate * total;
                }
            });
        } else if (cnt == 1) {
            const p = pts[0];

            p.startAngle = start;
            p.angle = cw * this._zombieRate * total;
        }
    }

    private $_layoutSectors(points: PieSeriesPoint[], width: number, height: number): void {
        const series = this.model;
        const cw = series.clockwise;
        const gr = this._getGrowRate();
        const center = series.getCenter(width, height);
        const cx = this._cx = center.x;
        const cy = this._cy = center.y;
        const rd = this._rd;
        const rdInner = this._rdInner;
        const labels = series.pointLabel as PieSeriesLabel;
        const labelViews = this._labelViews();
        const labelInside = series.getLabelPosition() === PointItemPosition.INSIDE;
        const labelOff = labels.getOffset();
        const labelDist = labels.distance || 0;
        const lineViews = this._lineContainer;
        const sliceOff = this._slicedOff = series.getSliceOffset(rd) * gr; // TODO: sector 후에...
        let labelView: PointLabelView;

        if (this._textView.visible) {
            const tr = this._textView.getBBox();
            this._textView.trans(cx, cy - tr.height / 2);
        }

        if (this._circle.visible = this._sectors.isEmpty) {
            this._circle.setCircle(this._cx, this._cy, this._rd);
        }

        this.$_calcAngles(points);

        this._sectors.forEach((sector) => {
            const p = sector.point;

            if (!p.isNull) {
                const start = p.startAngle;
                let dx = 0;
                let dy = 0;
    
                if (p.sliced && gr >= 1 && !sector.isDomAnimating()) {
                    const a = start + p.angle / 2;
                    dx += cos(a) * sliceOff;
                    dy += sin(a) * sliceOff;
                }
                sector.trans(dx, dy).setVis(true);
    
                const a = p.startAngle + p.angle / 2;
                p.xPos = cx + cos(a) * (sliceOff + rd * 0.7);
                p.yPos = cy + sin(a) * (sliceOff + rd * 0.7);
    
                sector.setPieSector(labelViews, /*lines*/null, {
                    cx: cx,// + dx,
                    cy: cy,// + dy,
                    rx: rd,
                    ry: rd,
                    innerRadius: rdInner,
                    start: start,
                    angle: absv(p.angle),
                    clockwise: series.clockwise
                });
    
                // label
                if (labelViews && (labelView = labelViews.get(p, 0))) {
                    const line = lineViews.get(p);

                    // labelView.anchor = TextAnchor.START; // 기본이 MIDDLE이다.

                    if (line.setVis(!labelInside)) {
                        // this.$_layoutLabel(p, labelView, line, off, dist, slicedOff, pb);
                        this.$_layoutLabel(p, labelView, line, labelOff, labelDist, p.sliced ? sliceOff : 0, cw);
                    } else {
                        line.visible = false;
                        // this.$_layoutLabelInner(p, label, off, dist, slicedOff);
                        this.$_layoutLabelInside(p, labelView, labelOff, 0, p.sliced ? sliceOff : 0);
                    }
                    labelView.setContrast(labelInside && sector.dom).setVis(true);
                } else {
                    lineViews.get(p)?.setVis(false);
                }
            } else {
                sector.setVis(false);
                if (labelViews && (labelView = labelViews.get(p, 0))) {
                    labelView.setVis(false);
                }
                lineViews.get(p)?.setVis(false);
            }
        })
    }
    
    private $_layoutLabel(p: PieSeriesPoint, view: PointLabelView, line: PointLabelLine, off: number, dist: number, sliceOff: number, cw: boolean): void {
        const r = view.getBBox();
        const a = p.startAngle + p.angle / 2;
        let cx = this._cx;
        let cy = this._cy;
        let rd = this._rd + dist * 0.8;
        let dx = cos(a) * sliceOff;
        let dy = sin(a) * sliceOff;

        let x1 = cx + cos(a) * this._rd;
        let y1 = cy + sin(a) * this._rd;
        let x2 = cx + cos(a) * rd;
        let y2 = cy + sin(a) * rd;
        const isLeft = x2 < cx;
        let x3: number;

        if (isLeft) {
            x3 = x2 - dist * 0.2;
        } else {
            x3 = x2 + dist * 0.2;
        }

        // line
        if (line && line.setVis(rd > 0)) {
            //line.move(x1, y1);
            //line.setPath(pb.move(x1, y1).lines(x2, y2, x3, y2).end())
            line.setLine(new PathBuilder().move(0, 0).quad(x2 - x1, y2 - y1, x3 - x1, y2 - y1).end())
            line.setPos(x1, y1); // 위치 정보 저장.
            !view.isDomAnimating() && line.trans(x1 + dx, y1 + dy);
        }

        // text
        if (isLeft) {
            x3 -= r.width + off;
            y2 -= r.height / 2;
        } else {
            x3 += off;
            y2 -= r.height / 2;
        }
        view.setPos(x3, y2); // 위치 정보 저장.
        !view.isDomAnimating() && view.layout(Align.CENTER).trans(x3 + dx, y2 + dy);
    }

    private $_layoutLabelInside(p: PieSeriesPoint, view: PointLabelView, off: number, dist: number, sliceOff: number): void {
        const r = view.getBBox();
        const inner = this._rd * this._rdInner;
        const rd = (inner > 0 ? inner + (this._rd - inner) / 2 : this._rd * 0.7) + off;
        const a = p.startAngle + p.angle / 2;
        let x = this._cx + cos(a) * rd;
        let y = this._cy + sin(a) * rd;

        view.move(x - r.width / 2, y - r.height / 2); // 위치 정보 저장.

        x = this._cx + cos(a) * (sliceOff + rd);
        y = this._cy + sin(a) * (sliceOff + rd);
        view.layout(Align.CENTER).trans(x - r.width / 2, y - r.height / 2);
    }

    private $_slice(view: SectorView, sliced: boolean, needLayout: boolean): void {
        const m = this.model;
        const dur = m.autoSlice ? m.sliceDuration : 0;
        const p = view.point;
        const a = p.startAngle + p.angle / 2;

        if (p.sliced = sliced) {
            view.transEx(cos(a) * this._slicedOff, sin(a) * this._slicedOff, dur);
        } else {
            view.transEx(0, 0, dur);
        }

        const labelViews = this._labelViews();
        // TODO: 다이어트할 것!
        if (labelViews) {
            const labels = m.pointLabel;
            const lineViews = this._lineContainer;
            const labelInside = m.getLabelPosition() === PointItemPosition.INSIDE;
            const labelView = labelViews.get(p, 0);
    
            if (labelView) {
                const lineView = !labelInside && lineViews.get(p);
    
                if (needLayout) {
                    if (labelInside) {
                        this.$_layoutLabelInside(p, labelView, labels.getOffset(), labels.distance, this._slicedOff);
                    } else {
                        this.$_layoutLabel(p, labelView, lineView, labels.getOffset(), labels.distance, this._slicedOff, m.clockwise);
                    }
                }
    
                if (sliced) {
                    let tx = labelView.tx;
                    let ty = labelView.ty;
    
                    labelView.trans(labelView.x, labelView.y);
                    labelView.transEx(tx, ty, dur);
    
                    if (lineView) {
                        tx = lineView.tx;
                        ty = lineView.ty;
                        lineView.trans(lineView.x, lineView.y);
                        lineView.transEx(tx, ty, dur);
                    }
                } else {
                    labelView.trans(labelView.tx, labelView.ty);
                    labelView.transEx(labelView.x, labelView.y, dur);
        
                    if (lineView) {
                        lineView.trans(lineView.tx, lineView.ty);
                        lineView.transEx(lineView.x, lineView.y, dur);
                    }
                }
            }
        }
    }
}