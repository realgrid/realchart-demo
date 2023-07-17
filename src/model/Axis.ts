////////////////////////////////////////////////////////////////////////////////
// Axis.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNumber, isObject, isString } from "../common/Common";
import { Align, VerticalAlign } from "../common/Types";
import { IChart } from "./Chart";
import { ChartItem, FormattableText } from "./ChartItem";
import { ISeries } from "./Series";
import { ISeriesGroup } from "./SeriesGroup";

export interface IAxis {

    valueUnit: number;
    _length: number;
    baseValue: number;

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

export class AxisItem extends ChartItem {

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
    text = 'Axis Title';
    gap = 8;

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
    verticalAlign = VerticalAlign.TOP;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

export enum AxisGuideType {
    LINE = 'line',
    RANGE = 'range'
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
    value: number;
}

export class AxisGuideRange extends AxisGuide {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    startValue: number;
    endValue: number;
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

export class AxisBreak extends AxisItem {
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
     */
    INSIDE = 'insider'
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
    readonly grid = new AxisGrid(this);
    readonly guides: AxisGuide[] = [];

    _isX: boolean;
    _isHorz: boolean;
    protected _series: ISeries[] = [];
    protected _groups: ISeriesGroup[] = [];
    _range: { min: number, max: number };
    _ticks: IAxisTick[];
    _length: number;

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
    /**
     * true면 기본 위치(x축: bottom, y축: left)의 반대편에 표시된다.
     */
    opposite = false;
    /**
     * true면 반대 방향으로 point 위치들이 지정된다.
     */
    reversed = false;
    /**
     * 축 최소값 쪽에서 축 안쪽으로 설정되는 여백 크기.
     * <br>
     * 이 값을 설정하지 않으면 {@link padding}에 지정한 값으로 설정된다.
     */
    minPadding: number;
    /**
     * 축 최대값 쪽에서 축 안쪽으로 설정되는 여백 크기.
     * <br>
     * 이 값을 설정하지 않으면 {@link padding}에 지정한 값으로 설정된다.
     */
    maxPadding: number;
    /**
     * 축 양쪽 끝에서 축 안쪽으로 설정되는 여백 크기.
     * <br>
     * {@link minPadding}, {@link maxPadding}으로 양 끝을 별도 설정할 수 있다.
     */
    padding = 0;
    /**
     * Plot 영역이나 앞쪽 축 사이의 여백 크기.
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
    valueUnit = 1;
    baseValue: number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    protected abstract _doPrepareRender(): void;
    protected abstract _doBuildTicks(min: number, max: number, length: number): IAxisTick[];

    prepareRender(): void {
        this._isHorz = this.chart.isInverted() ? !this._isX : this._isX;

        this._doPrepareRender();

        let vals: number[] = [];

        this._groups.forEach(g => {
            vals = vals.concat(g.collectValues(this));
        })
        this._range = this._doCalcluateRange(vals);
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

        this.$_loadGuids();
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadGuids(): void {
        // 소스 정보가 this.guides에 로드된 상태이다.
        const guides = this.guides;

        if (guides.length > 0) {
            for (let i = 0; i < guides.length; i++) {
                const g: any = guides[i]
                let guide: AxisGuide;

                if (g.type === 'range') {
                    guide = new AxisGuideRange(this);
                } else {
                    guide = new AxisGuideLine(this);
                }
                guide.load(g);
                guides[i] = guide;
            }
        }
    }

    _connect(series: ISeries): void {
        if (series && !this._series.includes(series)) {
            this._series.push(series);
            if (!this._groups.includes(series._group)) {
                this._groups.push(series._group);
            }
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

    prepareRender(): void {
        this._items.forEach(axis => axis.prepareRender());
    }

    buildTicks(length: number): void {
        this._items.forEach(axis => axis.buildTicks(length));
    }

    connect(series: ISeries): Axis {
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
                    if (ser.isCategorized()) {
                        if (src.name && ser.xAxis === src.name) {
                            t = 'category';
                            break;
                        } else if (isNumber(ser.xAxis) && ser.xAxis === index) {
                            t = 'category';
                            break;
                        }
                    }   
                }
                if (!t && chart.series.isCategorized()) {
                    t = 'category';
                }
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