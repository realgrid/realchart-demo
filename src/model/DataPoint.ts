////////////////////////////////////////////////////////////////////////////////
// DataPoint.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNone } from "../common/Common";
import { IAxis } from "./ChartItem";

export class DataPoint {

    value: any;

    constructor(source: any) {
        this.value = source;
    }

    getValue(fld: any, index: number): any {
        if (isNone(this.value)) return this.value;
        if (isArray(this.value)) return this.value[index];
        else return this.value[fld];
    }
}

export class DataPointCollection {

    private _points: DataPoint[];

    get count(): number {
        return this._points.length;
    }

    load(source: any): void {
        if (isArray(source)) {
            this._points = source.map(s => new DataPoint(s));
        }
    }

    getValues(fld: any, index = -1): any[] {
        if (index >= 0) {
            return this._points.map(p => p.getValue(fld, index));
        } else {
            return this._points.map(p => isNone(p.value) ? p.value : p.value[fld]);
        }
    }

    /**
     * 각 point의 두 축에 대한 값을 설정한다.
     * 값이 null인 것들은 별도로 모아서 axis unit 단위로 순서대로 설정한다.
     */
    prepareRender(xAxis: IAxis, xField: string, yAxis: IAxis, yField: string): void {
    }
}