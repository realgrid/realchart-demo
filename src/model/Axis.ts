////////////////////////////////////////////////////////////////////////////////
// Axis.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNumber, isObject, isString, pickNum } from "../common/Common";
import { Align, IPercentSize, SVGStyleOrClass, SizeValue, VerticalAlign, isNull, parsePercentSize } from "../common/Types";
import { IChart } from "./Chart";
import { ChartItem, FormattableText } from "./ChartItem";
import { Crosshair } from "./Crosshair";
import { IClusterable, IPlottingItem } from "./Series";

export interface IAxis {

    type(): string;
    chart: IChart;
    
    _length: number;
    _isX: boolean;
    _isHorz: boolean;
    _isOpposite: boolean;

    reversed: boolean;

    getBaseValue(): number;
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
    getPosition(length: number, value: number, point?: boolean): number;
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
    /**
     * 타이틀 텍스트.
     */
    text: string;
    /**
     * 타이틀과 label 혹은 축 선 사이의 간격.
     * <br>
     * 
     * @default 5 pixels
     */
    gap = 5;
    backgroundStyle: SVGStyleOrClass;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isVisible(): boolean {
        return this.visible && !isNull(this.text);
    }

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

    getPoints(length: number): number[] {
        const axis = this.axis;
        return this.axis._ticks.map(tick => axis.getPosition(length, tick.value, false));
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
 * 축에 표시되는 tick 위치와 표시 마크에 관한 설정 모델.
 */
export abstract class AxisTick extends AxisItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    /**
     * axis tick line length.
     */
    length = 7;
    margin = 3;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: Axis) {
        super(axis);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}

export enum AxisLabelArrange {
    NONE = 'none',
    /**
     * -45도 회전시킨다.
     */
    ROTATE = 'rotate',
    /**
     * label들이 겹치지 않도록 건너 뛰면서 배치한다.
     * <br>
     * {@link startStep}으로 지정된 step부터 배치된다.
     */
    STEP = 'step',
    /**
     * label들이 겹치지 않도록 여러 줄로 나누어 배치한다.
     * <br>
     */
    ROWS = 'rows'
}

/**
 * [겹치는 경우가 발생할 때]
 * 1. step이 0보다 큰 값으로 설정되면 반영한다.
 * 2. staggerRows가 0보다 큰 값으로 설정되면 반영한다.
 * 3. rotation이 0이 아닌 명시적 값으로 설정되면 반영한다.
 * 4. 1~3 모두 설정되지 않은 경우 autoArrange 설정에 따라 자동 배치한다.
 * 5. 배치 후 공간을 초과하는 label은 wrap 속성에 따라 줄나누기를 하거나, 
 *    ellipsis('...')로 처리해서 표시한다.
 */
export abstract class AxisLabel extends FormattableText {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public axis: Axis) {
        super(axis && axis.chart, true);

        // 기본은 ','이 포함된다. axis label에 ','를 포함시키지 않도록 한다.
        this.numberFormat = null;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * label 표시 간격.
     * <br>
     * 0보다 큰 값으로 지정하지 않으면
     * {@link autoStep}이 true일 때, label들이 겹치지 않도록 자동 계산된다.
     * <br>
     * 1이면 모든 tick 표시. 2이면 하나씩 건너 띄어서 표시.
     * 2 이상일 때 {@link startStep}으로 지정된 step부터 배치된다.
     */
    step = 0;
    /**
     * step이 2 이상일 때, 표시가 시작되는 label 위치.
     */
    startStep = 0;
    /**
     * 수평 축일 때 tick label 배치 행 수.
     * <br>
     * 0보다 큰 값으로 지정하지 않으면
     * {@link autoRows}가 true일 때, label들이 겹치지 않도록 자동 계산된다.
     * <br>
     */
    rows = 0;
    /**
     * 수평 축일 때, tick label 표시 회전 각도.
     * -90 ~ 90 사이의 각도로 지정할 수 있다.
     */
    rotation: number;
    /**
     * label들이 본래 차지하는 공간을 초과할 때,
     * {@link step}이나 {@link rows}가 1 이상으로 설정되지 않고,
     * {@link rotation}이 0이 아닌 명시적 값으로도 설정되지 않은 경우,
     * label들을 재배치하는 방식을 지정한다.
     * <br>
     */
    autoArrange = AxisLabelArrange.ROTATE;
    /**
     * label 배치 후 텍스트가 차지하는 공간을 넘치는 경우 줄 나누기를 한다.
     * <br>
     * false이면 줄 나누기 대신 ellipsis('...')로 표시한다.
     */
    wrap = false;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    abstract getTick(v: any): string;

