////////////////////////////////////////////////////////////////////////////////
// HistogramSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { RcElement } from "../../common/RcControl";
import { SvgShapes } from "../../common/impl/SvgShape";
import { HistogramSeries, HistogramSeriesPoint } from "../../model/series/HistogramSeries";
import { BoxPointElement, IPointView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

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
    protected _getPointPool(): ElementPool<RcElement> {
        return this._bars;
    }

    protected _prepareSeries(doc: Document, model: HistogramSeries): void {
        this.$_parepareBars(doc, model._visPoints as HistogramSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        this.$_layoutBars(width, height);
    }

    protected _runShowEffect(firstTime: boolean): void {
        firstTime && SeriesAnimation.grow(this);
    }

    protected _doViewRateChanged(rate: number): void {
        this.$_layoutBars(this.width, this.height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareBars(doc: Document, points: HistogramSeriesPoint[]): void {
        this._bars.prepare(points.length, (v, i) => {
            v.point = points[i];
        });
    }

    private $_layoutBars(width: number, height: number): void {
        const xAxis = this.model._xAxisObj;
        const yAxis = this.model._yAxisObj;
        const y = this.height;
        const vr = this._getViewRate();

        this._bars.forEach((bar, i) => {
            const p = bar.point as HistogramSeriesPoint;
            const x1 = xAxis.getPosition(width, p.min);
            const x2 = xAxis.getPosition(width, p.max);
            const x = x1 + (x2 - x1) / 2;

            bar.wPoint = Math.max(1, x2 - x1 - 1);
            bar.hPoint = yAxis.getPosition(height, bar.point.yValue) * vr;
            p.xPos = x;
            p.yPos = y - bar.hPoint;
            bar.render(x, y);
        })
    }
}