////////////////////////////////////////////////////////////////////////////////
// BarRangeSeries.ts
// 2023. 07. 25. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp, pickProp3, assign } from "../../common/Common";
import { DataPoint } from "../DataPoint";
import { CorneredSeries, RangedSeries } from "../Series";

/**
 * [low, y],
 * [x, low, y]
 */
export class BarRangeSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    low: any;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    lowValue: number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    labelCount(): number {
        return 2;
    }

    getLabel(index: number) {
        return index === 1 ? this.lowValue : this.yValue;
    }

    protected _assignTo(proxy: any): any {
        return assign(super._assignTo(proxy), {
            low: this.low,
            lowValue: this.lowValue
        });
    }

    protected _readArray(series: BarRangeSeries, v: any[]): void {
        const d = v.length > 2 ? 1 : 0;

        this.low = v[pickNum(series.lowField, 0 + d)];
        this.y = v[pickNum(series.yField, 1 + d)];
        if (d > 0) {
            this.x = v[pickNum(series.xField, 0)];
        }
    }

    protected _readObject(series: BarRangeSeries, v: any): void {
        super._readObject(series, v);

        this.low = pickProp(v[series.lowField], v.low);
        this.y = pickProp3(v[series.yField], v.y, v.value);
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);

        this.low = this.y;
    }

    parse(series: BarRangeSeries): void {
        super.parse(series);

        this.lowValue = parseFloat(this.low);
    }
}

export class BarRangeSeries extends CorneredSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * json 객체나 배열로 전달되는 데이터포인트 정보에서 low 값을 지정하는 속성명이나 인덱스.\
     * undefined이면, data point의 값이 array일 때는 1, 객체이면 'low'.
     * 
     * @config
     */
    lowField: string;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'barrange';
    }

    pointLabelCount(): number {
        return 2;
    }

    protected _createPoint(source: any): DataPoint {
        return new BarRangeSeriesPoint(source);
    }

    protected _getBottomValue(p: BarRangeSeriesPoint): number {
        return p.lowValue;
    }
}
