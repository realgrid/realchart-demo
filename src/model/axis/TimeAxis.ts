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
    MONTH,
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
    [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500],  // ms
    [1, 2, 5, 10, 15, 30],                          // sec
    [1, 2, 3, 4, 6, 8, 12],                         // min
    [1, 2, 3, 4, 6, 12],                            // hour
    [1, 2],                                         // day
    [1, 2],                                         // week
    [1, 2, 3, 4, 6]                                 // mon
]

export class TimeAxisTick extends LinearAxisTick {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    scale: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getStepMultiples(step: number): number[] {
        for (let i = TimeScale.MS; i < TimeScale.YEAR; i++) {
            if (step >= time_scales[i] && step < time_scales[i + 1] / 2) {
                // if (step <= time_scales[i]) {
                this.scale = i;
                return time_multiples[i];
            }
        }
        this.scale = TimeScale.YEAR;
    }

    buildSteps(length: number, base: number, min: number, max: number): number[] {
        const steps = super.buildSteps(length, base, min, max);

        return steps;
    }

    protected _getStepsByPixels(length: number, pixels: number, base: number, min: number, max: number): number[] {
        const len = max - min;

        if (len === 0) {
            return [];
        }

        const axis = this.axis as TimeAxis;
        let count = Math.floor(length / this.stepPixels) + 1;
        let step = Math.floor(len / (count - 1));
        // const scale = Math.pow(10, Math.floor(Math.log10(step)));
        const multiples = this._getStepMultiples(step);
        const scale = time_scales[this.scale];
        const steps: number[] = [];
        let v: number;

        step = step / scale;
        if (multiples) {
            if (step > multiples[0]) {
                let i = 0;
                for (; i < multiples.length - 1; i++) {
                    if (step > multiples[i] && step < multiples[i + 1]) {
                        step = multiples[i + 1];
                        break;
                    }
                }
                if (i >= multiples.length) {
                    debugger;
                    step = multiples[multiples.length - 1];
                }
            } else {
                step = multiples[0];
            }
        }

        const minDate = axis.date(min);
        const maxDate = axis.date(max);
        let dt = minDate;
        let t: number;

        if (this.scale === TimeScale.YEAR) {
            let y = dt.getFullYear();

            // step = Math.round(step);
            step = Math.ceil(step);
            dt = new Date(y, 0);

            if (dt < minDate) {
                y += step;
                dt = new Date(y, 0)
            }
            do {
                steps.push(+dt);
                y += step;
                dt = new Date(y, 0)
            } while (dt <= maxDate);
        } else if (this.scale === TimeScale.MONTH) {
            let y = dt.getFullYear();
            let m = dt.getMonth();

            // step = Math.round(step);
            step = Math.ceil(step);
            dt = new Date(y, m);

            if (dt < minDate) {
                m += step;
                dt = new Date(y, m);
            }
            do {
                steps.push(+dt);
                m += step;
                dt = new Date(y, m)
            } while (dt <= maxDate);
        } else if (this.scale === TimeScale.DAY || this.scale === TimeScale.WEEK) {
            let y = dt.getFullYear();
            let m = dt.getMonth();
            let d = dt.getDate();

            // step = Math.round(step);
            step = Math.ceil(step);
            dt = new Date(y, m, d);

            if (dt < minDate) {
                d += step;
                dt = new Date(y, m, d);
            }
            do {
                steps.push(+dt);
                d += step * (this.scale === TimeScale.WEEK ? 7 : 1);
                dt = new Date(y, m, d)
            } while (dt <= maxDate);
        } else {
            step *= scale;

            switch (this.scale) {
                case TimeScale.HOUR:
                    dt.setMinutes(0);
                case TimeScale.MIN:
                    dt.setSeconds(0);
                case TimeScale.SEC:
                    dt.setMilliseconds(0);
                    break;
            }

            t = dt.getTime();
            if (t < min) {
                t += step;
            }

            do {
                steps.push(t);
                t += step;
            } while (t <= max);
        }

        return steps;
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
    // fields
    //-------------------------------------------------------------------------
    private _offset = new Date().getTimezoneOffset() * 60 * 1000;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart, name);

        this.baseValue = NaN;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * true면 숫자나 문자열 값을 utc date로 생성한다.
     */
    utc: boolean = true;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createTick(): AxisTick {
        return new TimeAxisTick(this);
    }

    protected _adjustMinMax(min: number, max: number): { min: number; max: number; } {
        const v = super._adjustMinMax(min, max);
        return v;
    }

    protected _doBuildTicks(min: number, max: number, length: number): IAxisTick[] {
        const ticks = super._doBuildTicks(min, max, length);

        ticks.forEach(tick => {
            tick.label = this.$_getLabel(tick.value);
        })

        return ticks;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    date(value: number): Date {
        return new Date(value);
        // return this.utc ? new Date(value + this._offset) : new Date(value);
    }

    private $_getLabel(value: number): string {
        const d = this.date(value);

        switch ((this.tick as TimeAxisTick).scale) {
            case TimeScale.YEAR:
                return `${d.getFullYear()}`;
            case TimeScale.MONTH:
                if (d.getMonth() === 0) {
                    return `${d.getFullYear()}-01`;
                } else {
                    return `${d.getMonth() + 1}`;
                }      
            case TimeScale.WEEK:
            case TimeScale.DAY:
                if (d.getDate() === 1) {
                    return `${d.getMonth() + 1}-01`;
                } else {
                    return `${d.getDate()}`;
                }      
            case TimeScale.HOUR:
                if (d.getHours() === 0) {
                    return `${d.getDate()} 00:00`;
                } else {
                    return `${d.getHours()}:00`;
                }
        }
    }
}