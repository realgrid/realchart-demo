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

export class ChartItem extends RcObject {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    readonly chart: IChart;
    private _visible: boolean;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, visible = true) {
        super();

        this.chart = chart;
        this._visible = visible;
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
        if (!this._doLoadSimple(source)) {
            this._doLoad(source);
        }
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
    protected _doLoadSimple(source: any): boolean {
        return false;
    }

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
