////////////////////////////////////////////////////////////////////////////////
// DataPoint.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, pickNum, pickProp, pickProp3, pickProp4, assign, maxv, minv, pickNum3, incv } from "../common/Common";
import { IPoint } from "../common/Point";
import { IValueRange, _undef } from "../common/Types";
import { AxisZoom, IAxis } from "./Axis";
import { ISeries, LowRangedSeries, Series } from "./Series";

let __point_id__ = 0;

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
    yLabel: any;

    // ani: RcAnimation;
    // yPrev: number;
    // yNew: number;
    _prev: any;
    _vr: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(source: any) {
        this.source = source;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
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
    copy(): any {
        return {...this};
    }

    proxy(): any {
        return {
            pid: this.pid,
            xValue: this.xValue,
            yValue: this.yValue,
            zValue: this.zValue
        };
    }

    assignTo(proxy?: any): any {
        if (!proxy) proxy = {};
        this._assignTo(proxy);
        return proxy;
    }

    getProp(fld: string | number): any {
        return this.source !== null && this.source[fld];
    }

    parse(series: ISeries): void {
        const v = this.source;

        if (v == null) {
            this.isNull = true;
        } else if (isArray(v)) {
            if (v.length === 0) {
                this.isNull = true;
            } else {
                this._readArray(series, v);
            }
        } else if (isObject(v)) {
            this._readObject(series, v);
            if ((isArray(v.drillDown) || isObject(v.drillDown))) {
                this.drillDown = v.drillDown;
            }
        } else {
            this._readSingle(v);
        }

        this.initValues();
    }

    getLabelValue(index: number): any {
        return this.yLabel === _undef ? this.yValue : this.yLabel;
    }

    swap(): void {
        const x = this.xPos;
        this.xPos = this.yPos;
        this.yPos = x;
    }

    // updateYValue(value: number, animation: ValueAnimation): void {
    //     if (animation) {
    //         this.yPrev = this.yValue;
    //         this.yNew = value;
    //         this.ani = animation;
    //     } else {
    //         this.y = value; // [주의] Series.collectValues에 yValue가 다시 계산된다.
    //     }
    // }

    // cleanYValue(): void {
    //     this.y = this.yNew;
    //     delete this.yPrev;
    //     delete this.yNew;
    // }

    updateValues(series: ISeries, values: any): any {
        this._prev = this.copy();

        if (isObject(values)) {
            this.source = Object.assign(isObject(this.source) ? this.source : {}, values);
        } else if (isArray(values)) {
            this.source = values.slice(0);
        } else {
            this.source = values;
        }

        this.parse(series);

        if (this._valuesChangd()) {
            return this._prev;
        } else {
            this._prev = _undef;
        }
    }

    getTooltip(param: string): any {
        return param in this ? this[param] : this.source?.[param];
    }

    initValues(): void {
    }

    /**
     * 동적으로 생성 시 animation을 위해 prev 값들을 초기화 한다.
     */
    initPrev(axis: IAxis, prev: any): void {
        prev.yValue = axis.axisMin();
    }

    /**
     * ValueAnimation에서 호출한다.
     * 처음 생성될 때, 값이 변경될 때 모두 호출된다.
     * yValue는 series.collectValues()에서 계산한다.
     */
    applyValueRate(prev: any, vr: number): void {
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

    protected _readArray(series: ISeries, v: any[]): void {
        const f = +series.colorField;

        if (v.length > 1) {
            this.x = v[pickNum(series.xField, 0)];
            this.y = v[pickNum(series.yField, 1)];
        } else {
            this.y = v[0];
        }

        if (!isNaN(f)) {
            this.color = v[f];
        }
    }

    protected _readObject(series: ISeries, v: any): void {
        this.x = pickProp4(series._xFielder(v), v.x, v.name, v.label);
        this.y = pickProp3(series._yFielder(v), v.y, v.value);
        this.color = pickProp(series._colorFielder(v), v.color);
    }

    protected _readSingle(v: any): void {
        // x 축에 대한 정보가 없으므로 홑 값들은 순서대로 값을 지정한다.
        //this.x = this.index;
        this.y = v;
    }

    protected _valuesChangd(): boolean {
        return this.x !== this._prev.x || this.y !== this._prev.y;
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

    pointAt(xValue: number | any): DataPoint {
        if (isObject(xValue)) {
            const id = xValue.pid;
            for (const p of this._points) {
                if (p.pid === id) return p;
            }
        } else {
            for (const p of this._points) {
                if (p.xValue === xValue) return p;
            }
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
            this._points = this._owner.initPoints(source);
        } else {
            this._points = [];
        }
    }

    clear(): void {
        this._points = [];
    }

    add(p: DataPoint): void {
        this._points.push(p);
    }

    remove(p: DataPoint): boolean {
        const i = this._points.indexOf(p);
        if (i >= 0) {
            this._points.splice(i, 1);
            return true;
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
                // x1 = maxv(0, Math.floor(x1) - 1);
                // x2 = minv(Math.ceil(x2), len - 1);
                x1 = maxv(0, Math.floor(x1));
                x2 = minv(Math.ceil(x2), len - 1);
            }
            return this._points.slice(x1, x2 + 1);
        } else {
            return this._points;
        }
    }
}

/**
 * [y, z]
 * [x, y, z]
 */
export class ZValuePoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    z: any;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    override zValue: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    override getLabelValue(index: number): any {
        return this.zValue;
    }

    override getValue(): number {
        return this.zValue;
    }

    getZValue(): number {
        return this.zValue;
    }

    protected override _assignTo(proxy: any): any {
        return assign(super._assignTo(proxy), {
            z: this.z,
            zValue: this.zValue
        });
    }

    protected override _valuesChangd(): boolean {
        return this.z !== this._prev.z || super._valuesChangd();
    }

    protected override _readArray(series: Series, v: any[]): void {
        if (v.length <= 1) {
            this.isNull = true;
        } else {
            const d = v.length > 2 ? 1 : 0;

            if (d > 0) {
                this.x = v[pickNum(series.xField, 0)];
            }
            this.y = v[pickNum(series.yField, 0 + d)];
            this.z = v[pickNum(series.zField, 1 + d)];
        }
    }

    protected override _readObject(series: Series, v: any): void {
        super._readObject(series, v);

        if (!this.isNull) {
            this.z = pickProp(series._zFielder(v), v.z);
        }
    }

    protected override _readSingle(v: any): void {
        super._readSingle(v);

        this.z = this.y;
    }

    override parse(series: Series): void {
        super.parse(series);
        
        this.isNull ||= isNaN(this.zValue);
    }

    override initValues(): void {
        this.zValue = parseFloat(this.z);
    }

    override initPrev(axis: IAxis, prev: any): void {
        prev.yValue = prev.zValue = this.yValue;
    }

    override applyValueRate(prev: any, vr: number): void {
        // yValue는 series.collectValues()에서 한다.
        this.zValue = incv(prev.zValue, this.zValue, vr);
    }
}

