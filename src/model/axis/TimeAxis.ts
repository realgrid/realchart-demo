////////////////////////////////////////////////////////////////////////////////
// TimeAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isNumber, isObject, isString, pickNum, assign, maxv, isStringL } from "../../common/Common";
import { DatetimeFormatter } from "../../common/DatetimeFormatter";
import { Axis, AxisLabel, AxisTick } from "../Axis";
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

// const equals = function (scale: TimeScale, t1: number, t2: number): boolean {
//     const d1 = new Date(t1);
//     const d2 = new Date(t2);

//     if (scale === TimeScale.WEEK) {
//         d1.setHours(0, 0, 0, 0);
//         d2.setHours(0, 0, 0, 0);
//         return d1.setDate(d1.getDate() - d1.getDay()) ===  d2.setDate(d2.getDate() - d2.getDay());
//     }
//     if (d1.getFullYear() !== d2.getFullYear()) return false;
//     if (scale < TimeScale.YEAR && d1.getMonth() !== d2.getMonth()) return false;
//     if (scale < TimeScale.MONTH && d1.getDate() !== d2.getDate()) return false;
//     if (scale < TimeScale.DAY && d1.getHours() !== d2.getHours()) return false;
//     if (scale < TimeScale.HOUR && d1.getMinutes() !== d2.getMinutes()) return false;
//     if (scale < TimeScale.MIN && d1.getSeconds() !== d2.getSeconds()) return false; 
//     if (scale < TimeScale.SEC && d1.getMilliseconds() !== d2.getMilliseconds()) return false; 
//     return true;
// }

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
const time_periods = {
    s: 1,
    n: 2,
    h: 3,
    d: 4,
    w: 5,
    m: 6,
    y: 7
};

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
    /**
     * 단위가 지정된 문자열로 지정하는 경우 값이 -1 이하이거나 1 이상이어야 한다. #141
     */
    "@config stepInerval" = undefined;

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

    protected _isValidInterval(v: any): boolean {
        if (!isNaN(v)) {
            return +v !== 0;
        } else if (isString(v) && time_periods.hasOwnProperty(v.charAt(v.length - 1))) {
            v = parseFloat(v);
            return !isNaN(v) && (v <= -1 || v >= 1);
        } 
    }

    protected _getStepMultiples(step: number): number[] {
        for (let i = TimeScale.MS; i < TimeScale.YEAR; i++) {
            if (step >= time_scales[i] / 2 && step < time_scales[i + 1] / 2) {
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
        let step = maxv(1, Math.floor(len / (count - 1)));
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
                m = calcedMin.getMonth();
                dt = new Date(calcedMin.getFullYear(), m);
            }
            do {
                steps.push(+dt);
                dt.setMonth(dt.getMonth() + step);
            } while (dt <= maxDate);

        } else if (this.scale === TimeScale.DAY || this.scale === TimeScale.WEEK) {
            let y = dt.getFullYear();
            let m = dt.getMonth();
            let d = dt.getDate();
            const inc = this.scale === TimeScale.WEEK ? 7 : 1;

            this._step = step = Math.ceil(step);
            dt = new Date(y, m, d);

            if (dt < calcedMin && new Date(y, m, d + inc * step) > calcedMin) {
                d = calcedMin.getDate();
                dt = new Date(calcedMin.getFullYear(), calcedMin.getMonth(), d);
            }
            do {
                steps.push(+dt);
                dt.setDate(dt.getDate() + step * inc);
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

    protected _getStepsByInterval(interval: any, base: number, min: number, max: number): number[] {
        if (isString(interval)) {
            const axis = this.axis as TimeAxis;
            const calcedMin = new Date(axis._calcedMin);
            const steps: number[] = [];
            const scale = interval.charAt(interval.length - 1);
            const step = parseFloat(interval);
            let v: number;
            let dt: Date;

            this.scale = time_periods[scale];
            interval = time_scales[this.scale];

            // scale의 첫날 부터 시작되도록 한다.
            let d = new Date(min);

            switch (this.scale) {
                case TimeScale.YEAR:
                    const yCalced = calcedMin.getFullYear();
                    let yMin = d.getFullYear();

                    d.setMonth(0, 1);
                    if (yMin < yCalced && yCalced < yMin + step) {
                        d = new Date(yCalced, 0);
                    }
                    break;

                case TimeScale.MONTH:
                    d.setDate(1);
                    d.setHours(0, 0, 0, 0);

                    dt = new Date(d);
                    dt.setMonth(dt.getMonth() + step);
                    if (d < calcedMin && calcedMin < dt) {
                        d = new Date(calcedMin);
                        d.setDate(1);
                        d.setHours(0, 0, 0, 0);
                    }
                    break;

                case TimeScale.WEEK:
                    // byPixels(...)에서 주초로 맞추지 않는다.
                    // d.setDate(d.getDate() - d.getDay() + this.chart.startOfWeek);
                case TimeScale.DAY:
                    let inc = this.scale === TimeScale.WEEK ? 7 : 1;

                    d.setHours(0, 0, 0, 0);

                    dt = new Date(d);
                    dt.setDate(dt.getDate() + step * inc);
                    if (d < calcedMin && dt > calcedMin) {
                        d = new Date(calcedMin);
                        d.setHours(0, 0, 0, 0);
                    }
                    break;

                case TimeScale.HOUR:
                    d.setMinutes(0);
                case TimeScale.MIN:
                    d.setSeconds(0);
                case TimeScale.SEC:
                    d.setMilliseconds(0);
                    break;
                case TimeScale.MS:
                    break;
            }

            this._step = step;
            min = +d;

            if (!isNaN(base)) {
                steps.push(v = base);
                while (v > min) {
                    steps.unshift(v = this.getNextStep(v, -1));
                }
                v = base;
                while (v < max) {
                    steps.push(v = this.getNextStep(v, 1));
                }
            } else {
                steps.push(v = min);
                while (v < max) {
                    steps.push(v = this.getNextStep(v, 1));
                }
            
            }
            this._step = interval;
            return steps;

        } else {
            return super._getStepsByInterval(interval, base, min, max);
        }
    }
}

const FORMATS = [
    { format: 'SSS', beginningFormat: 'mm:ss' },            // ms
    { format: "ss", beginningFormat: 'mm:ss' },             // s
    { format: "mm:ss", beginningFormat: 'HH:mm:ss'},        // m
    { format: "HH:mm", beginningFormat: 'MM-dd HH:mm' },    // H
    { format: "MM-dd", beginningFormat: 'yyyy-MM-dd' },     // d
    { format: "MM W주", beginningFormat: 'yyyy-MM-dd' },     // w
    { format: "yyyy-MM", beginningFormat: 'yyyy-MM' },      // M
    { format: "yyyy", beginningFormat: 'yyyy' }             // y
]   

export class TimeAxisLabel extends AxisLabel {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _formats: { format: string, beginningFormat: string}[];
    private _formatter: DatetimeFormatter;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 현재 스케일의 시작일시에 상위 스케일의 포맷을 사용해서 표시한다.
     */
    useBeginningFormat = true;
    /**
     * [밀리초, 초, 분, 시, 일, 주, 월, 년] 순서대로 날찌/시간 형식을 지정한다.<br/>
     * 각 형식은 문자열이거나, { format: string, beginningFormat: string} 형태의 json 객체로 지정한다.
     * 지정하지 않은 스케일은 {@link timeFormat}, {@link beginningFormat}이나 기본 형식에 따라 표시된다.
     */
    timeFormats: any[]; // string | { format: string, beginningFormat: string}
    /**
     * 날짜/시간 표시 형식.
     */
    timeFormat: string;
    /**
     * 스케일 시작일시에 표시에 사용되는 형식.
     */
    beginningFormat: string;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoad(source: any): void {
        super._doLoad(source);

        const f1 = isString(this.timeFormat) ? this.timeFormat : void 0;
        const b1 = isString(this.beginningFormat) ? this.beginningFormat : void 0;
        const fmts = this.timeFormats;
        const use = this.useBeginningFormat;

        // this._formatter = (f1 && !b1 && !isArray(fmts)) ? DatetimeFormatter.getFormatter(f1) : void 0;
        this._formats = FORMATS.map(f => assign(f));

        if (f1) {
            this._formats.forEach(f => {
                f.format = f.beginningFormat = f1;
            })
        }
        if (use && b1) {
            this._formats.forEach(f => {
                f.beginningFormat = b1;
            })
        }
        if (isArray(fmts)) {
            for (let i = 0; i < fmts.length; i++) {
                const f = this._formats[i];

                // if (f1) {
                //     f.format = f1;
                //     f.beginningFormat = b1 || f1;                    
                // } else {
                    const fmt = fmts[i];
    
                    if (isStringL(fmt)) {
                        // f.format = f.beginningFormat = fmt;
                        f.format = fmt;
                    } else if (isObject(fmt)) {
                        if (isStringL(fmt.format)) f.format = fmt.format;
                        if (use && isStringL(fmt.beginningFormat)) f.beginningFormat = fmt.beginningFormat;
                    }
                // }
            }
        }
    }

    getTick(index: number, v: any): string {
        const chart = this.chart;
        const axis = this.axis as TimeAxis;
        const d = axis.date(v);

        if (this._formatter) {
            return this._formatter.toStr(d, chart.startOfWeek);
        }

        const fmts = this._formats;
        const scale = (axis.tick as TimeAxisTick).scale;
        const ft = DatetimeFormatter.getFormatter;

        switch (scale) {
            case TimeScale.YEAR:
                return ft(fmts[scale].format).toStr(d, chart.startOfWeek);
            case TimeScale.MONTH:
                if (index === 0 || d.getMonth() === 0) {
                    return ft(fmts[scale].beginningFormat).toStr(d, chart.startOfWeek);
                } else {
                    return ft(fmts[scale].format).toStr(d, chart.startOfWeek);
                }      
            case TimeScale.WEEK:
            case TimeScale.DAY:
                if (index === 0 || d.getDate() === 1) {
                    return ft(fmts[scale].beginningFormat).toStr(d, chart.startOfWeek);
                } else {
                    return ft(fmts[scale].format).toStr(d, chart.startOfWeek);
                }      
            case TimeScale.HOUR:
                if (index === 0 || d.getHours() === 0) {
                    return ft(fmts[scale].beginningFormat).toStr(d, chart.startOfWeek);
                } else {
                    return ft(fmts[scale].format).toStr(d, chart.startOfWeek);
                }
            case TimeScale.MIN:
                if (index === 0 || d.getMinutes() === 0) {
                    return ft(fmts[scale].beginningFormat).toStr(d, chart.startOfWeek);
                } else {
                    return ft(fmts[scale].format).toStr(d, chart.startOfWeek);
                }
            case TimeScale.SEC:
                if (index === 0 || d.getSeconds() === 0) {
                    return ft(fmts[scale].beginningFormat).toStr(d, chart.startOfWeek);
                } else {
                    return ft(fmts[scale].format).toStr(d, chart.startOfWeek);
                }
            case TimeScale.MS:
                if (index === 0 || d.getMilliseconds() === 0) {
                    return ft(fmts[scale].beginningFormat).toStr(d, chart.startOfWeek);
                } else {
                    return ft(fmts[scale].format).toStr(d, chart.startOfWeek);
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
    _offset: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    init(): Axis {
        super.init();

        this.baseValue = NaN;
        return this;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * @override
     * @config
     */
    readonly label: TimeAxisLabel;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'time';
    }

    protected _createTickModel(): AxisTick {
        return new TimeAxisTick(this);
    }

    protected _createLabel(): AxisLabel {
        return new TimeAxisLabel(this);
    }

    protected _doLoad(source: any): void {
        super._doLoad(source);

        if (!source || !source.label) {
            this.label.load(null);
        }
    }

    collectValues(): void {
        this._offset = pickNum(this.chart.timeOffset, 0) * 60 * 1000;
        super.collectValues();
    }

    getValue(value: any): number {
        if (isNumber(value)) {  
            return value;
        } else if (value instanceof Date) {
            return value.getTime();
        } else if (isString(value)) { // 표준시로 읽어들인다.
            return new Date(value).getTime() + this._offset;
        }
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
                    case 'w':
                        d.setDate(d.getDate() + 7 * v);
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
            return value;
        } else {
            return value + step;
        }
    }

    date(value: number): Date {
        return new Date(value);
    }

    axisValueAt(length: number, pos: number): any {
        return new Date(this.valueAt(length, pos));
    }

    value2Tooltip(value: number): any {
        return isNaN(value) ? this.chart.tooltip.nanText : new Date(value);
    }

    getXValue(value: number) {
        return isNaN(value) ? NaN : new Date(value);
    }

    override getPos(length: number, value: number): number {
        return super.getPos(length, value);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}