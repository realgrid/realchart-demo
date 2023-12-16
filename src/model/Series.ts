////////////////////////////////////////////////////////////////////////////////
// Series.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isFunc, isObject, isString, pickNum, pickProp, pickProp3 } from "../common/Common";
import { IPoint } from "../common/Point";
import { RcElement } from "../common/RcControl";
import { RcObject } from "../common/RcObject";
import { IRichTextDomain } from "../common/RichText";
import { Align, IPercentSize, IValueRange, IValueRanges, RtPercentSize, SVGStyleOrClass, VerticalAlign, _undef, buildValueRanges, calcPercent, parsePercentSize } from "../common/Types";
import { Utils } from "../common/Utils";
import { RectElement } from "../common/impl/RectElement";
import { Shape, Shapes } from "../common/impl/SvgShape";
import { IAxis } from "./Axis";
import { IChart } from "./Chart";
import { ChartItem, FormattableText } from "./ChartItem";
import { LineType } from "./ChartTypes";
import { DataPoint, DataPointCollection } from "./DataPoint";
import { ILegendSource, LegendItem } from "./Legend";
import { ITooltipContext, Tooltip } from "./Tooltip";
import { CategoryAxis } from "./axis/CategoryAxis";

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
    // const
    //-------------------------------------------------------------------------
    private static readonly OFFSET = 4;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _point: DataPoint;
    _domain: IRichTextDomain = {
        callback: (traget: any, param: string): any => {
            return this._point[param] || this._point.source[param];
        }
    }

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart, _undef);

        this.visible = _undef;
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 포인트 label 표시 위치.
     * 
     * @config
     */
    position = PointItemPosition.AUTO;
    /**
     * 다중 라인이거나 경계가 있을 때,
     * 텍스트 상자 내에서 텍스트 라인들의 수평 정렬.
     */
    textAlign = Align.CENTER;
    /**
     * label과 point view 사이의 기본 간격.\
     * 값을 지정하지 않으면 {@link position}이 'inside'일 때는 0, 그 외는 4 픽셀이다.
     * 
     * @config
     */
    offset: number;
    /**
     * 'pie', 'funnel' 시리즈에서 label이 외부에 표시될 때 label과 시리즈 본체와의 기본 간격.
     * 
     * @config
     */
    distance = 25;
    /**
     * 계산되는 기본 text 대신, data point label로 표시될 text 리턴.\
     * undefined나 null을 리턴하면 {@link text} 속성 등에 설정된 값으로 표시하거나,
     * 값에 따라 자동 생성되는 텍스트를 사용한다.
     * 빈 문자열 등 정상적인 문자열을 리턴하면 그 문자열대로 표시된다. 
     * {@link prefix}나 포맷 속성 등은 적용되지 않는다.
     */
    textCallback: (point: any) => string;
    /**
     * 데이터 포인트별 label 표시 여부를 리턴하는 콜백.
     * 
     * @config
     */
    visibleCallback: (point: any) => boolean;
    /**
     * 데이터 포인트별로 추가 적용되는 스타일을 리턴한다.\
     */
    styleCallback: (point: any) => SVGStyleOrClass;
    /**
     * 데이터 포인트 label 표시 여부.
     * 값을 설정하지 않고 {@link visibleCallback}이 설정되면 콜백 리턴값을 따른다.
     * 명시적으로 값을 설정하면 그 값에 따른다.
     */
    //"@config visible" = undefined;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getTextDomain(p: DataPoint): IRichTextDomain {
        this._point = p;
        return this._domain;
    }

    getText(value: any): string {
        if (Utils.isValidNumber(value)) {
            return this._getText(null, value, Math.abs(value) > 1000, true);
        }
        return value;
    }

    getOffset(): number {
        const off = +this.offset;
        if (isNaN(off)) {
            return this.position === PointItemPosition.INSIDE ? 0 : DataPointLabel.OFFSET;
        }
        return off;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _doLoadSimple(source: any): boolean {
        if (isFunc(source)) {
            this.visibleCallback = source;
            return this.visible = true;
        }
        return super._doLoadSimple(source);
    }

    protected _doPrepareRender(chart: IChart): void {
        this._domain.numberFormatter = this._numberFormatter;
    }
}

export interface IPlottingItem {
    _row: number;
    _col: number;

    row: number;
    col: number;
    index: number;
    xAxis: string | number;
    yAxis: string | number;
    visible: boolean;
    zOrder: number;

    setCol(col: number): void;
    setRow(row: number): void;
    getVisibleSeries(): ISeries[];
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
    collectCategories(axis: IAxis): string[];
    prepareRender(): void;
    prepareAfter(): void;
    collectValues(axis: IAxis, vals: number[]): void;
    pointValuesPrepared(axis: IAxis): void;
}

export enum TrendType {
    LINEAR = 'linear',
    LOGARITHMIC = 'logarithmic', 
    POLYNOMIAL = 'polynomial', 
    POWER = 'power', 
    EXPONENTIAL = 'exponential', 
    MOVING_AVERAGE = 'movingAverage'
}

export class MovingAverage extends RcObject {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    interval: number = 5;
    type: 'simple' | 'weighted' | 'exponential' | 'triangualr' = 'simple';
}

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
        super(series.chart, false);
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
        (this['$_' + this.type] || this.$_linear).call(this, this.series._runPoints, this._points = []);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
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
    layout: SeriesGroupLayout;
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
    isVisible(p: DataPoint): boolean;
}

export interface IDataPointCallbackArgs {
    /* series */
    series: object;
    count: number;
    vcount: number;
    yMin: number;
    yMax: number;
    xMin: number;
    xMax: number;
    zMin: number;
    zMax: number;

    /* point proxy */
    index: number;
    vindex: number;
    x: any;
    y: any;
    z: any;
    xValue: any;
    yValue: any;
    zValue: any;
    
    source: any;
}

export type PointStyleCallback = (args: IDataPointCallbackArgs) => SVGStyleOrClass;
export type PointClickCallback = (args: IDataPointCallbackArgs) => boolean;

