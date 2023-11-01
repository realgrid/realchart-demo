////////////////////////////////////////////////////////////////////////////////
// Axis.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNumber, isObject, isString, pickNum } from "../common/Common";
import { Align, SVGStyleOrClass, VerticalAlign, fixnum, isNull } from "../common/Types";
import { IChart } from "./Chart";
import { ChartItem, FormattableText } from "./ChartItem";
import { Crosshair } from "./Crosshair";
import { IClusterable, IPlottingItem } from "./Series";

/**
 * @internal
 */
export interface IAxis {
    type(): string;
    chart: IChart;
    side: boolean;
    
    _vlen: number;
    _isX: boolean;
    _isHorz: boolean;
    _isOpposite: boolean;
    _isBetween: boolean;

    reversed: boolean;
    _zoom: IAxisZoom;

    isContinuous(): boolean;
    getBaseValue(): number;
    axisMax(): number;
    axisMin(): number;
    length(): number;

    zoom(start: number, end: number): boolean;

    /**
     * data point의 값을 축 상의 값으로 리턴한다.
     */
    getValue(value: any): number;
    parseValue(value: any): number;
    contains(value: number): boolean;
    incStep(value: number, step: any): number;
    /**
     * 값(축 상 위치)에 해당하는 픽셀 위치.
     */
    getPosition(length: number, value: number, point?: boolean): number;
    getValueAt(length: number, pos: number): number;
    /**
     * 값(축 상 위치)에 해당하는 축 단위 픽셀 크기. 
     * <br>
     * 값에 따라 크기가 다를 수도 있다.
     */
    getUnitLength(length: number, value: number): number;
}

/**
 * @internal
 */
export abstract class AxisItem extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly axis: Axis;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: Axis, visible = true) {
        super(axis?.chart, visible);

        this.axis = axis;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

/**
 * 축 선(line) 설정 모델.
 * 
 * @config
 */
export class AxisLine extends AxisItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: Axis) {
        super(axis, true);//false);

        this.visible = axis._isX; 
    }
}

export enum AxisTitleAlign {
    START = 'start',
    MIDDLE = 'middle',
    END = 'end'
}

/**
 * 축 타이틀 설정 모델.
 * 
 * @config
 */
export class AxisTitle extends AxisItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 타이틀 텍스트.\
     * 지정하지 않으면 타이틀 영역 자체가 없어진다.
     * 
     * @config
     */
    text: string;
    /**
     * 축 내에서 타이틀의 위치.\
     * {@link offset}으로 경계 지점과의 간격을 지정할 수 있다.
     * 
     * @config
     */
    align = AxisTitleAlign.MIDDLE;
    /**
     * {@link align} 기준으로 배치할 때 경계 지점과의 간격.\
     * plus 값을 지정하면 차트 안쪽으로 들어온다.
     * align이 'middle'일 때는 음수일 때 축 시작값 쪽으로 밀린다.
     * 
     * @config
     */
    offset = 0;
    /**
     * 타이틀과 틱 label들, 혹은 축 선 사이의 간격을 픽셀 단위로 지정한다.
     * 
     * @default 5 pixels
     * @config
     */
    gap = 5;
    /**
     * 타이틀 배경 스타일.
     * 
     * @config
     */
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
        return super._doLoadSimple(source);
    }
}

/**
 * visible 기본값이 undefined이다.
 * visible이 undefined나 null로 지정되면, 축 위치에 따라 visible 여부가 결정된다.
 * 
 * @config
 */
