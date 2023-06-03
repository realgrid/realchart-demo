////////////////////////////////////////////////////////////////////////////////
// Axis.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IChart } from "./Chart";
import { ChartItem } from "./ChartItem";

export class AxisItem extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _axis: Axis;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(axis: Axis) {
        super(axis.chart());

        this._axis = axis;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    axis(): Axis {
        return this._axis;
    }
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
}

export class Axis extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _title: AxisTitle;
    private _grid: AxisGrid;
    private _tick: AxisTick;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, public name?: string) {
        super(chart);

        this._title = new AxisTitle(this);
        this._grid = new AxisGrid(this);
        this._tick = new AxisTick(this);
    }
}