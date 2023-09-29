////////////////////////////////////////////////////////////////////////////////
// Gauge.ts
// 2023. 09. 25. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, isString, pickNum, pickNum3, pickProp } from "../common/Common";
import { IPoint } from "../common/Point";
import { ISize } from "../common/Size";
import { IPercentSize, RtPercentSize, calcPercent, parsePercentSize } from "../common/Types";
import { IChart } from "./Chart";
import { FormattableText } from "./ChartItem";
import { Widget } from "./Widget";

export interface IGaugeValueRange {
    startValue?: number;
    endValue?: number;
    color: string;
}

/**
 * 게이지 모델.
 */
export abstract class Gauge extends Widget {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    /**
     * endValue는 포함되지 않는다. 즉, startValue <= v < endValue.
     * startValue를 지정하면 이전 range의 endValue를 startValue로 설정한다.
     * 이전 범위가 없으면 min으로 지정된다.
     * endValue가 지정되지 않으면 max로 지정된다.
     * color가 설정되지 않거나, startValue와 endValue가 같은 범위는 포힘시키지 않는다.
     * startValue를 기준으로 정렬한다.
     */
    static buildRanges(source: IGaugeValueRange[], min: number, max: number): IGaugeValueRange[] {
        let ranges: IGaugeValueRange[];
        let prev: IGaugeValueRange;

        if (isArray(source)) {
            ranges = [];
            source.forEach(src => {
                if (isObject(src) && isString(src.color)) {
                    const range: IGaugeValueRange = {
                        startValue: pickNum(src.startValue, prev ? prev.endValue : min),
                        endValue: pickNum(src.endValue, max),
                        color: src.color
                    };
                    if (range.startValue < range.endValue) {
                        ranges.push(range);
                        prev = range;
                    }
                }
            });
            ranges = ranges.sort((r1, r2) => r1.startValue - r2.startValue);
        }
        return ranges;
    }

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _widthDim: IPercentSize;
    private _heightdim: IPercentSize;

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
     * 게이지 너비.
     * 픽셀 단위의 고정 값이나, plot 영역에 대한 상태 크기롤 지정할 수 있다.
     * 
     * @config
     */
    width: RtPercentSize;
    /**
     * 게이지 높이.
     * 픽셀 단위의 고정 값이나, plot 영역에 대한 상태 크기롤 지정할 수 있다.
     * 
     * @config
     */
    height: RtPercentSize;
    /**
     * {@link width}와 {@link height}를 동시에 설정한다.
     * 
     * @config
     */
    size: RtPercentSize = '100%';
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
    maxValue = 100;
    /**
     * 현재값.
     * 
     * @config
     */
    value = 0;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getSize(width: number, height: number): ISize {
        return {
            width: calcPercent(this._widthDim, width) || width,
            height: calcPercent(this._heightdim, height) || height
        };
    }

