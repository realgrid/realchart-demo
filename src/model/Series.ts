////////////////////////////////////////////////////////////////////////////////
// Series.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, isString } from "../common/Common";
import { NumberFormatter } from "../common/NumberFormatter";
import { Align, RtPercentSize, VerticalAlign } from "../common/Types";
import { Utils } from "../common/Utils";
import { Shape } from "../common/impl/SvgShape";
import { IAxis } from "./Axis";
import { Chart, IChart } from "./Chart";
import { ChartItem } from "./ChartItem";
import { DataPoint, DataPointCollection } from "./DataPoint";
import { ILegendSource } from "./Legend";
import { ISeriesGroup } from "./SeriesGroup";
import { CategoryAxis } from "./axis/CategoryAxis";
import { LinearAxis } from "./axis/LinearAxis";

export enum PointItemPosition {
    AUTO = 'auto',
    INSIDE = 'inside',
    OUTSIDE = 'outside',
    INSIDE_FIRST = 'insideFirst',
    OUTSIDE_FIRST = 'outsideFirst',
}

export const BRIGHT_COLOR = 'white';
export const DARK_COLOR = 'black';

export const NUMBER_SYMBOLS = 'k,M,G,T,P,E';
export const NUMBER_FORMAT = '#,##0.#';

/**
 * Series data point label options.
 */
