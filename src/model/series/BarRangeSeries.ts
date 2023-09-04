////////////////////////////////////////////////////////////////////////////////
// BarRangeSeries.ts
// 2023. 07. 25. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp, pickProp3 } from "../../common/Common";
import { DataPoint } from "../DataPoint";
import { RangedSeries } from "../Series";

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

    protected _readArray(series: BarRangeSeries, v: any[]): void {
        const d = v.length > 2 ? 1 : 0;

        this.low = v[pickNum(series.lowField, 0 + d)];
        this.y = v[pickNum(series.yField, 1 + d)];

        if (d > 0) {
            this.x = v[pickNum(series.xField, 0)];
        } else {
            this.x = this.index;
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

export class BarRangeSeries extends RangedSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    lowField: string;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'barrange';
    }

    protected _createPoint(source: any): DataPoint {
        return new BarRangeSeriesPoint(source);
    }

    protected _getBottomValue(p: BarRangeSeriesPoint): number {
        return p.lowValue;
    }
}
