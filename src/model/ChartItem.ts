////////////////////////////////////////////////////////////////////////////////
// ChartItem.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject } from "../common/Common";
import { RcObject } from "../common/RcObject";
import { IChart } from "./Chart";
import { DataPoint, DataPointCollection } from "./DataPoint";

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
    // methods
    //-------------------------------------------------------------------------
    load(source: any): void {
        this._doLoad(source);
    }

    prepareRender(): void {
        this._doPrepareRender(this.chart);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _changed(): void {
        this.chart?._modelChanged(this);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _doLoad(source: any): void {
        for (const p in source) {
            let v = source[p];

            if (isArray(v)) {
                v = v.slice(0);
            } else if (isObject(v)) {
                v = Object.assign({}, v);
            }
            this[p] = v;
        }
    }

    protected _doPrepareRender(chart: IChart): void {
    }
}
