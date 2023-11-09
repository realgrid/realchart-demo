////////////////////////////////////////////////////////////////////////////////
// TimeAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNumber, isObject, isString, pickNum } from "../../common/Common";
import { DatetimeFormatter } from "../../common/DatetimeFormatter";
import { isNull, pad2 } from "../../common/Types";
import { AxisLabel, AxisTick, IAxisTick } from "../Axis";
import { IChart } from "../Chart";
import { ContinuousAxis, ContinuousAxisTick } from "./LinearAxis";

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

/**
 * @internal
 * 
 * [주의] javascript에서 숫자값을 Date로 변환하거나, Date를 숫자로 변환할 때는 모두 new Date가 기준이 된다.
 */
export class TimeAxisTick extends ContinuousAxisTick {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    scale: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    getNextStep(curr: number, delta: number): number {
        const t = new Date(curr);
        
        delta *= this._step;

        switch (this.scale) {
            case TimeScale.YEAR:
                t.setFullYear(t.getFullYear() + delta);
                break;
            case TimeScale.MONTH:
                t.setMonth(t.getMonth() + delta);
                break;
            case TimeScale.WEEK:
                t.setDate(t.getDate() + delta * 7);
                break;
            case TimeScale.DAY:
                t.setDate(t.getDate() + delta);
                break;
            case TimeScale.HOUR:
                t.setHours(t.getHours() + delta);
                break;
            case TimeScale.MIN:
                t.setMinutes(t.getMinutes() + delta);
                break;
            case TimeScale.SEC:
                t.setSeconds(t.getSeconds() + delta);
                break;
            case TimeScale.MS:
                t.setMilliseconds(t.getMilliseconds() + delta);
                break;
        }
        return +t;
    }

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

    protected _getStepsByPixels(length: number, pixels: number, base: number, min: number, max: number): number[] {
        const steps: number[] = [];
        const len = max - min;

        if (len === 0) {
            return steps;
        }

        const axis = this.axis as TimeAxis;
        const calcedMin = new Date(axis._calcedMin);
        let count = Math.floor(length / this.stepPixels) + 1;
        let step = Math.max(1, Math.floor(len / (count - 1)));
        const multiples = this._getStepMultiples(step);
        const scale = time_scales[this.scale];

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
            } else {
                step = multiples[0];
            }
        }

        const minDate = axis.date(min);
        const maxDate = axis.date(max);
        let dt = minDate;
        let t: number;

        if (this.scale === TimeScale.YEAR) {
            const yCalced = calcedMin.getFullYear();
            let y = dt.getFullYear();

            this._step = step = Math.ceil(step);
            dt = new Date(y, 0);

            // 가능한 시리즈 포인트들의 최소 년도가 tick에 표시될 수 있도록 한다.
            // TODO: 다른 구현 방법이 있지 않을까?
            if (y < yCalced && y + step > yCalced) {
                y = yCalced;
                dt = new Date(y, 0);
            }
            do {
                steps.push(+dt);
                y += step;
                dt = new Date(y, 0)
            } while (dt <= maxDate);

        } else if (this.scale === TimeScale.MONTH) {
            let y = dt.getFullYear();
            let m = dt.getMonth();

            this._step = step = Math.ceil(step);
            dt = new Date(y, m);

            if (dt < calcedMin && new Date(y, m + step) > calcedMin) {
                dt = new Date(calcedMin.getFullYear(), calcedMin.getMonth());
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
            const inc = this.scale === TimeScale.WEEK ? 7 : 1;

            this._step = step = Math.ceil(step);
            dt = new Date(y, m, d);

            if (dt < calcedMin && new Date(y, m, d + inc * step) > calcedMin) {
                dt = new Date(calcedMin.getFullYear(), calcedMin.getMonth(), calcedMin.getDate());
            }
            do {
                steps.push(+dt);
                d += step * inc;
                dt = new Date(y, m, d)
            } while (dt <= maxDate);

        } else {
            this._step = step;
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
            const t2 = calcedMin.getTime();

            if (t < t2 && t + step > t2) {
                t = t2;
            }
            // if (t < min) {
            //     t += 1;//step;
            // }

            do {
                steps.push(t);
                t += step;
            } while (t <= max);
        }
        return steps;
    }
}

