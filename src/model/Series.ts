////////////////////////////////////////////////////////////////////////////////
// Series.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, isString, pickNum } from "../common/Common";
import { RcObject } from "../common/RcObject";
import { Align, IPercentSize, RtPercentSize, VerticalAlign, calcPercent, parsePercentSize } from "../common/Types";
import { Utils } from "../common/Utils";
import { Shape } from "../common/impl/SvgShape";
import { IAxis } from "./Axis";
import { Chart, IChart } from "./Chart";
import { ChartItem, FormattableText } from "./ChartItem";
import { DataPoint, DataPointCollection } from "./DataPoint";
import { ILegendSource } from "./Legend";
import { ISeriesGroup2 } from "./SeriesGroup2";
import { CategoryAxis } from "./axis/CategoryAxis";
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

export interface IPlottingItem {

    xAxis: string | number;
    yAxis: string | number;

    visible: boolean;
    needAxes(): boolean;
    isEmpty(): boolean;
    isCategorized(): boolean;

    prepareRender(): void;
}

export interface ISeriesGroup extends IPlottingItem {
}

export interface ISeries extends IPlottingItem {

    _group: ISeriesGroup2;

    xProp: string | number;
    yProp: string | number;

    color: string;

    createPoints(source: any[]): DataPoint[];
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
    // static members
    //-------------------------------------------------------------------------
    static _loadSeries(chart: IChart, src: any, defType?: string): Series {
        let cls = chart._getSeriesType(src.type);

        if (!cls) {
            cls = chart._getSeriesType(defType || chart.type);
        }

        const ser = new cls(chart, src.name);

        ser.load(src);
        return ser;
    }

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    readonly name: string;
    readonly pointLabel: DataPointLabel;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _group: ISeriesGroup2;
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
    parent: SeriesGroup;
    group: string;
    zOrder = 0;
    xAxis: string | number;
    yAxis: string | number;
    /**
     * undefined이면 data point의 값이 array일 때는 0, 객체이면 'x'.
     */
    xProp: string | number;
    /**
     * undefined이면 data point의 값이 array일 때는 1, 객체이면 'y'.
     */
    yProp: string | number;
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

    getPoints(): DataPointCollection {
        return this._points;
    }

    isEmpty(): boolean {
        return this._points.isEmpty();
    }

