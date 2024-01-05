////////////////////////////////////////////////////////////////////////////////
// BulletGauge.ts
// 2023. 10. 05. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isObject, pickProp } from "../../common/Common";
import { IPercentSize, IValueRange, RtPercentSize, SVGStyleOrClass, buildValueRanges, parsePercentSize } from "../../common/Types";
import { IChart } from "../Chart";
import { ChartItem } from "../ChartItem";
import { LinearGaugeBase, LinearGaugeGroupBase, LinearValueBar } from "./LinearGauge";

export class BulletGaugeBand extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _width: RtPercentSize;
    private _height: RtPercentSize;
    private _ranges: IValueRange[];

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _runRanges: IValueRange[];
    private _widthDim: IPercentSize;
    private _heightDim: IPercentSize;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public gauge: BulletGauge | BulletGaugeGroup) {
        super(gauge.chart, true);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * true면 수직 bar로 표시한다.
     * 
     * @config
     */
    vertical = false;

    /**
     * 너비
     * 
     * @config
     */
    get width(): RtPercentSize {
        return this._width;
    }
    set width(value: RtPercentSize) {
        if (value !== this._width) {
            this._width = value;
            this._widthDim = parsePercentSize(value, true);
        }
    }
    /**
     * 높이
     * 
     * @config
     */
    get height(): RtPercentSize {
        return this._height;
    }
    set height(value: RtPercentSize) {
        if (value !== this._height) {
            this._height = value;
            this._heightDim = parsePercentSize(value, true);
        }
    }
    /**
     * 값 범위 목록.
     * 범위별로 다른 스타일을 적용할 수 있다.
     * 
     * @config
     */
    get ranges(): IValueRange[] {
        return this.$_internalRanges()?.slice(0);
    }
    set ranges(value: IValueRange[]) {
        if (value !== this._ranges) {
            this._ranges = value;
            this._runRanges = null;
        }
    }

    /**
     * true로 지정하면 {@link ranges} 항목에서  **toValue**나 **fromValue**가 지정되지 않은 경우,  
     * 모든 값이 포함되는 값으로 확장한다.
     * 
     * @config
     */
    rangeInclusive = true;

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_internalRanges(): IValueRange[] {
        if (!this._runRanges) {
            this._runRanges = buildValueRanges(this._ranges, this.gauge.minValue, this.gauge.maxValue, this.rangeInclusive);
        }
        return this._runRanges;
    }
}

export class BulletTargetBar extends ChartItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: BulletGauge) {
        super(gauge.chart, true);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 목표 bar 표시 여부.
     * 
     * @default true
     */
    '@config visible': any;
}

export interface IBulletGaugeArgs {
    gauge: object;
    value: number;
}

export class BulletValueBar extends LinearValueBar {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * {@link value 현재 값}이 {@link targetValue 목표 값} 미만일 때 적용되는 스타일셋.
     * 
     * @config
     */
    belowStyle: SVGStyleOrClass;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
}

/**
 * bullet 게이지 모델.
 * 현재 값을 목표 값과 비교해서 표시한다.
 * 또, 여러 값 범위 중 어디에 속한 상태인 지를 나타낸다.
 * 
 * @config chart.gauge[type=bullet]
 */
export class BulletGauge extends LinearGaugeBase {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 밴드.
     * 
     * @config
     */
    band = new BulletGaugeBand(this);
    /**
     * target bar.
     * 
     * @config
     */
    targetBar = new BulletTargetBar(this);
    /**
     * actual bar.
     * 
     * @config
     */
    valueBar = new BulletValueBar(this);
    /**
     * 목표 값.
     * 
     * @config
     */
    targetValue: number;
    /**
     * 값 범위 목록.
     * 범위별로 다른 스타일을 적용할 수 있다.
     * 
     * @config
     */
    ranges: IValueRange[];
    /**
     * true로 지정하면 {@link ranges} 항목에서  **toValue**나 **fromValue**가 지정되지 않은 경우,  
     * 모든 값이 포함되는 값으로 확장한다.
     * 
     * @config
     */
    rangeInclusive = true;
    
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getRanges(min: number, max: number, inclusive: boolean): IValueRange[] {
        return buildValueRanges(this.ranges, min, max, pickProp(inclusive, this.rangeInclusive));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'bullet';
    }

    protected _doLoad(src: any): void {
        super._doLoad(src);
    }
}

export class BulletGaugeGroup extends LinearGaugeGroupBase<BulletGauge> {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 값 범위 목록.
     * 범위별로 다른 스타일을 적용할 수 있다.
     * 
     * @config
     */
    ranges: IValueRange[];
    /**
     * true로 지정하면 {@link ranges} 항목에서  **toValue**나 **fromValue**가 지정되지 않은 경우,  
     * 모든 값이 포함되는 값으로 확장한다.
     * 
     * @config
     */
    rangeInclusive = true;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getRanges(min: number, max: number, inclusive: boolean): IValueRange[] {
        return buildValueRanges(this.ranges, min, max, pickProp(inclusive, this.rangeInclusive));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'bulletgroup';
    }

    _gaugesType(): string {
        return 'bullet';
    }
}
