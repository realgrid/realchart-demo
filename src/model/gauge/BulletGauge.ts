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
import { GaugeLabel, GaugeScale, IGaugeValueRange, ValueGauge } from "../Gauge";

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

export class BulletGaugeLabel extends GaugeLabel {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _width: RtPercentSize;
    private _height: RtPercentSize;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _widthDim: IPercentSize;
    private _heightDim: IPercentSize;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: BulletGauge) {
        super(gauge.chart);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 값을 지정하지 않으면 게이지 표시 방향에 따라 자동으로 위치를 결정한다.
     */
    position: undefined | 'left' | 'right' | 'top' | 'bottom';
    /**
     * 값을 지정하지 않으면,
     * position이 'left', 'right'일 때 기본값은 '25%'이다.
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
     * 값을 지정하지 않으면,
     * position이 'top', 'bottom'일 때 기본값은 '25%'이다.
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

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getWidth(vertical: boolean,  domain: number): number {
        let w = calcPercent(this._widthDim, domain);

        if (isNaN(w)) {
            if (!vertical) {
                w = domain * 0.25;
            }
        }
        return w;
    }

    getHeight(vertical: boolean, domain: number): number {
        let h = calcPercent(this._heightDim, domain);

        if (isNaN(h)) {
            if (vertical) {
                h = domain * 0.25;
            }
        }
        return h;
    }
}

export class BulletGaugeScale extends GaugeScale {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _vertical: boolean;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * true면 반대쪽에 표시한다.
     * 
     * @config
     */
    opposite = false;
    /**
     * 게이지 본체와의 간격.
     */
    gap = 8;
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
    private _gap: RtPercentSize;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _gapDim: IPercentSize;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart);

        this.gap = '5%';
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
    scale = new BulletGaugeScale(this);
    /**
     * label.
     * 
     * @config
     */
    label = new BulletGaugeLabel(this);
    /**
     * label과 본체 사이의 간격.
     * 
     * @config
     */
    get gap(): RtPercentSize {
        return this._gap;
    }
    set gap(value: RtPercentSize) {
        if (value !== this._gap) {
            this._gap = value;
            this._gapDim = parsePercentSize(value, true);
        }
    }
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

    getGap(domain: number): number {
        return calcPercent(this._gapDim, domain, 0);
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