const FORMATS = [
    { format: 'SSS', beginningFormat: 'mm:ss' },            // ms
    { format: "ss", beginningFormat: 'mm:ss' },             // s
    { format: "mm:ss", beginningFormat: 'HH:mm:ss'},        // m
    { format: "HH:mm", beginningFormat: 'MM-dd' },          // H
    { format: "MM-dd", beginningFormat: 'yyyy-MM' },        // d
    { format: "W주 w", beginningFormat: 'yyyy-MM' },        // w
    { format: "yyyy-MM", beginningFormat: 'yyyy-MM' },      // M
    { format: "yyyy" }                                      // y
]   

export class TimeAxisLabel extends AxisLabel {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _formats: { format: string, beginningFormat: string}[];

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 현재 스케일의 시작일시에 상위 스케일의 포맷을 사용해서 표시한다.
     */
    useBeginningFormat = true;
    /**
     * [밀리초, 초, 분, 시, 일, 주, 월, 년] 순서대로 날찌/시간 형식을 지정한다.
     * 각 형식은 문자열이거나, { format: string, beginningFormat: string} 형태의 json 객체로 지정한다.
     * 지정하지 않은 스케일은 기본 형식에 따라 표시된다.
     */
    timeFormats: any[]; // string | { format: string, beginningFormat: string}
    /**
     * 날짜/시간 표시 형식.
     * 이 속성이 지정되면 timeFormats는 무시된다.
     */
    timeFormat: string;
    /**
     * 스케일 시작일시에 표시에 사용되는 형식.
     */
    beginningFormat: string;
    /**
     * 한 주의 시작 요일.
     */
    startOfWeek = 0;    // 0: 일요일, 1: 월요일

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoad(source: any): void {
        super._doLoad(source);

        const f1 = isString(this.timeFormat) ? this.timeFormat : void 0;
        const b1 = isString(this.beginningFormat) ? this.beginningFormat : void 0;
        const fmts = this.timeFormats;
        const use = this.useBeginningFormat;

        this._formats = FORMATS.map(f => Object.assign(f));

        if (isArray(fmts)) {
            for (let i = 0; i < fmts.length; i++) {
                const f = this._formats[i];

                if (f1) {
                    f.format = f1;
                    f.beginningFormat = b1 || f1;                    
                } else {
                    const fmt = fmts[i];
    
                    if (isString(fmt)) {
                        f.format = fmt;
                        if (!use) f.beginningFormat = fmt;
                    } else if (isObject(fmt)) {
                        if (isString(fmt.format)) f.format = fmt.format;
                        if (isString(fmt.beginningFormat)) f.beginningFormat = fmt.beginningFormat;
                        else if (!use) f.beginningFormat = f.format;
                    }
                }
            }
        }
    }

