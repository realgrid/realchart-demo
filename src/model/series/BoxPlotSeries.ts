////////////////////////////////////////////////////////////////////////////////
// BoxPlotSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, pickNum, pickProp, pickProp3 } from "../../common/Common";
import { IRect } from "../../common/Rectangle";
import { DataPoint } from "../DataPoint";
import { ISeries } from "../Series";
import { ColumnSeries } from "./BarSeries";

export class BoxPlotSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    min: any;
    low: any;    // first quartile(q1, 25th percentile)
    mid: any;    // median (q2, 50th percentile)
    high: any;   // third quartile (q3 75th percentile)

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    minValue: number;
    lowValue: number;
    midValue: number;
    highValue: number;

    lowPos: number;
    midPos: number;
    highPos: number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    // getInside(): IRect {
    //     return { x: 0, y: 0, width: this.width, height: this.height };
    // }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _readArray(series: BoxPlotSeries, v: any[]): void {
        const d = v.length > 5 ? 1 : 0;

        this.min = v[pickNum(series.minField, 0 + d)];
        this.low = v[pickNum(series.lowField, 1 + d)];
        this.mid = v[pickNum(series.midField, 2 + d)];
        this.high = v[pickNum(series.highField, 3 + d)];
        this.y = v[pickNum(series.yField, 4 + d)];

        if (d > 0) {
            this.x = v[pickNum(series.xField, 0)];
        } else {
            this.x = this.index;
        }
    }

    protected _readObject(series: BoxPlotSeries, v: any): void {
        super._readObject(series, v);

        this.min = pickProp(v[series.minField], v.min);
        this.low = pickProp(v[series.lowField], v.low);
        this.mid = pickProp(v[series.midField], v.mid);
        this.high = pickProp(v[series.highField], v.high);
        this.y = pickProp3(v[series.yField], v.y, v.value);
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);

        this.min = this.low = this.mid = this.high = this.y;
    }

    prepare(series: BoxPlotSeries): void {
        super.prepare(series);

        this.minValue = +this.min;
        this.lowValue = +this.low;
        this.midValue = +this.mid;
        this.highValue = +this.high;
    }
}

export class BoxPlotSeries extends ColumnSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    minField: string;
    lowField: string;
    midField: string;
    highField: string;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    createPoint(source: any): DataPoint {
        return new BoxPlotSeriesPoint(source);
    }
}