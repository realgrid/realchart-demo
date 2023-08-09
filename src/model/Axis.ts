////////////////////////////////////////////////////////////////////////////////
// Axis.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNumber, isObject, isString, pickNum } from "../common/Common";
import { Align, IPercentSize, SVGStyleOrClass, SizeValue, VerticalAlign, parsePercentSize } from "../common/Types";
import { IChart } from "./Chart";
import { ChartItem, FormattableText } from "./ChartItem";
import { IClusterable, IPlottingItem } from "./Series";

export interface IAxis {

    type(): string;

    _length: number;

    axisMax(): number;
    axisMin(): number;

    /**
     * data point의 값을 축 상의 값으로 리턴한다.
     */
    getValue(value: any): number;
    contains(value: number): boolean;
    /**
     * 값(축 상 위치)에 해당하는 픽셀 위치.
     */
    getPosition(length: number, value: number): number;
    /**
     * 값(축 상 위치)에 해당하는 축 단위 픽셀 크기. 
     * <br>
     * 값에 따라 크기가 다를 수도 있다.
     */
    getUnitLength(length: number, value: number): number;
}

export abstract class AxisItem extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly axis: Axis;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(axis: Axis, visible = true) {
        super(axis?.chart, visible);

        this.axis = axis;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

export class AxisLine extends AxisItem {
}

export class AxisTitle extends AxisItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    text: string;
    gap = 8;
    backgroundStyle: SVGStyleOrClass;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoadSimple(source: any): boolean {
        if (isString(source)) {
            this.text = source;
            return true;
        }
    }
}

/**
 * visible 기본값이 undefined이다.
 * <br>
 * visible이 undefined나 null로 지정되면, 축 위치에 따라 visible 여부가 결정된다.
 */
export class AxisGrid extends AxisItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    circular = false;
    startVisible = true;
    endVisible = true;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: Axis) {
        super(axis, null);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isVisible(): boolean {
        return this.visible == null ? !this.axis._isX : this.visible;
    }

    getPoints(): number[] {
        return this.axis._ticks.map(tick => tick.pos);
    }
            
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

export class AxisGuideLabel extends FormattableText {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart, true);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 수평 정렬.
     */
    align = Align.LEFT;

    /**
     * 수직 정렬.
     */
    valign = VerticalAlign.TOP;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

export enum AxisGuideType {
    /**
     * 축 위의 특정한 값에 선분을 표시한다.
     */
    LINE = 'line',
    /**
     * 축 위 특정한 두 값 사이의 영역을 구분 표시한다.
     */
    RANGE = 'range',
    /**
     * Plot 영역에 (x, y)로 지정하는 값 좌표의 배열로 설정되는 다각형을 표시한다.
     */
    AREA = 'area'
}

export abstract class AxisGuide extends AxisItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    readonly label: AxisGuideLabel;

    /**
     * true면 시리즈들보다 위에 표시된다.
     */
    front = true;
    /**
     * 모든 guide들 중에서 값이 클수록 나중에 그려진다.
     */
    zindex = 0;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: Axis) {
        super(axis);

        this.label = new AxisGuideLabel(axis.chart);
    }
}

export class AxisGuideLine extends AxisGuide {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    value: number; // TODO: RtPercentSize
}

/**
 * range -> zone ?
 */
export class AxisGuideRange extends AxisGuide {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    start: number;  // TODO: RtPercentSize
    end: number;
}

export class AxisTickLabel extends FormattableText {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart, true);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * label 표시 간격.
     * <br>
     * 예) 2이면 짝수만 표시된다.
     */
    step = 1;
    /**
     * step이 2 이상일 때, 표시가 시작되는 label 위치.
     */
    start = 0;
}

/**
 * 기본적으로 tick 위치에 선으로 표시된다.
 */
export class AxisTickMark extends AxisItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * axis tick line length.
     */
    length = 7;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
}

