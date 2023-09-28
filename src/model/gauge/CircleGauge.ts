////////////////////////////////////////////////////////////////////////////////
// CircleGauge.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IChart } from "../Chart";
import { CircularGauge, Gauge, IGaugeValueRange } from "../Gauge";

/**
 * 시계 게이지 모델.
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
     * true면 {@link ranges}에 설정된 범위별로 gauge를 다른 색으로 표시한다.
     * false면 값에 따라 해당하는 range의 설정에 따라 gauge 전체를 표시한다.
     * 
     * @config
     */
    stepped = false;
    /**
     * 값 범위 목록.
     * {@link stepped} 설정에 따라 다르게 사용된다.
     * 
     * @config
     */
    ranges: IGaugeValueRange[];

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

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'circle';
    }

    protected _doLoad(src: any): void {
        super._doLoad(src);

        this._ranges = Gauge.buildRanges(src?.ranges, this.minValue, this.maxValue);
    }
}
