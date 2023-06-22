////////////////////////////////////////////////////////////////////////////////
// Axis.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNumber, isObject, isString } from "../common/Common";
import { IChart } from "./Chart";
import { ChartItem, IAxis, ISeries } from "./ChartItem";

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
    text: string;
    margin = 8;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getProps(): string[] {
        return ['text', 'margin'].concat(super._getProps());
    }
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
    protected _getProps(): string[] {
        return ['circular', 'startVisible', 'endVisible'].concat(super._getProps());
    }
}

export class AxisTickLabel extends AxisItem {
}

export class AxisTickLine extends AxisItem {
}

export class AxisTick extends AxisItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _ticks: number[];

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
}

export interface IAxisTick {
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
    unit: number;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly name: string;
    readonly title: AxisTitle;
    readonly tick: AxisTick;
    readonly grid: AxisGrid;

    protected _series: ISeries[] = [];
    protected _range: { min: number, max: number };

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
    protected abstract _doCalcluateRange(): { min: number, max: number };
    protected abstract _doPrepareTicks(min: number, max: number, length: number): IAxisTick[];

    prepareRender(): void {
        this._doPrepareRender();
    }

    calculateRange(): void {
        this._range = this._doCalcluateRange();
    }

    prepareTicks(length: number): void {
        const ticks = this._doPrepareTicks(this._range.min, this._range.max, length);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    _connect(series: ISeries): void {
        if (series && !this._series.includes(series)) {
            this._series.push(series);
        }
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

        if (isArray(src)) {
            src.forEach((s, i) => this._items.push(this.$_loadAxis(chart, s, i)));
        } else if (isObject(src)) {
            this._items.push(this.$_loadAxis(chart, src, 0));
        }
    }

    get(name: string): Axis {
        return this._map.get(name);
    }

    prepareRender(): void {
        this._items.forEach(axis => axis.prepareRender());
    }

    calculateRange(): void {
        this._items.forEach(axis => axis.calculateRange());
    }

    prepareTicks(length: number): void {
        this._items.forEach(axis => axis.prepareTicks(length));
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
                for (const ser of chart.getSeries().items) {
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