/**
 * 축 상의 특정 값 위치를 나타낸다.
 * 카테고리 축의 경우 각 카테고리 값의 위치이다.
 */
export class AxisTick extends AxisItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    mark: AxisTickMark;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: Axis) {
        super(axis);

        this.mark = this._createMark();
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    prefix: string;
    suffix: string;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getTick(v: any): string {
        if (v != null) {
            let s = String(v);
            if (this.prefix) s = this.prefix + s;
            if (this.suffix) s += this.suffix;
            return s;
        } else {
            return '';
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _createMark(): AxisTickMark {
        return new AxisTickMark(this.axis);
    }
}

export interface IAxisTick {
    pos: number;
    value: number;
    label: string;
}

export enum AxisPosition {
    /**
     * X축은 아래쪽에 수평으로, Y축은 왼쪽에 수직으로 표시된다.
     * <br>
     * {@link Chart.inverted}이면 Y축이 아래쪽에 수평으로, X축은 왼쪽에 수직으로 표시된다.
     */
    NORMAL = 'normal',
    /**
     * X축은 위쪽에 수평으로, Y축은 오른쪽에 수직으로 표시된다.
     * <br>
     * {@link Chart.inverted}이면 Y축이 위쪽에 수평으로, X축은 오른쪽에 수직으로 표시된다.
     */
    OPPOSITE = 'opposite',
    /**
     * 상대 축의 baseValue 지점에 표시된다.
     * <br>
     * 상대 축이 **linear** 가 아니거나 {@link LinearAxis.baseValue}가 min 보다 작거나 max보다 크면 이 값은 무시되고,
     * {@link NORMAL}로 적용된다.
     * <br>
     * [주의] 연결된 시리즈들이 BarSeries일 때만 가능하다.
     */
    BASE = 'base'
}

/**
 * 차트에서 축을 명식적으로 지정하지 않으면, 첫번째 시리즈에 합당한 축이 기본 생성된다.
 */
export abstract class Axis extends ChartItem implements IAxis {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly name: string;
    readonly title = new AxisTitle(this);
    readonly line = new AxisLine(this);
    readonly tick: AxisTick;
    readonly grid = this._createGrid();
    readonly guides: AxisGuide[] = [];

    _isX: boolean;
    _isHorz: boolean;
    _isOpposite: boolean;
    protected _series: IPlottingItem[] = [];
    _range: { min: number, max: number };
    _ticks: IAxisTick[];
    _length: number;

    _minPadDim: IPercentSize;
    _maxPadDim: IPercentSize;
    _minPad = 0;
    _maxPad = 0;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart);

        this.name = name;
        this.tick = this._createTick();
    }

