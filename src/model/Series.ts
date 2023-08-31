////////////////////////////////////////////////////////////////////////////////
// Series.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, isString, pickNum } from "../common/Common";
import { IPercentSize, RtPercentSize, calcPercent, parsePercentSize } from "../common/Types";
import { Utils } from "../common/Utils";
import { Shape } from "../common/impl/SvgShape";
import { IAxis } from "./Axis";
import { Chart, IChart } from "./Chart";
import { ChartItem, FormattableText } from "./ChartItem";
import { LineType } from "./ChartTypes";
import { DataPoint, DataPointCollection } from "./DataPoint";
import { ILegendSource } from "./Legend";
import { Tooltip } from "./Tooltip";
import { CategoryAxis } from "./axis/CategoryAxis";
import { TimeAxis } from "./axis/TimeAxis";

export enum PointItemPosition {
    AUTO = 'auto',
    INSIDE = 'inside',
    OUTSIDE = 'outside',
    HEAD = 'head',
    FOOT = 'foot',
    INSIDE_FIRST = 'insideFirst',
    OUTSIDE_FIRST = 'outsideFirst',
}

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
    
    // /**
    //  * position 위치에서 수평 정렬 상태.
    //  * pie 시리즈에서는 무시.
    //  */
    // align = Align.CENTER;
    // /**
    //  * position 위치에서 수직 정렬 상태.
    //  */
    // valign = VerticalAlign.MIDDLE;

    offset = 4;

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
    index: number;
    xAxis: string | number;
    yAxis: string | number;

    visible: boolean;
    getVisiblePoints(): DataPoint[];
    getLegendSources(list: ILegendSource[]): void;
    needAxes(): boolean;
    isEmpty(): boolean;
    canCategorized(): boolean;
    defaultYAxisType(): string;
    clusterable(): boolean;
    getBaseValue(axis: IAxis): number;
    // axis에 설정된 baseValue를 무시하라!
    canMinPadding(axis: IAxis): boolean; 
    canMaxPadding(axis: IAxis): boolean; 
    ignoreAxisBase(axis: IAxis): boolean;
    collectValues(axis: IAxis): number[];
    collectCategories(axis: IAxis): string[];
    prepareRender(): void;
    prepareAfter(): void;
}

export enum TrendType {
    LINEAR = 'linear',
    LOGARITHMIC = 'logarithmic', 
    POLYNOMIAL = 'polynomial', 
    POWER = 'power', 
    EXPONENTIAL = 'exponential', 
    MOVING_AVERAGE = 'movingAverage'
}

export class MovingAverage {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    interval: number;
    type: 'simple' | 'weighted' | 'exponential' | 'triangualr';
}

const _movingAverage = {
    interval: 5,
    type: 'simple'
};

/**
 * 시리즈 추세선.
 */
export class Trendline extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _points: {x: number, y: number}[];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public series: Series) {
        super(series.chart);

