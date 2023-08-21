////////////////////////////////////////////////////////////////////////////////
// LinearAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, pickNum } from "../../common/Common";
import { IPercentSize, RtPercentSize, SizeValue, assert, calcPercent, ceil, fixnum, parsePercentSize } from "../../common/Types";
import { Axis, AxisItem, AxisTick, IAxisTick } from "../Axis";
import { DataPoint } from "../DataPoint";

export class LinearAxisTick extends AxisTick {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    stepSize: number;
    stepPixels = 72;
    stepCount: number;
    steps: number[];
    /**
     * true면 소수점값이 표시되지 않도록 한다.
     */
    integral = false;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    buildSteps(length: number, base: number, min: number, max: number): number[] {
        let pts: number[];

        if (Array.isArray(this.steps)) {
            // 지정한 위치대로 tick들을 생성한다.
            pts = this.steps.slice(0);
        } else if (this.stepCount > 0) {
            pts = this._getStepsByCount(this.stepCount, base, min, max);
        } else if (this.stepSize > 0) {
            pts = this._getStepsBySize(this.stepSize, base, min, max);
        } else if (this.stepPixels > 0) {
            pts = this._getStepsByPixels(length, this.stepPixels, base, min, max);
        } else {
            pts = [min, max];
        }
        return pts;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _getStepsByCount(count: number, base: number, min: number, max: number): number[] {
        if (min > base) {
            min = base;
            base = NaN;
        } else if (max < base) {
            max = base;
            base = NaN;
        }

        const integral = isNaN(base) && this.integral;
        const len = max - min;
        let step = len / (count - 1);
        const scale = Math.pow(10, Math.floor(Math.log10(step)));
        const steps: number[] = [];

        step = Math.ceil(step / scale) * scale;

        if (!isNaN(base)) { // min이 base 아래, max가 base 위에 있다.
            assert(min < base && max > base, "base error");
            count = Math.max(3, count);

            while (true) {
                const n = ceil((base - min) / step) + ceil((max - base) / step) + 1; // +1은 base
                if (n > count) {
                    step += scale;
                } else {
                    break;
                }
            }
            min = base - ceil((base - min) / step) * step;

        } else {
            if (min > Math.floor(min / scale) * scale) {
                min = Math.floor(min / scale) * scale;
            } else if (min < Math.ceil(min / scale) * scale) {
                min = Math.ceil(min / scale) * scale;
            }
        }

        steps.push(min);
        for (let i = 1; i < count; i++) {
            steps.push(fixnum(steps[i - 1] + step));
        }
        return steps;
    }

    protected _getStepsBySize(size: number, base: number, min: number, max: number): number[] {
        const steps: number[] = [];
        let v: number;

        if (!isNaN(base)) {
            steps.push(v = base);
            while (v > min) {
                steps.unshift(v -= size);
            }
            v = base;
            while (v < max) {
                steps.push(v += size);
            }
        } else {
            steps.push(v = min);
            while (v < max) {
                steps.push(v += size);
            }
        }
        return steps;
    }

    protected _getStepMultiples(step: number): number[] {
        return [1, 2, 2.5, 5, 10];
    }

    protected _getStepsByPixels(length: number, pixels: number, base: number, min: number, max: number): number[] {
        if (min >= base) {
            min = base;
            base = NaN;
        } else if (max <= base) {
            max = base;
            base = NaN;
        }

        const len = max - min;

        if (len === 0) {
            return [];
        }

        let count = Math.floor(length / this.stepPixels) + 1;
        let step = len / (count - 1);
        const scale = Math.pow(10, Math.floor(Math.log10(step)));
        const multiples = this._getStepMultiples(step);
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
        step *= scale;

        if (!isNaN(base)) { // min이 base 아래, max가 base 위에 있다.
            assert(min < base && max > base, "base error");
            count = Math.max(3, count);

            while (true) {
                const n = ceil((base - min) / step) + ceil((max - base) / step) + 1; // +1은 base
                if (n > count) {
                    step += scale;
                } else {
                    break;
                }
            }
            min = base - ceil((base - min) / step) * step;

        } else {
            if (min > Math.floor(min / scale) * scale) {
                min = Math.floor(min / scale) * scale;
            } else if (min < Math.ceil(min / scale) * scale) {
                min = Math.ceil(min / scale) * scale;
            }
        }

        steps.push(fixnum(v = min));
        while (v < max) {
            steps.push(fixnum(v += step));
        }
        return steps;
    }
}

/**
 * from에서 to 이전까지의 값은 from으로 표시된다.
 * space는 break line 등을 표시하기 위한 공간.
 * 
 * 1. to가 from보다 커야 한다.
 * 2. ratio가 0보다 크고 1보다 작은 값으로 반드시 설정돼야 한다.
 * 3. 이전 break의 ratio보다 큰 값으로 설정돼야 한다.
 * 4. 1, 2, 3 중 하나라도 위반하면 병합에서 제외시킨다.
 * 5. 이전 범위와 겹치면 병합된다.
 */
export class AxisBreak extends AxisItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    enabled = true;
    from: number;
    to: number;
    size: RtPercentSize = '30%';
    space = 12;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _sizeDim: IPercentSize;
    _sect: AxisBreakSect;

