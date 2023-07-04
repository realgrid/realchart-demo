////////////////////////////////////////////////////////////////////////////////
// ColumnSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathElement, RcElement } from "../../common/RcControl";
import { SvgShapes } from "../../common/impl/SvgShape";
import { Axis } from "../../model/Axis";
import { DataPoint } from "../../model/DataPoint";
import { ColumnSeries } from "../../model/series/BarSeries";
import { PointLabelView, SeriesView } from "../SeriesView";

class BarElement extends PathElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: DataPoint;
    labelViews: PointLabelView[] = [];
    wPoint: number;
    hPoint: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, null, 'rct-series-bar');
    }

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
    private _bars: ElementPool<BarElement>;

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
        const pts = model.getPoints().getVisibles();

        this.$_parepareBars(doc, pts);
    }

    protected _renderSeries(width: number, height: number): void {
        const ticks = (this.model._xAxisObj as Axis)._ticks;
        const y = this.height;

        this._bars.forEach((bar, i) => {
            const x = ticks[i].pos;
            bar.render(x, y);
        })
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareBars(doc: Document, points: DataPoint[]): void {
        const xAxis = this.model._xAxisObj;
        const yAxis = this.model._yAxisObj;

        if (!this._bars) {
            this._bars = new ElementPool(this, BarElement);
        }
        this._bars.prepare(points.length, (v, i) => {
            v.point = points[i];
            v.wPoint = 50;
            v.hPoint = 100;
        });
    }
}