    updateValues(values: any): void {
        if (values !== this.value) {
            this.value = values;
            this._changed();
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoad(source: any): void {
        super._doLoad(source);

        const sz = parsePercentSize(this.size, true);

        this._widthDim = parsePercentSize(this.width, true) || sz;
        this._heightdim = parsePercentSize(this.height, true) || sz;
    }
}

export class GaugeCollection {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly chart: IChart;
    private _map: {[name: string]: Gauge} = {};
    private _items: Gauge[] = [];
    private _visibles: Gauge[] = [];

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

    visibles(): Gauge[] {
        return this._visibles;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    get(name: string): Gauge {
        return this._map[name];
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
        let cls = chart._getGaugeType(src.type || 'circle');
        if (!cls) {
            throw new Error('Invalid gauge type: ' + src.type);
        }

        const g = new cls(chart, src.name || `Gauge ${index + 1}`);

        g.load(src);
        g.index = index;
        return g;
    }
}

export class GaugeLabel extends FormattableText {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart, true);

        this.setLineHeight(1.2);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 게이지 중심 등, label이 표시될 기준 위치에서 x 방향으로 이동한 픽셀 크기.
     * 기준 위치는 게이지 종류에 따라 달라진다.
     * 
     * @config
     */
    offsetX = 0;
    /**
     * 게이지 중심 등, label이 표시될 기준 위치에서 y 방향으로 이동한 픽셀 크기.
     * 기준 위치는 게이지 종류에 따라 달라진다.
     * 
     * @config
     */
    offsetY = 0;
    /**
     * 게이지 값 변경 애니메이션이 실행될 때, label도 따라서 변경시킨다.
     * 
     * @config
     */
    animatable = true;
}

/**
 * 원형 게이지 모델.
 * label의 기본 위치의 x는 원호의 좌위 최대 각 위치를 연결한 지점,
 * y는 중심 각도의 위치.
 */
export abstract class CircularGauge extends Gauge {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly DEF_CENTER = '50%';
    static readonly DEF_RADIUS = '40%';
    static readonly DEF_THICKNESS = '20%';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _centerXDim: IPercentSize;
    private _centerYDim: IPercentSize;
    private _radiusDim: IPercentSize;
    private _thickDim: IPercentSize;
    private _valueDim: IPercentSize;
    private _activeValue: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart);

        this.label = new GaugeLabel(chart);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * {@link value} 변화를 애니메이션으로 표현한다.
     * 
     * @config
     */
    animatable = true;
    /**
     * Animation duration.
     * 
     * @config
     */
    duration = 500;
    /**
     * 게이지 중심 수평 위치.
     * 픽셀 단위의 크기나, plot 영역 전체 너비에 대한 상대적 크기로 지정할 수 있다.
     * 
     * @config
     */
    centerX: RtPercentSize = CircularGauge.DEF_CENTER;
    /**
     * 게이지 중심 수직 위치.
     * 픽셀 단위의 크기나, plot 영역 전체 높이에 대한 상대적 크기로 지정할 수 있다.
     * 
     * @config
     */
    centerY: RtPercentSize = CircularGauge.DEF_CENTER;
    /**
     * 게이지 원의 크기.
     * 픽셀 단위의 크기나, plot 영역 전체 크기(너비와 높이 중 작은 값)에 대한 상대적 크기로 지정할 수 있다.
     * 
     * @config
     */
    radius: RtPercentSize = CircularGauge.DEF_RADIUS;
    /**
     * 내부 원의 크기.
     * 픽셀 단위의 크기나, {@link radius}에 대한 상대적 크기로 지정할 수 있다.
     * 
     * @config
     */
    thickness: RtPercentSize = CircularGauge.DEF_THICKNESS;
    /**
     * 값을 표시하는 내부 원의 크기.
     * 픽셀 단위의 크기나, {@link radius}에 대한 상대적 크기로 지정할 수 있다.
     * 예) '100%'로 지정하면 원을 채운다.
     * 
     * @config
     */
    valueThickness: RtPercentSize;
    /**
     * 게이지 시작 각도.
     * 0~360 사이의 값이로 지정한다.
     * 
     * @config
     */
    startAngle = 0;
    /**
     * 게이지 끝 각도.
     * 0~360 사이의 값이로 지정한다.
     * 
     * @config
     */
    endAngle = 360;
    /**
     * 게이지 중앙에 표시되는 label 설정 모델
     * 
     * @config
     */
    label: GaugeLabel;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getCenter(gaugeWidth: number, gaugeHeight: number): { x: number, y: number } {
        const x = calcPercent(this._centerXDim, gaugeWidth);
        const y = calcPercent(this._centerYDim, gaugeHeight);

        return { x, y };
    }

    getExtents(gaugeWidth: number, gaugeHeight: number): { radius: number, thick: number, value: number } {
        const radius = calcPercent(this._radiusDim, Math.min(gaugeWidth, gaugeHeight));
        const thick = Math.min(radius, this._thickDim ? calcPercent(this._thickDim, radius) : 0);
        const value = Math.min(radius, this._valueDim ? calcPercent(this._valueDim, radius) : thick);

        return { radius, thick, value };
    }

    getLabel(value: number): string {
        this._activeValue = value;
        return this.label.text || (this.label.prefix || '') + value + (this.label.suffix || '');
    }

    getParam(param: string): any {
        switch (param) {
            case 'value':
                return this._activeValue;
            case 'min':
                return this.minValue;
            case 'max':
                return this.maxValue;
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'gauge';
    }

    protected _doLoad(src: any): void {
        super._doLoad(src);

        this._centerXDim = parsePercentSize(pickProp(this.centerX, CircularGauge.DEF_CENTER), true);
        this._centerYDim = parsePercentSize(pickProp(this.centerY, CircularGauge.DEF_CENTER), true);
        this._radiusDim = parsePercentSize(pickProp(this.radius, CircularGauge.DEF_RADIUS), true);
        this._thickDim = parsePercentSize(pickProp(this.thickness, CircularGauge.DEF_THICKNESS), true);
        this._valueDim = parsePercentSize(this.valueThickness, true);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}
