////////////////////////////////////////////////////////////////////////////////
// Axis.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNumber, isObject, isString } from "../common/Common";
import { IChart } from "./Chart";
import { ChartItem } from "./ChartItem";
import { DataPoint } from "./DataPoint";
import { ISeries } from "./Series";

export interface IAxis {

    valueUnit: number;
    /**
     * data point의 값을 축 상의 값으로 리턴한다.
     */
    getValue(value: any): number;
    contains(value: number): boolean;
    getPosition(length: number, value: number): number;
    /**
     * 축 단위 값에 해당하는 너비. 
     */
    getPointWidth(length: number, series: ISeries, point: DataPoint): number;
}

export class AxisItem extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly axis: Axis;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(axis: Axis) {
        super(axis?.chart);

        this.axis = axis;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

export class AxisTitle extends AxisItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    text = 'Axis Title';
    margin = 8;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

export class AxisGrid extends AxisItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    circular = false;
    startVisible = true;
    endVisible = true;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

export class AxisTickLabel extends AxisItem {
}

/**
 * 기본적으로 tick 위치에 선으로 표시된다.
 */
export class AxisTickMark extends AxisItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * axis tick line length.
     */
    length = 7;
}

export class AxisBreak extends AxisItem {
}

/**
 * 축 상의 특정 값 위치를 나타낸다.
 * 카테고리 축의 경우 각 카테고리 값의 위치이다.
 */
export class AxisTick extends AxisItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    prefix: string;
    suffix: string;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    mark: AxisTickMark;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: Axis) {
        super(axis);

        this.mark = this._createMark();
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getTick(v: any): string {
        if (v != null) {
            let s = String(v);
            if (this.prefix) s = this.prefix + s;
            if (this.suffix) s += this.suffix;
            return s;
        } else {
            return '';
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _createMark(): AxisTickMark {
        return new AxisTickMark(this.axis);
    }
}

export interface IAxisTick {
    pos: number;
    value: number;
    label: string;
}

/**
 * 차트에서 축을 명식적으로 지정하지 않으면, 첫번째 시리즈에 합당한 축이 기본 생성된다.
 */
export abstract class Axis extends ChartItem implements IAxis {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * true면 기본 위치(x축: bottom, y축: left)의 반대편에 표시된다.
     */
    opposite = false;
    /**
     * true면 반대 방향으로 point 위치들이 지정된다.
     */
    reversed = false;
    /**
     * 축 최소값 위치에서 축 바깥 방향으로 추가되는 여백 크기.
     */
    minPadding = 0;
    /**
     * 축 최대값 위치에서 축 바깥 방향으로 추가되는 여백 크기.
     */
    maxPadding = 0;
    /**
     * 축 시작 위치에 tick이 표시되지 않게 계산될 때,
     * (ex, 첫번째 tick 이전에 data point가 표시될 수 있다.)
     * tick이 표시되도록 조정한다.
     */
    tickStart = false;
    /**
     * 축 끝 위치에 tick이 표시되지 않게 계산될 때,
     * (ex, 마자믹 tick 이후에 data point가 표시될 수 있다.)
     * tick이 표시되도록 조정한다.
     */
    tickEnd = false;
    valueUnit = 1;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly name: string;
    readonly title: AxisTitle;
    readonly tick: AxisTick;
    readonly grid: AxisGrid;

    protected _series: ISeries[] = [];
    _range: { min: number, max: number };
    _ticks: IAxisTick[];
    _reversed: boolean;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart);

        this.name = name;
        this.title = new AxisTitle(this);
        this.tick = this._createTick();
        this.grid = new AxisGrid(this);
    }

    protected _createTick(): AxisTick {
        return new AxisTick(this);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    protected abstract _doPrepareRender(): void;
    protected abstract _doBuildTicks(min: number, max: number, length: number): IAxisTick[];

    prepareRender(): void {
        this._reversed = this.chart.isInverted();

        this._doPrepareRender();

        let vals: number[] = [];

        this._series.forEach(ser => {
            vals = vals.concat(ser.collectValues(this));
        })
        this._range = this._doCalcluateRange(vals);
    }

    buildTicks(length: number): void {
        this._ticks = this._doBuildTicks(this._range.min, this._range.max, length);
    }

    /**
     * value에 해당하는 축상의 위치.
     */
    abstract getPosition(length: number, value: number): number;
    abstract getPointWidth(length: number, series: ISeries, point: DataPoint): number;

    getValue(value: any): number {
        return +value;
    }

    contains(value: number): boolean {
        return value >= this._range.min && value <= this._range.max;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    _connect(series: ISeries): void {
        if (series && !this._series.includes(series)) {
            this._series.push(series);
        }
    }

    protected _doCalcluateRange(values: number[]): { min: number, max: number } {
        let min = Math.min(...values) || 0;
        let max = Math.max(...values) || 0;

        return { min, max };
    }
}

export class AxisCollection {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly chart: IChart;
    readonly isX: boolean;
    private _items: Axis[] = [];
    private _map = new Map<string, Axis>();

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, isX: boolean) {
        this.chart = chart;
        this.isX = isX;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get count(): number {
        return this._items.length;
    }

    get first(): Axis {
        return this._items[0];
    }

    get items(): Axis[] {
        return this._items.slice(0);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(src: any): void {
        const chart = this.chart;
        const items = this._items;

        if (isArray(src)) {
            src.forEach((s, i) => items.push(this.$_loadAxis(chart, s, i)));
        } else if (isObject(src)) {
            items.push(this.$_loadAxis(chart, src, 0));
        }
    }

    get(name: string): Axis {
        return this._map.get(name);
    }

    prepareRender(): void {
        this._items.forEach(axis => axis.prepareRender());
    }

    buildTicks(length: number): void {
        this._items.forEach(axis => axis.buildTicks(length));
    }

    connect(series: ISeries): Axis {
        const items = this._items;
        const a = this.isX ? series.xAxis : series.yAxis;
        let axis: Axis;

        if (isNumber(a) && a >= 0 && items.length) {
            axis = items[a];
        } else if (isString(a)) {
            axis = items.find(item => item.name === a);
        }
        if (!axis) {
            axis = items[0];
        }

        if (axis) {
            axis._connect(series);
        }
        return axis;
    }

    forEach(callback: (p: Axis, i?: number) => any): void {
        for (let i = 0, n = this._items.length; i < n; i++) {
            if (callback(this._items[i], i) === true) break;
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadAxis(chart: IChart, src: any, index: number): Axis {
        let cls = chart._getAxisType(src.type);

        if (!cls) {
            let t: string;

            if (isArray(src.categories)) {
                t = 'category';
            } else if (this.isX) {
                for (const ser of chart._getSeries().items()) {
                    if (ser.isCategorized()) {
                        if (src.name && ser.xAxis === src.name) {
                            t = 'category';
                            break;
                        } else if (isNumber(ser.xAxis) && ser.xAxis === index) {
                            t = 'category';
                            break;
                        }
                    }   
                }
                if (!t && chart.series.isCategorized()) {
                    t = 'category';
                }
            }
            if (t) {
                cls = chart._getAxisType(t);
            }
        }
        if (!cls) {
            cls = chart._getAxisType('linear');
        }

        const axis = new cls(chart, src.name);

        axis.load(src);
        return axis;
    }
}