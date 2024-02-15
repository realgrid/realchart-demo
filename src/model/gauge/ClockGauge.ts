////////////////////////////////////////////////////////////////////////////////
// ClockGauge.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isString, minv, pickProp } from "../../common/Common";
import { IPercentSize, RtPercentSize, calcPercent, parsePercentSize } from "../../common/Types";
import { IChart } from "../Chart";
import { ChartItem, FormattableText } from "../ChartItem";
import { CircularGauge, Gauge } from "../Gauge";

/**
 * Clock 게이지 테두리(rim) 설정 모델.<br/>
 */
export class ClockGaugeRim extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _thickness: RtPercentSize;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _thickDim: IPercentSize;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: ClockGauge) {
        super(gauge.chart, true);

        this.thickness = 7;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * rim 두께.
     * 픽셀 단위 크기나, 게이지 반지름 대한 상대 크기로 지정할 수 있다.
     * 
     * @config
     * @default 7 pixel
     */
    get thickness(): RtPercentSize {
        return this._thickness;
    }
    set thickness(value: RtPercentSize) {
        if (value !== this._thickness) {
            this._thickness = value;
            this._thickDim = parsePercentSize(this.thickness, true);
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getThickness(domain: number): number {
        return calcPercent(this._thickDim, domain, domain);
    }
}

/**
 * Clock 게이지 시/분침(hand) 설정 모델.<br/>
 */
export class ClockGaugeHand extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _length: RtPercentSize;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lengthDim: IPercentSize;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: ClockGauge, thickness: number, length: RtPercentSize) {
        super(gauge.chart, true);

        this.thickness = thickness;
        this.length = length;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 픽셀 단위 바늘 두께.
     * 침 종류에 따라 기본값이 다르다.
     * 
     * @config
     */
    thickness: number;
    /**
     * 바늘 길이.
     * 픽셀 단위로 직접 지정하거나 시계 반지름에 대한 상대 크기로 지정할 수 있다.
     * 침 종류에 따라 기본값이 다르다.
     * 
     * @config
     */
    get length(): RtPercentSize {
        return this._length;
    }
    set length(value: RtPercentSize) {
        if (value !== this._length) {
            this._length = value;
            this._lengthDim = parsePercentSize(value, true);
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getLength(domain: number): number {
        return calcPercent(this._lengthDim, domain, domain);
    }
}

/**
 * Clock 게이지 초침(hand) 설정 모델.<br/>
 */
export class ClockGaugeSecondHand extends ClockGaugeHand {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * true면 초 이동 시 애니메이션 효과로 표시한다.
     * 
     * @config
     */
    animatable = false;
    /**
     * {@link animatable}이 true일 때 애니메이션 기간.
     * 밀리초 단위로 지정한다.
     * 
     * @config
     */
    duration = 200;
}

/**
 * Clock 게이지 tick 설정 모델.<br/>
 */
export class ClockGaugeTick extends ChartItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: ClockGauge, public length: number) {
        super(gauge.chart, true);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

/**
 * Clock 게이지 tick 라벨 설정 모델.<br/>
 */
export class ClockGaugeTickLabel extends ChartItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: ClockGauge) {
        super(gauge.chart, true);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    step = 1;
    offset = 1;
}

/**
 * Clock 게이지 중심 pin 설정 모델.<br/>
 */
export class ClockGaugePin extends ChartItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: ClockGauge, public raidus: number) {
        super(gauge.chart, true);
    }
}

/**
 * Clock 게이지 내부에 표시되는 라벨 설정 모델.<br/>
 */
export class ClockGaugeLabel extends FormattableText {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: ClockGauge) {
        super(gauge.chart, true);

        this.text = 'RealChart Clock<br>ver1.0';
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    '@config text' = 'RealChart Clock<br>ver1.0';
    /**
     * 라벨 표시 위치.
     * 
     * @config
     */
    position: 'top' | 'bottom' = 'top';
}

/**
 * 시계 게이지 모델.<br/>
 * 원형 아날로그 시계를 표시한다.
 * 
 * @config chart.gauge[type=clock]
 */
export class ClockGauge extends Gauge {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _active = true;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _centerXDim: IPercentSize;
    private _centerYDim: IPercentSize;
    private _radiusDim: IPercentSize;

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
     * 분단위로 시계에 표시할 지역의 timezone을 지정한다.
     * 예) 뉴욕: -4 * 60, 파리: 2 * 60
     * 
     * @config
     */
    timezone: number;
    /**
     * 이 속성에 명시적으로 시간을 지정하면 현재 시간 대신 이 시각을 표시한다.
     * 
     * @config
     */
    time: Date | number | string;
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
     * 게이지 원호의 반지름.
     * 픽셀 단위의 크기나, plot 영역 전체 크기(너비와 높이 중 작은 값)에 대한 상대적 크기로 지정할 수 있다.
     * '50%'로 지정하면 plot 영역의 width나 height중 작은 크기와 동일한 반지름으로 표시된다.
     * 
     * @config
     */
    radius: RtPercentSize = CircularGauge.DEF_RADIUS;
    /**
     * rim 설정 모델.
     * 
     * @config
     */
    rim = new ClockGaugeRim(this);
    /**
     * 시침 설정 모델.
     * 
     * @config
     */
    hourHand = new ClockGaugeHand(this, 7, '60%');
    /**
     * 분침 설정 모델.
     * 
     * @config
     */
    minuteHand = new ClockGaugeHand(this, 5, '85%');
    /**
     * 초침 설정 모델.
     * 
     * @config
     */
    secondHand = new ClockGaugeSecondHand(this, 2, '95%');
    /**
     * main tick.
     * 
     * @config
     */
    tick = new ClockGaugeTick(this, 10);
    /**
     * minor tick
     * 
     * @config
     */
    minorTick = new ClockGaugeTick(this, 5);
    /**
     * pin
     * 
     * @config
     */
    /**
     * tick label
     * 
     * @config
     */
    tickLabel = new ClockGaugeTickLabel(this);
    /**
     * pin
     * 
     * @config
     */
    pin = new ClockGaugePin(this, 5);
    /**
     * label
     * 
     * @config
     */
    label = new ClockGaugeLabel(this);
    /**
     * 시계 동작 여부.
     * 
     * @config
     * @default true
     */
    get active(): boolean {
        return this._active;
    }
    set active(value: boolean) {
        if (value !== this._active) {
            this._active = value;
            this._changed();
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getTime(): Date {
        if (this.time instanceof Date) return this.time;
        if (isString(this.time)) return new Date(this.time);
        if (!isNaN(this.time)) return new Date(this.time);
    }

    getExtendts(gaugeWidth: number, gaugeHeight: number): {cx: number, cy: number, rd: number} {
        const r = minv(gaugeWidth, gaugeHeight);

        return {
            cx: calcPercent(this._centerXDim, gaugeWidth, gaugeWidth / 2),
            cy: calcPercent(this._centerYDim, gaugeHeight, gaugeHeight / 3),
            rd: calcPercent(this._radiusDim, r, r / 2)
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'clock';
    }

    protected override _doLoad(src: any): void {
        super._doLoad(src);

        this._centerXDim = parsePercentSize(pickProp(this.centerX, CircularGauge.DEF_CENTER), true);
        this._centerYDim = parsePercentSize(pickProp(this.centerY, CircularGauge.DEF_CENTER), true);
        this._radiusDim = parsePercentSize(pickProp(this.radius, CircularGauge.DEF_RADIUS), true);
    }
}
