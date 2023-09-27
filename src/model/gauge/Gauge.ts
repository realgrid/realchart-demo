////////////////////////////////////////////////////////////////////////////////
// Gauge.ts
// 2023. 09. 25. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, pickProp } from "../../common/Common";
import { Align, IPercentSize, RtPercentSize, calcPercent, parsePercentSize } from "../../common/Types";
import { IChart } from "../Chart";
import { FormattableText } from "../ChartItem";
import { Widget } from "../Widget";

export interface IGaugeValueRange {
    startValue: number;
    endValue: number;
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
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    abstract _type(): string;

    name: string;
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
    ranges: IGaugeValueRange[];

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    updateValues(values: any): void {
        if (values !== this.value) {
            this.value = values;
            this._changed();
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
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
     * 게이지 중심 등, label이 표시될 기준 위치에서 y 방향으로 이동한 픽셀 크기.
     * 기준 위치는 게이지 종류에 따라 달라진다.
     * 
     * @config
     */
    offset = 0;
}

/**
 * 원형 게이지 모델.
 */
export abstract class CircularGauge extends Gauge {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly DEF_CENTER = '50%';
    static readonly DEF_SIZE = '80%';
    static readonly INNER_SIZE = '80%';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _centerXDim: IPercentSize;
    private _centerYDim: IPercentSize;
    private _radiusDim: IPercentSize;
    private _innerDim: IPercentSize;

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
    size: RtPercentSize = CircularGauge.DEF_SIZE;
    /**
     * 내부 원의 크기.
     * 픽셀 단위의 크기나, 게이지 원 크기(너비와 높이 중 작은 값)에 대한 상대적 크기로 지정할 수 있다.
     * 
     * @config
     */
    innerSize: RtPercentSize = CircularGauge.INNER_SIZE;
    /**
     * @config
     */
    startAngle = 0;
    endAngle = 360;
    label: GaugeLabel;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getCenter(plotWidth: number, plotHeight: number): { x: number, y: number } {
        const x = calcPercent(this._centerXDim, plotWidth);
        const y = calcPercent(this._centerYDim, plotHeight);

        return { x, y };
    }

    getSize(plotWidth: number, plotHeight: number): { size: number, inner: number } {
        const size = calcPercent(this._radiusDim, Math.min(plotWidth, plotHeight));
        const inner = this._innerDim ? calcPercent(this._innerDim, size) : 0;

        return { size: size, inner };
    }

    getLabel(): string {
        return this.label.text || (this.label.prefix || '') + this.value + (this.label.suffix || '');
    }

    getParam(param: string): any {
        switch (param) {
            case 'value':
                return this.value;
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
        this._radiusDim = parsePercentSize(pickProp(this.size, CircularGauge.DEF_SIZE), true);
        this._innerDim = parsePercentSize(pickProp(this.innerSize, CircularGauge.INNER_SIZE), true);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}
