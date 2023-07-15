////////////////////////////////////////////////////////////////////////////////
// Series.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, isString, pickNum } from "../common/Common";
import { Align, IPercentSize, RtPercentSize, VerticalAlign, calcPercent, parsePercentSize } from "../common/Types";
import { Utils } from "../common/Utils";
import { Shape } from "../common/impl/SvgShape";
import { IAxis } from "./Axis";
import { Chart, IChart } from "./Chart";
import { ChartItem, FormattableText } from "./ChartItem";
import { DataPoint, DataPointCollection } from "./DataPoint";
import { ILegendSource } from "./Legend";
import { ISeriesGroup } from "./SeriesGroup";
import { CategoryAxis } from "./axis/CategoryAxis";
import { LinearAxis } from "./axis/LinearAxis";
import { TimeAxis } from "./axis/TimeAxis";

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
export class DataPointLabel extends FormattableText {

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

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
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
            let s = this._getText(null, value, Math.abs(value) > 1000, true);
            return s;
        }
        return value;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
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
    readonly pointLabel: DataPointLabel;

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

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart);

        this.name = name;
        this.pointLabel = new DataPointLabel(chart);
        this._points = new DataPointCollection(this);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
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
    xStart: number;
    /**
     * 시리즈 데이타에 x축 값이 설정되지 않은 경우, 포인트 간의 간격 크기.
     * time 축일 때, 정수 값 대신 시간 단위로 지정할 수 있다.
     * <br>
     * 이 속성이 지정되지 않으면 {@link Chart.xStep}이 적용된다.
     */
    xStep: number | string;
    /**
     * 데이터 포인트 기본 색.
     */
    color: string;
    /**
     * 데이터 포인트별 색들을 지정한다.
     * <br>
     * false로 지정하면 모든 포인트들이 시리즈 색으로 표시된다.
     * true로 지정하면 기본 색들로 표시된다.
     * 색 문자열 배열로 지정하면 포함된 색 순서대로 표시된다.
     * undefined나 null이면 시리즈 종류에 따라 false 혹은 true로 해석된다.
     */
    pointColors: boolean | string[];

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
        return this.visible;
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

    getXStart(): number {
        let s = this.xStart;
        let s2 = this.chart.xStart;

        if (this._xAxisObj instanceof TimeAxis) {
            if (isString(s)) {
                s = new Date(s).getTime();
            } else if (isString(s2)) {
                s2 = new Date(s2).getTime();
            }
        }
        return pickNum(s, s2);
    }

    getXStep(): number {
        return pickNum(this.xStep, this.chart.xStep);
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
        const xStep = this.getXStep() || 1;
        let x = this.getXStart() || 0;

        this._visPoints.forEach((p, i) => {
            let val = axis.getValue(p[a]);

            if (isNaN(val) && a === 'x') {
                val = x;
                // if (p[a] === void 0) p[a] = val;
                x += xStep;
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

    protected _colorByPoint(): boolean {
        return false;
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
        let color: string;
        let colors: string[];

        if (this.pointColors === false) {
            color = this.color;
        } else if (isArray(this.pointColors)) {
            colors = this.pointColors;
        } else if (this._colorByPoint()) { 
            colors = this.chart.colors;
        } else {
            color = this.color;
        }

        this._visPoints.forEach((p, i) => {
            if (!p.color) {
                p.color = color || colors[i % colors.length];
            }
        })
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
        return this._items.filter(ser => ser.visible);
    }

    isInverted(): boolean {
        for (const ser of this._items) {
            if (ser.visible && ser.isInverted()) {
                return true;
            }
        }
    }

    isPolar(): boolean {
        for (const ser of this._items) {
            if (ser.visible && !ser.isPolar()) {
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
            ser.visible && ser.getLegendSources(legends);
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
            if (ser.visible) {
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
    // fields
    //-------------------------------------------------------------------------
    private _sizeDim: IPercentSize;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    startAngle = 0;
    centerX = 0;
    centerY = 0;
    size: RtPercentSize;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getSize(width: number, height: number): number {
        return calcPercent(this._sizeDim, Math.min(width, height));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoad(src: any): void {
        super._doLoad(src);

        this._sizeDim = parsePercentSize(this.size, true) || { size: 80, fixed: false };
    }
}

