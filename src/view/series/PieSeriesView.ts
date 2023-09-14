////////////////////////////////////////////////////////////////////////////////
// PieSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathBuilder } from "../../common/PathBuilder";
import { RcElement } from "../../common/RcControl";
import { ORG_ANGLE, deg2rad } from "../../common/Types";
import { Utils } from "../../common/Utils";
import { CircleElement } from "../../common/impl/CircleElement";
import { ISectorShape, SectorElement } from "../../common/impl/SectorElement";
import { TextElement } from "../../common/impl/TextElement";
import { PointItemPosition } from "../../model/Series";
import { PieSeries, PieSeriesGroup, PieSeriesPoint } from "../../model/series/PieSeries";
import { IPointView, PointLabelContainer, PointLabelLine, PointLabelLineContainer, PointLabelView, SeriesView, WidgetSeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class SectorView extends SectorElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: PieSeriesPoint;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setSectorEx(labels: PointLabelContainer, lines: PointLabelLineContainer, newSector: ISectorShape): void {
        this._assignShape(newSector);
    }
}

export class PieSeriesView extends WidgetSeriesView<PieSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _circle: CircleElement;
    private _sectors = new ElementPool(this._pointContainer, SectorView, null, 0.5);
    private _textView: TextElement;
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

        this.add(this._textView = new TextElement(doc, 'rct-pie-series-inner'));
        this.add(this._lineContainer = new PointLabelLineContainer(doc));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._sectors;
    }

    protected _prepareSeries(doc: Document, model: PieSeries): void {
        super._prepareSeries(doc, model);
        
        this.$_prepareSectors(this._visPoints as PieSeriesPoint[]);
        this._lineContainer.prepare(model);
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
        const sz = this.model.getSize(width, height);

        this._rd = Math.floor(sz / 2);
        this._rdInner = this.model.getInnerRadius(this._rd);
    }

    private $_calcGroup(width: number, height: number): void {
        const m = this.model;
        const g = m.group as PieSeriesGroup;
        const sz = Math.floor(g ? g.getPolarSize(width, height) / 2 : m.getSize(width, height) / 2);
        const szInner = g ? g.getInnerRadius(sz) * sz : m.getInnerRadius(sz);
        const len = sz - szInner;

        this._rd = szInner + (m._groupPos + m._groupSize) * len;
        this._rdInner = (szInner + m._groupPos * len) / this._rd;
    }

    protected _runShowEffect(firstTime: boolean): void {
        firstTime && SeriesAnimation.grow(this);
    }

    protected _doPointClicked(view: IPointView): void {
    }

    _resizeZombie(): void {
        this._renderSeries(this.width, this.height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareSectors(points: PieSeriesPoint[]): void {
        this._sectors.prepare(points.length, (sector, i) => {
            const p = sector.point = points[i];

            this._setPointStyle(sector, p);
            p._calcedColor = getComputedStyle(sector.dom).fill;
        })
    }

    private $_calcAngles(points: PieSeriesPoint[]): void {
        const vr = this._getViewRate();
        let start = ORG_ANGLE + deg2rad(this.model.startAngle);
        const sum = points.filter(p => (p.visible || p === this._zombie) && !p.isNull)
                          .map(p => p === this._zombie ? p.yValue * this._zombieRate : p.yValue)
                          .reduce((a, c) => a + c, 0);

        points.forEach(p => {
            p.yRate = (p === this._zombie ? p.yValue * this._zombieRate : p.yValue) / sum || 0;
            p.startAngle = start;
            start += p.angle = p.yRate * Math.PI * 2 * vr;
        });
    }

    private $_layoutSectors(points: PieSeriesPoint[], width: number, height: number): void {
        const series = this.model;
        const vr = this._getViewRate();
        const center = series.getCenter(width, height);
        const cx = this._cx = center.x;
        const cy = this._cy = center.y;
        const rd = this._rd;
        const rdInner = this._rdInner;
        const labels = series.pointLabel;
        const labelViews = this._labelViews();
        const labelInside = series.getLabelPosition() === PointItemPosition.INSIDE;
        const labelOff = labels.offset;
        const labelDist = labelViews ? (labels.distance || 0) : 0;
        const lineViews = this._lineContainer;
        const sliceOff = this._slicedOff = series.getSliceOffset(rd) * vr; // TODO: sector 후에...
        let labelView: PointLabelView;

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
    
                if (p.sliced) {
                    const a = start + p.angle / 2;
                    dx += Math.cos(a) * sliceOff;
                    dy += Math.sin(a) * sliceOff;
                }
    
                const a = p.startAngle + p.angle / 2;
                p.xPos = cx + Math.cos(a) * (sliceOff + rd * 0.7);
                p.yPos = cy + Math.sin(a) * (sliceOff + rd * 0.7);
    
                sector.setSectorEx(labelViews, /*lines*/null, {
                    cx: cx + dx,
                    cy: cy + dy,
                    rx: rd,
                    ry: rd,
                    innerRadius: rdInner,
                    start: start,
                    angle: p.angle,
                    clockwise: true
                });
    
                // label
                if (labelViews && (labelView = labelViews.get(p, 0))) {
                    const line = lineViews.get(p);

                    if (line.setVisible(!labelInside)) {
                        // this.$_layoutLabel(p, labelView, line, off, dist, slicedOff, pb);
                        this.$_layoutLabel(p, labelView, line, labelOff, labelDist, p.sliced ? sliceOff : 0);
                    } else {
                        line.visible = false;
                        // this.$_layoutLabelInner(p, label, off, dist, slicedOff);
                        this.$_layoutLabelInner(p, labelView, labelOff, 0, p.sliced ? sliceOff : 0);
                    }
                    labelView.setContrast(labelInside && sector.dom);
                } else {
                    lineViews.get(p)?.setVisible(false);
                }
            }
        })
    }
    
    private $_layoutLabel(p: PieSeriesPoint, view: PointLabelView, line: PointLabelLine, off: number, dist: number, sliceOff: number): void {
        const r = view.getBBounds();
        const a = p.startAngle + p.angle / 2;
        const isLeft = Utils.isLeft(a);
        let cx = this._cx;
        let cy = this._cy;
        let rd = this._rd + dist * 0.8;
        let dx = Math.cos(a) * sliceOff;
        let dy = Math.sin(a) * sliceOff;

        let x1 = cx + Math.cos(a) * this._rd;
        let y1 = cy + Math.sin(a) * this._rd;
        let x2 = cx + Math.cos(a) * rd;
        let y2 = cy + Math.sin(a) * rd;
        let x3: number;

        if (isLeft) {
            x3 = x2 - dist * 0.2;
        } else {
            x3 = x2 + dist * 0.2;
        }

        if (line && line.setVisible(rd > 0)) {
            line.move(x1, y1);
            //line.setPath(pb.move(x1, y1).lines(x2, y2, x3, y2).end())
            line.setLine(new PathBuilder().move(0, 0).quad(x2 - x1, y2 - y1, x3 - x1, y2 - y1).end())
            !view.moving && line.translate(x1 + dx, y1 + dy);
        }

        if (isLeft) {
            x3 -= r.width + off;
            y2 -= r.height / 2;
        } else {
            x3 += off;
            y2 -= r.height / 2;
        }
        view.move(x3, y2); // 위치 정보 저장.
        !view.moving && view.layout().translate(x3 + dx, y2 + dy);
    }

    private $_layoutLabelInner(p: PieSeriesPoint, view: PointLabelView, off: number, dist: number, sliceOff: number): void {
        const r = view.getBBounds();
        const a = p.startAngle + p.angle / 2;
        let x = this._cx + Math.cos(a) * (sliceOff + this._rd * 0.7);
        let y = this._cy + Math.sin(a) * (sliceOff + this._rd * 0.7);

        view.layout().translate(x - r.width / 2, y - r.height / 2);
    }

    protected _doViewRateChanged(rate: number): void {
        this.$_layoutSectors(this._visPoints as PieSeriesPoint[], this.width, this.height)
    }
}