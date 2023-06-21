////////////////////////////////////////////////////////////////////////////////
// Axis.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

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

    protected _series: ISeries[];
    protected _range: { min: number, max: number };

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart);

        this.name = name;
        this.title = new AxisTitle(this);
        this.tick = new AxisTick(this);
        this.grid = new AxisGrid(this);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    protected abstract _doCalcluateRange(): { min: number, max: number };
    protected abstract _doPrepareRender(): void;
    protected abstract _doPrepareTicks(min: number, max: number, length: number): IAxisTick[];

    prepareRender(): void {
        this._doPrepareRender();
    }

    calcluateRange(): void {
        this._range = this._doCalcluateRange();
    }

    prepareTicks(length: number): void {
        const ticks = this._doPrepareTicks(this._range.min, this._range.max, length);
    }
}

export class AxisCollection {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly chart: IChart;
    private _items: Axis[] = [];
    private _map = new Map<string, Axis>();

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        this.chart = chart;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    first(): Axis {
        return this._items[0];
    }

    items(): Axis[] {
        return this._items.slice(0);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    get(name: string): Axis {
        return this._map.get(name);
    }

    prepareRender(): void {
        this._items.forEach(axis => axis.prepareRender());
    }

    calculateRange(): void {
        this._items.forEach(axis => axis.calcluateRange());
    }
}