export class AxisGrid extends AxisItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * polar 차트일 때 그리드 선을 원형으로 그릴 지 여부.
     * 
     * @config
     */
    circular = true;
    /**
     * 시작 값에 표시되는 그리드 선을 표시할 지 여부.
     * 
     * @config
     */
    startVisible = false;
    /**
     * 끝 값에 표시되는 그리드 선을 표시할 지 여부.
     * 
     * @config
     */
    endVisible: boolean;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: Axis) {
        super(axis, null);

        this.endVisible = !axis._isX;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isVisible(): boolean {
        return this.visible == null ? !this.axis._isX : this.visible;
    }

    getPoints(length: number): number[] {
        const axis = this.axis;
        return axis._ticks.map(tick => axis.getPosition(length, tick.value, false));
    }
            
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

/**
 *
 */
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
     * 
     * @config
     */
    align = Align.LEFT;

    /**
     * 수직 정렬.
     * 
     * @config
     */
    verticalAlign = VerticalAlign.TOP;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

export enum AxisGuideType {
    /**
     * 축 위의 특정한 값에 선분을 표시한다.
     * 
     * @config
     */
    LINE = 'line',
    /**
     * 축 위 특정한 두 값 사이의 영역을 구분 표시한다.
     * 
     * @config
     */
    RANGE = 'range',
    /**
     * Plot 영역에 (x, y)로 지정하는 값 좌표의 배열로 설정되는 다각형을 표시한다.
     * 
     * @config
     */
    AREA = 'area'
}

export abstract class AxisGuide extends AxisItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: Axis) {
        super(axis);

        this.label = new AxisGuideLabel(axis.chart);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * label 모델.
     * 
     * @config
     */
    readonly label: AxisGuideLabel;
    /**
     * true면 시리즈들보다 위에 표시된다.
     * 
     * @config
     */
    front = true;
    /**
     * 모든 guide들 중에서 값이 클수록 나중에 그려진다.
     * 
     * @config
     */
    zindex = 0;
}

export class AxisLineGuide extends AxisGuide {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 가이드 선이 표시될 축 상의 위치에 해당하는 값.
     * 
     * @config
     */
    value: number; // TODO: RtPercentSize
}

/**
 * range -> zone ?
 */
export class AxisRangeGuide extends AxisGuide {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 가이드 영역의 시작 값.
     * 
     * @config
     */
    start: number;  // TODO: RtPercentSize
    /**
     * 가이드 영역의 끝 값.
     * 
     * @config
     */
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
     * 선의 길이.
     * 
     * @link
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
     * 
     * @config
     */
    length = 7;
    /**
     * tick 라인과 다른 요소(label이나 title) 사이의 간격.
     * 
     * @config
     */
    margin = 3;
    /**
     * true면 소수점값애 해당하는 tick은 표시되지 않도록 한다.
     */
    integral = false;
    /**
     * true면 다른 설정과 상관없이 첫번째 tick은 항상 표시된다.
     */
    showFirst = false;
    /**
     * true면 다른 설정과 상관없이 마지막 tick은 항상 표시된다.
     */
    showLast = false;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: Axis) {
        super(axis, false);
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
    /**
     * 아무것도 하지 않는다.
     * 
     * @config
     */
    NONE = 'none',
    /**
     * -45도 회전시킨다.
     * 
     * @config
     */
    ROTATE = 'rotate',
    /**
     * label들이 겹치지 않도록 건너 뛰면서 배치한다.
     * <br>
     * {@link startStep}으로 지정된 step부터 배치된다.
     * 
     * @config
     */
    STEP = 'step',
    /**
     * label들이 겹치지 않도록 여러 줄로 나누어 배치한다.
     * <br>
     * 
     * @config
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
    // fields
    //-------------------------------------------------------------------------
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
     * label 표시 간격.\
     * 1이면 모든 tick 표시. 2이면 하나씩 건너 띄어서 표시.
     * 2 이상일 때 {@link startStep}으로 지정된 step부터 배치된다.
     */
    step = 0;
    /**
     * step이 2 이상이 될 때, 표시가 시작되는 label 위치.
     */
    startStep = 0;
    /**
     * 수평 축일 때 tick label 배치 행 수.\
     * 1은 한 줄, 2면 두 줄 등으로 여러 줄로 나눠서 표시한다.
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
    abstract getTick(index: number, value: any): string;

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
     * 상대 축에 따라 위치를 조정한다.
     * x축이 reversed이면 y축이 반대 쪽에 표시되고,
     * y축이 reversed이면 x축이 반대 쪽에 표시된다.
     */
    AUTO = 'auto',
    /**
     * X축은 아래쪽에 수평으로, Y축은 왼쪽에 수직으로 표시된다.
     * <br>
     * {@link Chart.inverted}이면 Y축이 아래쪽에 수평으로, X축은 왼쪽에 수직으로 표시된다.
     * 
     * @config
     */
    NORMAL = 'normal',
    /**
     * X축은 위쪽에 수평으로, Y축은 오른쪽에 수직으로 표시된다.
     * <br>
     * {@link Chart.inverted}이면 Y축이 위쪽에 수평으로, X축은 오른쪽에 수직으로 표시된다.
     * 
     * @config
     */
    OPPOSITE = 'opposite',
    /**
     * 상대 축의 baseValue 지점에 표시된다.
     * <br>
     * [주의] 
     * 1. 축에 연결된 시리즈들이 BarSeries 계열일 때만 가능하다.
     * 2. 차트의 X축 하나에만 적용할 수 있다. 두번째로 지정된 축의 속성은 {@link NORMAL}로 적용된다.
     * 3. 상대 축이 **linear** 가 아니거나 {@link LinearAxis.baseValue}가 min 보다 작거나 max보다 크면 이 값은 무시되고,
     *    {@link NORMAL}로 적용된다.
     * 
     * @config
     */
    BASE = 'base',
    /**
     * Y축이고, 축이 연결되는 body가 분할 상태일 때, 중간 분할 위치에 표시한다.
     */
    BETWEEN = 'between'
}

