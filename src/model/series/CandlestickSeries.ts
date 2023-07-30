////////////////////////////////////////////////////////////////////////////////
// CandlestickSeries.ts
// 2023. 07. 29. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp } from "../../common/Common";
import { IAxis } from "../Axis";
import { DataPoint } from "../DataPoint";
import { BoxSeries } from "./BarSeries";

/**
 * [low, close, open, high]
 * [x, low, close, open, high]
 */
export class CandlestickSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    low: any;
    close: any;
    open: any;
    high: any;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    lowValue: number;
    closeValue: number;
    openValue: number;
    highValue: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    parse(series: CandlestickSeries): void {
        super.parse(series);

        this.lowValue = +this.low;
        this.closeValue = +this.close;
        this.openValue = +this.open;
        this.highValue = +this.high;
    }

    protected _readArray(series: CandlestickSeries, v: any[]): void {
        const d = v.length > 4 ? 1 : 0;

        this.low = v[pickNum(series.lowProp, 0 + d)];
        this.close = v[pickNum(series.closeProp, 1 + d)];
        this.open = v[pickNum(series.openProp, 2 + d)];
        this.y = this.high = v[pickNum(series.highProp, 3 + d)];

        if (d > 0) {
            this.x = v[pickNum(series.xProp, 0)];
        } else {
            this.x = this.index;
        }
    }

    protected _readObject(series: CandlestickSeries, v: any): void {
        super._readObject(series, v);

        this.low = pickProp(v[series.lowProp], v.row);
        this.close = pickProp(v[series.closeProp], v.close);
        this.open = pickProp(v[series.openProp], v.open);
        this.high = pickProp(v[series.highProp], v.high);
        if (!isNaN(this.high)) this.y = this.high;
        else if (!isNaN(this.y)) this.high = this.y;
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);

        this.low = this.close = this.open = this.high = this.y;
    }
}

export class CandlestickSeries extends BoxSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    lowProp: string;
    closeProp: string;
    openProp: string;
    highProp: string;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'candlestick';
    }

    canCategorized(): boolean {
        return true;
    }

    protected _createPoint(source: any): DataPoint {
        return new CandlestickSeriesPoint(source);
    }

    collectValues(axis: IAxis): number[] {
        const vals = super.collectValues(axis);

        if (axis === this._yAxisObj) {
            this._visPoints.forEach((p: CandlestickSeriesPoint) => {
                vals.push(p.lowValue);
            })
        }
        return vals;
    }
}