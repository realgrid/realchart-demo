////////////////////////////////////////////////////////////////////////////////
// BarSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { SvgShapes } from "../../common/impl/SvgShape";
import { DataPoint } from "../../model/DataPoint";
import { BarSeries } from "../../model/series/BarSeries";
import { BoxPointElement, SeriesView } from "../SeriesView";

class BarElement extends BoxPointElement {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, null, 'rct-series-bar');
    }

    render(x: number, y: number): void {
        this.setPath(SvgShapes.rect({
            x,
            y: y - this.wPoint / 2,
            width: this.hPoint,
            height: this.wPoint
        }));
    }
}

export class BarSeriesView extends SeriesView<BarSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars: ElementPool<BarElement>;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-bar-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: BarSeries): void {
        const pts = model.getPoints().getVisibles();

        this.$_parepareBars(doc, pts);
    }

    protected _renderSeries(width: number, height: number): void {
        const m = this.model;
        const xAxis = this.model._xAxisObj;
        const yAxis = this.model._yAxisObj;

        this._bars.forEach((bar, i) => {
            const y = height - xAxis.getPosition(height, i);

            bar.wPoint = xAxis.getPointWidth(height, m, bar.point) * m.pointWidth;
            bar.hPoint = yAxis.getPosition(width, bar.point.yValue);
            bar.render(0, y);
        })
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareBars(doc: Document, points: DataPoint[]): void {
        if (!this._bars) {
            this._bars = new ElementPool(this, BarElement);
        }
        this._bars.prepare(points.length, (v, i) => {
            v.point = points[i];
        });
    }
}