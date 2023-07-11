////////////////////////////////////////////////////////////////////////////////
// ChartItem.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isBoolean, isObject } from "../common/Common";
import { RcObject } from "../common/RcObject";
import { Sides } from "../common/Sides";
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
        if (isBoolean(source)) {
            this.setVisible(source);
            return true;
        }
    }

    protected _doLoad(source: any): void {
        for (const p in source) {
            //if (this.hasOwnProperty(p)) {
                let v = source[p];

                if (isArray(v)) {
                    this[p] = v.slice(0);
                } else if (this[p] instanceof ChartItem) {
                    this[p].load(v);
                } else if (isObject(v)) {
                    this[p] = Object.assign({}, v);
                } else {
                    this[p] = v;
                }
            //}
        }
    }

    protected _doPrepareRender(chart: IChart): void {
    }
}

export class BoundableItem extends ChartItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    padding = Sides.Empty;
    margin = Sides.Empty;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoad(source: any): void {
        super._doLoad(source);

        if ('padding' in source) {
            this.padding = Sides.create(source('padding'));
        }
        if ('margin' in source) {
            this.margin = Sides.create(source('margin'));
        }
    }
}