////////////////////////////////////////////////////////////////////////////////
// BulletGauge.ts
// 2023. 10. 05. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IPercentSize, RtPercentSize, calcPercent, parsePercentSize } from "../../common/Types";
import { IChart } from "../Chart";
import { ChartItem } from "../ChartItem";
import { GaugeLabel, GaugeScale, IGaugeValueRange, LinearGaugeLabel, LinearGaugeScale, ValueGauge } from "../Gauge";

export class BulletGaugeBand extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _width: RtPercentSize;
    private _height: RtPercentSize;
    private _ranges: IGaugeValueRange[];

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _runRanges: IGaugeValueRange[];
    private _widthDim: IPercentSize;
    private _heightDim: IPercentSize;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public gauge: BulletGauge) {
        super(gauge.chart);
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
    get ranges(): IGaugeValueRange[] {
        return this.$_internalRanges()?.slice(0);
    }
    set ranges(value: IGaugeValueRange[]) {
        if (value !== this._ranges) {
            this._ranges = value;
            this._runRanges = null;
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_internalRanges(): IGaugeValueRange[] {
        if (!this._runRanges) {
            this._runRanges = ValueGauge.buildRanges(this._ranges, this.gauge.minValue, this.gauge.maxValue);
        }
        return this._runRanges;
    }
}

export class BulletTargetBar extends ChartItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: BulletGauge) {
        super(gauge.chart);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

export class BulletActualBar extends ChartItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: BulletGauge) {
        super(gauge.chart);
    }
}

/**
 * bullet 게이지 모델.
 * 현재 값을 목표 값과 비교해서 표시한다.
 * 또, 여러 값 범위 중 어디에 속한 상태인 지를 나타낸다.
 * 
 * @config chart.gauge[type=bullet]
 */
export class BulletGauge extends ValueGauge {

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
     * true면 수직 방향으로 표시한다.
     * 값을 지정하지 않으면 게이지 전체 크기의 수평 수직을 비교해서 표시 방향을 자동으로 설정한다.
     * 
     * @config
     */
    vertical: boolean;
    /**
     * true면 반대 방향으로 표시한다.
     * 
     * @config
     */
    reversed = false;
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
    actualBar = new BulletActualBar(this);
    /**
     * scale.
     * 
     * @config
     */
    scale = new LinearGaugeScale(this);
    /**
     * label.
     * 
     * @config
     */
    label = new LinearGaugeLabel(this.chart);
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
    ranges: IGaugeValueRange[];

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getRanges(min: number, max: number): IGaugeValueRange[] {
        return ValueGauge.buildRanges(this.ranges, min, max);
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