    //-------------------------------------------------------------------------
    // method
    //-------------------------------------------------------------------------
    getSize(domain: number): number {
        return calcPercent(this._sizeDim, domain);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoad(source: any): void {
        super._doLoad(source);

        this.space = pickNum(this.space, 0);
        this._sizeDim = parsePercentSize(this.size, false);
    }
}

interface AxisBreakSect {
    from: number;
    to: number;
    pos: number;
    len: number;
}

export abstract class ContinuousAxis extends Axis {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _hardMin: number;
    private _hardMax: number;
    private _min: number;
    private _max: number;
    private _base: number;
    private _unitLen: number;

    private _runBreaks: AxisBreak[];
    private _sects: AxisBreakSect[];
    private _lastSect: AxisBreakSect;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * data point의 이 축 값이 NaN일 때도 point를 표시할 지 여부.
     */
    nullable = true;
    /**
     */
    baseValue: number;
    /**
     * baseValue가 설정되고,
     * 계산된 최소값이 baseValue보다 작고 최대값이 baseValue보다 클 때,
     * min max를 둘 중 큰 절대값으로 맞춘다.
     * 두 시리즈가 양쪽으로 벌어지는 컬럼/바 시리즈에 활용할 수 있다.
     */
    syncMinMax = false;

    /**
     * {@link minPadding}, {@link maxPadding}의 기본값이다.
     */
    padding = 0.05;
    /**
     * 첫번째 tick 앞쪽에 추가되는 최소 여백을 축 길이에 대한 상대값으로 지정한다.
     * <br>
     * 이 값을 지정하지 않으면 {@link padding}에 지정된 값을 따른다.
     * data point의 최소값과 첫번째 tick 사이에 이미 그 이상의 간격이 존재한다면 무시된다.
     * {@link strictMin}이 지정돼도 이 속성은 무시된다.
     */
    minPadding: number;
    /**
     * 마지막 tick 뒤쪽에 추가되는 최소 여백을 축 길이에 대한 상대값으로 지정한다.
     * <br>
     * 이 값을 지정하지 않으면 {@link padding}에 지정된 값을 따른다.
     * data point의 최대값과 마지막 tick 사이에 이미 그 이상의 간격이 존재한다면 무시된다.
     * {@link strictMax}가 지정돼도 이 속성은 무시된다.
     */
    maxPadding: number;

    /** y축으로 사용될 때만 적용한다. */
    readonly breaks: AxisBreak[] = [];

    getBaseValue(): number {
        return this.baseValue;
    }

    axisMin(): number {
        return this._min;
    }

    axisMax(): number {
        return this._max;
    }

    hasBreak(): boolean {
        return !!this._runBreaks;
    }

