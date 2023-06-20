////////////////////////////////////////////////////////////////////////////////
// ChartItem.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcObject } from "../common/RcObject";
import { IChart } from "./Chart";

export class ChartItem extends RcObject {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    readonly chart: IChart;
    private _visible = true;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super();

        this.chart = chart;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /** visible */
    visible(): boolean {
        return this._visible;
    }
    setVisible(value: boolean) {
        if (value !== this._visible) {
            this._visible = value;
            this.chart?._visibleChanged(this);
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getProps(): string[] {
        return ['visible'];
    }

    protected _changed(): void {
        this.chart?._modelChanged(this);
    }
}