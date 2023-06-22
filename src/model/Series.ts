////////////////////////////////////////////////////////////////////////////////
// Series.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNone, isObject, pickNum, pickProp } from "../common/Common";
import { RcObject } from "../common/RcObject";
import { IChart } from "./Chart";
import { ChartItem, IAxis, ISeries } from "./ChartItem";
import { DataPoint, DataPointCollection } from "./DataPoint";
import { CategoryAxis } from "./axis/CategoryAxis";

export abstract class Series extends ChartItem implements ISeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    readonly name: string;
    group: string;
    xAxis: string | number;
    yAxis: string | number;
    /**
     * undefined이면 data point의 값이 array일 때는 0, 객체이면 'x'.
     */
    xField: string | number;
    /**
     * undefined이면 data point의 값이 array일 때는 1, 객체이면 'y'.
     */
    yField: string | number;
    /**
     * undefined이면 "data".
     */
    dataProp: string;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _xAxisObj: IAxis;
    private _yAxisObj: IAxis;
    private _points: DataPointCollection;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart);

        this.name = name;
        this._points = new DataPointCollection(this);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    getPoints(): DataPointCollection {
        return this._points;
    }

    isCategorized(): boolean {
        return false;
    }
    
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(source: any): void {
        this._points.load(source[this.dataProp || 'data']);
    }

    getValue(point: DataPoint, axis: IAxis): number {
        const pv = point.value;

        if (pv != null) {
            const fld = this._getField(axis);
            const v = pv[fld];

        } else {
            return NaN;
        }
    }

    collectCategories(axis: IAxis): string[] {
        if (axis instanceof CategoryAxis) {
            let fld = axis.categoryField;

            if (fld != null) {
                return this._points.getValues(fld);
            } else {
                const prop = this._getField(axis);

                if (isNone(prop)) {
                    if (axis === this._xAxisObj) {
                        this._points.getValues(this.xField || 'x' || 'name' || 'label', 0);
                    } else {
                        this._points.getValues(this.yField || 'y' || 'name' || 'label', 1);
                    }
                } else {
                    this._points.getValues(prop);
                }
            }
        }
    }

    collectValues(axis: IAxis, categories: string[]): number[] {
        const vals: number[] = [];

        return vals;
    }

    prepareRender(): void {
        this._xAxisObj = this.chart.axisOfSeries(this, true);
        this._yAxisObj = this.chart.axisOfSeries(this, false);

        this._points.prepareRender(this._xAxisObj, this._yAxisObj);
    }
    
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _getField(axis: IAxis): any {
        return axis === this._xAxisObj ? this.xField : this.xField;
    }

    protected _doLoad(src: any): void {
        super._doLoad(src);

        const data = src[this.dataProp];

        if (isArray(data)) {
            this._points.load(data);
        }
    }
}

export class SeriesCollection {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly chart: IChart;
    private _items: Series[] = [];
    private _map = new Map<string, Series>();

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        this.chart = chart;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get first(): Series {
        return this._items[0];
    }

    get items(): Series[] {
        return this._items.slice(0);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(src: any): void {
        const chart = this.chart;

        if (isArray(src)) {
            src.forEach(s => this._items.push(this.$_loadSeries(chart, s)));
        } else if (isObject(src)) {
            this._items.push(this.$_loadSeries(chart, src));
        }
    }

    get(name: string): Series {
        return this._map.get(name);
    }

    prepareRender(): void {
        this._items.forEach(ser => ser.prepareRender());
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadSeries(chart: IChart, src: any): Series {
        let cls = chart._getSeriesType(src.type);

        if (!cls) {
        }
        if (!cls) {
            cls = chart._getSeriesType('column');
        }

        const ser = new cls(chart, src.name);

        ser.load(src);
        return ser;
    }
}

export class SeriesGroup extends RcObject {

}