    runBreaks(): AxisBreak[] {
        return this._runBreaks && this._runBreaks.slice(0);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    contains(value: number): boolean {
        return !isNaN(value);
        // return (this.nullable && isNaN(value)) || super.contains(value);
    }

    protected _createTick(): AxisTick {
        return new LinearAxisTick(this);
    }

    protected _doLoadProp(prop: string, value: any): boolean {
        if (prop ==='break') {
            this.$_loadBreaks(value);
            return true;
        }
        return super._doLoadProp(prop, value);
    }

    protected _doPrepareRender(): void {
        // const base = this.baseValue;

        this._hardMin = this.min;
        this._hardMax = this.max;

        // if (this._series.find(s => s.ignoreAxisBase(this))) {
        //     this._base = NaN;
        // } else {
        //     this._base = pickNum(+base, 0);
        // }

        this._base = parseFloat(this.baseValue as any);

        this._unitLen = NaN;
    }

    protected _doBuildTicks(calcedMin: number, calcedMax: number, length: number): IAxisTick[] {
        const tick = this.tick as LinearAxisTick;
        let { min, max } = this._adjustMinMax(calcedMin, calcedMax);
        let steps = tick.buildSteps(length, this._base, min, max);
        const ticks: IAxisTick[] = [];

        this._setMinMax(
            min = Math.min(min, steps[0]), 
            max = Math.max(max, steps[steps.length - 1])
        );

        if (min !== max) {
            if (this._runBreaks) {
                steps = this.$_getBrokenSteps(this._runBreaks, length, min, max);
            }
    
            for (let i = 0; i < steps.length; i++) {
                ticks.push({
                    pos: this.getStepPosition(length, steps[i]),
                    value: steps[i],
                    label: this.tick.getTick(steps[i]) || String(steps[i])
                });
            }
        }
        return ticks;
    }

    private $_buildBrokenSteps(sect: AxisBreakSect): number[] {
        const tick = this.tick as LinearAxisTick;
        const steps = tick.buildSteps(sect.len, void 0, sect.from, sect.to);

        return steps;
    }

    private $_getBrokenSteps(breaks: AxisBreak[], len: number, min: number, max: number): number[] {
        let p = 0;
        let start = min;
        const steps: number[] = [start];
        const sects = this._sects = [];
        
        len -= breaks.reduce((a, c) => a + c.space, 0);

        breaks.forEach(br => {
            const sz = br.getSize(len);
            const sect = {
                from: start,
                to: br.from,
                pos: p,
                len: sz
            };

            p += sz;

            sects.push(sect, br._sect = {
                from: br.from,
                to: br.to,
                pos: p,
                len: br.space
            })

            p += br.space;

            const steps2 = this.$_buildBrokenSteps(sect);

            steps2.forEach(s => {
                if (s > sect.from && s <= sect.to) {
                    steps.push(s);
                }
            })
            if (br.space > 0) {
                steps.push(br.to);
            }
        });

        const last = breaks[breaks.length - 1];

        if (max > last.to) {
            const sect = {
                from: last.to,
                to: max,
                pos: p,
                len: this._length - p
            };

            sects.push(sect);

            const steps2 = this.$_buildBrokenSteps(sect);
            steps2.forEach(s => {
                if (s > sect.from && s <= sect.to) {
                    steps.push(s);
                }
            })
        }

        this._lastSect = sects[sects.length - 1];
        return steps;
    }

    getPosition(length: number, value: number): number {
        if (this._runBreaks) {
            const sect = this._sects.find(s => value < s.to) || this._lastSect;
            const p = sect.len * (value - sect.from) / (sect.to - sect.from);

            return (this.reversed ? length - p : p) + sect.pos;
        } else {
            const p = length * (value - this._min) / (this._max - this._min);

            return this.reversed ? length - p : p;
        }
    }

    getStepPosition(length: number, value: number): number {
        return this.getPosition(length, value);
    }

    getUnitLength(length: number, value: number): number {
        if (isNaN(this._unitLen)) {
            this._unitLen = this.$_calcUnitLength(length);
        }
        return this._unitLen;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _adjustMinMax(min: number, max: number): { min: number, max: number } {
        const base = this._base;
        const minPad = this._minPad;
        const maxPad = this._maxPad;

        if (!isNaN(base)) {
            if (this.syncMinMax && min <= base && max >= base) {
                const v = Math.max(Math.abs(min), Math.abs(max));
    
                max = base + v;
                min = base - v;
            }
        }
         
        if (!isNaN(this._hardMin)) {
            min = this._hardMin;
            if (base < min) this._base = NaN;
        }
        if (!isNaN(this._hardMax)) {
            max = this._hardMax;
            if (base > max) this._base = NaN;
        }

        let len = Math.max(0, max - min);

        min -= len * this._minPad;
        max += len * this._maxPad;

        return { min, max };
    }

    protected _setMinMax(min: number, max: number): void {
        this._min = min;
        this._max = max;
    }

    protected $_calcUnitLength(length: number): number {
        const pts: DataPoint[] = [];

        this._series.forEach(ser => {
            if (ser.visible && ser.clusterable()) {
                pts.push(...ser.getVisiblePoints());
            }
        })

        const isX = this._isX;
        const vals = pts.map(p => isX ? p.xValue : p.yValue).sort();
        let min = vals[1] - vals[0];

        for (let i = 2; i < vals.length; i++) {
            min = Math.min(vals[i] - vals[i - 1]);
        }

        // 이 축에 연결된 clsuterable 시리즈들의 point 최소 간격.
        length *= min / (this._max - this._min);
        return this._unitLen = pickNum(length, 1);
    }
    private $_loadBreak(source: any): AxisBreak {
        if (isObject(source) && 'from' in source && 'to' in source) {
            return new AxisBreak(this).load(source) as AxisBreak;
        }
    }

    private $_loadBreaks(source: any): void {
        if (isArray(source)) {
            for (let src of source) {
                const br = this.$_loadBreak(src);
                br && this.breaks.push(br);
            }
        } else if (source) {
            const br = this.$_loadBreak(source);
            br && this.breaks.push(br);
        }
        this.$_mergeBreaks();
    }

    /**
     * 1. rate가 0보다 크고 1보다 작은 값으로 반드시 설정돼야 한다.
     * 2. 이전 break의 rate보다 큰 값으로 설정돼야 한다.
     * 3. 1, 2 중 하나라도 위반하면 병합에서 제외시킨다.
     */
    private $_mergeBreaks(): void {

        function intersects(br1: AxisBreak, br2: AxisBreak): boolean {
            return br2.from < br1.to;
        }

        function merge(br1: AxisBreak, br2: AxisBreak): void {
            br1.to = br2.to;
        }

        const breaks = this.breaks.sort((b1, b2) => b1.from - b2.from).filter(b => b.to > b.from);

        this._runBreaks = null;

        if (breaks.length > 0) {
            const runs = this._runBreaks = [];

            runs.push(Object.assign(new AxisBreak(this), breaks[0]));

            for (let i = 1; i < breaks.length; i++) {
                const r = runs[runs.length - 1];
                const b = breaks[i];

                if (intersects(r, b)) {
                    merge(r, b);
                } else {
                    runs.push(Object.assign(new AxisBreak(this), b));
                }
            }
        }
    }
}

export class LinearAxis extends ContinuousAxis {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'linear';
    }
}