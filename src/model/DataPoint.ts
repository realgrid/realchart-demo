////////////////////////////////////////////////////////////////////////////////
// DataPoint.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNone, isObject, pickNum, pickProp, pickProp3, pickProp4, assign, maxv, minv, absv } from "../common/Common";
import { IPoint } from "../common/Point";
import { IValueRange, _undef } from "../common/Types";
import { AxisZoom, IAxis } from "./Axis";
import { ISeries } from "./Series";

let __point_id__ = 0;

export interface IPointPos {
    xPos: number;
    yPos: number;
    isNull?: boolean;
    range?: IValueRange;
}

/**
 * 데이터 포인트를 표시할 수 없는 값을 설정하면 null로 간주한다.
 * 
 * isNull과 visible은 다르다.
 * isNull이어도 자리를 차지한다.
 * 
 * [y]
 * [x, y]
 */
export class DataPoint {

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static swap(pts: IPointPos[]): IPointPos[] {
        const list = [];
        for (let i = 0; i < pts.length; i++) {
            list.push({xPos: pts[i].yPos, yPos: pts[i].xPos});
        }
        return list;
    }

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    index: number;
    vindex: number;
    x: any;
    y: any;
    /**
     * drilldown series
     */
    series: string | number; 

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly pid = __point_id__++;

    source: any;
    isNull: boolean;
    // Series.collectValues() 등에서 결정된다. x, y와 각각 다른 값으로 설정될 수 있다.
    xValue: number;     // x 좌표상의 value
    yValue: number;     // y 좌표상의 value
    yRate: number;      // 전체 point 합 내에서 비율(백분율)

    visible = true;     // 시리즈에는 표시되지 않지만 legend에는 표시된다.
    color: string;
    xPos: number;
    yPos: number;

    yGroup: number;     // for stacking. stacking 가능한 경우 이 값으로 축 상 위치를 계산한다.
                        // [주의] yValue를 강제로 재설정하는 경우 이 값도 재설정할 것!
    drillDown: any[] | object;  // array이면 현재 시리즈의 data 교체. object면 다른 시리즈로 교체.
    range: IValueRange;

    zValue: number;
    label: any;

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
        return absv(this.yValue);
    }

    get xAbs(): number {
        return absv(this.xValue);
    }

    ariaHint(): string {
        return (this.x || this.xValue) + ', ' + this.yValue;
    }

    labelCount(): number {
        return 1;
    }

    getValue(): number {
        return this.yValue;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    assignTo(proxy?: any): any {
        if (!proxy) proxy = {};
        this._assignTo(proxy);
        return proxy;
    }

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
            if ((isArray(v.drillDown) || isObject(v.drillDown))) {
                this.drillDown = v.drillDown;
            }
        } else {
            this._readSingle(v);
        }
    }

    getLabel(index: number): any {
        return this.label === _undef ? this.yValue : this.label;
    }

    swap(): void {
        const x = this.xPos;
        this.xPos = this.yPos;
        this.yPos = x;
    }

    getTooltipPos(): IPoint {
        return { x: this.xPos, y: this.yPos };
    }

    toPoint(): IPointPos {
        return {
            xPos: this.xPos,
            yPos: this.yPos,
            isNull: this.isNull,
            range: this.range
        };
    }

    setValue(value: any): boolean {
        if (value !== this.yValue) {
            this.yValue = value;
            return true;
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _assignTo(proxy: any): any {
        return assign(proxy, {
            index: this.index,
            vindex: this.vindex,
            x: this.x,
            y: this.y,
            xValue: this.xValue,
            yValue: this.yValue,
            color: this.color,
            source: this.source,
        });
    }

    // protected _colorIndex(): number {
    //     return 2;
    // }

    protected _readArray(series: ISeries, v: any[]): void {
        if (v == null) {
            this.isNull = true;
        } else {
            const f = +series.colorField;

            if (!isNaN(f)) {
                this.color = v[f];
            }

            if (v.length > 1) {
                this.x = v[pickNum(series.xField, 0)];
                this.y = v[pickNum(series.yField, 1)];
            } else {
                this.y = v[pickNum(series.yField, 0)];
            }
        }
    }

    protected _readObject(series: ISeries, v: any): void {
        if (v == null) {
            this.isNull = true;
        } else {
            this.x = pickProp4(series._xFielder(v), v.x, v.name, v.label);
            this.y = pickProp3(series._yFielder(v), v.y, v.value);
            this.color = pickProp(series._colorFielder(v), v.color);
        }
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
    protected _owner: ISeries;
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

    pointAt(xValue: number): DataPoint {
        for (const p of this._points) {
            if (p.xValue === xValue) return p;
        }
    }

    contains(p: DataPoint) {
        return this._points.indexOf(p) >= 0;
    }

    load(source: any): void {
        if (isArray(source)) {
            // x 축에 대한 정보가 없으므로 홑 값들은 앞으로 이동시킨다.
            // source = source.sort((a, b) => {
            //     return ((isArray(a) || isObject(a)) ? 1 : 0) - ((isArray(b) || isObject(b)) ? 1 : 0);
            // });
            this._points = this._owner.createPoints(source);
        } else {
            this._points = [];
        }
    }

    getProps(prop: string | number): any[] {
        return this._points.map(p => p.getProp(prop));
    }

    getCategories(axis: string): any[] {
        return this._points.map(p => p[axis]);
    }

    getProxies(): any[] {
        return this._points.map(p => p.assignTo());
    }

    forEach(callback: (p: DataPoint, i?: number) => any): void {
        for (let i = 0, n = this._points.length; i < n; i++) {
            if (callback(this._points[i], i) === true) break;
        }
    }

    getPoints(xAxis: IAxis, yAxis: IAxis): DataPoint[] {
        const zoom = xAxis._zoom as AxisZoom;

        if (zoom) {
            const pts = this._points;
            const len = pts.length;
            let x1 = zoom.start;
            let x2 = zoom.end;

            if (xAxis.continuous()) {
                let i = 0;
                let p: DataPoint;
                let prev: number;

                prev = Number.MIN_VALUE;
                for (; i < len - 1; i++) {
                    p = pts[i];
                    if (x1 >= prev && x1 < p.xValue + (pts[i + 1].xValue - p.xValue) / 2) {
                        x1 = i;
                        break;
                    }
                    prev = p.xValue;
                }
                if (x1 !== i) {
                    x1 = len - 1;
                }

                prev = Number.MAX_VALUE;
                for (i = len - 1; i > 0; i--) {
                    p = pts[i];
                    if (x2 < prev && x2 > p.xValue - (p.xValue - pts[i - 1].xValue) / 2) {
                        x2 = i;
                        break;
                    }
                    prev = p.xValue;
                }
                if (x2 !== i) {
                    x2 = 0;
                }
                x1 = maxv(x1 - 1, 0);
                x2 = minv(x2 + 1, len - 1);
            } else {
                x1 = maxv(0, Math.floor(x1) - 1);
                x2 = minv(Math.ceil(x2), len - 1);
            }
            return this._points.slice(x1, x2 + 1);
        } else {
            return this._points;
        }
    }
}
