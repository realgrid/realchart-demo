////////////////////////////////////////////////////////////////////////////////
// Series.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNumber, isObject, isString } from "../common/Common";
import { NumberFormatter } from "../common/NumberFormatter";
import { RcObject } from "../common/RcObject";
import { Align, VerticalAlign } from "../common/Types";
import { Utils } from "../common/Utils";
import { Shape } from "../common/impl/SvgShape";
import { IAxis } from "./Axis";
import { Chart, IChart } from "./Chart";
import { ChartItem } from "./ChartItem";
import { DataPoint, DataPointCollection } from "./DataPoint";
import { ILegendSource } from "./Legend";
import { CategoryAxis } from "./axis/CategoryAxis";
import { LinearAxis } from "./axis/LinearAxis";
import { BoxSeries } from "./series/BarSeries";

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
    gindex = -1;
    _group: SeriesGroup;
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
        this._visPoints = this._points.getVisibles();
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

export enum SeriesGroupLayout {

    /**
     * 시리즈 종류에 따른 기본 표시 방식.
     * <br>
     * bar 종류의 시리즈인 경우 포인트들을 순서대로 옆으로 배치하고,
     * line 종류인 경우 {@link OVERLAP}과 동일하게 순서대로 표시된다.
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
     * 그룹 합은 SeriesGroup.max로 지정한다.
     * 각 포인트들은 STACK과 마찬가지로 순서대로 쌓여서 표시된다.
     * SeriesGroup.baseValue 보다 값이 큰 point는 baseValue 위쪽에 작은 값을 가진
     * 포인트들은 baseValue 아래쪽에 표시된다.
     */
    FILL = 'fill',
    /**
     * FILL과 동일히다.
     * 다만 baseValue보다 작은 point들도 baseValue 위쪽에 표시한다.
     */
    //FILL_POSITIVE = 'fillPositive',
    /**
     * FILL과 동일히다.
     * 다만 baseValue를 기준으로 양쪽에 속한 포인트들의 합이 SeriesGroup.max가 
     * 되도록 표시한다.
     */
    //FILL_BOTH = 'fillBoth'
}

export class SeriesGroup extends RcObject {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * 그룹 이름.
     * <br>
     * 시리즈에서 이 값으로 자신이 속하는 그룹을 지정할 수 있다.
     */
    name: string;
    /**
     * 그룹 내의 포인트들을 배치하는 방식.
     */
    private _layout = SeriesGroupLayout.DEFAULT;
    /**
     * 이 group이 축의 단위 너비 내에서 차지하는 영역의 상대 크기.
     * <br>
     * 0보다 큰 값으로 지정한다.
     * group이 여러 개인 경우 이 너비를 모두 합한 크기에 대한 상대값으로 group의 너비가 결정된다.
     */
    groupWidth = 1;
    /**
     * 시리즈 point bar들의 양 끝을 점유하는 빈 공간 크기 비율.
     * <br>
     * 0 ~ 1 사이의 비율 값으로 지정한다.
     */
    groupPadding = 0.2;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get layout(): SeriesGroupLayout {
        return this._layout;
    }
    set layout(value: SeriesGroupLayout) {
        if ([SeriesGroupLayout.OVERLAP, SeriesGroupLayout.STACK, SeriesGroupLayout.FILL].indexOf(value) < 0) {
            this._layout = SeriesGroupLayout.DEFAULT;
        } else {
            this._layout = value;
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    // 축 단위 내에서 이 그룹이 차지하는 계산된 영역 너비. 0 ~ 1 사이의 값.
    _groupWidth = 1;
    // 축 단위 내에서 이 그룹이 시작하는 위치. 0 ~ 1 사이의 상대 값.
    _groupPos = 0;
    _series: ISeries[] = [];

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(src: any): void {
        for (const p in src) {
            if (this.hasOwnProperty(p)) {
                this[p] = src[p];
            }
        }
    }

    prepareRender(): void {
        if (this._layout === SeriesGroupLayout.DEFAULT) {
            const series = this._series.filter(ser => ser instanceof BoxSeries) as BoxSeries[];
            const cnt = series.length;

            if (cnt > 1) {
                const sum = series.map(ser => ser.pointWidth).reduce((a, c) => a + c);
                let x = 0;
                
                series.forEach(ser => {
                    ser._groupWidth = ser.pointWidth / sum;
                    ser._groupPos = x;
                    x += ser._groupWidth;
                });
            } else if (cnt === 1) {
                series[0]._groupWidth = 1;
            }
        }
    }
}

export class SeriesGroupCollection {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    private static readonly DEFAULT = new SeriesGroup();

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly chart: IChart;
    private _items: SeriesGroup[] = [];
    private _map = new Map<string, SeriesGroup>();

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        this.chart = chart;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get first(): SeriesGroup {
        return this._items[0] || SeriesGroupCollection.DEFAULT;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    get(name: string | number): SeriesGroup {
        return  this._map[name] || this._items[name] || this._items[0] || SeriesGroupCollection.DEFAULT;
    }

    load(src: any): void {
        const chart = this.chart;

        this._items = [];
        this._map.clear();

        if (isArray(src)) {
            src.forEach((s, i) => this._items.push(this.$_loadGroup(chart, s)));
        } else if (isObject(src)) {
            this._items.push(this.$_loadGroup(chart, src));
        }

        chart._getSeries().forEach(ser => {
            const g = this.get(ser.group);

            ser._group = g;
            ser.gindex = g._series.length;
            g._series.push(ser);
        })
    }

    prepareRender(): void {
        if (this._items.length > 0) {
            const sum = this._items.map(g => g.groupWidth).reduce((a, c) => a + c, 0);
            let x = 0;

            this._items.forEach((g, i) => {
                g._groupWidth = g.groupWidth / sum;
                g._groupPos = x;
                x += g._groupWidth;
                g.prepareRender();
            });
        } else {
            const g = this.first;

            g._groupWidth = 1;
            g.prepareRender();
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadGroup(chart: IChart, src: any): SeriesGroup {
        const g = new SeriesGroup();

        g.load(src);
        src.name && this._map.set(src.name, g);
        return g;
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

export class RadialSeries extends Series {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    startAngle = 0;
}