        this.visible = false;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    type = TrendType.LINEAR;
    lineType = LineType.DEFAULT;
    movingAverage = new MovingAverage();

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    protected _doPrepareRender(chart: IChart): void {
        (this['$_' + this.type] || this.$_linear).call(this, this.series._visPoints, this._points = []);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getDefObjProps(prop: string) {
        if (prop === 'movingAverage') return _movingAverage;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    $_linear(pts: DataPoint[], list: {x: number, y: number}[]): void {
        const len = pts.length;

        if (len > 1) {
            let sx = 0;
            let sy = 0;
            let sxx = 0;
            let syy = 0;
            let sxy = 0;

            pts.forEach(p => {
                sx += p.xValue;
                sy += p.yValue;
                sxx += p.xValue * p.xValue;
                syy += p.yValue + p.yValue;
                sxy += p.xValue * p.yValue;
            });

            const slope  = ((len * sxy) - (sx * sy)) / (len * sxx - (sx * sx));
            const intercept = (sy - slope * sx) / len;

            list.push({x: pts[0].xValue, y: slope * pts[0].xValue + intercept});
            list.push({x: pts[len - 1].xValue, y: slope * pts[len - 1].xValue + intercept});
        }
    }

    $_logarithmic(pts: DataPoint[], list: {x: number, y: number}[]): void {
    }

    $_polynomial(pts: DataPoint[], list: {x: number, y: number}[]): void {
    }

    $_power(pts: DataPoint[], list: {x: number, y: number}[]): void {
    }

    $_exponential(pts: DataPoint[], list: {x: number, y: number}[]): void {
    }

    $_movingAverage(pts: DataPoint[], list: {x: number, y: number}[]): void {
        const ma = this.movingAverage;
        const length = pts.length;
        const interval = Math.max(1, Math.min(length, ma.interval));
        let index = interval - 1;

        while (index <= length) {
            index = index + 1;

            const slice = pts.slice(index - interval, index);
            const sum = slice.reduce((a, c) => a + c.yValue, 0);

            if (index <= length) {
                list.push({x: pts[index - 1].xValue, y: sum / interval});
            }
        }
    }
}

/**
 * 옆으로 나누어 배치 가능한가? ex) bar series/group
 */
export interface IClusterable {

    /**
     * @internal
     * 축 단위 내에서 이 그룹이 차지하는 계산된 영역 너비. 0 ~ 1 사이의 값. 
     * 그룹들의 groupWidth로 정해진다.
     */
    _clusterWidth: number;
    /**
     * @internal
     * 축 단위 내에서 이 그룹이 시작하는 위치. 0 ~ 1 사이의 상대 값.
     * 그룹들의 groupWidth와 groupPadding으로 정해진다.
     */
    _clusterPos: number;

    /**
     * 이 아이템이 축의 단위 너비 내에서 차지하는 영역의 상대 크기.
     * <br>
     * 0보다 큰 값으로 지정한다.
     * group이 여러 개인 경우 이 너비를 모두 합한 크기에 대한 상대값으로 group의 너비가 결정된다.
     */
    groupWidth: number;
    // /**
    //  * 시리즈 point bar들의 양 끝을 점유하는 빈 공간 크기 비율.
    //  * <br>
    //  * 0 ~ 1 사이의 비율 값으로 지정한다.
    //  */
    // groupPadding: number;

    setCluster(width: number, pos: number): void;
}

export interface ISeriesGroup extends IPlottingItem {
}

export interface ISeries extends IPlottingItem {

    chart: IChart;
    group: ISeriesGroup;

    xField: string | number;
    yField: string | number;
    colorField: string | number;

    color: string;

    displayName(): string;
    createPoints(source: any[]): DataPoint[];
    getPoints(): DataPointCollection;
    getValue(point: DataPoint, axis: IAxis): number;
    isVisible(p: DataPoint): boolean;
}

export abstract class Series extends ChartItem implements ISeries, ILegendSource {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
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
    readonly label: string;
    readonly pointLabel: DataPointLabel;
    readonly trendline: Trendline;
    readonly tooltip: Tooltip;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    index = -1;
    group: SeriesGroup<Series>;
    _xAxisObj: IAxis;
    _yAxisObj: IAxis;
    protected _points: DataPointCollection;
    _visPoints: DataPoint[];
    _minValue: number;
    _maxValue: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart);

        this.name = name;
        this.pointLabel = new DataPointLabel(chart);
        this.trendline = new Trendline(this);
        this.tooltip = new Tooltip(this);

        this._points = new DataPointCollection(this);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    abstract type(): string; // for debugging, ...

    // group: string;
    zOrder = 0;
    xAxis: string | number;
    yAxis: string | number;
    /**
     * undefined이면, data point의 값이 array일 때는 0, 객체이면 'x'.
     */
    xField: string | number;
    /**
     * undefined이면, data point의 값이 array일 때는 1, 객체이면 'y'.
     */
    yField: string | number;
    /**
     * undefined이면, data point의 값이 객체일 때 'color'.
     */
    colorField: string;
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

    /**
     * body 영역을 벗어난 data point view는 잘라낸다.
     */
    clipped = false;

    getPoints(): DataPointCollection {
        return this._points;
    }

    getLabeledPoints(): DataPoint[] {
        return this._points.getPoints();
    }

    getVisiblePoints(): DataPoint[] {
        return this._points.getVisibles();
    }

    isEmpty(): boolean {
        return this._points.isEmpty();
    }

    needAxes(): boolean {
        return true;
    }

    /**
     * @internal
     * 
     * CategoryAxis에 연결 가능한가?
     */
    canCategorized(): boolean {
        return false;
    }

    defaultYAxisType(): string {
        return 'linear';
    }

    /**
     * @internal
     * 
     * 병렬 배치 가능한가?
     */
    clusterable(): boolean {
        return false;
    }

    displayName(): string {
        return this.label || this.name;
    }

    legendColor(): string {
        return this.color;
    }

    legendLabel(): string {
        return this.label || this.name;
    }

    legendVisible(): boolean {
        return this.visible;
    }

    ignoreAxisBase(axis: IAxis): boolean {
        return false;
    }

    canMixWith(other: IPlottingItem): boolean {
        return true;
    }

    /**
     * BarSeries 계열처럼 base를 기준으로 표시하는 방향이 달라지는 경우 기준 값.
     */
    getBaseValue(axis: IAxis): number {
        return NaN;
    }

    canMinPadding(axis: IAxis): boolean {
        return true;
    }

    canMaxPadding(axis: IAxis): boolean {
        return true;
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
            p.yGroup = p.yValue;
            p.isNull = s == null;
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
        this._xAxisObj = this.group ? this.group._xAxisObj : this.chart._connectSeries(this, true);
        this._yAxisObj = this.group ? this.group._yAxisObj : this.chart._connectSeries(this, false);
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
        const isX = axis === this._xAxisObj;
        const a = isX ? 'x' : 'y';
        const v = a + 'Value';
        const vals: number[] = [];
        const xStep = this.getXStep() || 1;
        let x = this.getXStart() || 0;

        this._visPoints.forEach((p, i) => {
            let val = axis.getValue(p[a]);

            // 카테고리에 포함되지 않는 숫자 값들은 자동으로 값을 지정한다.
            if (isNaN(val) && isX) {
                val = x;
                x += xStep;
            }
            if (!isNaN(val)) {
                vals.push(p[v] = val);
                if (!isX) p.yGroup = p[v];
            }
        });

        if (!isX) {
            this._minValue = Math.min(...vals);
            this._maxValue = Math.max(...vals);
        }
        return vals;
    }

    isVisible(point: DataPoint): boolean {
        return this._xAxisObj.contains(point.x) && this._yAxisObj.contains(point.y);
    }

    getLegendSources(list: ILegendSource[]): void {
        list.push(this);
    }

    getLabelPosition(p: PointItemPosition): PointItemPosition {
        return p;
    }

    getLabelOff(off: number): number {
        return off;
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
        return axis === this._xAxisObj ? this.xField : this.yField;
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

    prepareAfter(): void {
        // DataPoint.xValue가 필요하다.
        this.trendline.visible && this.trendline.prepareRender();
    }
}

export class PlottingItemCollection  {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly chart: IChart;
    private _map: {[name: string]: Series} = {};
    private _items: IPlottingItem[] = [];
    private _visibles: IPlottingItem[] = [];
    private _series: Series[] = [];
    private _visibleSeries: Series[] = [];

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

    get firstSeries(): Series {
        return this._series[0];
    }

    get firstVisible(): IPlottingItem {
        return this._visibles[0];
    }

    get firstVisibleSeries(): Series {
        return this._visibleSeries[0];
    }

    isEmpty(): boolean {
        return !this._items.find(item => !item.isEmpty());
        // return !this._visibles.find(item => !item.isEmpty());
    }

    items(): IPlottingItem[] {
        return this._items.slice(0);
    }

    visibles(): IPlottingItem[] {
        return this._visibles.slice(0);
    }

    series(): Series[] {
        return this._series.slice(0);
    }

    visibleSeries(): Series[] {
        return this._visibleSeries.slice(0);
    }

    needAxes(): boolean {
        if (this._visibles.find(item => item.needAxes())) {
            return true;
        }
        return this._visibleSeries.length === 0;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    get(name: string): Series {
        return this._map[name];
    }

    getLegendSources(): ILegendSource[] {
        const legends: ILegendSource[] = [];

        this._items.forEach(ser => ser.getLegendSources(legends));
        return legends;
    }

    load(src: any): void {
        const chart = this.chart;
        const items: IPlottingItem[] = this._items = [];
        const series: Series[] = this._series = [];
        const map = this._map = {};

        if (isArray(src)) {
            src.forEach((s, i) => {
                items.push(this.$_loadItem(chart, s, i));
            });
        } else if (isObject(src)) {
            items.push(this.$_loadItem(chart, src, 0));
        }

        // series
        items.forEach((item, i) => {
            item.index = i;
            if (item instanceof SeriesGroup) {
                series.push(...item.series);
            } else if (item instanceof Series) {
                series.push(item);
            }
        })

        series.forEach(ser => {
            if (ser.name) map[ser.name] = ser;
            for (const ser2 of this._series) {
                if (ser2 !== ser) {
                    if (!ser.canMixWith(ser2)) {
                        throw new Error('동시에 표시할 수 없는 시리즈들입니다: ' + ser.type() + ', ' + ser2.type());
                    }
                    if (ser._referOtherSeries(ser2)) {
                        break;
                    }
                }
            }
        });
    }

    prepareRender(): void {
        const colors = this.chart.colors;
        
        this._visibleSeries = this._series.filter(ser => ser.visible);

        const nCluster = this._visibleSeries.filter(ser => ser.clusterable()).length;

        this._visibleSeries.forEach((ser, i) => {
            ser.color = ser.color || colors[i++ % colors.length];
            if (ser instanceof ClusterableSeries) {
                ser._single = nCluster === 1;
            }
        });

        this._visibles = this._items.filter(item => item.visible);
        this._visibles.forEach(item => item.prepareRender());
    }

    prepareAfter(): void {
        this._visibles.forEach(item => item.prepareAfter());
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadItem(chart: IChart, src: any, index: number): IPlottingItem {
        let cls = src.series && (chart._getGroupType(src.type) || chart._getGroupType(chart.type));

        if (cls) {
            const g = new cls(chart);

            g.load(src);
            return g;
        }

        cls = chart._getSeriesType(src.type) || chart._getSeriesType(chart.type);

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

export abstract class WidgetSeries extends Series {

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
export abstract class RadialSeries extends WidgetSeries {

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

export abstract class ClusterableSeries extends Series implements IClusterable {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _clusterWidth = 1;
    _clusterPos = 0;
    _childWidth = 1;    // group내에서 이 시리즈의 상대적 너비
    _childPos = 0;      // group내에서 이 시리즈의 상대적 위치

    _single: boolean;
    _pointPad = 0;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 시리즈가 group에 포함되지 않은 경우, 축 단위 너비에서 이 시리즈가 차지하는 상대적 너비.
     * <br>
     * 그룹에 포함되면 이 속성은 무시된다.
     */
    groupWidth = 1; // _clusterWidth 계산에 사용된다. TODO: clusterWidth로 변경해야 하나?
    // /**
    //  * 시리즈가 group에 포함되지 않은 경우 자동 생성되는 기본 group에 포함되는 데,
    //  * 그 그룹의 너비에서 포인트들이 표시되기 전후의 상대적 여백 크기.
    //  * <br>
    //  * 명시적으로 설정된 그룹에 포함되면 이 속성은 무시된다.
    //  */
    // groupPadding = 0.2;
    /**
     * 시리즈가 포함된 그룹의 layout이 {@link SeriesGroupLayout.DEFAULT}이거나 특별히 설정되지 않아서,
     * 그룹에 포함된 시리즈들의 data point가 옆으로 나열되어 표시될 때,
     * 포인트 표시 영역 내에서 이 시리즈의 포인트가 차지하는 영역의 상대 크기.
     * <br>
     * 예를 들어 이 시리즈의 속성값이 1이고 다른 시리즈의 값이 2이면 다른 시리즈의 data point가 두 배 두껍게 표시된다.
     */
    pointWidth = 1;
    /**
     * 이 시리즈의 point가 차지하는 영역 중에서 point bar 양쪽 끝에 채워지는 빈 영역의 크기.
     * <br>
     * point가 차지할 원래 크기에 대한 상대 값으로서,
     * 0 ~ 1 사이의 비율 값으로 지정한다.
     * 
     * @default 한 카테고리에 cluster 가능한 시리즈가 하나만 표시되면 0.25, group에 포함된 경우 0.1, 여러 시리즈와 같이 표시되면 0.2.
     */
    pointPadding: number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getPointWidth(length: number): number {
        const g = this.group as ClustrableSeriesGroup<Series>;
        let w = length;
        
        if (g) {
            w *= g._clusterWidth;
            w *= 1 - g.groupPadding * 2;  
            w *= this._childWidth;      // 그룹 내 시리즈 영역
        } else {
            w *= this._clusterWidth;           
        }
        w *= 1 - this._pointPad * 2;    // 시리즈 padding
        return w;
    }

    getPointPos(length: number): number {
        const g = this.group as ClustrableSeriesGroup<Series>;
        let w = length;
        let p = 0;

        if (g) {
            p = w * g._clusterPos;
            w *= g._clusterWidth;

            p += w * g.groupPadding;
            w -= w * g.groupPadding * 2;

            p += w * this._childPos;
            w *= this._childWidth;
        } else {
            p = w * this._clusterPos;
            w *= this._clusterWidth;
        }
        p += w * this._pointPad;
        return p;
    }

    getLabelPosition(p: PointItemPosition): PointItemPosition {
        return p === PointItemPosition.AUTO ? PointItemPosition.OUTSIDE_FIRST : p;
    }

    //-------------------------------------------------------------------------
    // overriden mebers
    //-------------------------------------------------------------------------
    clusterable(): boolean {
        return true;
    }

    setCluster(width: number, pos: number): void {
        this._clusterWidth = width;
        this._clusterPos = pos;
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        this._pointPad = isNaN(this.pointPadding) ? (this._single ? 0.25 : this.group ? 0.1 : 0.2) : this.pointPadding;
    }
}

export abstract class BasedSeries extends ClusterableSeries {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _base: number;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 위/아래 구분의 기준이 되는 값.
     * <br>
     * 숫자가 아닌 값으로 지정하면 0으로 간주한다.
     */
    baseValue = 0;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doPrepareRender(): void {
        super._doPrepareRender();

        this._base = pickNum(this._getGroupBase(), this._yAxisObj.getBaseValue());
    }

    getBaseValue(axis: IAxis): number {
        return axis === this._yAxisObj ? this._base : NaN;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _getGroupBase(): number {
        return this.baseValue;
    }
}

export abstract class RangedSeries extends ClusterableSeries {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    collectValues(axis: IAxis): number[] {
        const vals = super.collectValues(axis);

        if (axis === this._yAxisObj) {
            this._visPoints.forEach((p: DataPoint) => {
                const v = this._getBottomValue(p);
                !isNaN(v) && vals.push(v);
            })
        }
        return vals;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _getBottomValue(p: DataPoint): number;
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

export abstract class SeriesGroup<T extends Series> extends ChartItem implements ISeriesGroup {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * {@link layout}이 {@link SeriesGroupLayout.FILL}일 때 상대적 최대값.
     * <br>
     * 
     * @default 100
     */
    layoutMax = 100;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    index = -1;
    private _series: T[] = [];
    protected _visibles: T[] = [];
    _xAxisObj: IAxis;
    _yAxisObj: IAxis;
    _stackPoints: Map<number, DataPoint[]>;

    //-------------------------------------------------------------------------
    // ISeriesGroup
    //-------------------------------------------------------------------------
    layout = SeriesGroupLayout.DEFAULT;
    xAxis: string | number;
    yAxis: string | number;

    get series(): T[] {
        return this._series.slice(0);
    }

    needAxes(): boolean {
        return true;
    }

    isEmpty(): boolean {
        return this._series.length < 1;
        // return this._visibles.length < 1;
    }

    canCategorized(): boolean {
        return true;
    }

    defaultYAxisType(): string {
        return 'linear';
    }

    clusterable(): boolean {
        return false;
    }

    getBaseValue(axis: IAxis): number {
        return NaN;//axis.getBaseValue();
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    // Axis에서 요청한다.
    collectValues(axis: IAxis): number[] {
        if (this._visibles.length < 1) {
            return [];
        } else if (axis === this._visibles[0]._yAxisObj) {
            switch (this.layout) {
                case SeriesGroupLayout.STACK:
                    return this.$_collectStack(axis);

                case SeriesGroupLayout.FILL:
                    return this.$_collectFill(axis);
    
                case SeriesGroupLayout.DEFAULT:
                case SeriesGroupLayout.OVERLAP:
                    return this.$_collectValues(axis);
            }
        } else {
            return this.$_collectValues(axis);
        }
    }

    collectCategories(axis: IAxis): string[] {
        let cats: string[] = [];

        this._visibles.forEach(ser => cats = cats.concat(ser.collectCategories(axis)));
        return cats;
    }

    ignoreAxisBase(axis: IAxis): boolean {
        for (const ser of this._visibles) {
            if (ser.ignoreAxisBase(axis)) return true;
        }
    }

    getLegendSources(list: ILegendSource[]) {
        // list.push(...this._visibles);
        list.push(...this._series);
    }

    canMinPadding(axis: IAxis): boolean {
        return true;
    }

    canMaxPadding(axis: IAxis): boolean {
        return this.layout !== SeriesGroupLayout.FILL;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    getVisiblePoints(): DataPoint[] {
        const pts: DataPoint[] = [];

        this._visibles.forEach(ser => pts.push(...ser.getVisiblePoints()));
        return pts;
    }

    protected _doLoadProp(prop: string, value: any): boolean {
        if (prop === 'series') {
            this.$_loadSeries(this.chart, value);
            return true;
        }
    }

    prepareRender(): void {
        this._visibles = this._series.filter(ser => ser.visible);

        super.prepareRender();
    }

    protected _doPrepareRender(chart: IChart): void {
        const series = this._visibles.sort((s1, s2) => (s1.zOrder || 0) - (s2.zOrder || 0));
        
        this._xAxisObj = this.chart._connectSeries(this, true);
        this._yAxisObj = this.chart._connectSeries(this, false);

        if (series.length > 0) {
            series.forEach(ser => ser.prepareRender());
            this._doPrepareSeries(series);
        }
    }

    prepareAfter(): void {
        this._visibles.forEach(ser => ser.prepareAfter());
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _seriesType(): string;
    protected abstract _canContain(ser: Series): boolean;

    protected _doPrepareSeries(series: T[]): void {}

    private $_loadSeries(chart: IChart, src: any) {
        const type = this._seriesType();

        if (isArray(src)) {
            src.forEach((s, i) => this.$_add(Series._loadSeries(chart, s, type) as T));
        } else if (isObject(src)) {
            this.$_add(Series._loadSeries(chart, src, type) as T);
        }
    }

    private $_add(series: T): void {
        if (this._canContain(series)) {
            this._series.push(series);
            series.group = this;
            series.index = this._series.length - 1;
        } else {
            throw new Error('이 그룹에 포함될 수 없는 시리즈입니다: ' + series);
        }
    }
    private $_collectValues(axis: IAxis): number[] {
        let vals: number[] = [];

        this._visibles.forEach(ser => {
            vals = vals.concat(ser.collectValues(axis));
        })
        return vals;
    }

    private $_collectPoints(): Map<number, DataPoint[]> {
        const series = this._visibles;
        const map: Map<number, DataPoint[]> = this._stackPoints = new Map();

        series[0]._visPoints.forEach(p => {
            p.yGroup = p.yValue;
            map.set(p.xValue, [p]);
        });

        for (let i = 1; i < series.length; i++) {
            series[i]._visPoints.forEach(p => {
                const pts = map.get(p.xValue);
                
                if (pts) {
                    pts.push(p);
                } else {
                    map.set(p.xValue, [p]);
                }
                p.yGroup = p.yValue;
            });
        }
        return map;
    }

    private $_collectStack(axis: IAxis): number[] {
        const base = this.getBaseValue(axis);
        const map = this.$_collectPoints();
        const vals: number[] = [];

        if (!isNaN(base)) {
            for (const pts of map.values()) {
                let v = pts[0].yValue;
                let prev = v >= base ? 0 : -1;
                let nprev = v < base ? 0 : -1;

                for (let i = 1; i < pts.length; i++) {
                    v = pts[i].yValue;

                    if (v >= base) {    
                        if (prev >= 0) {
                            pts[i].yGroup = pts[prev].yGroup + v;
                        }
                        prev = i;
                    } else {
                        if (nprev >= 0) {
                            pts[i].yGroup = pts[nprev].yGroup + v;
                        }
                        nprev = i;
                    }
                }
                if (prev >= 0) {
                    vals.push(pts[prev].yGroup);
                }
                if (nprev >= 0) {
                    vals.push(pts[nprev].yGroup);
                }
            }
        } else {
            for (const pts of map.values()) {
                for (let i = 1; i < pts.length; i++) {
                    pts[i].yGroup = pts[i - 1].yGroup + pts[i].yValue;
                }
                vals.push(pts[pts.length - 1].yGroup);
            }
        }
        return vals;
    }

    private $_collectFill(axis: IAxis): number[] {
        const base = this.getBaseValue(axis);
        const max = this.layoutMax || 100;
        const map = this.$_collectPoints();
        const vals: number[] = [];

        if (!isNaN(base)) {
            for (const pts of map.values()) {
                let sum = 0;
                for (const p of pts) {
                    sum += Math.abs(p.yValue) || 0;
                }

                let prev = 0;
                let nprev = 0;
                
                for (const p of pts) {
                    p.yValue = p.yValue / sum * max;

                    if (p.yValue < base) {
                        nprev = p.yGroup = p.yValue + nprev;
                    } else {
                        prev = p.yGroup = p.yValue + prev;
                    }
                }
                vals.push(nprev, prev);
            }
        } else {
            for (const pts of map.values()) {
                let sum = 0;
                for (const p of pts) {
                    sum += p.yValue || 0;
                }
                let prev = 0;
                for (const p of pts) {
                    p.yValue = p.yValue / sum * max;
                    prev = p.yGroup = p.yValue + prev;
                }
                vals.push(max);
            }
        }
        return vals;
    }
}

export abstract class ConstraintSeriesGroup<T extends Series> extends SeriesGroup<T> {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    collectValues(axis: IAxis): number[] {
        let vals = super.collectValues(axis);

        if (axis === this._yAxisObj) {
            vals = this._doConstraintYValues(this._visibles) || vals;
        }
        return vals;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _doConstraintYValues(series: Series[]): number[];
}

export abstract class ClustrableSeriesGroup<T extends Series> extends SeriesGroup<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _clusterWidth = 1;
    _clusterPos = 0;
    
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 축 단위 너비에서 이 그룹이 차지하는 상대적 너비.
     */
    groupWidth = 1;
    /**
     * 이 그룹의 너비에서 포인트들이 표시되기 전후의 상대적 여백 크기.
     */
    groupPadding = 0.1;

}