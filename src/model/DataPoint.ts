////////////////////////////////////////////////////////////////////////////////
// DataPoint.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNone, isObject, pickNum, pickProp3, pickProp4 } from "../common/Common";
import { ISeries } from "./Series";

export class DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    value: any;
    index: number;
    x: any;
    y: any;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    // Series.collectValues()에서 결정된다. x, y와 각각 다른 값으로 설정될 수 있다.
    xValue: number;
    yValue: number;

    visible = true;
    color: string;
    xPos: number;
    yPos: number;

    yGroup: number;   // for stacking

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(source: any) {
        this.value = source;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getProp(fld: string | number): any {
        if (isNone(this.value)) return this.value;
        else return this.value[fld];
    }

    prepare(series: ISeries): void {
        const v = this.value;

        if (isArray(v)) {
            this._readArray(series, v);
        } else if (isObject(v)) {
            this._readObject(series, v);
        } else {
            this._readSingle(v);
        }
        this.yValue = +this.y;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _readArray(series: ISeries, v: any[]): void {
        if (v.length > 1) {
            this.x = v[pickNum(series.xField, 0)];
            this.y = v[pickNum(series.yField, 1)];
        } else {
            this.x = this.index;
            this.y = v[pickNum(series.yField, 0)];
        }
    }

    protected _readObject(series: ISeries, v: any): void {
        this.x = pickProp4(v[series.xField], v.x, v.name, v.label);
        this.y = pickProp3(v[series.yField], v.y, v.value);
    }

    protected _readSingle(v: any): void {
        // x 축에 대한 정보가 없으므로 홑 값들은 순서대로 값을 지정한다.
        this.x = this.index;
        this.y = v;
    }
}

export class DataPointCollection {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _owner: ISeries;
    private _points: DataPoint[] = [];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(owner: ISeries) {
        this._owner = owner;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get count(): number {
        return this._points.length;
    }

    isEmpty(): boolean {
        return this._points.length < 1;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    get(index: number): DataPoint {
        return this._points[index];
    }

    load(source: any): void {
        if (isArray(source)) {
            // x 축에 대한 정보가 없으므로 홑 값들은 앞으로 이동시킨다.
            source = source.sort((a, b) => {
                return ((isArray(a) || isObject(a)) ? 1 : 0) - ((isArray(b) || isObject(b)) ? 1 : 0);
            });
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
            p.yGroup = p.y; // 추 후 Axis에서 변경할 수 있다.
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