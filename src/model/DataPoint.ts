////////////////////////////////////////////////////////////////////////////////
// DataPoint.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNone, isNumber, isObject, pickNum } from "../common/Common";
import { ISeries } from "./Series";

export class DataPoint {

    value: any;
    index: number;
    x: number;
    y: number;

    constructor(source: any) {
        this.value = source;
    }

    getProp(fld: string | number): any {
        if (isNone(this.value)) return this.value;
        else return this.value[fld];
    }
}

export class DataPointCollection {

    private _owner: ISeries;
    private _points: DataPoint[];

    constructor(owner: ISeries) {
        this._owner = owner;
    }

    get count(): number {
        return this._points.length;
    }

    get(index: number): DataPoint {
        return this._points[index];
    }

    load(source: any): void {
        if (isArray(source)) {
            // x 축에 대한 정보가 없으므로 홑 값들은 앞으로 이동시킨다.
            source = source.sort((a, b) => (!isArray(a) && !isObject(a)) ? -1 : 0);
            this._points = source.map((s: any) => new DataPoint(s));
        } else {
            this._points = [];
        }
    }

    getProps(prop: string | number): any[] {
        return this._points.map(p => p.getProp(prop));
    }

    getValues(axis: string): any[] {
        return this._points.map(p => p[axis]);
    }

    /**
     * 각 point의 두 축에 대한 값을 설정한다.
     */
    prepare(): void {
        const series = this._owner;

        this._points.forEach((p, i) => {
            const v = p.value;

            p.index = i;

            if (isArray(v)) {
                p.x = v[pickNum(series.xField, 0)];
                p.y = v[pickNum(series.yField, 1)];
            } else if (isObject(v)) {
                p.x = v[series.xField] || v.x || v.name || v.label;
                p.y = v[series.xField] || v.y || v.value;
            } else {
                // x 축에 대한 정보가 없으므로 홑 값들은 순서대로 값을 지정한다.
                p.x = i;
                p.y = v;
            }
        });
    }

    forEach(callback: (p: DataPoint, i?: number) => any): void {
        for (let i = 0, n = this._points.length; i < n; i++) {
            if (callback(this._points[i], i) === true) break;
        }
    }

    getVisibles(): DataPoint[] {
        return this._points.filter(p => this._owner.isVisible(p));
    }
}