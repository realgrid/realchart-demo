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
    // overriden members
    //-------------------------------------------------------------------------
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
    private _bars = new ElementPool(this, BarElement);

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
        this.$_parepareBars(doc, model._visPoints);
    }

    protected _renderSeries(width: number, height: number): void {
        const series = this.model;
        const xAxis = this.model._xAxisObj;
        const yAxis = this.model._yAxisObj;
        const yBase = yAxis.getPosition(width, yAxis.baseValue);
        const xOrg = 0;

        this._bars.forEach((bar, i) => {
            const wUnit = xAxis.getUnitLength(height, i);
            const wPoint = series.getPointWidth(wUnit);
            let y = height - xAxis.getPosition(height, i) - wUnit / 2;
            let x = xOrg;
            const y2 = yAxis.getPosition(width, bar.point.yValue);

            bar.wPoint = wPoint;
            bar.hPoint = y2 - yBase;

            y += series.getPointPos(wUnit) + wPoint / 2;
            x += yAxis.getPosition(width, bar.point.yGroup) - bar.hPoint;

            bar.render(x, y);
        })
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareBars(doc: Document, points: DataPoint[]): void {
        const color = this.model.color;

        this._bars.prepare(points.length, (v, i) => {
            v.point = points[i];
            v.setStyle('fill', color);
        });
    }
}