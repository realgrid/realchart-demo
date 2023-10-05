////////////////////////////////////////////////////////////////////////////////
// ClockGauge.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickProp } from "../../common/Common";
import { IPercentSize, RtPercentSize, calcPercent, parsePercentSize } from "../../common/Types";
import { IChart } from "../Chart";
import { ChartItem } from "../ChartItem";
import { CircularGauge, Gauge } from "../Gauge";

export class ClockRim extends ChartItem {

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
        super(gauge.chart);

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

export class ClockHand extends ChartItem {

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
        super(gauge.chart);

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
}

export class ColckTick extends ChartItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: ClockGauge, public length: number) {
        super(gauge.chart);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

/**
 * 시계 게이지 모델.
 * 
 * @config chart.gauge[type=clock]
 */
export class ClockGauge extends Gauge {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
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
     * 명시적으로 false로 설정하면 반대 방향으로 회전한다.
     * 
     * @config
     */
    clockwise = true;
    /**
     * rim 설정 모델.
     * 
     * @config
     */
    rim = new ClockRim(this);
    /**
     * 시침 설정 모델.
     * 
     * @config
     */
    hourHand = new ClockHand(this, 7, '80%');
    /**
     * 분침 설정 모델.
     * 
     * @config
     */
    minuteHand = new ClockHand(this, 5, '50%');
    /**
     * 초침 설정 모델.
     * 
     * @config
     */
    secondHand = new ClockHand(this, 2, '80%');
    /**
     * main tick.
     * 
     * @config
     */
    tick = new ColckTick(this, 10);
    /**
     * minor tick
     * 
     * @config
     */
    minorTick = new ColckTick(this, 5);

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getExtendts(gaugeWidth: number, gaugeHeight: number): {cx: number, cy: number, rd: number} {
        const r = Math.min(gaugeWidth, gaugeHeight);

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

    protected _doLoad(src: any): void {
        super._doLoad(src);

        this._centerXDim = parsePercentSize(pickProp(this.centerX, CircularGauge.DEF_CENTER), true);
        this._centerYDim = parsePercentSize(pickProp(this.centerY, CircularGauge.DEF_CENTER), true);
        this._radiusDim = parsePercentSize(pickProp(this.radius, CircularGauge.DEF_RADIUS), true);
    }
}
