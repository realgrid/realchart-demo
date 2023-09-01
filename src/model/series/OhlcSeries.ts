////////////////////////////////////////////////////////////////////////////////
// OhlcSeries.ts
// 2023. 08. 08. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp } from "../../common/Common";
import { IAxis } from "../Axis";
import { DataPoint } from "../DataPoint";
import { ClusterableSeries, RangedSeries } from "../Series";

/**
 * Low/Open/Close/High 네 값을 수직선(low-high)과 
 * 왼쪽(open), 오른쪽(close) 수평 선분으로 표시한다.<br>
 * close가 open보다 큰 경와 작은 경우를 다른 색으로 표시할 수 있다.<br>
 * 일정 기간 동안 한 값의 대체적인 변화를 표시한다.
 *
 * [low, open, close, high]
 * [x, low, open, close, high]
 */
export class OhlcSeriesPoint extends DataPoint {

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
    parse(series: OhlcSeries): void {
        super.parse(series);

        this.lowValue = parseFloat(this.low);
        this.openValue = parseFloat(this.open);
        this.closeValue = parseFloat(this.close);
        this.highValue = parseFloat(this.high);
    }

    protected _readArray(series: OhlcSeries, v: any[]): void {
        const d = v.length > 4 ? 1 : 0;

        this.low = v[pickNum(series.lowField, 0 + d)];
        this.open = v[pickNum(series.openField, 1 + d)];
        this.close = v[pickNum(series.closeField, 2 + d)];
        this.y = this.high = v[pickNum(series.highField, 3 + d)];

        if (d > 0) {
            this.x = v[pickNum(series.xField, 0)];
        } else {
            this.x = this.index;
        }
    }

    protected _readObject(series: OhlcSeries, v: any): void {
        super._readObject(series, v);

        this.low = pickProp(v[series.lowField], v.row);
        this.open = pickProp(v[series.openField], v.open);
        this.close = pickProp(v[series.closeField], v.close);
        this.high = pickProp(v[series.highField], v.high);
        if (!isNaN(this.high)) this.y = this.high;
        else if (!isNaN(this.y)) this.high = this.y;
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);

        this.low = this.close = this.open = this.high = this.y;
    }
}

export class OhlcSeries extends RangedSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    lowField: string;
    openField: string;
    closeField: string;
    highField: string;

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
        return 'ohlc';
    }

    canCategorized(): boolean {
        return true;
    }

    protected _createPoint(source: any): DataPoint {
        return new OhlcSeriesPoint(source);
    }

    protected _getBottomValue(p: OhlcSeriesPoint): number {
        return p.lowValue;
    }
}