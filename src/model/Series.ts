////////////////////////////////////////////////////////////////////////////////
// Series.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, isString } from "../common/Common";
import { RcObject } from "../common/RcObject";
import { IAxis } from "./Axis";
import { IChart } from "./Chart";
import { ChartItem } from "./ChartItem";
import { DataPoint, DataPointCollection } from "./DataPoint";
import { ILegendSource } from "./Legend";
import { CategoryAxis } from "./axis/CategoryAxis";

export interface ISeries {

    xAxis: string | number;
    yAxis: string | number;
    xField: string | number;
    yField: string | number;

    createPoint(source: any): DataPoint;
    isCategorized(): boolean;
    getPoints(): DataPointCollection;
    getValue(point: DataPoint, axis: IAxis): number;
    collectCategories(axis: IAxis): string[];
    collectValues(axis: IAxis): number[];
    isVisible(p: DataPoint): boolean;
}

export interface ISeriesGroup {
}
export abstract class Series extends ChartItem implements ISeries, ILegendSource {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static Defaults = {
    };

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
    /**
     * 시리즈 데이타에 x축 값이 설정되지 않은 경우, 첫 포인트의 자동 지정 x값.
     */
    pointStart = 0;
    /**
     * 시리즈 데이타에 x축 값이 설정되지 않은 경우, 포인트 간의 간격 크기.
     * time 축일 때, 정수 값 대신 시간 단위로 지정할 수 있다.
     */
    pointStep: number | string = 1;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    index = -1;
    _xAxisObj: IAxis;
    _yAxisObj: IAxis;
    protected _points: DataPointCollection;

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
    isBar(): boolean {
        return false;
    }

    getPoints(): DataPointCollection {
        return this._points;
    }

    isEmpty(): boolean {
        return this._points.isEmpty();
    }

    isCategorized(): boolean {
        return false;
    }

    legendColor(): string {
        return 'red';
    }

    legendLabel(): string {
        return this.name;
    }

    legendVisible(): boolean {
        return this.visible();
    }
    
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(source: any): void {
        this._points.load(source[this.dataProp || 'data']);
    }

    createPoint(source: any): DataPoint {
        return new DataPoint(source);
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

    prepareRender(): void {
        this._xAxisObj = this.chart._connectSeries(this, true);
        this._yAxisObj = this.chart._connectSeries(this, false);
        this._points.prepare();
    }

    collectCategories(axis: IAxis): string[] {
        if (axis instanceof CategoryAxis) {
            let fld = axis.categoryField;

            if (fld != null) {
                return this._points.getProps(fld);
            } else {
                return this._points.getValues(axis === this._xAxisObj ? 'x' : 'y').filter(v => isString(v));
            }
        }
    }

    collectValues(axis: IAxis): number[] {
        return this._points.getValues(axis === this._xAxisObj ? 'x' : 'y').map(v => axis.getValue(v));
    }

    isVisible(point: DataPoint): boolean {
        return this._xAxisObj.contains(point.x) && this._yAxisObj.contains(point.y);
    }

    getLegendSources(list: ILegendSource[]) {
        list.push(this);
    }
    
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _getField(axis: IAxis): any {
        return axis === this._xAxisObj ? this.xField : this.yField;
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

    isEmpty(): boolean {
        if (this._items.length > 0) {
            for (const ser of this._items) {
                if (!ser.isEmpty()) return false;
            }
        }
        return true;
    }

    items(): Series[] {
        return this._items.slice(0);
    }

    visibles(): Series[] {
        return this._items.filter(ser => ser.visible());
    }

    containsBar(): boolean {
        for (const ser of this._items) {
            if (ser.visible() && ser.isBar()) {
                return true;
            }
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(src: any): void {
        const chart = this.chart;

        if (isArray(src)) {
            src.forEach((s, i) => this._items.push(this.$_loadSeries(chart, s, i)));
        } else if (isObject(src)) {
            this._items.push(this.$_loadSeries(chart, src, 0));
        }
    }

    get(name: string): Series {
        return this._map.get(name);
    }

    getLegendSources(): ILegendSource[] {
        const legends: ILegendSource[] = [];

        this._items.forEach(ser => {
            ser.visible() && ser.getLegendSources(legends);
        })
        return legends;
    }

    forEach(callback: (p: Series, i?: number) => any): void {
        for (let i = 0, n = this._items.length; i < n; i++) {
            if (callback(this._items[i], i) === true) break;
        }
    }

    prepareRender(): void {
        this._items.forEach(ser => ser.prepareRender());
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadSeries(chart: IChart, src: any, index: number): Series {
        let cls = chart._getSeriesType(src.type);

        if (!cls) {
        }
        if (!cls) {
            cls = chart._getSeriesType(chart.type);
        }

        const ser = new cls(chart, src.name || `Series ${index + 1}`);

        ser.load(src);
        ser.index = index;
        return ser;
    }
}

export class SeriesGroup extends RcObject {
}