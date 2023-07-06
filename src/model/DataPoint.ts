////////////////////////////////////////////////////////////////////////////////
// DataPoint.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNone, isObject, pickNum } from "../common/Common";
import { ISeries } from "./Series";

export class DataPoint {

    value: any;
    index: number;
    x: any;
    y: any;

    xValue: number;
    yValue: number;
    visible: boolean;
    color: string;

    constructor(source: any) {
        this.value = source;
    }

    getProp(fld: string | number): any {
        if (isNone(this.value)) return this.value;
        else return this.value[fld];
    }

    prepare(series: ISeries): void {
        const v = this.value;

        if (isArray(v)) {
            this.x = v[pickNum(series.xField, 0)];
            this.y = v[pickNum(series.yField, 1)];
        } else if (isObject(v)) {
            this.x = v[series.xField] || v.x || v.name || v.label;
            this.y = v[series.yField] || v.y || v.value;
        } else {
            // x 축에 대한 정보가 없으므로 홑 값들은 순서대로 값을 지정한다.
            this.x = this.index;
            this.y = v;
        }
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

    isEmpty(): boolean {
        return this._points.length < 1;
    }

    get(index: number): DataPoint {
        return this._points[index];
    }

    load(source: any): void {
        if (isArray(source)) {
            // x 축에 대한 정보가 없으므로 홑 값들은 앞으로 이동시킨다.
            source = source.sort((a, b) => (!isArray(a) && !isObject(a)) ? -1 : 0);
            this._points = source.map((s: any) => this._owner.createPoint(s));
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
            p.index = i;
            p.prepare(series);
        });
    }

    forEach(callback: (p: DataPoint, i?: number) => any): void {
        for (let i = 0, n = this._points.length; i < n; i++) {
            if (callback(this._points[i], i) === true) break;
        }
    }

    getVisibles(): DataPoint[] {
        return this._points;
        // return this._points.filter(p => this._owner.isVisible(p));
    }
}