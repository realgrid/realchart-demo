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
import { FunnelSeries, FunnelSeriesPoint } from "../../model/series/FunnelSeries";
import { IPointView, PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class FunnelSegment extends PathElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: FunnelSeriesPoint

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS + ' rct-funnel-point');
    }
}

export class FunnelSeriesView extends SeriesView<FunnelSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _segments: ElementPool<FunnelSegment>;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-funnel-series')

        this._segments = new ElementPool(this._pointContainer, FunnelSegment);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._segments;
    }

    protected _prepareSeries(doc: Document, model: FunnelSeries): void {
        this.$_prepareSegments(model._visPoints as FunnelSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        this.$_layoutSegments(width, height);
    }

    protected _runShowEffect(firstTime: boolean): void {
        firstTime && SeriesAnimation.slide(this, { from: this.model.reversed ? 'bottom' : 'top'});
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareSegments(points: FunnelSeriesPoint[]): void {
        const count = points.length;

        this._segments.prepare(count, (m, i) => {
            const p = points[i];

            m.point = p;
            m.setStyle('fill', p.color);
        })
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
        const labels = series.pointLabel;
        const labelViews = this._labelViews();
        const reversed = series.reversed;
        const sz = series.getSize(width, height);
        const szNeck = series.getNeckSize(width, height);
        const builder = new PathBuilder();
        const x1 = (width - sz.width) / 2;
        const y1 = (height - sz.height) / 2;
        const yEnd = y1 + sz.height;
        const xMid = x1 + sz.width / 2;
        const pNeck = sz.height - szNeck.height;
        const yNeck = reversed ? yEnd - pNeck : y1 + pNeck;
        const xNeck = x1 + (sz.width - szNeck.width) / 2;
        let labelView: PointLabelView;

        this._segments.forEach((seg) => {
            const p = seg.point;

            if (seg.setVisible(!p.isNull)) {
                const start = p.yPos * sz.height;
                const end = (p.yPos + p.height) * sz.height;
                const y = reversed ? (yEnd - start) : y1 + start;
                const y2 = reversed ? (yEnd - end) : y1 + end;
                let x: number;
                let x2: number;
                let x3: number;
                let x4: number;

                if (start >= pNeck) {
                    x = xNeck;
                    x2 = x + szNeck.width;
                    builder.move(x, y).lines(x2, y, x2, y2, x, y2);   
                } else if (end < pNeck) {
                    x = getPosAt(y);
                    x2 = x + (xMid - x) * 2;
                    x3 = getPosAt(y2);
                    x4 = x3 + (xMid - x3) * 2;
                    builder.move(x, y).lines(x2, y, x4, y2, x3, y2);
                } else {
                    x = getPosAt(y);
                    x2 = x + (xMid - x) * 2;
                    x3 = xNeck;
                    x4 = x3 + szNeck.width;
                    builder.move(x, y).lines(x2, y, x4, yNeck, x4, y2, x3, y2, x3, yNeck);
                }
    
                const path = builder.close(true);
                seg.setPath(path);
    
                p.xPos = xMid;
                p.yPos = y + (y2 - y) / 2;
    
                // label
                if (labelViews && (labelView = labelViews.get(p, 0))) {
                    const r = labelView.getBBounds();
    
                    labelView.translate(xMid - r.width / 2, y + ((y2 - y) - r.height) / 2);
                }
            }
        });
    }
}