    getTick(index: number, v: any): string {
        const axis = this.axis as TimeAxis;
        const fmts = this._formats;
        const scale = (axis.tick as TimeAxisTick).scale;
        const d = axis.date(v);
        let t: number;

        switch (scale) {
            case TimeScale.YEAR:
                return DatetimeFormatter.getFormatter(fmts[scale].format).toStr(d, this.startOfWeek);
            case TimeScale.MONTH:
                if (index === 0 || d.getMonth() === 0) {
                    return DatetimeFormatter.getFormatter(fmts[scale].beginningFormat).toStr(d, this.startOfWeek);
                } else {
                    return DatetimeFormatter.getFormatter(fmts[scale].format).toStr(d, this.startOfWeek);
                }      
            case TimeScale.WEEK:
            case TimeScale.DAY:
                if (index === 0 || d.getDate() === 1) {
                    return DatetimeFormatter.getFormatter(fmts[scale].beginningFormat).toStr(d, this.startOfWeek);
                } else {
                    return DatetimeFormatter.getFormatter(fmts[scale].format).toStr(d, this.startOfWeek);
                }      
            case TimeScale.HOUR:
                if (index === 0 || d.getHours() === 0) {
                    return DatetimeFormatter.getFormatter(fmts[scale].beginningFormat).toStr(d, this.startOfWeek);
                } else {
                    return DatetimeFormatter.getFormatter(fmts[scale].format).toStr(d, this.startOfWeek);
                }
            case TimeScale.MIN:
                if (index === 0 || d.getMinutes() === 0) {
                    return DatetimeFormatter.getFormatter(fmts[scale].beginningFormat).toStr(d, this.startOfWeek);
                } else {
                    return DatetimeFormatter.getFormatter(fmts[scale].format).toStr(d, this.startOfWeek);
                }
            case TimeScale.SEC:
                if (index === 0 || d.getSeconds() === 0) {
                    return DatetimeFormatter.getFormatter(fmts[scale].beginningFormat).toStr(d, this.startOfWeek);
                } else {
                    return DatetimeFormatter.getFormatter(fmts[scale].format).toStr(d, this.startOfWeek);
                }
            case TimeScale.MS:
                if (index === 0 || d.getMilliseconds() === 0) {
                    return DatetimeFormatter.getFormatter(fmts[scale].beginningFormat).toStr(d, this.startOfWeek);
                } else {
                    return DatetimeFormatter.getFormatter(fmts[scale].format).toStr(d, this.startOfWeek);
                }
        }
     }
}

/**
 *  timeUnit(기본값 1)밀리초가 1에 해당한다.
 * 
 * @config chart.xAxis[type=time]
 * @config chart.yAxis[type=time]
 */
export class TimeAxis extends ContinuousAxis {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    // private _zone = new Date().getTimezoneOffset();
    private _offset: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, isX: boolean, name?: string) {
        super(chart, isX, name);

        this.baseValue = NaN;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * @override
     * @config
     */
    readonly label: TimeAxisLabel;

    /**
     * javascript에서 숫자 단위로 전달되는 날짜값은 기본적으로 local이 아니라 new Date 기준이다.
     * 그러므로 보통 숫자로 지정된 날짜값은 utc 값이다.
     * local 기준으로 표시하기 위해, 숫자로 지정된 날짜값에 더해야 하는 시간을 시간단위로 지정한다.
     * ex) 한국은 -9
     * 
     * @config
     */
    timeOffset = 0;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'time';
    }

    protected _createTickModel(): AxisTick {
        return new TimeAxisTick(this);
    }

    protected _createLabelModel(): AxisLabel {
        return new TimeAxisLabel(this);
    }

    protected _doLoad(source: any): void {
        super._doLoad(source);

        if (!source || !source.label) {
            this.label.load(null);
        }
    }

    collectValues(): void {
        this._offset = pickNum(this.timeOffset, 0) * 60 * 60 * 1000;
        super.collectValues();
    }

    protected _adjustMinMax(min: number, max: number): { min: number; max: number; } {
        const v = super._adjustMinMax(min, max);
        return v;
    }

    getValue(value: any): number {
        if (isNumber(value)) {  
            return value + this._offset;
        } else if (value instanceof Date) {
            return value.getTime();
        } else if (isString(value)) {
            return new Date(value).getTime();
        }
        return 0;
    }

    incStep(value: number, step: any): number {
        if (isString(step)) {
            const v = parseFloat(step);

            if (v != 0) {
                let d = new Date(value);

                switch (step.charAt(step.length - 1)) {
                    case 'y':
                        d.setFullYear(d.getFullYear() + v);
                        break;
                    case 'm':
                        d.setMonth(d.getMonth() + v);
                        break;
                    case 'd':
                        d.setDate(d.getDate() + v);
                        break;
                    case 'h':
                        d.setHours(d.getHours() + v);
                        break;
                    case 'n':
                        d.setMinutes(d.getMinutes() + v);
                        break;
                    case 's':
                        d.setSeconds(d.getSeconds() + v);
                        break
                }
                return +d;
            }
        } else {
            return value + step;
        }
    }

    date(value: number): Date {
        return new Date(value);
    }

    getAxisValueAt(length: number, pos: number): any {
        return new Date(this.getValueAt(length, pos));
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}