    getRotation(): number {
        return this.rotation || 0;
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
     * Y축의 baseValue 지점에 표시된다.
     * <br>
     * [주의] 
     * 1. 축에 연결된 시리즈들이 BarSeries 계열일 때만 가능하다.
     * 2. 차트의 X축 하나에만 적용할 수 있다. 두번째로 지정된 축의 속성은 {@link NORMAL}로 적용된다.
     * 3. 상대 축이 **linear** 가 아니거나 {@link LinearAxis.baseValue}가 min 보다 작거나 max보다 크면 이 값은 무시되고,
     *    {@link NORMAL}로 적용된다.
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
    readonly label: AxisLabel;
    readonly grid = this._createGrid();
    readonly guides: AxisGuide[] = [];
    readonly crosshair = new Crosshair(this);

    _isX: boolean;
    _isHorz: boolean;
    _isOpposite: boolean;
    protected _series: IPlottingItem[] = [];
    _range: { min: number, max: number };
    _ticks: IAxisTick[];
    _markPoints: number[];
    _length: number;
    _minPad = 0;
    _maxPad = 0;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart);

        this.name = name;
        this.tick = this._createTickModel();
        this.label = this._createLabelModel();
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
     * Plot 영역이나 앞쪽 축 사이의 여백 크기.
     * <br>
     */
    marginNear = 0;
    /**
     * 차트 경계나 뒤쪽 축 사이의 여백 크기.
     */
    marginFar = 0;

    isEmpty(): boolean {
        return this._series.length < 1;
    }

    getBaseValue(): number {
        return NaN;
    }
    
    abstract axisMin(): number;
    abstract axisMax(): number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    protected abstract _createTickModel(): AxisTick;
    protected abstract _createLabelModel(): AxisLabel;
    protected abstract _doPrepareRender(): void;
    protected abstract _doBuildTicks(min: number, max: number, length: number): IAxisTick[] | { ticks: IAxisTick[], markPoints: number[] };

    disconnect(): void {
        this._series = [];
    }

    prepareRender(): void {
        this._isHorz = this.chart.isInverted() ? !this._isX : this._isX;
        this._isOpposite = this.position === AxisPosition.OPPOSITE;

        this._doPrepareRender();

        // range
        const series = this._series;
        let vals: number[] = [];

        series.forEach(item => {
            vals = vals.concat(item.collectValues(this));
        })
        this._range = this._doCalcluateRange(vals);

        // clustering
        let sum = 0;
        let p = 0;

        series.forEach(item => {
            if (item.clusterable()) {
                sum += pickNum((item as any as IClusterable).groupWidth, 1);
            }
        });
        series.forEach(item => {
            if (item.clusterable()) {
                const w = pickNum((item as any as IClusterable).groupWidth, 1) / sum;

                (item as any as IClusterable).setCluster(w, p);
                p += w;
            }
        });
        // console.log(this._series.map(s => (s as any)._clusterPos));
    }

    buildTicks(length: number): void {
        const ts = this._doBuildTicks(this._range.min, this._range.max, this._length = length);

        if (isArray(ts)) {
            this._ticks = ts;
            this._markPoints = ts.map(t => t.pos);
        } else {
            this._ticks = ts.ticks;
            this._markPoints = ts.markPoints;
        }
    }

    calcPoints(length: number, phase: number): void {
        this._ticks.forEach(t => t.pos = this.getPosition(length, t.value));
    }

    /**
     * value에 해당하는 축상의 위치.
     */
    abstract getPosition(length: number, value: number, point?: boolean): number;
    abstract getUnitLength(length: number, value: number): number;

    getLabelLength(length: number, value: number): number {
        return this.getUnitLength(length, value);
    }

    getValue(value: any): number {
        return +value;
    }

    contains(value: number): boolean {
        return value >= this._range.min && value <= this._range.max;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
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