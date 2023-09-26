////////////////////////////////////////////////////////////////////////////////
// Gauge.ts
// 2023. 09. 25. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, pickProp } from "../../common/Common";
import { IPercentSize, RtPercentSize, calcPercent, parsePercentSize } from "../../common/Types";
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
}

/**
 * 원형 게이지 모델.
 */
export abstract class CircularGauge extends Gauge {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly DEF_SIZE = '80%';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _radiusDim: IPercentSize;
    private _innerDim: IPercentSize;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart);

        this.label = new GaugeLabel(chart, true);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    centerX: RtPercentSize = '50%';
    centerY: RtPercentSize = '50%';
    /**
     * 게이지 본체의 크기.
     * <br>
     * 픽셀 크기나 차지할 수 있는 전체 크기에 대한 상대적 크기로 지정할 수 있다.
     * 
     * @config
     */
    size: RtPercentSize = CircularGauge.DEF_SIZE;
    innerSize: RtPercentSize;
    /**
     * @config
     */
    startAngle = 0;
    endAngle = 360;
    label: GaugeLabel;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getSize(plotWidth: number, plotHeight: number): { size: number, inner: number } {
        const size = calcPercent(this._radiusDim, Math.min(plotWidth, plotHeight));
        const inner = Math.min(size, this._innerDim ? calcPercent(this._innerDim, Math.min(plotWidth, plotHeight)) : 0);

        return { size: size, inner };
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'gauge';
    }

    protected _doLoad(src: any): void {
        super._doLoad(src);

        this._radiusDim = parsePercentSize(pickProp(this.size, CircularGauge.DEF_SIZE), true);
        this._innerDim = parsePercentSize(this.innerSize, true);
    }
}