const AXIS_VALUE = {
    'x': 'xValue',
    'y': 'yValue',
    'z': 'zValue'
}

/**
 */
export abstract class Series extends ChartItem implements ISeries, ILegendSource, ITooltipContext {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly LEGEND_MARKER = 'rct-legend-item-marker';

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static _loadSeries(chart: IChart, src: any, defType?: string): Series {
        const cls = chart._getSeriesType(src.type) || chart._getSeriesType(defType || chart.type);
        return new cls(chart, src.name).load(src);
    }

    static getPointTooltipParam(series: Series, point: DataPoint, param: string): any {
        switch (param) {
            case 'series':
                return series.displayName();
            case 'name':
                return series._xAxisObj.getXValue(point.xValue);
            case 'x':
                return series._xAxisObj.value2Tooltip(point.x || (series._xAxisObj instanceof CategoryAxis ? series._xAxisObj.getCategory(point.index) : point.xValue));
            case 'xValue':
                return series._xAxisObj.value2Tooltip(point[param]);
            case 'y':
            case 'yValue':
                return series._yAxisObj.value2Tooltip(point[param]);
            default:
                return param in point ? point[param] : point.source?.[param];
        }
    }

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _row = 0;
    _col = 0;
    index = -1;
    group: SeriesGroup<Series>;
    _xAxisObj: IAxis;
    _yAxisObj: IAxis;
    protected _points: DataPointCollection;
    _runPoints: DataPoint[];
    _visPoints: DataPoint[];
    _containsNull: boolean;
    _runRangeValue: 'x' | 'y' | 'z';
    _runRanges: IValueRange[];
    _minX: number;
    _maxX: number;
    _minY: number;
    _maxY: number;
    _minZ: number;
    _maxZ: number;
    _referents: Series[];
    _calcedColor: string;
    _simpleMode = false;
    private _legendMarker: RcElement;
    private _pointLabelCallback: (point: any) => string;
    protected _pointArgs: IDataPointCallbackArgs;
    private _argsPoint: DataPoint;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart, true);

        this.name = name;
        this.pointLabel = this._createLabel(chart);
        this.trendline = new Trendline(this);

        this._points = new DataPointCollection(this);
        this._pointArgs = this._createPointArgs();

        this._initProps();
    }

    protected _initProps(): void {
    }

    protected _createLabel(chart: IChart): DataPointLabel {
        return new DataPointLabel(chart);
    }

    //-------------------------------------------------------------------------
    // ITooltipContext
    //-------------------------------------------------------------------------
    getTooltipText(series: ISeries, point: DataPoint): string {
        return this.tooltipText;
    }

    getTooltipParam(series: ISeries, point: DataPoint, param: string): any {
        return Series.getPointTooltipParam(series as Series, point, param);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    abstract _type(): string; // for debugging, ...

    /**
     * 시리즈 이름.\
     * 시리즈 생성시 지정되고 변경할 수 없다.
     * 
     * @config
     */
    readonly name: string;
    /**
     * 이 시리즈를 나타내는 텍스트.\
     * 레전드나 툴팁에서 시리즈를 대표한다.
     * 이 속성이 지정되지 않으면 {@link name}이 사용된다.
     * 
     * @config
     */
    label: string;
    /**
     * 데이터포인트 label 설정 모델.
     * 
     * @config
     */
    readonly pointLabel: DataPointLabel;
    /**
     * 추세선 설정 모델.
     * 
     * @config
     */
    readonly trendline: Trendline;
    /**
     * 분할 모드일 때 시리즈가 표시될 pane의 수평 위치.
     * 
     * @config
     */
    row: number;
    /**
     * 분할 모드일 때 시리즈가 표시될 pane의 수직 위치.
     * 
     * @config
     */
    col: number;
    /**
     * 포인터가 차지하는 너비가 이 값 미만이면 표시하지 않는다.
     * // TODO: 구현할 것!
     */
    visibleThreshold: number;
    /**
     * @config
     */
    zOrder = 0;
    /**
     * @config
     */
    xAxis: string | number;
    /**
     * @config
     */
    yAxis: string | number;
    /**
     * json 객체나 배열로 전달되는 데이터포인트 정보에서 x 값을 지정하는 속성명이나 인덱스.\
     * undefined이면, data point의 값이 array일 때는 0, 객체이면 'x'.
     * 
     * @config
     */
    xField: string | number;
    /**
     * json 객체나 배열로 전달되는 데이터포인트 정보에서 y 값을 지정하는 속성명이나 인덱스.\
     * undefined이면, data point의 값이 array일 때는 1, 객체이면 'y'.
     * 
     * @config
     */
    yField: string | number;
    /**
     * undefined이면, data point의 값이 객체일 때 'color'.
     * 
     * @config
     */
    colorField: string;
    /**
     * undefined이면 'data'.
     * 
     * @config
     */
    dataProp: string;
    /**
     * x축 값이 설정되지 않은 첫번째 데이터 point에 설정되는 x값.\
     * 이 후에는 {@link xStep}씩 증가시키면서 설정한다.
     * 이 속성이 지징되지 않은 경우 {@link ChartOptions.xStart}가 적용된다.
     * 
     * @config
     */
    xStart: any;
    /**
     * x축 값이 설정되지 않은 데이터 point에 지정되는 x값의 간격.\
     * 첫번째 값은 {@link xStart}로 설정한다.
     * time 축일 때, 정수 값 대신 시간 단위('y', 'm', 'w', 'd', 'h', 'n', 's')로 지정할 수 있다.
     * 이 속성이 지정되지 않으면 {@link ChartOptions.xStep}이 적용된다.
     * 
     * @config
     */
    xStep: number | string;
    /**
     * 모든 데이터포인트에 적용되는 inline 스타일셋.\
     * {@link Series.style}로 설정되는 시리즈의 inline 스타일이
     * 데이터포인터에 적용되지 않는 경우 이 속성을 사용할 수 있다.
     */
    pointStyle: SVGStyleOrClass;
    /**
     * 데이터 포인트 기본 색.
     * 
     * @config
     */
    color: string;
    /**
     * 데이터 포인트별 색들을 지정한다.\
     * false로 지정하면 모든 포인트들이 시리즈 색으로 표시된다.
     * true로 지정하면 기본 색들로 표시된다.
     * 색 문자열 배열로 지정하면 포함된 색 순서대로 표시된다.
     * undefined나 null이면 시리즈 종류에 따라 false 혹은 true로 해석된다.
     * 
     * @config
     */
    pointColors: boolean | string[];
    /**
     * 값 범위 목록.\
     * 범위별로 다른 스타일을 적용할 수 있다.
     * 범위들은 중첩될 수 없다.
     * 
     * @config
     */
    viewRanges: IValueRange[] | IValueRanges;
    /**
     * ranges가 적용되는 값.\
     * 지정하지 않으면 시리즈 종류에 띠라 자동 적용된다.
     * 'line' 시리즈 계열은 'x', 나머지는 'y'가 된다.
     * 현재 'z'은 range는 bubble 시리즈에만 적용할 수 있다.
     * 
     * @config
     */
    viewRangeValue: 'x' | 'y' | 'z';
    /**
     * true로 지정하면 body를 벗어난 data point 영역도 표시된다.\
     * 값을 지정하지 않으면 polar 차트에서는 true, 직교 차트에서는 false이다.
     * group에 포함되면 group의 noClip 설정을 따른다.
     * 
     * @config
     */
    noClip: boolean;
    /**
     * 명시적 false로 지정하면 legend에 표시하지 않는다.
     * 
     * @config
     */
    visibleInLegend = true;
    /**
     * true로 지정하면 시리즈 내비게이터에 표시한다.
     */
    visibleInNavigator = false;
    /**
     * 데이터포인트 툴팁 텍스트.
     * 
     * @config
     */
    tooltipText = '<b>${name}</b><br>${series}:<b> ${yValue}</b>';
    /**
     * 데이터 point의 동적 스타일 콜백.
     * 
     * @config
     */
    pointStyleCallback: PointStyleCallback;
    /**
     * 데이터 point가 클릭될 때 발생하는 이벤트 콜백.
     * 명시적 true를 리턴하면 기본 동작이 진행되지 않는다.
     * 
     * @config
     */
    onPointClick: PointClickCallback;

    contains(p: DataPoint): boolean {
        return this._points.contains(p);
    }

    getPoints(): DataPointCollection {
        return this._points;
    }

    getLabeledPoints(): DataPoint[] {
        return this._points.getPoints(this._xAxisObj, this._yAxisObj);
    }

    getVisiblePoints(): DataPoint[] {
        return this._points.getPoints(this._xAxisObj, this._yAxisObj);
    }

    // point에 표시되는 최대 label 개수.
    pointLabelCount(): number {
        return 1;
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

    hasZ(): boolean {
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

    legendMarker(doc: Document, size: number): RcElement {
        if (!this._legendMarker) {
            this._legendMarker = this._createLegendMarker(doc, +size || LegendItem.MARKER_SIZE);
        }
        return this._legendMarker;
    }
    // setLegendMarker(elt: RcElement): void {
    //     this._legendMarker = elt;
    // }

    legendColor(): string {
        return this._calcedColor;
    }

    legendLabel(): string {
        return this.label || this.name;
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

    hasMarker(): boolean {
        return false;
    }

    setShape(shape: Shape): void {}

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getVisibleSeries(): ISeries[] {
        return [this];
    }

    needClip(polar: boolean): boolean {
        const no = (this.group ? this.group.noClip : this.noClip);

        if (polar) {
            // [주의] 명시적으로 false일 때만, undefined나 null이면 true로 간주.
            return no === false;
        } else {
            // when undefined, null, false
            return no !== true;
        }
    }

    setCol(col: number): void {
        this._col = col;
    }

    setRow(row: number): void {
        this._row = row;
    }

    createPoints(source: any[]): DataPoint[] {
        this._containsNull = false;

        return source.map((s, i) => {
            const p = this._createPoint(s);

            p.index = i;
            p.parse(this);
            if (p.isNull ||= s == null || p.y == null) {
                this._containsNull = true;
            }
            return p;
        });
    }

    private $_getXStart(): number {
        let s = this._xAxisObj.getValue(this.xStart);
        const v = !isNaN(s) ? s : this._xAxisObj.getValue(this.chart.options.xStart);

        return this._xAxisObj._zoom ? Math.floor(this._xAxisObj._zoom.start) : v;
    }

    getXStep(): number {
        return pickProp(this.xStep, this.chart.options.xStep);
    }

    prepareRender(): void {
        this._xAxisObj = this.group ? this.group._xAxisObj : this.chart._connectSeries(this, true);
        this._yAxisObj = this.group ? this.group._yAxisObj : this.chart._connectSeries(this, false);
        this._calcedColor = void 0;
        this._runPoints = this._points.getPoints(this._xAxisObj, this._yAxisObj);
        this.pointLabel.prepareRender();

        super.prepareRender();
    }

    prepareAfter(): void {
        // DataPoint.xValue가 필요하다.
        this.trendline.visible && this.trendline.prepareRender();
    }

    collectCategories(axis: IAxis): string[] {
        if (axis instanceof CategoryAxis) {
            let fld = axis.categoryField;

            if (fld != null) {
                return this._points.getProps(fld);
            } else {
                return this._points.getCategories(axis === this._xAxisObj ? 'x' : 'y').filter(v => isString(v));
            }
        }
    }

    /**
     * vals가 지정되지 않은 상태로 호출될 수 있다.
     * x값이 숫자가 아닐 때 axis가 해석하지 못하면 xStart 부터 xStep으로 증가 시켜 가면서 순서대로 지정한다.
     */
    collectValues(axis: IAxis, vals: number[]): void {
        if (axis === this._xAxisObj) {
            let x = this.$_getXStart() || 0;
            let xStep: any = this.getXStep() || 1;

            if (isString(xStep)) xStep = xStep.trim();

            this._runPoints.forEach((p, i) => {
                let val = axis.getValue(p.x);
    
                // 축이 해석하지 못한 값은 자동으로 값을 지정한다.
                if (isNaN(val)) {
                    val = x;
                    x = axis.incStep(x, xStep);
                }
                if (!isNaN(val)) {
                    p.xValue = val;
                    vals && vals.push(val);
                } else {
                    p.isNull = true;
                }
            });
        } else {
            this._runPoints.forEach((p, i) => {
                if (p.isNull) {
                    p.y = p.yGroup = p.yValue = NaN;
                } else {
                    // p.y가 point 생성 시 null이었지만 series.prepareRender() 중 정상 값으로 설정될 수 있다. (waterfall)
                    // isNull은 유지하면서 p.y 값이 재설정될 수 있도록 한다.
                    // let val = p.isNull ? NaN : axis.getValue(p.y);
                    let val = p.y == null ? NaN : axis.getValue(p.y);
        
                    if (!isNaN(val)) {
                        p.yGroup = p.yValue = val;
                        vals && vals.push(val);
                    } else {
                        p.yGroup = 0;
                    }
                    p.isNull = isNaN(p.yValue);
                }
            });
        }
    }

    collectVisibles(): DataPoint[] {
        const visPoints = this._visPoints = this._runPoints.filter(p => p.visible);
        const len = visPoints.length;

        if (len > 0) {
            const args = this._pointArgs;
            let p = visPoints[0];
            let minX = p.xValue;
            let maxX = minX;
            let minY = p.yValue;
            let maxY = minY;
            let minZ = p.zValue
            let maxZ = minZ;
            const hasZ = this.hasZ();

            p.vindex = 0;

            for (let i = 1; i < len; i++) {
                p = visPoints[i];
                
                p.vindex = i;

                if (p.yValue > maxY) maxY = p.yValue;
                else if (p.yValue < minY) minY = p.yValue;

                if (p.xValue > maxX) maxX = p.xValue;
                else if (p.xValue < minX) minX = p.xValue;
            }

            if (hasZ) {
                for (let i = 1; i < len; i++) {
                    const v = visPoints[i].zValue;
    
                    if (v > maxZ) maxZ = v;
                    else if (v < minZ) minZ = v;
                }
            }

            args.yMin = this._minY = minY;
            args.yMax = this._maxY = maxY;
            args.xMin = this._minX = minX;
            args.xMax = this._maxX = maxX;
            if (hasZ) {
                args.zMin = this._minZ = minZ;
                args.zMax = this._maxZ = maxZ;
            }
        }

        // this.prepareViewRanges();

        return visPoints;
    }

    protected _getRangeMinMax(axis: 'x' | 'y' | 'z'): { min: number, max: number } {
        let min: number;
        let max: number;

        if (axis === 'x') {
            min = this._minX;
            max = this._maxX;
        } else if (axis === 'z') {
            min = this._minZ;
            max = this._maxZ;
        } else {
            min = this._minY;
            max = this._maxY;
        }
        return { min, max }; 
    }

    prepareViewRanges(): void {
        const axis = this.viewRangeValue === 'x' ? this._xAxisObj : this._yAxisObj;
        const min = axis.axisMin();
        const max = axis.axisMax();

        if (this._runRanges = buildValueRanges(this.viewRanges, min, max, false, false, true, this.color)) {
            this._visPoints.forEach((p, i) => {
                this._setViewRange(p, this._runRangeValue = this.getViewRangeAxis());
            });
        } else {
            this._visPoints.forEach((p, i) => {
                p.range = _undef;
            });
        }
    }

    pointValuesPrepared(axis: IAxis): void {
        if (this._referents) {
            this._referents.forEach(r => r.reference(this, axis));
        }
    }

    reference(other: Series, axis: IAxis): void {
    }

    isVisible(point: DataPoint): boolean {
        return this._xAxisObj.contains(point.x) && this._yAxisObj.contains(point.y);
    }

    getLegendSources(list: ILegendSource[]): void {
        this.visibleInLegend !== false && list.push(this);
    }

    getLabelPosition(p: PointItemPosition): PointItemPosition {
        return p;
    }

    getLabelOff(off: number): number {
        return off;
    }

    referBy(ref: Series): void {
        if (ref) {
            if (!this._referents) {
                this._referents = [ref];
            } else if (this._referents.indexOf(ref) < 0) {
                this._referents.push(ref);
            }
        }
    }

    setPointVisible(p: DataPoint, visible: boolean) {
        if (p && visible !== p.visible) {
            p.visible = visible;
            this.chart._pointVisibleChanged(this, p);
        }
    }

    protected _createPointArgs(): IDataPointCallbackArgs {
        return {} as any;
    }

    protected _preparePointArgs(args: IDataPointCallbackArgs): void {
        this._pointLabelCallback = this.pointLabel.textCallback;
        this._argsPoint = null;

        args.series = this.chart._proxy?.getChartObject(this);
        args.count = this._points.count;
        // args.vcount = 
    }

    protected _getPointCallbackArgs(args: IDataPointCallbackArgs, p: DataPoint): void {
        if (p !== this._argsPoint) {
            (this._argsPoint = p).assignTo(args);
        }
    }

    getPointText(p: DataPoint, label: any): string {
        if (this._pointLabelCallback) {
            this._getPointCallbackArgs(this._pointArgs, p);
            const s = this._pointLabelCallback(this._pointArgs);
            if (s != null) return s;
        }
        return label;
    }

    getPointStyle(p: DataPoint): any {
        if (this.pointStyleCallback) {
            this._getPointCallbackArgs(this._pointArgs, p);
            return this.pointStyleCallback(this._pointArgs);
        }
    }

    getPointLabelStyle(p: DataPoint): any {
        if (this.pointLabel.styleCallback) {
            this._getPointCallbackArgs(this._pointArgs, p);
            return this.pointLabel.styleCallback(this._pointArgs);
        }
    }

    pointClicked(p: DataPoint): boolean {
        if (this.onPointClick) {
            this._getPointCallbackArgs(this._pointArgs, p);
            return this.onPointClick(this._pointArgs);
        }
    }

    getViewRangeAxis(): 'x' | 'y' | 'z' {
        return this.viewRangeValue || this._defViewRangeValue();
    }

    isPointLabelsVisible(): boolean {
        return this.pointLabel.visible || isFunc(this.pointLabel.visibleCallback);
    }

    isPointLabelVisible(p: DataPoint): boolean {
        const m = this.pointLabel;

        if (m.visible === false) {
            return false;
        }
        if (m.visibleCallback) {
            this._getPointCallbackArgs(this._pointArgs, p);
            return m.visibleCallback(this._pointArgs);
        }
        return m.visible === true;
    }

    updateData(data: any): void {
        this._points.load(data);
        this._changed();
    }

    getPointAt(xValue: number): DataPoint {
        return this._points.pointAt(xValue);
    }
    
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _createPoint(source: any): DataPoint {
        return new DataPoint(source);
    }

    protected _createLegendMarker(doc: Document, size: number): RcElement {
        return RectElement.create(doc, Series.LEGEND_MARKER, 0, 0, size, size, size / 2);
    }

    _referOtherSeries(series: Series): boolean {
        // true 리턴하면 더 이상 참조하지 않는 다는 뜻.
        return true;
    }

    protected _getField(axis: IAxis): any {
        return axis === this._xAxisObj ? this.xField : this.yField;
    }

    _colorByPoint(): boolean {
        return false;
    }

    protected _doLoad(src: any): void {
        super._doLoad(src);

        const data = this._loadData(src);

        if (isArray(data) && data.length > 0) {
            this._doLoadPoints(data);
        }
    }

    protected _loadData(src: any): any {
        const data = src[this.dataProp || 'data'];
        return data;
    }

    protected _doLoadPoints(src: any[]): void {
        this._points.load(src);
    }

    loadPoints(src: any[]): void {
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

        this._runPoints.forEach((p, i) => {
            if (!p.color && colors) {
                p.color = color || colors[i % colors.length];
            }
        })

        this._preparePointArgs(this._pointArgs);
    }

    protected _setViewRange(p: DataPoint, axis: 'x' | 'y' | 'z'): void {
        const v = p[AXIS_VALUE[axis]];

        for (const r of this._runRanges) {
            if (v >= r.fromValue && v <= r.toValue) {
                p.range = r;
                return;
            }
        }
        p.range = _undef;
    }

    _defViewRangeValue(): 'x' | 'y' | 'z' {
        return 'y';
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
    private _widget: boolean;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        this.chart = chart;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get count(): number {
        return this._items.length;
    }

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

    isWidget(): boolean {
        return this._widget;
    }

    isEmpty(): boolean {
        return !this._items.find(item => !item.isEmpty());
        // return !this._visibles.find(item => !item.isEmpty());
    }

    items(): IPlottingItem[] {
        return this._items.slice(0);
    }
    internalItems(): IPlottingItem[] {
        return this._items;
    }

    visibles(): IPlottingItem[] {
        return this._visibles.slice(0);
    }

    series(): Series[] {
        return this._series.slice(0);
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
    getSeries(name: string): Series {
        return this._map[name];
    }

    getVisibleSeries(): Series[] {
        return this._visibleSeries.slice(0);
    }

    getPaneSeries(row: number, col: number): Series[] {
        return this._visibleSeries.filter(ser => row === ser._row && col === ser._col);
    }

    seriesByPoint(point: DataPoint): Series {
        for (const ser of this._series) {
            if (ser.contains(point)) {
                return ser;
            }
        }
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

        this._widget = true;

        series.forEach(ser => {
            if (this._widget && !(ser instanceof WidgetSeries)) {
                this._widget = false;
            }
            if (ser.name) {
                map[ser.name] = ser;
            }
            for (const ser2 of this._series) {
                if (ser2 !== ser) {
                    if (!ser.canMixWith(ser2)) {
                        throw new Error('동시에 표시할 수 없는 시리즈들입니다: ' + ser._type() + ', ' + ser2._type());
                    }
                    if (ser._referOtherSeries(ser2)) {
                        break;
                    }
                }
            }
        });
    }

    updateData(values: any[]): void {
    }

    prepareRender(): void {
        const visibles = [];
        let iShape = 0;

        this._visibles = this._items.filter(item => item.visible).sort((i1, i2) => (+i1.zOrder || 0) - (+i2.zOrder || 0));

        this._series.forEach(ser => {
            ser.visible && visibles.push(ser);
            if (ser.hasMarker()) {
                ser.setShape(Shapes[iShape++ % Shapes.length]);
            }
        });

        this._visibleSeries = visibles.sort((s1, s2) => {
            let order1 = +(s1.group ? s1.group.zOrder : s1.zOrder) || 0;
            let order2 = +(s2.group ? s2.group.zOrder : s2.zOrder) || 0;

            if (order1 === order2 && s1.group && s1.group === s2.group) {
                return (+s1.zOrder || 0) - (+s2.zOrder || 0);
            }
            return order1 - order2;
        })

        const nCluster = this._visibleSeries.filter(ser => ser.clusterable()).length;

        this._visibleSeries.forEach((ser, i) => {
            if (ser instanceof ClusterableSeries) {
                ser._single = nCluster === 1;
            }
        });

        this._visibles.forEach(item => item.prepareRender());
    }

    prepareAfter(): void {
        this._visibles.forEach(item => item.prepareAfter());
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadItem(chart: IChart, src: any, index: number): IPlottingItem {
        let cls = isArray(src.children || src.series) && (chart._getGroupType(src.type || chart.type));

        if (cls) {
            const g = new cls(chart);

            g.load(src);
            g.index = index;
            return g;
        }

        cls = chart._getSeriesType(src.type || chart.type);
        if (!cls) {
            throw new Error('Invalid series type: ' + src.type + ', ' + chart.type);
        }

        const ser = new cls(chart, src.name || `Series ${index + 1}`);

        ser.load(src);
        ser.index = index;
        return ser;
    }
}

export enum MarkerVisibility {
    /** 
     * visible 속성에 따른다. 
     * 
     * @config
     * */
    DEFAULT = 'default',
    /** 
     * visible 속성과 상관없이 항상 표시한다. 
     * 
     * @config
     * */
    VISIBLE = 'visible',
    /** 
     * visible 속성과 상관없이 항상 표시하지 않는다. 
     * 
     * @config
     * */
    HIDDEN = 'hidden'
}

/**
 * @config chart.series.marker
 */
export abstract class SeriesMarker extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * 명시적으로 지정하지 않으면 typeIndex에 따라 Shapes 중 하나로 돌아가면서 설정된다.
     * 
     * @config
     */
    shape: Shape;
    /**
     * {@link shape}의 반지름.
     * 
     * @config
     */
    radius = 3;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public series: Series) {
        super(series.chart, true);
    }
}

export class WidgetSeriesPoint extends DataPoint implements ILegendSource {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _calcedColor: string;
    _legendMarker: RcElement;

    //-------------------------------------------------------------------------
    // ILegendSource
    //-------------------------------------------------------------------------
    legendMarker(): RcElement {
        return this._legendMarker;
    }
    setLegendMarker(elt: RcElement): void {
        this._legendMarker = elt;
    }

    legendColor(): string {
        return this._calcedColor;
    }

    legendLabel(): string {
        return pickProp(this.x, this.y);
    }
}

export abstract class WidgetSeries extends Series {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly CENTER = '50%';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _centerXDim: IPercentSize;
    private _centerYDim: IPercentSize;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * @config
     */
    centerX: RtPercentSize;;
    /**
     * @config
     */
    centerY: RtPercentSize;
    /**
     * @config
     */
    center: RtPercentSize;
    /**
     * widget 본체의 크기나 표시 위치가 변경됐을 때 animation 실행 여부
     */
    boundsAnimation = true;
    /**
     * 데이터 포인트별 legend 항목을 표시한다.
     * 
     * @config
     */
    legendByPoint = false;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getCenter(plotWidth: number, plotHeight: number): IPoint {
        return {
            x: calcPercent(this._centerXDim, plotWidth),
            y: calcPercent(this._centerYDim, plotHeight)
        };
    }

    getLabelPosition(): PointItemPosition {
        const p = this.pointLabel.position;
        return p === PointItemPosition.AUTO ? PointItemPosition.INSIDE : p;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    needAxes(): boolean {
        return false;
    }

    _colorByPoint(): boolean {
        return true;
    }

    getLegendSources(list: ILegendSource[]): void {
        if (this.legendByPoint) {
            this.visibleInLegend !== false && this._runPoints.forEach(p => {
                list.push(p as WidgetSeriesPoint);
            })        
        } else {
            super.getLegendSources(list);
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoad(src: any): void {
        super._doLoad(src);

        this._centerXDim = parsePercentSize(pickProp3(this.centerX, this.center, WidgetSeries.CENTER), true);
        this._centerYDim = parsePercentSize(pickProp3(this.centerY, this.center, WidgetSeries.CENTER), true);
    }
}

/**
 * 직교 좌표계가 표시된 경우, plot area 영역을 기준으로 size, centerX, centerY가 적용된다.
 * <br>
 * TODO: 현재 PieSeris만 계승하고 있다. 추후 PieSeries에 합칠 것.
 * 
 */
export abstract class RadialSeries extends WidgetSeries {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly DEF_RADIUS = '40%';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _radiusDim: IPercentSize;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 시리즈 원호의 반지름.
     * 픽셀 크기나 plot 영역 크기에 대한 상대적 크기로 지정할 수 있다.
     * '50%'로 지정하면 plot 영역의 width나 height중 작은 크기와 동일한 반지름으로 표시된다.
     * 
     * @config
     */
    radius: RtPercentSize = RadialSeries.DEF_RADIUS;
    /**
     * 시리즈 원호 시작 각도.
     * 지정하지 않거나 잘못된 값이면 0으로 계산된다.
     * 0은 시계의 12시 위치다.
     * 
     * @config
     */
    startAngle = 0;
    /**
     * 시리즈 원호 전체 각도.
     * 0 ~ 360 사이의 값으로 지정해야 한다.
     * 범위를 벗어난 값은 범위 안으로 조정된다.
     * 지정하지 않거나 잘못된 값이면 360으로 계산된다.
     * 
     * @config
     */
    totalAngle = 360;
    /**
     * true면 시계 방향으로 회전한다.
     * 
     * @config
     */
    clockwise = true;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getRadius(plotWidth: number, plotHeight: number): number {
        return calcPercent(this._radiusDim, Math.min(plotWidth, plotHeight));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoad(src: any): void {
        super._doLoad(src);

        this._radiusDim = parsePercentSize(pickProp(this.radius, RadialSeries.DEF_RADIUS), true);
    }
}

/**
 */
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
    get groupWidth(): number {
        return this.pointWidth;
    }
    // /**
    //  * 시리즈가 group에 포함되지 않은 경우, 축 단위 너비에서 이 시리즈가 차지하는 상대적 너비.
    //  * 그룹에 포함되면 이 속성은 무시된다.
    //  * 
    //  * @config
    //  */
    // groupWidth = 1; // _clusterWidth 계산에 사용된다. TODO: clusterWidth로 변경해야 하나?
    /**
     * 시리즈가 그룹에 포함되지 않거나,
     * 포함된 그룹의 layout이 {@link SeriesGroupLayout.DEFAULT}이거나 특별히 설정되지 않아서,
     * 그룹에 포함된 시리즈들의 data point가 옆으로 나열되어 표시될 때,
     * 포인트 표시 영역 내에서 이 시리즈의 포인트가 차지하는 영역의 상대 크기.
     * 예를 들어 이 시리즈의 속성값이 1이고 다른 시리즈의 값이 2이면 다른 시리즈의 data point가 두 배 두껍게 표시된다.
     * 또, 그룹에 포함되고 그룹의 layout이 {@link SeriesGroupLayout.DEFAULT}
     * 
     * @config
     */
    pointWidth = 1;
    pointPos: number;
    /**
     * 이 시리즈의 point가 차지하는 영역 중에서 point bar 양쪽 끝에 채워지는 빈 영역의 크기.
     * <br>
     * point가 차지할 원래 크기에 대한 상대 값으로서,
     * 0 ~ 1 사이의 비율 값으로 지정한다.
     * 
     * @default undefined 한 카테고리에 cluster 가능한 시리즈가 하나만 표시되면 0.25, group에 포함된 경우 0.1, 여러 시리즈와 같이 표시되면 0.2.
     * @config
     */
    pointPadding: number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getPointWidth(length: number): number {
        const g = this.group as ClusterableSeriesGroup<Series>;
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
        const g = this.group as ClusterableSeriesGroup<Series>;
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

/**
 * 'bar'와 같이 바닥이 필요한 시리즈.\
 * 바닥 값은 {@link baseValue}로 지정한다.
 */
export abstract class BasedSeries extends ClusterableSeries {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _base: number;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 상/하 값 구분의 기준이 되는 값.\
     * 숫자가 아닌 값으로 지정하면 0으로 간주한다.
     * 
     * @config
     */
    baseValue = 0;
    /**
     * null인 y값을 {@link baseValue}로 간주한다.
     * 
     * @config
     */
    nullAsBase = false;
    /**
     * {@link baseValue} 혹은 y축의 baseValue보다 작은 쪽의 point들에 적용되는 스타일.
     * 
     * @config
     */
    belowStyle: SVGStyleOrClass;

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

/**
 */
export abstract class RangedSeries extends ClusterableSeries {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    collectValues(axis: IAxis, vals: number[]): void {
        super.collectValues(axis, vals);

        if (axis === this._yAxisObj) {
            this._runPoints.forEach((p: DataPoint) => {
                const v = this._getBottomValue(p);
                vals && !isNaN(v) && vals.push(v);
            })
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _getBottomValue(p: DataPoint): number;
}

/**
 */
export abstract class CorneredSeries extends RangedSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * 지정한 반지름 크기로 데이터포인트 bar의 모서리를 둥글게 표시한다.\
     * 최대값이 bar 폭으로 절반으로 제한되므로 아주 큰 값을 지정하면 반원으로 표시된다.
     * 
     * @config
     */
    cornerRadius: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createLegendMarker(doc: Document, size: number): RcElement {
        return RectElement.create(doc, Series.LEGEND_MARKER, 0, 0, size, size, 2);
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

/**
 */
export abstract class SeriesGroup<T extends Series> extends ChartItem implements ISeriesGroup, ITooltipContext {

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static collectTooltipText(tooltip: {tooltipHeader: string, tooltipRow: string, tooltipFooter: string}, series: ISeries[], point: DataPoint): string {
        let s = tooltip.tooltipHeader || '';

        if (tooltip.tooltipRow) {
            let i = 0;
            series.forEach(ser => {
                if (s) s = s + '<br>';
                s += tooltip.tooltipRow.replace('series', 'series.' + i++);
            })
        }
        s += tooltip.tooltipFooter ? '<br>' + tooltip.tooltipFooter : '';
        return s;
    }

    static inflateTooltipParam(series: ISeries[], ser: ISeries, point: DataPoint, param: string): string {
        if (param.startsWith('series.')) {
            ser = series[+param.substring(7)] || ser;
            param = 'series';
        }
        return Series.getPointTooltipParam(ser as Series, point, param);
    }

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _row: number;
    _col: number;
    index = -1;
    private _series: T[] = [];
    protected _visibles: T[] = [];
    _xAxisObj: IAxis;
    _yAxisObj: IAxis;
    _stackPoints: Map<number, DataPoint[]>;
    _stacked: boolean;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart, true);
    }

    //-------------------------------------------------------------------------
    // ITooltipContext
    //-------------------------------------------------------------------------
    getTooltipText(series: ISeries, point: DataPoint): string {
        return SeriesGroup.collectTooltipText(this, this._visibles, point);
    }

    getTooltipParam(series: ISeries, point: DataPoint, param: string): string {
        return SeriesGroup.inflateTooltipParam(this._visibles, series, point, param);
    }

    //-------------------------------------------------------------------------
    // ISeriesGroup
    //-------------------------------------------------------------------------
    row: number;
    col: number;

    /**
     * @config
     */
    layout = SeriesGroupLayout.DEFAULT;
    /**
     * @config
     */
    xAxis: string | number;
    /**
     * @config
     */
    yAxis: string | number;
    /**
     * 명시적 false로 지정하면 legend에 표시하지 않는다.
     * 
     * @config
     */
    visibleInLegend = true;
    zOrder = 0;
    noClip: boolean;

    /**
     * 그룹 툴팁의 위쪽에 표시되는 텍스트.\
     * 
     * tooltipHeader
     * tooltipRow,
     * tooltipRow,
     * ...
     * tooltipFooter
     * 형태로 툴팁이 표시된다.
     * 
     * @config
     */
    tooltipHeader = '<b>${name}</b>';
    /**
     * 그룹 툴팁에 각 시리즈별 표시되는 포인트 툴팁 텍스트.
     * 
     * @config
     */
    tooltipRow = '${series}:<b> ${yValue}</b>';
    /**
     * 그룹 툴팁의 아래쪽에 표시되는 텍스트.
     * 
     * @config
     */
    tooltipFooter: string;

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
        return false;
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

    getVisibleSeries(): ISeries[] {
        return this._visibles;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * {@link layout}이 {@link SeriesGroupLayout.FILL}일 때 상대적 최대값.
     * <br>
     * 
     * @default 100
     * @config
     */
    layoutMax = 100;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    abstract _type(): string;
    abstract _seriesType(): string;

    setCol(col: number): void {
        this._col = col;
        this._series.forEach(ser => ser.setCol(col));
    }

    setRow(row: number): void {
        this._row = row;
        this._series.forEach(ser => ser.setRow(row));
    }

    isFirstVisible(series: ISeries): boolean {
        return series === this._visibles[0];
    }

    isLastVisible(series: ISeries): boolean {
        return series === this._visibles[this._visibles.length - 1];
    }

    // Axis에서 요청한다.
    collectValues(axis: IAxis, vals: number[]): void {
        if (this._visibles.length > 0) {
            if (axis === this._visibles[0]._yAxisObj) {
                switch (this.layout) {
                    case SeriesGroupLayout.STACK:
                        this.$_collectStack(axis, vals);
                        break;

                    case SeriesGroupLayout.FILL:
                        this.$_collectFill(axis, vals);
                        break;
        
                    //case SeriesGroupLayout.DEFAULT:
                    //case SeriesGroupLayout.OVERLAP:
                    default:
                        this.$_collectValues(axis, vals);
                        break;
                }
            } else {
                this.$_collectValues(axis, vals);
            }
        }
    }

    pointValuesPrepared(axis: IAxis): void {
        this._series.forEach(ser => ser.pointValuesPrepared(axis));
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
        if (this.visibleInLegend !== false) {
            this._series.forEach(ser => ser.getLegendSources(list));
        }
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
        if (prop === 'children') {
            this.$_loadSeries(this.chart, value);
            return true;
        }
    }

    prepareRender(): void {
        this._stacked = this.layout === SeriesGroupLayout.STACK || this.layout === SeriesGroupLayout.FILL;
        this._visibles = this._series.filter(ser => ser.visible).sort((s1, s2) => (+s1.zOrder || 0) - (+s2.zOrder || 0));

        super.prepareRender();
    }

    protected _doPrepareRender(chart: IChart): void {
        this._xAxisObj = this.chart._connectSeries(this, true);
        this._yAxisObj = this.chart._connectSeries(this, false);

        if (this._visibles.length > 0) {
            this._visibles.forEach(ser => ser.prepareRender());
            this._doPrepareSeries(this._visibles);
        }
    }

    prepareAfter(): void {
        this._visibles.forEach(ser => ser.prepareAfter());
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
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

    private $_collectValues(axis: IAxis, vals: number[]): void {
        this._visibles.forEach(ser => {
            ser.collectValues(axis, vals);
        })
    }

    private $_collectPoints(axis: IAxis): Map<number, DataPoint[]> {
        const series = this._visibles;
        const map: Map<number, DataPoint[]> = this._stackPoints = new Map();

        // point들의 yValue를 준비한다.
        series.forEach(ser => {
            ser.collectValues(axis, null);
        });

        series[0]._runPoints.forEach(p => {
            // p.yGroup = p.yValue || 0;
            map.set(p.xValue, [p]);
        });

        for (let i = 1; i < series.length; i++) {
            series[i]._runPoints.forEach(p => {
                const pts = map.get(p.xValue);
                
                if (pts) {
                    pts.push(p);
                } else {
                    map.set(p.xValue, [p]);
                }
                // p.yGroup = p.yValue || 0;
            });
        }
        return map;
    }

    private $_collectStack(axis: IAxis, vals: number[]): void {
        const base = this.getBaseValue(axis);
        const map = this.$_collectPoints(axis);

        if (!isNaN(base)) {
            for (const pts of map.values()) {
                let v = pts[0].yValue || 0;
                let prev = v >= base ? 0 : -1;
                let nprev = v < base ? 0 : -1;

                pts[0].yGroup = pts[0].yValue || 0;

                for (let i = 1; i < pts.length; i++) {
                    v = pts[i].yValue || 0;

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
                pts[0].yGroup = pts[0].yValue || 0;

                for (let i = 1; i < pts.length; i++) {
                    pts[i].yGroup = pts[i - 1].yGroup + (pts[i].yValue || 0);
                }
                vals.push(pts[pts.length - 1].yGroup);
            }
        }
    }

    private $_collectFill(axis: IAxis, vals: number[]): void {
        const base = this.getBaseValue(axis);
        const max = this.layoutMax || 100;
        const map = this.$_collectPoints(axis);

        if (!isNaN(base)) {
            for (const pts of map.values()) {
                let sum = 0;
                for (const p of pts) {
                    sum += Math.abs(p.yValue) || 0;
                }

                let prev = 0;
                let nprev = 0;
                
                for (const p of pts) {
                    p.yValue = (p.yValue || 0) / sum * max;

                    if (p.yValue < base) {
                        nprev = p.yGroup = (p.yValue || 0) + nprev;
                    } else {
                        prev = p.yGroup = (p.yValue || 0) + prev;
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
                    prev = p.yGroup = (p.yValue || 0) / sum * max + prev;
                }
                vals.push(max);
            }
        }
    }
}

/**
 */
export abstract class ConstraintSeriesGroup<T extends Series> extends SeriesGroup<T> {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    collectValues(axis: IAxis, vals: number[]): void {
        super.collectValues(axis, vals);

        if (axis === this._yAxisObj) {
            const vals2 = this._doConstraintYValues(this._visibles);

            vals.length = 0;
            vals.push(...vals2);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _doConstraintYValues(series: Series[]): number[];
}

/**
 */
export abstract class ClusterableSeriesGroup<T extends Series> extends SeriesGroup<T> {

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

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    clusterable(): boolean {
        return true;
    }

    setCluster(width: number, pos: number): void {
        this._clusterWidth = width;
        this._clusterPos = pos;
    }
}

export abstract class MarkerSeries extends Series {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 명시적으로 지정하지 않으면 typeIndex에 따라 Shapes 중 하나로 돌아가면서 설정된다.
     * 
     * @config
     */
    shape: Shape;
}