    needAxes(): boolean {
        return true;
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
    protected _createPoint(source: any): DataPoint {
        return new DataPoint(source);
    }

    createPoints(source: any[]): DataPoint[] {
        return source.map((s, i) => {
            const p = this._createPoint(s);

            p.index = i;
            p.parse(this);
            p.yGroup = p.y; // 추 후 Axis에서 변경할 수 있다.
            return p;
        });
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
        const pv = point.source;

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
        const vals: number[] = [];
        const xStep = this.getXStep() || 1;
        let x = this.getXStart() || 0;

        this._visPoints.forEach((p, i) => {
            let val = axis.getValue(p[a]);

            // 카테고리에 포함되지 않는 숫자 값들은 자동으로 값을 지정한다.
            if (isNaN(val) && a === 'x') {
                val = x;
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
    _referOtherSeries(series: Series): boolean {
        // true 리턴하면 더 이상 참조하지 않는 다는 뜻.
        return true;
    }

    protected _getField(axis: IAxis): any {
        return axis === this._xAxisObj ? this.xProp : this.yProp;
    }

    protected _colorByPoint(): boolean {
        return false;
    }

    protected _doLoad(src: any): void {
        super._doLoad(src);

        const data = src[this.dataProp || 'data'];

        if (isArray(data) && data.length > 0) {
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

    needAxes(): boolean {
        for (const ser of this._items) {
            if (ser.visible && ser.needAxes()) {
                return true;
            }
        }
        return this._items.length === 0;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(src: any): void {
        const chart = this.chart;

        this._items = [];
        this._map.clear();

        if (isArray(src)) {
            src.forEach((s, i) => this._items.push(this.$_loadSeries(chart, s)));

            this._items.forEach(ser => {
                for (const ser2 of this._items) {
                    if (ser2 !== ser && ser._referOtherSeries(ser2)) {
                        break;
                    }
                }
            });
        } else if (isObject(src)) {
            this._items.push(this.$_loadSeries(chart, src));
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
    private $_loadSeries(chart: IChart, src: any): Series {
        const ser = Series._loadSeries(chart, src);

        src.name && this._map.set(src.name, ser);
        return ser;
    }
}

export class PlottingItemCollection  {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly chart: IChart;
    private _items: IPlottingItem[] = [];
    private _series: Series[] = [];
    private _map: {[name: string]: Series} = {};

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        this.chart = chart;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get first(): IPlottingItem {
        return this._items[0];
    }

    isEmpty(): boolean {
        return !this._items.find(item => item.visible && !item.isEmpty());
    }

    items(): IPlottingItem[] {
        return this._items.slice(0);
    }

    visibles(): IPlottingItem[] {
        return this._items.filter(item => item.visible);
    }

    series(): Series[] {
        return this._series.slice(0);
    }

    needAxes(): boolean {
        if (this._items.filter(item => item.visible && item.needAxes())) {
            return true;
        }
        return this._items.length === 0;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(src: any): void {
        const chart = this.chart;
        const items = this._items = [];
        const series = this._series = [];
        const map = this._map = {};

        if (isArray(src)) {
            src.forEach((s, i) => {
                items.push(this.$_loadItem(chart, s, i));
            });
        } else if (isObject(src)) {
            items.push(this.$_loadItem(chart, src, 0));
        }

        // series
        items.forEach(item => {
            if (item instanceof SeriesGroup) {
                series.push(...item.series);
            } else {
                series.push(item);
            }
        })

        series.forEach(ser => {
            if (ser.name) map[ser.name] = ser;
            for (const ser2 of this._series) {
                if (ser2 !== ser && ser._referOtherSeries(ser2)) {
                    break;
                }
            }
        });
    }

    prepareRender(): void {
        const colors = this.chart.colors;
        
        this._series.forEach((ser, i) => {
            if (ser.visible) {
                ser.color = colors[i % colors.length];
            }
        });

        this._items.forEach(item => item.prepareRender());
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadItem(chart: IChart, src: any, index: number): IPlottingItem {
        let cls = chart._getGroupType(src.type);

        if (cls) {
            const g = new cls(chart);

            g.load(src);
            return g;
        }

        cls = chart._getSeriesType(src.type);
        if (!cls) {
            cls = chart._getSeriesType(chart.type);
        }

        const ser = new cls(chart, src.name || `Series ${index + 1}`);

        ser.load(src);
        ser.index = index;
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
 * Polar 좌표계에 표시될 수 있는 시리즈.
 */
export class PolarableSeries extends Series {

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
}


export class WidgetSeries extends Series {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    needAxes(): boolean {
        return false;
    }
}

/**
 * 직교 좌표계가 표시된 경우, plot area 영역을 기준으로 size, centerX, centerY가 적용된다.
 * <br>
 * TODO: 현재 PieSeris만 계승하고 있다. 추후 PieSeries에 합칠 것.
 */
export class RadialSeries extends WidgetSeries {

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
    /**
     * 원형 플롯 영역의 크기.
     * <br>
     * 픽셀 크기나 차지할 수 있는 전체 크기에 대한 상대적 크기로 지정할 수 있다.
     */
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

export enum SeriesGroupLayout {

    /**
     * 시리즈 종류에 따른 기본 표시 방식.
     * <br>
     * bar 종류의 시리즈인 경우 포인트들을 순서대로 옆으로 배치하고,
     * line 종류인 경우 {@link OVERLAP}과 동일하게 순서대로 표시된다.
     * pie 종류인 경우 {@link FILL}과 동일하다.
     * <br>
     * 기본 값이다.
     */
    DEFAULT = 'default',
    /**
     * 포인트들을 순서대로 겹쳐서 표시한다.
     * <br>
     * bar 종류의 시리지은 경우, 
     * 마지막 시리즈의 포인트 값이 큰 경우 이전 포인트들은 보이지 않을 수 있다.
     */
    OVERLAP = 'overlap',
    /**
     * 포인트 그룹 내에서 각 포인트들을 순서대로 쌓아서 표시한다.
     */
    STACK = 'stack',
    /**
     * 포인트 그룹 내에서 각 포인트의 비율을 표시한다.
     * <br>
     * 그룹 합은 SeriesGroup.max로 지정한다.
     * 각 포인트들은 STACK과 마찬가지로 순서대로 쌓여서 표시된다.
     * SeriesGroup.baseValue 보다 값이 큰 point는 baseValue 위쪽에 작은 값을 가진
     * 포인트들은 baseValue 아래쪽에 표시된다.
     * <br>
     * Pie 시리즈에서는 {@link FILL}과 동일하다.
     */
    FILL = 'fill',
}

export abstract class SeriesGroup extends ChartItem implements ISeriesGroup {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _series: Series[] = [];

    //-------------------------------------------------------------------------
    // ISeriesGroup
    //-------------------------------------------------------------------------
    layout = SeriesGroupLayout.DEFAULT;
    xAxis: string | number;
    yAxis: string | number;

    get series(): Series[] {
        return this._series.slice(0);
    }

    needAxes(): boolean {
        return true;
    }

    isEmpty(): boolean {
        return false;
    }

    isCategorized(): boolean {
        return true;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    protected _doLoadProp(prop: string, value: any): boolean {
        if (prop === 'series') {
            this.$_loadSeries(this.chart, value);
            return true;
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected abstract _seriesType(): string;
    protected abstract _canContain(ser: Series): boolean;
    protected abstract _doPrepareSeries(series: Series[]): void;

    protected _doPrepareRender(chart: IChart): void {
        const series = this._series.filter(ser => ser.visible).sort((s1, s2) => (s1.zOrder || 0) - (s2.zOrder || 0));
        
        if (series.length > 0) {
            series.forEach(ser => ser.prepareRender());
            this._doPrepareSeries(series);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadSeries(chart: IChart, src: any) {
        const type = this._seriesType();

        if (isArray(src)) {
            src.forEach((s, i) => this.$_add(Series._loadSeries(chart, s, type)));
        } else if (isObject(src)) {
            this.$_add(Series._loadSeries(chart, src, type));
        }
    }

    private $_add(series: Series): void {
        if (this._canContain(series)) {
            this._series.push(series);
            series.parent = this;
        } else {
            throw new Error('이 그룹에 포함될 수 없는 시리즈입니다: ' + series);
        }
    }
}
