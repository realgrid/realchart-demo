////////////////////////////////////////////////////////////////////////////////
// ColumnSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { SvgShapes } from "../../common/impl/SvgShape";
import { DataPoint } from "../../model/DataPoint";
import { SeriesGroupLayout } from "../../model/Series";
import { ColumnSeries } from "../../model/series/BarSeries";
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

export class ColumnSeriesView extends SeriesView<ColumnSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars = new ElementPool(this, BarElement);

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-column-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: ColumnSeries): void {
        this.$_parepareBars(doc, model._visPoints);
    }

    protected _renderSeries(width: number, height: number): void {
        const m = this.model;
        const xAxis = this.model._xAxisObj;
        const yAxis = this.model._yAxisObj;
        const yOrg = this.height;

        this._bars.forEach((bar, i) => {
            const wUnit = xAxis.getUnitLength(width, i);
            const wPoint = m.getPointWidth(wUnit);
            let x = xAxis.getPosition(width, i) - wUnit / 2;
            let y = yOrg;

            x += m.getPointPos(wUnit) + wPoint / 2;

            bar.wPoint = wPoint;
            bar.hPoint = yAxis.getPosition(height, bar.point.yValue);
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