////////////////////////////////////////////////////////////////////////////////
// FunnelSeriesView.ts
// 2023. 07. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathBuilder } from "../../common/PathBuilder";
import { PathElement, RcElement } from "../../common/RcControl";
import { IRect } from "../../common/Rectangle";
import { fixnum } from "../../common/Types";
import { PointItemPosition } from "../../model/Series";
import { FunnelSeries, FunnelSeriesPoint } from "../../model/series/FunnelSeries";
import { IPointView, PointLabelLine, PointLabelLineContainer, PointLabelView, SeriesView, WidgetSeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class FunnelSegment extends PathElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: FunnelSeriesPoint
    ny: number;
    nx1: number;
    nx2: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS);
    }
}

export class FunnelSeriesView extends WidgetSeriesView<FunnelSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _segments: ElementPool<FunnelSegment>;
    private _lineContainer: PointLabelLineContainer;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-funnel-series')

        this._segments = new ElementPool(this._pointContainer, FunnelSegment);
        this.add(this._lineContainer = new PointLabelLineContainer(doc));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._segments;
    }

    protected _prepareSeries(doc: Document, model: FunnelSeries): void {
        super._prepareSeries(doc, model);

        this.$_prepareSegments(doc, model, this._visPoints as FunnelSeriesPoint[]);
        this._lineContainer.prepare(model);
    }

    protected _renderSeries(width: number, height: number): void {
        this.$_calcRates(this._visPoints as FunnelSeriesPoint[]);
        this.$_layoutSegments(width, height);
    }

    protected _runShowEffect(firstTime: boolean): void {
        firstTime && SeriesAnimation.slide(this, { from: this.model.reversed ? 'bottom' : 'top'});
    }

    _resizeZombie(): void {
        this._renderSeries(this.width, this.height);
    }

    _animationStarted(ani: Animation): void {
        super._animationStarted(ani);
        this._lineContainer.setVis(this._labelContainer.visible);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareSegments(doc: Document, model: FunnelSeries, pts: FunnelSeriesPoint[]): void {
        this._segments.prepare(pts.length, (seg, i) => {
            const p = seg.point = pts[i];
            this._preparePoint(doc, model, p, seg);
        })
    }

    private $_calcRates(pts: FunnelSeriesPoint[]): void {
        const cnt = pts.length;
        let sum = 0;
        let y = 0;

        pts.forEach(p => {
            sum += p.yValue * (p === this._zombie ? this._zombieRate : 1);
        });

        if (cnt > 1 || (cnt > 0 && !this._zombie)) {
            let i = 0;

            for (; i < cnt - 1; i++) {
                const p = pts[i];
                const h = fixnum((p.yValue * (p === this._zombie ? this._zombieRate : 1)) / sum) || 0;
    
                p.yRate = h * 100;
                p.yPos = y;
                p.height = h;
                y += h;
            }
            pts[i].yPos = y;
            pts[i].height = 1 - y;
        } else if (cnt == 1) {
            const p = pts[0];
            const h = fixnum(this._zombieRate);

            y = 1 - h;
            p.yRate = h * 100;
            p.yPos = y;
            p.height = h;
            p.yPos = y;
            p.height = 1 - y;
        }
    }

    private $_layoutSegments(width: number, height: number): void {

        function getPosAt(y: number): number {
            if (reversed) {
                return x1 + (xNeck - x1) * (yEnd - y) / (yEnd - yNeck);
            } else {
                return x1 + (xNeck - x1) * (y - y1) / (yNeck - y1);
            }
        }
        const series = this.model;
        const labelViews = this._labelViews();
        const labelInside = series.getLabelPosition() === PointItemPosition.INSIDE;
        const labels = series.pointLabel;
        const labelOff = labels.getOffset();
        const labelDist = labelViews ? (labels.distance || 0) : 0;
        const lineViews = this._lineContainer;
        const reversed = series.reversed;
        const sz = series.getSize(width, height);
        const szNeck = series.getNeckSize(sz.width, sz.height);
        const builder = new PathBuilder();
        const center = series.getCenter(width, height);
        const x1 = center.x - sz.width / 2;
        const y1 = center.y - sz.height / 2;
        const yEnd = y1 + sz.height;
        const xMid = x1 + sz.width / 2;
        const pNeck = sz.height - szNeck.height;
        const xNeck = x1 + (sz.width - szNeck.width) / 2;
        const yNeck = reversed ? yEnd - pNeck : y1 + pNeck;
        let labelView: PointLabelView;

        // animation 시작 때 감춰진 걸 표시한다.
        this._lineContainer.setVis(labelViews && !labelInside);

        this._segments.forEach((seg) => {
            const p = seg.point;

            if (seg.setVis(!p.isNull)) {
                const start = p.yPos * sz.height;
                const end = (p.yPos + p.height) * sz.height;
                const y = reversed ? (yEnd - start) : y1 + start;
                const y2 = reversed ? (yEnd - end) : y1 + end;
                let x: number;
                let x2: number;
                let x3: number;
                let x4: number;

                if (start >= pNeck) { // neck 아래 직사각형
                    x = xNeck;
                    x2 = x + szNeck.width;
                    builder.move(x, y).lines(x2, y, x2, y2, x, y2);   
                    seg.ny = seg.nx1 = NaN;
                } else if (end < pNeck) { // neck 위에 사다리꼴
                    x = getPosAt(y);
                    x2 = x + (xMid - x) * 2;
                    x3 = getPosAt(y2);
                    x4 = x3 + (xMid - x3) * 2;
                    builder.move(x, y).lines(x2, y, x4, y2, x3, y2);
                    seg.ny = NaN;
                    seg.nx1 = x3 - x;
                    seg.nx2 = x4 - x;
                } else { // neck에 걸친 사다리꼴
                    x = getPosAt(y);
                    x2 = x + (xMid - x) * 2;
                    x3 = xNeck;
                    x4 = x3 + szNeck.width;
                    builder.move(x, y).lines(x2, y, x4, yNeck, x4, y2, x3, y2, x3, yNeck);
                    seg.ny = yNeck - y;
                    seg.nx1 = x3 - x;
                    seg.nx2 = x4 - x;
                }
    
                seg.setPath(builder.close(true));

                p.xPos = xMid;
                p.yPos = y + (y2 - y) / 2;
    
                // label
                if (labelViews && (labelView = labelViews.get(p, 0))) {
                    const line = lineViews.get(p);

                    // labelView.anchor = TextAnchor.START; // 기본이 MIDDLE이다.

                    if (line.setVis(!labelInside)) {
                        const rSeg = seg.getBBounds();
                        let lx = p.xPos;
                        let ly = p.yPos;

                        if (!isNaN(seg.ny)) { // neck에 걸친 segment
                            if (Math.abs(seg.ny) > rSeg.height / 2) {
                                lx -= (seg.nx1 * rSeg.height / 2) / Math.abs(seg.ny);
                            }
                        } else if (!isNaN(seg.nx1)) { // 사디리꼴
                            lx -= (seg.nx1 * rSeg.height / 2) / rSeg.height;
                        }

                        this.$_layoutLabel(labelView, rSeg, line, labelOff, labelDist, lx, ly);
                    } else {
                        this.$_layoutLabelInner(labelView, p.xPos, p.yPos);
                    }
                    labelView.setContrast(labelInside && seg.dom);
                } else {
                    lineViews.get(p)?.setVis(false);
                }
            }
        });
    }

    private $_layoutLabel(labelView: PointLabelView, rSeg: IRect, line: PointLabelLine, off: number, dist: number, x: number, y: number): void {
        const r = labelView.getBBounds();
        
        x += rSeg.width / 2;
        line.setLine(new PathBuilder().move(0, 0).line(dist, 0).end());
        line.translate(x, y);

        x += dist+ off;
        labelView.translate(x, y - r.height / 2);
    }

    private $_layoutLabelInner(labelView: PointLabelView, x: number, y: number): void {
        const r = labelView.getBBounds();
    
        labelView.translate(x - r.width / 2, y - r.height / 2);
    }
}