export class DataPointLabel extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * 포인트 label 표시 위치.
     */
    position = PointItemPosition.AUTO;
    /**
     * position 위치에서 수평 정렬 상태.
     * pie 시리즈에서는 무시.
     */
    align = Align.CENTER;
    /**
     * position 위치에서 수직 정렬 상태.
     */
    verticalAlign = VerticalAlign.MIDDLE;
    /**
     * true면 텍스트 색상과 대조되는 색상의 배경을 표시한다.
     */
    outlined = true;
    /**
     * true면 포인트 색상과 대조되는 흰색 혹은 검정색으로 표시한다.
     */
    autoContrast = true;
    /**
     * autoContrast가 true일 때 밝은 쪽 텍스트 색상.
     */
    brightColor = BRIGHT_COLOR;
    /**
     * autoContrast가 true일 때 어두운 쪽 텍스트 색상.
     */
    darkColor = DARK_COLOR;
    /**
     * position으로 지정된 위치로 부터 떨어진 간격.
     * center나 middle일 때는 무시.
     * 파이 시리즈 처럼 label 연결선이 있을 때는 연결선과의 간격.
     */
    offset = 4;
    prefix: string;
    suffix: string;
    numberSymbols = NUMBER_SYMBOLS;
    numberFormat = NUMBER_FORMAT;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _numSymbols: string[];
    private _numberFormatter: NumberFormatter;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: Chart) {
        super(chart, false);
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getText(value: any): string {
        if (Utils.isValidNumber(value)) {
            let s = this._format(null, value, Math.abs(value) > 1000, true);
            return s;
        }
        return value;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoad(source: any): void {
        super._doLoad(source);

        this._numSymbols = this.numberSymbols && this.numberSymbols.split(',');
        this._numberFormatter = this.numberFormat && NumberFormatter.getFormatter(this.numberFormat);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_getNumberText(value: any, useSymbols: boolean, forceSymbols: boolean): string {
        if (Utils.isValidNumber(value)) {
            const sv = this._numSymbols && useSymbols && Utils.scaleNumber(value, this._numSymbols, forceSymbols);

            if (this._numberFormatter) {
                if (sv) {
                    return this._numberFormatter.toStr(sv.value) + sv.symbol;
                } else {
                    return this._numberFormatter.toStr(value);
                }
            }
            return String(value);
        }
        return 'NaN';
    }
    
    protected _format(text: string, value: any, useSymbols: boolean, forceSymbols = false): string {
        let s = text || this.$_getNumberText(value, useSymbols, forceSymbols);
        s = this.prefix + (s || value) + this.suffix;
        return s;
    }
}

export interface ISeries {

    _group: ISeriesGroup;

    xAxis: string | number;
    yAxis: string | number;
    xField: string | number;
    yField: string | number;

    color: string;

    createPoint(source: any): DataPoint;
    isPolar(): boolean;
    isCategorized(): boolean;
    getPoints(): DataPointCollection;
    getValue(point: DataPoint, axis: IAxis): number;
    collectCategories(axis: IAxis): string[];
    collectValues(axis: IAxis): number[];
    isVisible(p: DataPoint): boolean;
    // axis에 설정된 baseValue를 무시하라!
    ignoreAxisBase(axis: IAxis): boolean;
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
     * <br>
     * 이 속성이 지징되지 않은 경우 {@link Chart.xStart}가 적용된다.
     */
    xStart = 0;
    /**
     * 시리즈 데이타에 x축 값이 설정되지 않은 경우, 포인트 간의 간격 크기.
     * time 축일 때, 정수 값 대신 시간 단위로 지정할 수 있다.
     * <br>
     * 이 속성이 지정되지 않으면 {@link Chart.xStep}이 적용된다.
     */
    xStep: number | string;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    index = -1;
    gindex = -1;
    _group: ISeriesGroup;
    _xAxisObj: IAxis;
    _yAxisObj: IAxis;
    protected _points: DataPointCollection;
    _visPoints: DataPoint[];
    color: string;

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
    isInverted(): boolean {
        return false;
    }

    getPoints(): DataPointCollection {
        return this._points;
    }

    isEmpty(): boolean {
        return this._points.isEmpty();
    }

    isPolar(): boolean {
        return false;
    }

    isCategorized(): boolean {
        return false;
    }

    legendColor(): string {
        return this.color;
    }

    legendLabel(): string {
        return this.name;
    }

    legendVisible(): boolean {
        return this.visible();
    }

    ignoreAxisBase(axis: IAxis): boolean {
        return false;
    }
    
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
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
        this._visPoints = this._points.getVisibles();//.sort((p1, p2) => p1.xValue - p2.xValue);
        this._doPrepareRender();
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
        const a = axis === this._xAxisObj ? 'x' : 'y';
        const v = a + 'Value';
        const numeric = axis instanceof LinearAxis;
        const vals: number[] = [];
        let x = 0;

        this._visPoints.forEach((p, i) => {
            let val = axis.getValue(p[a]);

            // linear axis이고 'x'값이 숫자가 아니면 
            // (시리즈별이 아니라)모든 시리즈를 기준으로 0부터 순서대로 값을 부여한다.
            // TODO: 여기서 이렇게 하는 게 맞나?
            if (isNaN(val) && numeric && a === 'x') {
                val = x;
                x += axis.valueUnit;
            }
            if (!isNaN(val)) {
                vals.push(p[v] = val);
            }
        })

        return vals;
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

        const data = src[this.dataProp || 'data'];

        if (isArray(data)) {
            this._doLoadPoints(data);
        }
    }

    protected _doLoadPoints(src: any[]): void {
        this._points.load(src);
    }

    protected _doPrepareRender(): void {
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

    isInverted(): boolean {
        for (const ser of this._items) {
            if (ser.visible() && ser.isInverted()) {
                return true;
            }
        }
    }

    isPolar(): boolean {
        for (const ser of this._items) {
            if (ser.visible() && !ser.isPolar()) {
                return false;
            }
        }
        return true;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(src: any): void {
        const chart = this.chart;

        this._items = [];
        this._map.clear();

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
        const colors = this.chart.colors;

        this._items.forEach((ser, i) => {
            if (ser.visible()) {
                ser.color = colors[i % colors.length];
                ser.prepareRender();
            }
        });
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
        src.name && this._map.set(src.name, ser);
        return ser;
    }
}

export enum MarerVisibility {
    /** visible 속성에 따른다. */
    DEFAULT = 'default',
    /** visible 속성과 상관없이 항상 표시한다. */
    VISIBLE = 'visible',
    /** visible 속성과 상관없이 항상 표시하지 않는다. */
    HIDDEN = 'hidden'
}

export abstract class SeriesMarker extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * 명시적으로 지정하지 않으면 typeIndex에 따라 Shapes 중 하나로 돌아가면서 설정된다.
     */
    shape: Shape;
    /**
     * shape의 반지름.
     */
    radius = 3;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public series: Series) {
        super(series.chart);
    }
}

/**
 * Chart가 polar가 아닌 경우, plot area 영역을 기준으로 size, centerX, centerY가 적용된다.
 */
export class RadialSeries extends Series {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    startAngle = 0;
    centerX = 0;
    centerY = 0;
    size: RtPercentSize;
}

