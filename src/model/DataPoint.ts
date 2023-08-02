////////////////////////////////////////////////////////////////////////////////
// DataPoint.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNone, isObject, pickNum, pickProp3, pickProp4 } from "../common/Common";
import { ISeries } from "./Series";

let __point_id__ = 0;

export class DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    source: any;
    index: number;
    x: any;
    y: any;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly id = __point_id__++;

    // Series.collectValues() 등에서 결정된다. x, y와 각각 다른 값으로 설정될 수 있다.
    xValue: number;     // x 좌표상의 value
    yValue: number;     // y 좌표상의 value
    yRate: number;      // 전체 point 합 내에서 비율(백분율)

    visible = true;
    color: string;
    xPos: number;
    yPos: number;

    yGroup: number;     // for stacking. stacking 가능한 경우 이 값으로 축 상 위치를 계산한다.
                        // [주의] yValue를 강제로 재설정하는 경우 이 값도 재설정할 것!

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(source: any) {
        this.source = source;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get yAbs(): number {
        return Math.abs(this.yValue);
    }

    get xAbs(): number {
        return Math.abs(this.xValue);
    }

    ariaHint(): string {
        return this.x + ', ' + this.yValue;
    }

    labelCount(): number {
        return 1;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getProp(fld: string | number): any {
        if (isNone(this.source)) return this.source;
        else return this.source[fld];
    }

    parse(series: ISeries): void {
        const v = this.source;

        if (isArray(v)) {
            this._readArray(series, v);
        } else if (isObject(v)) {
            this._readObject(series, v);
        } else {
            this._readSingle(v);
        }

        // series.collectValue 등에서 재설정될 수 있다.
        this.yValue = +this.y;
    }

    getYLabel(index: number): any {
        return this.y;// this.yValue;
    }

    getValueOf = (traget: any, param: string): any => {
        return this[param] || this.source[param];
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
        this.color = v.color;
    }

    protected _readSingle(v: any): void {
        // x 축에 대한 정보가 없으므로 홑 값들은 순서대로 값을 지정한다.
        //this.x = this.index;
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
            const series = this._owner;

            // x 축에 대한 정보가 없으므로 홑 값들은 앞으로 이동시킨다.
            source = source.sort((a, b) => {
                return ((isArray(a) || isObject(a)) ? 1 : 0) - ((isArray(b) || isObject(b)) ? 1 : 0);
            });
            this._points = this._owner.createPoints(source);
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

    prepare(): void {
    }

    forEach(callback: (p: DataPoint, i?: number) => any): void {
        for (let i = 0, n = this._points.length; i < n; i++) {
            if (callback(this._points[i], i) === true) break;
        }
    }

    getPoints(): DataPoint[] {
        return this._points;
    }

    getVisibles(): DataPoint[] {
        return this._points;
        // return this._points.filter(p => this._owner.isVisible(p));
    }
}