    protected _createTick(): AxisTick {
        return new AxisTick(this);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    abstract type(): string;

    canBeX(): boolean {
        return true;
    }

    /**
     * 표시 위치.
     */
    position = AxisPosition.NORMAL;
    /**
     * true면 반대 방향으로 point 위치들이 지정된다.
     */
    reversed = false;
    /**
     * 명시적으로 지정하는 최소값.
     * <br>
     * 축에 연결된 data point들의 값으로 계산된 최소값 대신 이 값이 축의 최소값이 된다.
     * {@link minPadding}도 무시된다.
     */
    min: number;
    /**
     * 명시적으로 지정하는 최대값.
     * <br>
     * 축에 연결된 data point들의 값으로 계산된 최대값 대신 이 값이 축의 최소값이 된다.
     * {@link maxPadding}도 무시된다.
     */
    max: number;
    /**
     * 명시적 최소값이 지정되지 않은 경우, 축 최소값 쪽에서 축 안쪽으로 설정되는 여백 크기.
     * <br>
     * data point 값을 숫자로 지정하거나 전체 축 길이에 대한 상대 크기를 백분율로 지정할 수 있다.
     * 이 값을 설정하지 않으면 {@link padding}에 지정한 값으로 설정된다.
     */
    minPadding: SizeValue;
    /**
     * 명시적 최대값이 지정되지 않은 경우, 축 최대값 쪽에서 축 안쪽으로 설정되는 여백 크기.
     * <br>
     * data point 값을 숫자로 지정하거나 전체 축 길이에 대한 상대 크기를 백분율로 지정할 수 있다.
     * 이 값을 설정하지 않으면 {@link padding}에 지정한 값으로 설정된다.
     */
    maxPadding: SizeValue;
    /**
     * {@link minPadding}, {@link maxPadding}을 동시에 설정한다.
     * <br>
     * data point 값을 숫자로 지정하거나 전체 축 길이에 대한 상대 크기를 백분율로 지정할 수 있다.
     * {@link minPadding}, {@link maxPadding}으로 양 끝을 별도 설정할 수 있다.
     */
    padding: SizeValue = 0;
    /**
     * Plot 영역이나 앞쪽 축 사이의 여백 크기.
     * <br>
     */
    marginNear = 0;
    /**
     * 차트 경계나 뒤쪽 축 사이의 여백 크기.
     */
    marginFar = 0;
    /**
     * 축 시작 위치에 tick 표시 여부.
     * <br>
     * undefined나 null등으로 값을 지정하지 않으면 tick 설정에 따라 표시 여부가 자동 지정된다.
     * <br>
     * true로 지정하면 축 시작 위치에 tick이 표시되지 않게 계산될 때,
     * (ex, 첫번째 tick 이전에 data point가 표시될 수 있다.)
     * 시작 위치에 tick이 표시되도록 조정한다.
     * <br>
     * false로 지정하면 축 시작 위치에 tick이 생성된 경우에도 표시하지 않는다.
     */
    tickStart: boolean;
    /**
     * 축 끝 위치에 tick 표시 여부.
     * <br>
     * undefined나 null등으로 값을 지정하지 않으면 tick 설정에 따라 표시 여부가 자동 지정된다.
     * <br>
     * true로 지정하면 축 끝 위치에 tick이 표시되지 않게 계산될 때,
     * (ex, 마지막 tick 이후에 data point가 표시될 수 있다.)
     * 끝 위치에 tick이 표시되도록 조정한다.
     * <br>
     * false로 지정하면 축 끝 위치에 tick이 생성된 경우에도 표시하지 않는다.
     */
    tickEnd: boolean;

    isEmpty(): boolean {
        return this._series.length < 1;
    }

    abstract axisMin(): number;
    abstract axisMax(): number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    protected abstract _doPrepareRender(): void;
    protected abstract _doBuildTicks(min: number, max: number, length: number): IAxisTick[];

    disconnect(): void {
        this._series = [];
    }

    prepareRender(): void {
        this._isHorz = this.chart.isInverted() ? !this._isX : this._isX;
        this._isOpposite = this.position === AxisPosition.OPPOSITE;

        this._doPrepareRender();

        // range
        let vals: number[] = [];

        this._series.forEach(item => {
            vals = vals.concat(item.collectValues(this));
        })
        this._range = this._doCalcluateRange(vals);

        // clustering
        let sum = 0;
        let p = 0;

        this._series.forEach(item => {
            if (item.clusterable()) {
                sum += pickNum((item as any as IClusterable).groupWidth, 1);
            }
        })
        this._series.forEach(item => {
            if (item.clusterable()) {
                const w = pickNum((item as any as IClusterable).groupWidth, 1) / sum;

                (item as any as IClusterable).setCluster(w, p);
                p += w;
            }
        })
    }

    buildTicks(length: number): void {
        this._ticks = this._doBuildTicks(this._range.min, this._range.max, this._length = length);
    }

    /**
     * value에 해당하는 축상의 위치.
     */
    abstract getPosition(length: number, value: number): number;
    abstract getUnitLength(length: number, value: number): number;

    getValue(value: any): number {
        return +value;
    }

    contains(value: number): boolean {
        return value >= this._range.min && value <= this._range.max;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoad(source: any): void {
        super._doLoad(source);

        this._minPadDim = parsePercentSize(this.minPadding, true);
        this._maxPadDim = parsePercentSize(this.maxPadding, true);
    }

    protected _doLoadProp(prop: string, value: any): boolean {
        if (prop === 'guide') {
            if (isArray(value)) this.$_loadGuides(value);
            else if (isObject(value)) this.$_loadGuides([value]);
            return true;
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _createGrid(): AxisGrid {
        return new AxisGrid(this);
    }

    private $_loadGuides(source: any[]): void {
        for (let i = 0; i < source.length; i++) {
            const g: any = source[i]
            let guide: AxisGuide;

            switch (g.type) {
                case 'range':
                    guide = new AxisGuideRange(this);
                    break;

                case 'line':
                default:    
                    guide = new AxisGuideLine(this);
                    break;
            }

            guide.load(g);
            this.guides.push(guide);
        }
    }

    _connect(series: IPlottingItem): void {
        if (series && !this._series.includes(series)) {
            this._series.push(series);
        }
    }

    protected _doCalcluateRange(values: number[]): { min: number, max: number } {
        let min = Math.min(...values) || 0;
        let max = Math.max(...values) || 0;

        return { min, max };
    }
}

export class AxisCollection {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly chart: IChart;
    readonly isX: boolean;
    private _items: Axis[] = [];
    private _map = new Map<string, Axis>();

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, isX: boolean) {
        this.chart = chart;
        this.isX = isX;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get count(): number {
        return this._items.length;
    }

    get first(): Axis {
        return this._items[0];
    }

    get items(): Axis[] {
        return this._items.slice(0);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(src: any): void {
        const chart = this.chart;
        const items = this._items;

        if (isArray(src)) {
            src.forEach((s, i) => items.push(this.$_loadAxis(chart, s, i)));
        } else if (isObject(src)) {
            items.push(this.$_loadAxis(chart, src, 0));
        }
    }

    contains(axis: Axis): boolean {
        return this._items.indexOf(axis) >= 0;
    }

    get(name: string): Axis {
        return this._map.get(name);
    }

    disconnect(): void {
        this._items.forEach(axis => axis.disconnect());
    }

    prepareRender(): void {
        this._items.forEach(axis => axis.prepareRender());
    }

    buildTicks(length: number): void {
        this._items.forEach(axis => axis.buildTicks(length));
    }

    connect(series: IPlottingItem): Axis {
        const items = this._items;
        const a = this.isX ? series.xAxis : series.yAxis;
        let axis: Axis;

        if (isNumber(a) && a >= 0 && items.length) {
            axis = items[a];
        } else if (isString(a)) {
            axis = items.find(item => item.name === a);
        }
        if (!axis) {
            axis = items[0];
        }

        if (axis) {
            axis._connect(series);
        }
        return axis;
    }

    forEach(callback: (p: Axis, i?: number) => any): void {
        for (let i = 0, n = this._items.length; i < n; i++) {
            if (callback(this._items[i], i) === true) break;
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadAxis(chart: IChart, src: any, index: number): Axis {
        let cls = chart._getAxisType(src.type);

        if (!cls) {
            let t: string;

            if (isArray(src.categories)) {
                t = 'category';
            } else if (this.isX) {
                for (const ser of chart._getSeries().items()) {
                    if (ser.canCategorized()) {
                        if (src.name && ser.xAxis === src.name) {
                            t = 'category';
                            break;
                        } else if (isNumber(ser.xAxis) && ser.xAxis === index) {
                            t = 'category';
                            break;
                        }
                    }   
                }
                if (!t && chart.first.canCategorized()) {
                    t = 'category';
                }
            } else {
                t = chart._getSeries().first.defaultYAxisType();
            }

            if (t) {
                cls = chart._getAxisType(t);
            }
        }
        if (!cls) {
            cls = chart._getAxisType('linear');
        }

        const axis = new cls(chart, src.name);

        axis._isX = this.isX;
        axis.load(src);
        return axis;
    }
}