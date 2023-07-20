////////////////////////////////////////////////////////////////////////////////
// HistogramSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { SvgShapes } from "../../common/impl/SvgShape";
import { HistogramSeries, HistogramSeriesPoint } from "../../model/series/HistogramSeries";
import { BoxPointElement, SeriesView } from "../SeriesView";

class BarElement extends BoxPointElement {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    render(x: number, y: number): void {
        this.setPath(SvgShapes.rect({
            x: x - this.wPoint / 2,
            y,
            width: this.wPoint,
            height: -this.hPoint
        }));
    }
}

export class HistogramSeriesView extends SeriesView<HistogramSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars: ElementPool<BarElement> = new ElementPool(this._pointContainer, BarElement);

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-histogram-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: HistogramSeries): void {
        this.$_parepareBars(doc, model._visPoints as HistogramSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        const xAxis = this.model._xAxisObj;
        const yAxis = this.model._yAxisObj;
        const y = this.height;

        this._bars.forEach((bar, i) => {
            const p = bar.point as HistogramSeriesPoint;
            const x1 = xAxis.getPosition(width, p.min);
            const x2 = xAxis.getPosition(width, p.max);
            const x = x1 + (x2 - x1) / 2;

            bar.wPoint = Math.max(1, x2 - x1 - 1);
            bar.hPoint = yAxis.getPosition(height, bar.point.yValue);
            bar.render(x, y);
        })
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareBars(doc: Document, points: HistogramSeriesPoint[]): void {
        this._bars.prepare(points.length, (v, i) => {
            v.point = points[i];
        });
    }
}