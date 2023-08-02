////////////////////////////////////////////////////////////////////////////////
// ErrorBarSeries.ts
// 2023. 07. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp, pickProp3 } from "../../common/Common";
import { IAxis } from "../Axis";
import { DataPoint } from "../DataPoint";
import { BoxSeries } from "./BarSeries";

export class ErrorBarSeriesPoint extends DataPoint {

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

    getYLabel(index: number) {
        return index === 1 ? this.lowValue : this.yValue;
    }

    protected _readArray(series: ErrorBarSeries, v: any[]): void {
        const d = v.length > 2 ? 1 : 0;

        this.low = v[pickNum(series.lowField, 0 + d)];
        this.y = v[pickNum(series.yField, 1 + d)];

        if (d > 0) {
            this.x = v[pickNum(series.xField, 0)];
        } else {
            this.x = this.index;
        }
    }

    protected _readObject(series: ErrorBarSeries, v: any): void {
        super._readObject(series, v);

        this.low = pickProp(v[series.lowField], v.low);
        this.y = pickProp3(v[series.yField], v.y, v.value);
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);

        this.low = this.y;
    }

    parse(series: ErrorBarSeries): void {
        super.parse(series);

        this.lowValue = +this.low;
    }
}

export class ErrorBarSeries extends BoxSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    lowField: string;

    pointPadding = 0.3;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'errorbar';
    }

    clusterable(): boolean {
        return false;
    }

    protected _createPoint(source: any): DataPoint {
        return new ErrorBarSeriesPoint(source);
    }

    collectValues(axis: IAxis): number[] {
        const vals = super.collectValues(axis);

        if (axis === this._yAxisObj) {
            this._visPoints.forEach(p => vals.push((p as ErrorBarSeriesPoint).lowValue))
        }
        return vals;
    }
}