////////////////////////////////////////////////////////////////////////////////
// CircleGauge.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RtPercentSize } from "../../common/Types";
import { IChart } from "../Chart";
import { ChartItem } from "../ChartItem";
import { CircularGauge, Gauge, IGaugeValueRange } from "../Gauge";

export class CircleGaugeValueLine extends ChartItem {

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
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: CircleGauge) {
        super(gauge.chart, false);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    offset: RtPercentSize = 0;
    length: RtPercentSize = '100%';
}

export class CircleGaugePin extends ChartItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(gauge: CircleGauge) {
        super(gauge.chart, false);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    radius: RtPercentSize = 7;
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
    line = new CircleGaugeValueLine(this);
    marker = new CircleGaugeValueMarker(this);
    hand = new CircleGaugeHand(this);
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