/**
 * 축 스크롤바 모델.\
 * 축 스크롤 상태를 표시하고, 사용자가 스크롤 범위나 위치를 변경할 수 있다.
 */
export class AxisScrollBar extends AxisItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _thickness = 10;
    private _minThumbSize = 32;
    private _gap = 3;
    private _gapFar = 3;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: Axis) {
        super(axis, false);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 스크롤바 두께.
     */
    get thickness(): number {
        return this._thickness;
    }
    set thickness(value: number) {
        this._thickness = +value || this._thickness;
    }
    /**
     * 최소 thumb 길이.
     */
    get minThumbSize(): number {
        return this._minThumbSize;
    }
    set minThumbSize(value: number) {
        this._minThumbSize = +value || this._minThumbSize;
    }
    /**
     * 스크롤바와 차트 본체 방향 사이의 간격.
     */
    get gap(): number {
        return this._gap;
    }
    set gap(value: number) {
        this._gap = +value || this._gap;
    }
    /**
     * 스크롤바와 차트 본체 반대 방향 사이의 간격.
     */
    get gapFar(): number {
        return this._gapFar;
    }
    set gapFar(value: number) {
        this._gapFar = +value || this._gapFar;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

export interface IAxisZoom {
    start: number;
    end: number;
}

export class AxisZoom {

    min: number;
    max: number;
    start: number;
    end: number;

    constructor(public axis: Axis, start: number, end: number) {
        this.min = axis.axisMin();
        this.max = axis.axisMax();
        this.resize(start, end);
    }

    get length(): number {
        return this.end - this.start;
    }
    
    resize(start: number, end: number): boolean {
        start = isNaN(start) ? this.start : Math.max(this.min, Math.min(this.max, start));
        end = isNaN(end) ? this.end : Math.max(start, Math.min(this.max, end));

        if (start !== this.start || end !== this.end) {
            this.start = start;
            this.end = end;
            return true;
        }
    }
}

/**
 * 차트에서 축을 명식적으로 지정하지 않으면, 첫번째 시리즈에 합당한 축이 기본 생성된다.
 */
export abstract class Axis extends ChartItem implements IAxis {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _isX: boolean;
    _isHorz: boolean;
    _isOpposite: boolean;
    _isBetween: boolean;
    protected _series: IPlottingItem[] = [];
    _range: { min: number, max: number };
    _ticks: IAxisTick[];
    _markPoints: number[];
    _vlen: number;
    _minPad = 0;
    _maxPad = 0;
    _values: number[] = [];
    protected _min: number;
    protected _max: number;
    _zoom: AxisZoom;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, isX: boolean, name?: string) {
        super(chart);

        this._isX = isX;
        this.name = name;
        this.title = new AxisTitle(this);
        this.line = new AxisLine(this);
        this.tick = this._createTickModel();
        this.label = this._createLabelModel();
        this.grid = this._createGrid();
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    abstract type(): string;

    /**
     * @config
     */
    readonly name: string;
    /**
     * @config
     */
    readonly title: AxisTitle;
    /**
     * @config
     */
    readonly line: AxisLine;
    /**
     * @config
     */
    readonly tick: AxisTick;
    /**
     * @config
     */
    readonly label: AxisLabel;
    /**
     * visible 기본값이 undefined이다.
     * visible이 undefined나 null로 지정되면, 축 위치에 따라 visible 여부가 결정된다.
     * @config
     */
    readonly grid: AxisGrid;
    /**
     * @config
     */
    readonly guides: AxisGuide[] = [];
    /**
     * @config
     */
    readonly crosshair = new Crosshair(this);
    /**
     * @config
     */
    readonly scrollBar = new AxisScrollBar(this);

    /**
     * true이면, X축이고 축이 연결된 body가 분할된 경우 분할된 쪽에 연결된다.
     */
    side = false;
    /**
     * 표시 위치.
     * 기본적으로 상대 축의 원점 쪽에 표시된다.
     * 
     * @config
     */
    position = AxisPosition.NORMAL;
    /**
     * true면 반대 방향으로 point 위치들이 지정된다.
     * 
     * @config
     */
    reversed = false;
    /**
     * 명시적으로 지정하는 최소값.
     * 축에 연결된 data point들의 값으로 계산된 최소값 대신 이 값이 축의 최소값이 된다.
     * {@link minPadding}도 무시된다.
     * 
     * @config
     */
    minValue: number;
    /**
     * 명시적으로 지정하는 최대값.
     * 축에 연결된 data point들의 값으로 계산된 최대값 대신 이 값이 축의 최소값이 된다.
     * {@link maxPadding}도 무시된다.
     * 
     * @config
     */
    maxValue: number;
    /**
     * plot 영역이나 먼저 표시되는 축 사이의 여백 크기.
     * 
     * @config
     */
    marginNear = 0;
    /**
     * 차트 경계나 뒤쪽 축 사이의 여백 크기.
     * 
     * @config
     */
    marginFar = 0;

    isEmpty(): boolean {
        return this._series.length < 1;
    }

    getBaseValue(): number {
        return NaN;
    }

    length(): number {
        return this._max - this._min;
    }
    
    axisMin(): number {
        return this._min;
    }

    axisMax(): number {
        return this._max;
    }

    abstract isContinuous(): boolean;
    abstract getValueAt(length: number, pos: number): number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    protected abstract _createTickModel(): AxisTick;
    protected abstract _createLabelModel(): AxisLabel;
    protected abstract _doPrepareRender(): void;
    protected abstract _doBuildTicks(min: number, max: number, length: number): IAxisTick[];

    isBased(): boolean {
        return false;
    }

    disconnect(): void {
        this._series = [];
        this._values = [];
    }

    collectValues(): void {
        this._series.forEach(item => {
            item.collectValues(this, this._values);
        })
    }

    collectReferentsValues(): void {
        this._series.forEach(item => {
            item.pointValuesPrepared(this);
        })
    }

    prepareRender(): void {
        this._isHorz = this.chart.isInverted() ? !this._isX : this._isX;
        this._isBetween = this.position === AxisPosition.BETWEEN && this._isX;
        this._isOpposite = this.position === AxisPosition.OPPOSITE;

        this._doPrepareRender();

        // range
        const series = this._series;
        const vals: number[] = this._values;

        if (this._zoom) {
            this._range = { min: this._zoom.start, max: this._zoom.end };
        } else {
            this._range = this._doCalcluateRange(vals);
        }

        // clustering (x축에서만 가능)
        if (this._isX) {
            (this.chart._splitted ? [false, true] : [false]).forEach(side => {
                let sum = 0;
                let p = 0;
        
                series.forEach(item => {
                    if (item.isSide() == side && item.clusterable()) {
                        sum += pickNum((item as any as IClusterable).groupWidth, 1);
                    }
                });
                series.forEach(item => {
                    if (item.isSide() == side && item.clusterable()) {
                        const w = pickNum((item as any as IClusterable).groupWidth, 1) / sum;
        
                        (item as any as IClusterable).setCluster(w, p);
                        p += w;
                    }
                });
            });
        }
    }

    buildTicks(length: number): void {
        this._ticks = this._doBuildTicks(this._range.min, this._range.max, this._vlen = length);
    }

    calcPoints(length: number, phase: number): void {
        this._ticks.forEach(t => t.pos = this.getPosition(length, t.value));
    }

    /**
     * @internal
     * 
     * value에 해당하는 축상의 위치.
     * 
     * @param length axis view length
     * @param value 값
     * @param point 포인트가 너비를 갖는 경우 포인트 중심 위치를 기준으로 한다. (category axis)
     */
    abstract getPosition(length: number, value: number, point?: boolean): number;
    abstract getUnitLength(length: number, value: number): number;

    getLabelLength(length: number, value: number): number {
        return this.getUnitLength(length, value);
    }

    getValue(value: any): number {
        return value == null ? NaN : parseFloat(value);
    }

    incStep(value: number, step: any): number {
        return value += step;
    }

    parseValue(value: any): number {
        return parseFloat(value);
    }

    contains(value: number): boolean {
        return value >= this._range.min && value <= this._range.max;
    }

    resetZoom(): void {
        if (this._zoom) {
            this._zoom = null;
            this._changed();
        }
    }
    
    zoom(start: number, end: number): boolean {
        if (!this._zoom) {
            if (isNaN(start)) start = this._min;
            if (isNaN(end)) end = this._max;
            this._zoom = new AxisZoom(this, start, end);
            this._changed();
            return true;
        } else if (this._zoom.resize(start, end)) {
            this._changed();
            return true;
        }
    }

    isZoomed(): boolean {
        return !!this._zoom
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
                    guide = new AxisRangeGuide(this);
                    break;

                case 'line':
                default:    
                    guide = new AxisLineGuide(this);
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
        let min = values.length > 0 ? fixnum(Math.min(...values) || 0) : NaN;
        let max = values.length > 0 ?  fixnum(Math.max(...values) || 0) : NaN;

        return { min, max };
    }
}

export class AxisCollection {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly chart: IChart;
    readonly isX: boolean;
    protected _items: Axis[] = [];
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

    get(name: string | number): Axis {
        if (isString(name)) {
            return this._map.get(name);
        } else {
            return this._items[name];
        }
    }

    disconnect(): void {
        this._items.forEach(axis => axis.disconnect());
    }

    collectValues(): void {
        this._items.forEach(axis => axis.collectValues());
    }

    collectReferentsValues(): void {
        this._items.forEach(axis => axis.collectReferentsValues());
    }

    prepareRender(): void {
        this._items.forEach(axis => axis.prepareRender());
    }

    // Chart.layoutAxes 에서만 호출
    $_buildTicks(length: number): void {
        // 다른 축을 참조하는 axis를 나중에 계산한다.
        this._items.sort((a1, a2) => a1.isBased() ? 1 : a2.isBased() ? -1 : 0)
                   .forEach(axis => axis.buildTicks(this._getLength(axis, length)));
    }
    protected _getLength(axis: Axis, length: number): number {
        return length;
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

    isZoomed(): boolean {
        for (const axis of this._items) {
            if (axis.isZoomed()) return true;
        }
    }

    resetZoom(): void {
        this._items.forEach(axis => axis.resetZoom());
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
                if (!t && chart.first?.canCategorized()) {
                    t = 'category';
                }
            } else {
                t = chart._getSeries().first?.defaultYAxisType();
            }

            if (t) {
                cls = chart._getAxisType(t);
            }
        }
        if (!cls) {
            cls = chart._getAxisType('linear');
        }

        const axis = new cls(chart, this.isX, src.name);

        axis.load(src);
        return axis;
    }
}

export class YAxisCollection extends AxisCollection {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _splits: number[];

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    split(ratios: number[]): void {
        this._splits = ratios;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getLength(axis: Axis, length: number): number {
        if (this._splits) {
            return length * this._splits[axis.side ? 1 : 0];
        } else {
            return length;
        }
    }
}