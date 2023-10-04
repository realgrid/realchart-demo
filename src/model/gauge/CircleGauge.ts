////////////////////////////////////////////////////////////////////////////////
// CircleGauge.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IPercentSize, RtPercentSize, calcPercent, parsePercentSize } from "../../common/Types";
import { IChart } from "../Chart";
import { ChartItem } from "../ChartItem";
import { CircularGauge, Gauge, IGaugeValueRange } from "../Gauge";

export class CircleGaugeLine extends ChartItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: CircleGauge) {
        super(gauge.chart, true);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

export class CircleGaugeValueMarker extends ChartItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: CircleGauge) {
        super(gauge.chart, false);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

export class CircleGaugeHand extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _radiusDim: IPercentSize;
    private _lengthDim: IPercentSize;
    private _offsetDim: IPercentSize;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: CircleGauge) {
        super(gauge.chart, false);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    radius: RtPercentSize = 3;
    length: RtPercentSize = '100%';
    offset: RtPercentSize = 0;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getExtents(domain: number): {radius: number, length: number, offset: number} {
        return {
            radius: calcPercent(this._radiusDim, domain, 0),
            length: calcPercent(this._lengthDim, domain, 0),
            offset: calcPercent(this._offsetDim, domain, 0)
        };
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    load(source: any): ChartItem {
        super.load(source);

        this._radiusDim = parsePercentSize(this.radius, true);
        this._lengthDim = parsePercentSize(this.length, true);
        this._offsetDim = parsePercentSize(this.offset, true);
        return this;
    }
}

export class CircleGaugePin extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _radiusDim: IPercentSize;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: CircleGauge) {
        super(gauge.chart, false);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    radius: RtPercentSize = 5;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getRadius(domain: number): number {
        return calcPercent(this._radiusDim, domain, 0);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    load(source: any): ChartItem {
        super.load(source);

        this._radiusDim = parsePercentSize(this.radius, true);
        return this;
    }
}

/**
 * 게이지 모델.
 * 
 * @config chart.gauge[type=circle]
 */
export class CircleGauge extends CircularGauge {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _ranges: IGaugeValueRange[];
    private _valRanges: IGaugeValueRange[];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    line = new CircleGaugeLine(this);
    marker = new CircleGaugeValueMarker(this);
    /**
     * 게이지 바늘 설정 모델.
     * 
     * @config
     */
    hand = new CircleGaugeHand(this);
    /**
     * 게이지 중앙에 표시되는 핀 설정 모델.
     * 
     * @config
     */
    pin = new CircleGaugePin(this);
    /**
     * 배경 원호의 범위 목록.
     * 범위별로 다른 스타일을 적용할 수 있다.
     * 
     * @config
     */
    ranges: IGaugeValueRange[];
    /**
     * 값 범위 목록.
     * 범위별로 다른 스타일을 적용할 수 있다.
     * 
     * @config
     */
    valueRanges: IGaugeValueRange[];

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getRange(value: number): IGaugeValueRange | undefined {
        if (this._ranges) {
            for (const r of this._ranges) {
                if (value >= r.startValue && value < r.endValue) {
                    return r;
                }
            }
        }
    }

    getValueRange(value: number): IGaugeValueRange | undefined {
        if (this._valRanges) {
            for (const r of this._valRanges) {
                if (value >= r.startValue && value < r.endValue) {
                    return r;
                }
            }
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'circle';
    }

    protected _doLoad(src: any): void {
        super._doLoad(src);

        this._ranges = Gauge.buildRanges(src?.ranges, this.minValue, this.maxValue);
        this._valRanges = Gauge.buildRanges(src?.valueRanges, this.minValue, this.maxValue);
    }
}
