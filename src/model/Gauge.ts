////////////////////////////////////////////////////////////////////////////////
// Gauge.ts
// 2023. 09. 25. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, isString, pickNum, pickProp } from "../common/Common";
import { IPoint } from "../common/Point";
import { ISize } from "../common/Size";
import { DEG_RAD, IMinMax, IPercentSize, IValueRange, ORG_ANGLE, RtPercentSize, SVGStyleOrClass, buildValueRanges, calcPercent, fixnum, isNull, parsePercentSize } from "../common/Types";
import { IChart } from "./Chart";
import { ChartItem, FormattableText } from "./ChartItem";
import { Widget } from "./Widget";

/**
 * 게이지 모델.
 */
export abstract class GaugeBase extends Widget {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _size: RtPercentSize;
    private _width: RtPercentSize;
    private _height: RtPercentSize;
    private _left: RtPercentSize;
    private _right: RtPercentSize;
    private _top: RtPercentSize;
    private _bottom: RtPercentSize;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    index = -1;
    private _sizeDim: IPercentSize;
    private _widthDim: IPercentSize;
    private _heightDim: IPercentSize;
    private _leftDim: IPercentSize;
    private _rightDim: IPercentSize;
    private _topDim: IPercentSize;
    private _bottomDim: IPercentSize;
    
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart);

        this.size = '100%';
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    abstract _type(): string;
    /**
     * 게이지 이름.
     * 동적으로 게이지를 다루기 위해서는 반드시 지정해야 한다. 
     * 
     * @config
     */
    name: string;
    /**
     * plot 영역의 왼쪽 모서리와 widget 사이의 간격.
     * 
     * @config
     */
    get left(): RtPercentSize {
        return this._left;
    }
    set left(value: RtPercentSize) {
        if (value !== this._left) {
            this._leftDim = parsePercentSize(this._left = value, true);
        }
    }
    /**
     * plot 영역의 오른쪽 모서리와 widget 사이의 간격.
     * 
     * @config
     */
    get right(): RtPercentSize {
        return this._right;
    }
    set right(value: RtPercentSize) {
        if (value !== this._right) {
            this._rightDim = parsePercentSize(this._right = value, true);
        }
    }
    /**
     * plot 영역의 위쪽 모서리와 widget 사이의 간격.
     * 
     * @config
     */
    get top(): RtPercentSize {
        return this._top;
    }
    set top(value: RtPercentSize) {
        if (value !== this._top) {
            this._topDim = parsePercentSize(this._top = value, true);
        }
    }
    /**
     * plot 영역의 아래쪽 모서리와 widget 사이의 간격.
     * 
     * @config
     */
    get bottom(): RtPercentSize {
        return this._bottom;
    }
    set bottom(value: RtPercentSize) {
        if (value !== this._bottom) {
            this._bottomDim = parsePercentSize(this._bottom = value, true);
        }
    }
    /**
     * 게이지 너비.
     * 픽셀 단위의 고정 값이나, plot 영역에 대한 상태 크기롤 지정할 수 있다.
     * 
     * @config
     */
    get width(): RtPercentSize {
        return this._width;
    }
    set width(value: RtPercentSize) {
        if (value !== this._width) {
            this._widthDim = parsePercentSize(this._width = value, true);
        }
    }
    /**
     * 게이지 높이.
     * 픽셀 단위의 고정 값이나, plot 영역에 대한 상태 크기롤 지정할 수 있다.
     * 
     * @config
     */
    get height(): RtPercentSize {
        return this._height;
    }
    set height(value: RtPercentSize) {
        if (value !== this._height) {
            this._heightDim = parsePercentSize(this._height = value, true);
        }
    }
    /**
     * {@link width}와 {@link height}를 동시에 설정한다.
     * 
     * @config
     */
    get size(): RtPercentSize {
        return this._size;
    }
    set size(value: RtPercentSize) {
        if (value !== this._size) {
            this._sizeDim = parsePercentSize(this._size = value, true);
        }
    }

    /**
     * 게이지나 게이지그룹의 배경 pane에 대한 스타일.
     */
    paneStyle: SVGStyleOrClass;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getSize(width: number, height: number): ISize {
        return {
            width: calcPercent(this._widthDim || this._sizeDim, width, width),
            height: calcPercent(this._heightDim || this._sizeDim, height, height)
        };
    }

    getLeft(doamin: number): number {
        return calcPercent(this._leftDim, doamin);
    }

    getRight(doamin: number): number {
        return calcPercent(this._rightDim, doamin);
    }

    getTop(doamin: number): number {
        return calcPercent(this._topDim, doamin);
    }

    getBottom(doamin: number): number {
        return calcPercent(this._bottomDim, doamin);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

/**
 * 게이지 모델.
 */
export abstract class Gauge extends GaugeBase {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static _loadGauge(chart: IChart, src: any, defType?: string): Gauge {
        let cls = chart._getGaugeType(src.type);

        if (!cls) {
            cls = chart._getGaugeType(defType || chart.gaugeType);
        }

        const gauge = new cls(chart, src.name);

        gauge.load(src);
        return gauge;
    }

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    group: GaugeGroup<ValueGauge>;
    gindex = -1;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * Animation duration.
     * 
     * @config
     */
    duration = 500;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setGroup(group: GaugeGroup<ValueGauge>, index: number): void {
        this.group = group;
        this.gindex = index;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

/**
 * @inernal
 * 
 * TODO: 모든 자식들의 최소 최대가 포함되는 range로 구성한다.
 */
export abstract class GaugeGroup<T extends ValueGauge> extends GaugeBase {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _gauges: T[] = [];
    protected _visibles: T[] = [];

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 최소값.
     * 
     * @config
     */
    minValue = 0;
    /**
     * 최대값.
     * 
     * @config
     */
    maxValue: number;

    count(): number {
        return this._gauges.length;
    }

    isEmpty(): boolean {
        return this._gauges.length < 1;
    }

    visibles(): T[] {
        return this._visibles.slice(0);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    abstract _gaugesType(): string;

    get(index: number): T {
        return this._gauges[index];
    }

    getVisible(index: number): T {
        return this._visibles[index];
    }

    calcedMinMax(): IMinMax {
        return { min: this.minValue, max: this.maxValue };
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoadProp(prop: string, value: any): boolean {
        if (prop === 'children') {
            this.$_loadGauges(this.chart, value);
            return true;
        }
    }

    prepareRender(): void {
        this._visibles = this._gauges.filter(g => g.visible);
        super.prepareRender();
        this._prepareChildren(this._visibles);
    }

    protected _prepareChildren(visibles: T[]): void {
        visibles.forEach((g, i) => {
            this._setGroup(g, i);
            g.prepareRender();
        });
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadGauges(chart: IChart, src: any): void {
        const type = this._gaugesType();

        if (isArray(src)) {
            src.forEach((s, i) => this.$_add(Gauge._loadGauge(chart, s, type) as T));
        } else if (isObject(src)) {
            this.$_add(Gauge._loadGauge(chart, src, type) as T);
        }
    }

    private $_add(gauge: T): void {
        if (gauge._type() === this._gaugesType()) {
            this._gauges.push(gauge);
            gauge.index = this._gauges.length - 1;
        } else {
            throw new Error('이 그룹에 포함될 수 없는 게이지입니다: ' + gauge);
        }
    }

    protected _setGroup(child: T, index: number): void {
        child.setGroup(this, index);
    }
}

/**
 * @internal
 */
export class GaugeCollection {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly chart: IChart;
    private _map: {[name: string]: GaugeBase} = {};
    private _items: GaugeBase[] = [];
    private _visibles: GaugeBase[] = [];
    private _gauges: Gauge[] = [];

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

    get firstGauge(): Gauge {
        return this._gauges[0];
    }

    visibles(): GaugeBase[] {
        return this._visibles;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getGauge(name: string): Gauge {
        const g = this._map[name];
        if (g instanceof Gauge) return g;
    }

    get(name: string | number): GaugeBase {
        return isString(name) ? this._map[name] : this._items[name];
    }

    load(src: any): void {
        const chart = this.chart;
        const items: Gauge[] = this._items = [];
        const map = this._map = {};

        if (isArray(src)) {
            src.forEach((s, i) => {
                items.push(this.$_loadItem(chart, s, i));
            });
        } else if (isObject(src)) {
            items.push(this.$_loadItem(chart, src, 0));
        }

        items.forEach(g => {
            if (g.name) {
                map[g.name] = g;
            }

            if (g instanceof GaugeGroup) {
                for (let i = 0; i < g.count(); i++) {
                    const child = g.get(i);
                    if (child.name) {
                        map[child.name] = child;
                    }
                    this._gauges.push(child);
                }
            } else {
                this._gauges.push(g);
            }
        });
    }

    prepareRender(): void {
        this._visibles = this._items.filter(item => item.visible);
        this._visibles.forEach(item => item.prepareRender());
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadItem(chart: IChart, src: any, index: number): Gauge {
        let cls = isArray(src.children) && chart._getGaugeGroupType(src.type || chart.gaugeType);

        if (cls) {
            const g = new cls(chart);

            g.load(src);
            g.index = index;
            return g;
        }

        cls = chart._getGaugeType(src.type || chart.gaugeType);

        if (!cls) {
            throw new Error('Invalid gauge type: ' + src.type);
        }

        const g = new cls(chart, src.name || `Gauge ${index + 1}`);

        g.load(src);
        g.index = index;
        return g;
    }
}


/**
 * 게이지 모델.
 */
export abstract class ValueGauge extends Gauge {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _runValue: number;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 최소값.
     * group에 포함되면 이 값 대신 group의 최소값이 사용된다.
     * 
     * @config
     */
    minValue = 0;
    /**
     * 최대값.
     * group에 포함되면 이 값 대신 group의 최대값이 사용된다.
     * 
     * @config
     */
    maxValue: number;
    /**
     * 현재값.
     * 
     * @config
     */
    value = 0;
    /**
     * {@link value} 변화를 애니메이션으로 표현한다.
     * 
     * @config
     */
    animatable = true;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    updateValue(value: any, animate: boolean): void {
        if (value !== this.value) {
            this.value = value;
            this._changed();
        }
    }

    getLabel(label: GaugeLabel, value: number): string {
        this._runValue = value;
        return label.text || (label.prefix || '') + '${value}' + (label.suffix || '');
    }

    getParam(param: string): any {
        switch (param) {
            case 'value':
                return this._runValue;
            case 'min':
                return this.minValue;
            case 'max':
                return this.maxValue;
        }
    }

    calcedMinMax(): IMinMax {
        return { min: this.minValue, max: this.maxValue };
    }


    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

export abstract class LineGauge extends ValueGauge {
}

export class GuageScaleTick extends ChartItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public scale: GaugeScale) {
        super(scale.chart);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    reversed = false;
    length = 7;
}

/**
 * Gauge scale.
 */
export abstract class GaugeScale extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _gap = 8;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _step: number;
    _steps: number[];
    _min: number;
    _max: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public gauge: ValueGauge | GaugeGroup<ValueGauge>, visible = true) {
        super(gauge.chart, visible);

        this.line = new ChartItem(gauge.chart, true);
        this.tick = new GuageScaleTick(this);
        this.tickLabel = new ChartItem(gauge.chart);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * @config
     */
    position = GaugeItemPosition.DEFAULT;
    /**
     * @config
     */
    line: ChartItem;
    /**
     * @config
     */
    tick: GuageScaleTick;
    /**
     * @config
     */
    tickLabel: ChartItem;
    /**
     * @config
     */
    steps: number[];
    /**
     * @config
     */
    stepCount: number;
    /**
     * @config
     */
    stepInterval: number;
    /**
     * @config
     */
    stepPixels = 48;
    /**
     * 게이지 본체와의 간격.
     * 
     * @config
     * @default 8 픽셀.
     */
    get gap(): number {
        return this._gap;
    }
    set gap(value: number) {
        this._gap = pickNum(value, 0);
    }

    range(): IMinMax {
        return { min: this._min, max: this._max };
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    buildSteps(length: number, value: number, target = NaN): number[] {
        target = pickNum(target, value);
        const {min, max} = this._adjustMinMax(Math.min(value, target), Math.max(value, target));
        return this._steps = this._buildSteps(length, min, max);
    }

    buildGroupSteps(length: number, values: number[]): number[] {
        const {min, max} = this._adjustGroupMinMax(values);
        return this._steps = this._buildSteps(length, min, max);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _adjustMinMax(min: number, max: number): { min: number, max: number } {
        const g = this.gauge;

        if (!isNaN(g.minValue)) {
            min = g.minValue;
        }
        if (!isNaN(g.maxValue)) {
            max = g.maxValue;
        }

        this._min = Math.min(min, max);
        this._max = Math.max(max, min);
        return { min: this._min, max: this._max };
    }

    protected _adjustGroupMinMax(values: number[]): { min: number, max: number } {
        const g = this.gauge as GaugeGroup<ValueGauge>;
        let min = g.minValue;
        let max = g.maxValue;

        if (isNaN(min)) {
            min = Math.min(...values);
        }
        if (isNaN(max)) {
            max = Math.max(...values);
        }

        this._min = Math.min(min, max);
        this._max = Math.max(max, min);
        return { min: this._min, max: this._max };
    }

    protected _buildSteps(length: number, min: number, max: number): number[] {
        let pts: number[];

        if (Array.isArray(this.steps)) {
            pts = this.steps.slice(0);
        } else if (this.stepCount > 0) {
            pts = this._getStepsByCount(this.stepCount, min, max);
        } else if (this.stepInterval > 0) {
            pts = this._getStepsByInterval(this.stepInterval, min, max);
        } else if (this.stepPixels > 0) {
            pts = this._getStepsByPixels(length, this.stepPixels, min, max);
        } else {
            pts = [min, max];
        }

        this._min = pts[0];
        this._max = pts[pts.length - 1];
        return pts;
    }

    protected _getStepsByCount(count: number, min: number, max: number): number[] {
        const len = max - min;
        let step = len / (count - 1);
        const scale = Math.pow(10, Math.floor(Math.log10(step)));
        const steps: number[] = [];

        step = this._step = Math.ceil(step / scale) * scale;

        if (min > Math.floor(min / scale) * scale) {
            min = Math.floor(min / scale) * scale;
        } else if (min < Math.ceil(min / scale) * scale) {
            min = Math.ceil(min / scale) * scale;
        }

        steps.push(min);
        for (let i = 1; i < count; i++) {
            steps.push(fixnum(steps[i - 1] + step));
        }
        return steps;
    }

    protected _getStepsByInterval(interval: number, min: number, max: number): number[] {
        const steps: number[] = [];
        let v: number;

        steps.push(v = min);
        while (v < max) {
            steps.push(v += interval);
        }
        this._step = interval;
        return steps;
    }

    protected _getStepMultiples(step: number): number[] {
        return [1, 2, 2.5, 5, 10];
    }

    protected _getStepsByPixels(length: number, pixels: number, min: number, max: number): number[] {
        const steps: number[] = [];
        const len = max - min;

        if (len === 0) {
            return steps;
        }

        let count = Math.floor(length / pixels) + 1;
        let step = len / (count - 1);
        const scale = Math.pow(10, Math.floor(Math.log10(step)));
        const multiples = this._getStepMultiples(scale);
        let i = 0;
        let v: number;

        step = step / scale;
        if (multiples) {
            // 위쪽 배수에 맞춘다.
            if (step > multiples[i]) {
                for (; i < multiples.length - 1; i++) {
                    if (step > multiples[i] && step < multiples[i + 1]) {
                        step = multiples[++i];
                        break;
                    }
                }
            } else {
                step = multiples[i];
            }
        }
        step *= scale;

        if (min > Math.floor(min / step) * step) {
            min = Math.floor(min / step) * step;
        } else if (min < Math.ceil(min / step) * step) {
            min = Math.ceil(min / step) * step;
        }

        this._step = step;
        steps.push(fixnum(v = min));
        while (v < max) {
            steps.push(fixnum(v += step));
        }
        return steps;
    }
}

export enum GaugeItemPosition {
    /**
     * 게이지 본체와 scale 사이에 표시된다.
     */
    DEFAULT = 'default',
    /**
     * 원 표시 위치의 반대 쪽 게이지 옆에 표시된다.
     */
    OPPOSITE = 'opposite',
    /**
     * 게이지 본체 내부에 본체와 같은 두께로 표시된다.
     */
    INSIDE = 'inside'
}

/**
 * @config
 */
export class RangeLabel extends ChartItem {
}

/**
 * 게이지 밴드 모델.
 * 
 * @config
 */
export class GaugeRangeBand extends ChartItem {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly DEF_THICKNESS = 7;

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _ranges: IValueRange[];
    private _thickness: RtPercentSize;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _runRanges: IValueRange[];
    private _thickDim: IPercentSize;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public gauge: ValueGauge | GaugeGroup<ValueGauge>, visible = false) {
        super(gauge.chart, visible);

        this.rangeLabel = new RangeLabel(gauge.chart, false);
        this.tickLabel = new ChartItem(gauge.chart, true);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 표시 위치.
     * 
     * @config
     */
    position = GaugeItemPosition.DEFAULT;
    /**
     * 밴드의 두께를 픽셀 단위나, 
     * 게이지 rim의 두께에 대한 상대적 크기로 지정할 수 있다.\
     * 값을 지정하지 않으면 게이지 본체 내부에 표시될 때 '100%'(본체 두께와 동일)로 표시되고,
     * 외부에 있을 때는 7 픽셀로 두께로 표시된다.
     * 
     * @config
     */
    get thickness(): RtPercentSize {
        return this._thickness;
    }
    set thickness(value: RtPercentSize) {
        if (value !== this._thickness) {
            this._thickDim = parsePercentSize(this._thickness = value, true);
        }
    }
    /**
     * {@link position}이 'inside'가 아닐 때, 이 밴드와 게이지 본체 사이의 간격
     */
    gap = 5;
    /**
     * 0보다 큰 값으로 지정하면, 크기 만큼 영역 아이템 사이에 간격을 둔다.
     */
    itemGap = 0;
    /**
     * 값 범위 목록.
     * 범위별로 다른 스타일을 적용할 수 있다.
     * 
     * @config
     */
    get ranges(): IValueRange[] {
        return this.$_internalRanges().slice(0);
    }
    set ranges(value: IValueRange[]) {
        if (value !== this._ranges) {
            this._ranges = value;
            this._runRanges = null;
        }
    }
    /**
     * {@link position}이 'inside'일 때만 표시될 수 있다.
     * 
     * @config
     */
    rangeLabel: RangeLabel;
    /**
     * 각 range의 양 끝에 해당하는 값을 표시한다.
     * 
     * @config
     */
    tickLabel: ChartItem;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getThickness(domain: number): number {
        if (this._thickDim) {
            return calcPercent(this._thickDim, domain, 0);
        } else if (this.position === GaugeItemPosition.INSIDE) {
            return domain;
        } else {
            return GaugeRangeBand.DEF_THICKNESS;
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_internalRanges(): IValueRange[] {
        if (!this._runRanges) {
            const v = this.gauge.calcedMinMax();
            this._runRanges = buildValueRanges(this._ranges, v.min, v.max) || [];
        }
        return this._runRanges;
    }
}

export abstract class GaugeLabel extends FormattableText {

    //-------------------------------------------------------------------------
    // fields
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
     * 게이지 값 변경 애니메이션이 실행될 때, label도 따라서 변경시킨다.
     * 
     * @config
     */
    animatable = true;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

export class LinearGaugeScale extends GaugeScale {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _vertical: boolean;
    _reversed: boolean;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

export class CircularGaugeLabel extends GaugeLabel {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _offsetXDim: IPercentSize;
    private _offsetYDim: IPercentSize;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 게이지 중심 등, label이 표시될 기준 위치에서 x 방향으로 이동한 픽셀 크기.
     * 기준 위치는 게이지 종류에 따라 달라진다.
     * 
     * @config
     */
    offsetX: RtPercentSize = 0;
    /**
     * 게이지 중심 등, label이 표시될 기준 위치에서 y 방향으로 이동한 픽셀 크기.
     * 기준 위치는 게이지 종류에 따라 달라진다.
     * 
     * @config
     */
    offsetY: RtPercentSize = 0;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getOffset(width: number, height: number): IPoint {
        return {
            x: calcPercent(this._offsetXDim, width, 0),
            y: calcPercent(this._offsetYDim, height, 0)
        };
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    load(source: any): ChartItem {
        super.load(source);

        this._offsetXDim = parsePercentSize(this.offsetX, true);
        this._offsetYDim = parsePercentSize(this.offsetY, true);
        return this;
    }
}

/** 
 * @internal 
 */
export interface ICircularGaugeExtents {
    scale?: number;
    scaleTick?: number;
    scaleLabel?: number;
    band?: number;
    bandThick?: number;
    bandTick?: number;
    radius: number,
    radiusThick: number,
    inner: number, 
    value: number 
}

class CircularProps {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _centerX: RtPercentSize;
    private _centerY: RtPercentSize;
    private _radius: RtPercentSize;
    private _innerRadius: RtPercentSize;
    private _valueRadius: RtPercentSize;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _centerXDim: IPercentSize;
    private _centerYDim: IPercentSize;
    private _radiusDim: IPercentSize;
    private _innerDim: IPercentSize;
    private _valueDim: IPercentSize;

    _startRad: number;
    _handRad: number;
    _sweepRad: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(grouped = false) {
        if (grouped) {
            this.setCenterX('50%');
            this.setCenterY('50%');
            this.setValueRadius('100%');
        } else {
            this.setCenterX(CircularGauge.DEF_CENTER);
            this.setCenterY(CircularGauge.DEF_CENTER);
            this.setRadius(CircularGauge.DEF_RADIUS);
            this.setInnerRadius(CircularGauge.DEF_INNER);
        }
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    centerX(): RtPercentSize {
        return this._centerX;
    }
    setCenterX(value: RtPercentSize) {
        if (value !== this._centerX) {
            this._centerX = value;
            this._centerXDim = parsePercentSize(pickProp(value, CircularGauge.DEF_CENTER), true);
        }
    }

    centerY(): RtPercentSize {
        return this._centerY;
    }
    setCenterY(value: RtPercentSize) {
        if (value !== this._centerY) {
            this._centerY = value;
            this._centerYDim = parsePercentSize(pickProp(value, CircularGauge.DEF_CENTER), true);
        }
    }

    radius(): RtPercentSize {
        return this._radius;
    }
    setRadius(value: RtPercentSize) {
        if (value !== this._radius) {
            this._radius = value;
            this._radiusDim = parsePercentSize(pickProp(value, CircularGauge.DEF_RADIUS), true);
        }
    }

    innerRadius(): RtPercentSize {
        return this._innerRadius;
    }
    setInnerRadius(value: RtPercentSize) {
        if (value !== this._innerRadius) {
            this._innerRadius = value;
            this._innerDim = parsePercentSize(pickProp(value, CircularGauge.DEF_INNER), true);
        }
    }

    valueRadius(): RtPercentSize {
        return this._valueRadius;
    }
    setValueRadius(value: RtPercentSize) {
        if (value !== this._valueRadius) {
            this._valueRadius = value;
            this._valueDim = parsePercentSize(value, true);
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getCenter(gaugeWidth: number, gaugeHeight: number): { x: number, y: number } {
        return {
            x: calcPercent(this._centerXDim, gaugeWidth, gaugeWidth / 2),
            y: calcPercent(this._centerYDim, gaugeHeight, gaugeHeight / 2)
        };
    }

    getExtents(gaugeSize: number): ICircularGaugeExtents {
        const radius = calcPercent(this._radiusDim, gaugeSize, gaugeSize / 2);
        const inner = Math.min(radius, this._innerDim ? calcPercent(this._innerDim, radius) : 0);
        const middle = inner + (radius - inner) / 2;
        const value = this._valueDim ? calcPercent(this._valueDim, middle) : middle;

        return { radius, inner, value, radiusThick: radius - inner };
    }

    prepareAngles(startAngle: number, sweepAngle: number): void {
        const start = pickNum(startAngle % 360, 0);
        const sweep = Math.max(0, Math.min(360, pickNum(sweepAngle, 360)));

        this._startRad = ORG_ANGLE + DEG_RAD * start;
        this._handRad = DEG_RAD * start;
        this._sweepRad = DEG_RAD * sweep;
    }
}

/**
 * 원형 게이지 모델.
 * label의 기본 위치의 x는 원호의 좌위 최대 각 위치를 연결한 지점,
 * y는 중심 각도의 위치.
 */
export abstract class CircularGauge extends ValueGauge {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly DEF_CENTER = '50%';
    static readonly DEF_RADIUS = '40%';
    static readonly DEF_INNER = '80%';

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    props = new CircularProps();
    childProps: CircularProps;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart);

        this.label = new CircularGaugeLabel(chart);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    maxValue = 100;

    /**
     * 게이지 중심 수평 위치.
     * 픽셀 단위의 크기나, plot 영역 전체 너비에 대한 상대적 크기로 지정할 수 있다.
     * 
     * @config
     */
    get centerX(): RtPercentSize {
        return this.props.centerX();
    }
    set centerX(value: RtPercentSize) {
        this.props.setCenterX(value);
    }
    /**
     * 게이지 중심 수직 위치.
     * 픽셀 단위의 크기나, plot 영역 전체 높이에 대한 상대적 크기로 지정할 수 있다.
     * 
     * @config
     */
    get centerY(): RtPercentSize {
        return this.props.centerY();
    }
    set centerY(value: RtPercentSize) {
        this.props.setCenterY(value);
    }
    /**
     * 게이지 원호의 반지름.
     * 픽셀 단위의 크기나, plot 영역 전체 크기(너비와 높이 중 작은 값)에 대한 상대적 크기로 지정할 수 있다.
     * '50%'로 지정하면 plot 영역의 width나 height중 작은 크기와 동일한 반지름으로 표시된다.
     * 
     * @config
     */
    get radius(): RtPercentSize {
        return this.props.radius();
    }
    set radius(value: RtPercentSize) {
        this.props.setRadius(value);
    }
    /**
     * 내부 원호의 반지름.
     * 픽셀 단위의 크기나, {@link radius}에 대한 상대적 크기로 지정할 수 있다.
     * '100%'이면 게이지 원호의 반지름과 동일하다.
     * 
     * @config
     */
    get innerRadius(): RtPercentSize {
        return this.props.innerRadius();
    }
    set innerRadius(value: RtPercentSize) {
        this.props.setInnerRadius(value);
    }
    /**
     * 값을 나타내는 원호의 반지름.
     * 픽셀 단위의 크기나, 
     * {@link radius}와 {@link innerRadius}로 결정된 기본 rim의 중점에 대한 상대적 크기로 지정할 수 있다.
     * 지정하지 않거나 '100%'이고 {@link valueRim}의 {@link valueRim.thickness 두께}가 
     * 기본 rim의 두께와 동일하면 게이지 원호의 반지름과 동일하게 표시된다.
     */
    get valueRadius(): RtPercentSize {
        return this.props.valueRadius();
    }
    set valueRadius(value: RtPercentSize) {
        this.props.setValueRadius(value);
    }
    /**
     * 게이지 원호 시작 각도.
     * 지정하지 않거나 잘못된 값이면 0으로 계산된다.
     * 0은 시계의 12시 위치다.
     * 
     * @config
     */
    startAngle = 0;
    /**
     * 게이지 원호 전체 각도.
     * 0 ~ 360 사이의 값으로 지정해야 한다.
     * 범위를 벗어난 값은 범위 안으로 조정된다.
     * 지정하지 않거나 잘못된 값이면 360으로 계산된다.
     * 예) 180 이면 반 원호가 된다.
     * 
     * @config
     */
    sweepAngle = 360;
    /**
     * true면 시계 방향으로 회전한다.
     * 
     * @config
     */
    clockwise = true;
    /**
     * 게이지 중앙에 표시되는 label 설정 모델
     * 
     * @config
     */
    label: CircularGaugeLabel;
    /**
     * 내부 원에 적용할 스타일셋 혹은 class selector.
     * 
     * @config
     */
    innerStyle: SVGStyleOrClass;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getProps(): CircularProps {
        return this.childProps || this.props;
    }

    getCenter(gaugeWidth: number, gaugeHeight: number): { x: number, y: number } {
        if (this.group) {
            return this.childProps.getCenter(gaugeWidth, gaugeHeight);
        } else {
            return this.props.getCenter(gaugeWidth, gaugeHeight);
        }
    }

    getExtents(gaugeSize: number): ICircularGaugeExtents {
        if (this.group) {
            return this.childProps.getExtents(gaugeSize);
        } else {
            return this.props.getExtents(gaugeSize);
        }
    }

    labelVisible(): boolean {     
        // return !this.group && this.label.visible;
        return this.label.visible;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    setGroup(group: GaugeGroup<ValueGauge>, index: number): void {
        super.setGroup(group, index);

        if (group && !this.childProps) {
            this.childProps = new CircularProps();
        }
    }

    protected _doPrepareRender(chart: IChart): void {
        super._doPrepareRender(chart);

        const g = this.group as CircularGaugeGroup<CircularGauge>;

        if (g) {
            this.childProps.prepareAngles(g.startAngle, g.sweepAngle);
        } else {
            this.props.prepareAngles(this.startAngle, this.sweepAngle);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}

export abstract class CircularGaugeGroup<T extends CircularGauge> extends GaugeGroup<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    props = new CircularProps();

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 게이지 중심 수평 위치.
     * 픽셀 단위의 크기나, plot 영역 전체 너비에 대한 상대적 크기로 지정할 수 있다.
     * 
     * @config
     */
    get centerX(): RtPercentSize {
        return this.props.centerX();
    }
    set centerX(value: RtPercentSize) {
        this.props.setCenterX(value);
    }
    /**
     * 게이지 중심 수직 위치.
     * 픽셀 단위의 크기나, plot 영역 전체 높이에 대한 상대적 크기로 지정할 수 있다.
     * 
     * @config
     */
    get centerY(): RtPercentSize {
        return this.props.centerY();
    }
    set centerY(value: RtPercentSize) {
        this.props.setCenterY(value);
    }
    /**
     * 게이지 원호의 반지름.
     * 픽셀 단위의 크기나, plot 영역 전체 크기(너비와 높이 중 작은 값)에 대한 상대적 크기로 지정할 수 있다.
     * '50%'로 지정하면 plot 영역의 width나 height중 작은 크기와 동일한 반지름으로 표시된다.
     * 
     * @config
     */
    get radius(): RtPercentSize {
        return this.props.radius();
    }
    set radius(value: RtPercentSize) {
        this.props.setRadius(value);
    }
    /**
     * 내부 원호의 반지름.
     * 픽셀 단위의 크기나, {@link radius}에 대한 상대적 크기로 지정할 수 있다.
     * '100%'이면 게이지 원호의 반지름과 동일하다.
     * 
     * @config
     */
    get innerRadius(): RtPercentSize {
        return this.props.innerRadius();
    }
    set innerRadius(value: RtPercentSize) {
        this.props.setInnerRadius(value);
    }
    /**
     * 값을 나타내는 원호의 반지름.
     * 픽셀 단위의 크기나, {@link radius}에 대한 상대적 크기로 지정할 수 있다.
     * 지정하지 않거나 '100%'이면 게이지 원호의 반지름과 동일하다.
     */
    get valueRadius(): RtPercentSize {
        return this.props.valueRadius();
    }
    set valueRadius(value: RtPercentSize) {
        this.props.setValueRadius(value);
    }
    /**
     * 게이지 원호 시작 각도.
     * 지정하지 않거나 잘못된 값이면 0으로 계산된다.
     * 0은 시계의 12시 위치다.
     * 
     * @config
     */
    startAngle = 0;
    /**
     * 게이지 원호 전체 각도.
     * 0 ~ 360 사이의 값으로 지정해야 한다.
     * 범위를 벗어난 값은 범위 안으로 조정된다.
     * 지정하지 않거나 잘못된 값이면 360으로 계산된다.
     * 예) 180 이면 반 원호가 된다.
     * 
     * @config
     */
    sweepAngle = 360;
    /**
     * true면 시계 방향으로 회전한다.
     * 
     * @config
     */
    clockwise = true;
    /**
     * 게이지 중앙에 표시되는 label 설정 모델
     * 
     * @config
     */
    label: CircularGaugeLabel;
    /**
     * 내부 원에 적용할 스타일셋 혹은 class selector.
     * 
     * @config
     */
    innerStyle: SVGStyleOrClass;
    /**
     * 자식 게이지 원호들의 간격을 픽셀 단위로 지정한다.
     */
    itemGap = 4;

    labelGap = 10;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getCenter(gaugeWidth: number, gaugeHeight: number): { x: number, y: number } {
        return this.props.getCenter(gaugeWidth, gaugeHeight);
    }

    getExtents(gaugeSize: number): ICircularGaugeExtents {
        return this.props.getExtents(gaugeSize);
    }

    setChildExtents(exts: ICircularGaugeExtents): void {
        const count = this._visibles.length;

        if (count > 0) {
            const gap = +this.itemGap || 0;
            let rd = exts.radius;
            const thick = (rd - exts.inner - gap * (count - 1)) / count;
    
            this._visibles.forEach((child, i) => {
                const props = child.childProps;
    
                props.setRadius(rd);
                props.setInnerRadius(rd - thick);
    
                rd -= thick + gap;
            });    
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}