/**
 * [low, high |y]
 * [x, low, high | y]
 */
export class RangedPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    low: any;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    lowValue: number;
    get high(): number { return this.y; }
    get highValue(): number { return this.yValue; }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    override labelCount(): number {
        return 2;
    }

    override getLabelValue(index: number) {
        return index === 1 ? this.lowValue : this.yValue;
    }

    protected override _assignTo(proxy: any): any {
        return assign(super._assignTo(proxy), {
            low: this.low,
            high: this.high,
            lowValue: this.lowValue,
            highValue: this.yValue,
        });
    }

    protected override _valuesChangd(): boolean {
        return this.low !== this._prev.low || super._valuesChangd();
    }

    protected override _readArray(series: LowRangedSeries, v: any[]): void {
        const d = v.length > 2 ? 1 : 0;

        this.low = v[pickNum(series.lowField, 0 + d)];
        this.y = v[pickNum3(series.highField, series.yField, 1 + d)];
        if (d > 0) {
            this.x = v[pickNum(series.xField, 0)];
        }
    }

    protected override _readObject(series: LowRangedSeries, v: any): void {
        super._readObject(series, v);

        if (!this.isNull) {
            this.low = pickProp(v[series.lowField], v.low);
            this.y = pickProp3(v[series.highField], v.high, this.y);
        }
    }

    protected override _readSingle(v: any): void {
        super._readSingle(v);

        this.low = this.y;
    }

    override parse(series: LowRangedSeries): void {
        super.parse(series);

        this.isNull ||= isNaN(this.lowValue);
    }

    override initValues(): void {
        this.lowValue = parseFloat(this.low);
    }

    override initPrev(axis: IAxis, prev: any): void {
        prev.yValue = prev.lowValue = this.lowValue; 
    }

    override applyValueRate(prev: any, vr: number): void {
        // yValue는 series.collectValues()에서 한다.
        this.lowValue = incv(prev.lowValue, this.lowValue, vr);
    }
}
