////////////////////////////////////////////////////////////////////////////////
// TimeAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { AxisTick, IAxisTick } from "../Axis";
import { IChart } from "../Chart";
import { LinearAxis, LinearAxisTick } from "./LinearAxis";

const enum TimeScale {
    MS,
    SEC,
    MIN,
    HOUR,
    DAY,
    WEEK,
    MON,
    YEAR
};

// 밀리초 기준 시간 단위별 크기
const time_scales = [
    1,
    1000,
    60 * 1000,
    60 * 60 * 1000,
    24 * 60 * 60 * 1000,
    7 * 24 * 60 * 60 * 1000,
    28 * 24 * 60 * 60 * 1000,    // 최소 월 일수
    364 * 24 * 60 * 60 * 1000    // 최소 연 일수
];

const time_multiples = [
    [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500],
    [1, 2, 5, 10, 15, 30],
    [1, 2, 3, 4, 6, 8, 12],
    [1, 2, 3],
    [1, 2],
    [1, 2, 3, 4, 6]
]

export class TimeAxisTick extends LinearAxisTick {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getStepMultiples(step: number): number[] {
        for (let i = TimeScale.MS; i < TimeScale.YEAR; i++) {
            if (step <= time_scales[i]) {
                return time_multiples[i];
            }
        }
        return null;
    }
}

/**
 *  timeUnit(기본값 1)밀리초가 1에 해당한다.
 */
export class TimeAxis extends LinearAxis {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart, name);

        this.baseValue = NaN;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createTick(): AxisTick {
        return new TimeAxisTick(this);
    }

    protected _doBuildTicks(min: number, max: number, length: number): IAxisTick[] {
        return;
    }
}