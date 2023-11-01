////////////////////////////////////////////////////////////////////////////////
// LinearAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, pickNum, pickNum3 } from "../../common/Common";
import { IPercentSize, RtPercentSize, assert, calcPercent, ceil, fixnum, parsePercentSize } from "../../common/Types";
import { Axis, AxisItem, AxisTick, AxisLabel, IAxisTick, IAxis } from "../Axis";
import { DataPoint } from "../DataPoint";
import { SeriesGroup, SeriesGroupLayout } from "../Series";

export class ContinuousAxisTick extends AxisTick {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _baseAxis: Axis;
    _step: number;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    stepInterval: number;
    stepPixels = 72;
    stepCount: number;
    steps: number[];
    /**
     * tick 개수를 맞춰야 하는 대상 axis.
     * base의 strictMin, strictMax가 설정되지 않아야 한다.
     * base의 startFit, endFilt의 {@link AxisFit.TICK}으로 설정되어야 한다.
     * 
     * @config
     */
    baseAxis: number | string;
    /**
     * {@link baseAxis}가 지정된 경우, true로 지정하면 base 축의 범위와 동일하게
     * 축의 최소/최대가 결정된다.
     * 
     * @config
     */
    baseRange = false;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    buildSteps(length: number, base: number, min: number, max: number, broken = false): number[] {
        let pts: number[];

        this._step = NaN;

        if (broken) {
            pts = this._getStepsByPixels(length, pickNum(this.stepPixels * 0.85, 60), base, min, max);
        } else if (Array.isArray(this.steps)) {
            // 지정한 위치대로 tick들을 생성한다.
            pts = this.steps.slice(0);
        } else if (this._baseAxis instanceof ContinuousAxis) {
            pts = this._getStepsByCount(this._baseAxis._ticks.length, base, min, max);
        } else if (this.stepCount > 0) {
            pts = this._getStepsByCount(this.stepCount, base, min, max);
        } else if (this.stepInterval > 0) {
            pts = this._getStepsByInterval(this.stepInterval, base, min, max);
        } else if (this.stepPixels > 0) {
            pts = this._getStepsByPixels(length, (this.axis?._isPolar ? 0.5 : 1) * this.stepPixels, base, min, max);
        } else {
            pts = min !== max ? [min, max] : [min];
        }
        return pts;
    }

    getNextStep(step: number, delta: number): number {
        return step + delta * this._step;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    _findBaseAxis(): void {
        if (this.baseAxis != null) {
            const axis = this.axis;
            const base = (axis._isX ? this.chart._getXAxes() : this.chart._getYAxes()).get(this.baseAxis);

            if (base !== axis && base instanceof ContinuousAxis) {
                this._baseAxis = base;
                (base.tick as ContinuousAxisTick)._baseAxis = null;
            }
        }
    }

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

        step = this._step = Math.ceil(step / scale) * scale;

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

    protected _getStepsByInterval(interval: number, base: number, min: number, max: number): number[] {
        const steps: number[] = [];
        let v: number;

        if (!isNaN(base)) {
            steps.push(v = base);
            while (v > min) {
                steps.unshift(v -= interval);
            }
            v = base;
            while (v < max) {
                steps.push(v += interval);
            }
        } else {
            steps.push(v = min);
            while (v < max) {
                steps.push(v += interval);
            }
        }
        this._step = interval;
        return steps;
    }

    protected _getStepMultiples(step: number): number[] {
        return [1, 2, 2.5, 5, 10];
    }

    protected _getStepsByPixels(length: number, pixels: number, base: number, min: number, max: number): number[] {
        if (min >= base) {
            min = base;
        } else if (max <= base) {
            max = base;
        }

        const len = max - min;
        const steps: number[] = [];

        if (len === 0) {
            return isNaN(min) ? [] : [min];
        }

        let count = Math.max(1, Math.floor(length / pixels)) + 1;
        let step = len / (count - 1);
        const scale = Math.pow(10, Math.floor(Math.log10(step)));
        const multiples = this._getStepMultiples(scale);
        let i = 0;
        let v: number;

        step = step / scale;
        if (multiples) {
            // 위쪽 배수에 맞춘다.
            if (step > multiples[i]) {
                for (; i < multiples.length - 1; i++) {
                    if (step > multiples[i] && step < multiples[i + 1]) {
                        step = multiples[++i];
                        break;
                    }
                }
            } else {
                step = multiples[i];
            }
        }
        step *= scale;

        if (!isNaN(base)) { // min이 base 아래, max가 base 위에 있다.
            assert(min <= base && max >= base, "base error");
            count = Math.max(3, count);

            // 계산된 개수보다 많아지면 줄인다.
            while (i < multiples.length) {
                const n = ceil((base - min) / step) + ceil((max - base) / step) + 1; // +1은 base
                if (n > count) {
                    step = (i < multiples.length - 1) ? multiples[i + 1] * scale : step * 2;
                    i++;
                } else {
                    break;
                }
            }
            min = base - ceil((base - min) / step) * step;

        } else {
            if (min > Math.floor(min / step) * step) {
                min = Math.floor(min / step) * step;
            } else if (min < Math.ceil(min / step) * step) {
                min = Math.ceil(min / step) * step;
            }
        }

        this._step = step;
        steps.push(fixnum(v = min));
        while (v < max) {
            steps.push(fixnum(v += step));
        }
        return steps;
    }
}

class LinearAxisLabel extends AxisLabel {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    useSymbols = true;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    getTick(index: number, v: any): string {
        return this._getText(null, v, this.useSymbols && (this.axis.tick as ContinuousAxisTick)._step > 100);
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
    space = 16;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _sizeDim: IPercentSize;
    _sect: IAxisBreakSect;

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

interface IAxisBreakSect {
    from: number;
    to: number;
    pos: number;
    len: number;
}

/**
 * 축 양 끝 맞춤 방식.
 */
export enum AxisFit {
    /**
     * x축이면 {@link VALUE}, y축이면 {@link TICK}.
     */
    DEFAULT = 'default',
    /**
     * 축의 min/max가 tick에 해당하지 않는 경우 tick이 표시될 수 있도록 증가 시킨다.
     */
    TICK = 'tick',
    /**
     * 축의 min/max에 맞춰 표시한다.
     */
    VALUE = 'value'
}

/**
 * 연속 축 기반.
 */
export abstract class ContinuousAxis extends Axis {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _hardMin: number;
    private _hardMax: number;
    private _single: boolean;
    private _base: number;
    private _unitLen: number;
    _calcedMin: number;
    _calcedMax: number;
    private _minBased: boolean;
    private _maxBased: boolean;

    private _runBreaks: AxisBreak[];
    private _sects: IAxisBreakSect[];
    private _lastSect: IAxisBreakSect;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * data point의 이 축 값이 NaN일 때도 point를 표시할 지 여부.
     * 
     * @config
     */
    nullable = true;
    /**
     * 
     * @config
     */
    baseValue: number;

    /**
     * {@link minPadding}, {@link maxPadding}이 설정되지 않았을 때 적용되는 기본값이다.
     * 
     * @config
     */
    padding = 0.05;
    /**
     * 첫번째 tick 앞쪽에 추가되는 최소 여백을 축 길이에 대한 상대값으로 지정한다.
     * 이 값을 지정하지 않으면 {@link padding}에 지정된 값을 따른다.
     * {@link startFit}이 {@link AxitFit.TICK}일 때,
     * data point의 최소값과 첫번째 tick 사이에 이미 그 이상의 간격이 존재한다면 무시된다.
     * {@link strictMin}가 지정되거나, {@link minValue}이 계산된 최소값보다 작은 경우에도 이 속성은 무시된다.
     * 
     * @config
     */
    minPadding: number;
    /**
     * 마지막 tick 뒤쪽에 추가되는 최소 여백을 축 길이에 대한 상대값으로 지정한다.
     * 이 값을 지정하지 않으면 {@link padding}에 지정된 값을 따른다.
     * {@link endFit}이 {@link AxitFit.TICK}일 때,
     * data point의 최대값과 마지막 tick 사이에 이미 그 이상의 간격이 존재한다면 무시된다.
     * {@link strictMax}가 지정되거나, {@link maxValue}가 계산된 최대값보다 큰 경우에도 이 속성은 무시된다.
     * 
     * @config
     */
    maxPadding: number;
    /**
     * 무조건 적용되는 최소값.
     * 즉, 이 값보다 작은 값을 갖는 시리즈 포인트들은 표시되지 않는다.
     * minPadding도 적용되지 않는다.
     * 
     * @config
     */
    strictMin: number;
    /**
     * 무조건 적용되는 최대값.
     * 즉, 이 값보다 큰 값을 갖는 시리즈 포인트들은 표시되지 않는다.
     * maxPadding도 적용되지 않는다.
     * 
     * @config
     */
    strictMax: number;
    /**
     * 축 시작 위치에 tick 표시 여부.
     * {@link strictMin}이 설정되고 {@link AxisFit.VALUE}로 적용된다.
     * 
     * @config
     */
    startFit = AxisFit.DEFAULT;
    /**
     * 축 끝 위치에 tick 표시 여부.
     * {@link strictMax}가 설정되면 무시되고 {@link AxisFit.VALUE}로 적용된다.
     * 
     * @config
     */
    endFit = AxisFit.DEFAULT;

    /** y축으로 사용될 때만 적용한다. */
    readonly breaks: AxisBreak[] = [];

    getBaseValue(): number {
        return this.baseValue;
    }

    hasBreak(): boolean {
        return this._runBreaks != null;
    }

    runBreaks(): AxisBreak[] {
        // TODO: v1.0 - break 하나만 적용한다. (여러 개가 의미가 있는가?)
        return this._runBreaks && this._runBreaks.slice(0, 1);
    }

    getStartFit(): AxisFit {
        return this.startFit === AxisFit.DEFAULT ? (this._isX ? AxisFit.VALUE : AxisFit.TICK) : this.startFit;
    }

    getEndFit(): AxisFit {
        return this.endFit === AxisFit.DEFAULT ? (this._isX ? AxisFit.VALUE : AxisFit.TICK) : this.endFit;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    isContinuous(): boolean {
        return true;
    }

    contains(value: number): boolean {
        return !isNaN(value);
        // return (this.nullable && isNaN(value)) || super.contains(value);
    }

    isBased(): boolean {
        return !!(this.tick as ContinuousAxisTick)._baseAxis;
    }

    protected _createTickModel(): AxisTick {
        return new ContinuousAxisTick(this);
    }

    protected _createLabelModel(): AxisLabel {
        return new LinearAxisLabel(this);
    }

    protected _doLoadProp(prop: string, value: any): boolean {
        if (prop ==='break') {
            this.$_loadBreaks(value);
            return true;
        }
        return super._doLoadProp(prop, value);
    }

    protected _doPrepareRender(): void {
        this._hardMin = this.minValue;
        this._hardMax = this.maxValue;
        this._base = parseFloat(this.baseValue as any);
        this._unitLen = NaN;
        (this.tick as ContinuousAxisTick)._findBaseAxis();
    }

    protected _doBuildTicks(calcedMin: number, calcedMax: number, length: number): IAxisTick[] {
        if (isNaN(calcedMin) || isNaN(calcedMax)) {
            return[];
        }

        const tick = this.tick as ContinuousAxisTick;
        const based = tick._baseAxis instanceof ContinuousAxis;
        let { min, max } = this._adjustMinMax(this._calcedMin = calcedMin, this._calcedMax = calcedMax);
        let base = this._base;

        if (isNaN(base) && min < 0 && max > 0) {
            base = 0;
        } 

        if (based && tick.baseRange) {
            min = tick._baseAxis.axisMin();
            max = tick._baseAxis.axisMax();
        }

        let steps = tick.buildSteps(length, base, min, max, false);
        const ticks: IAxisTick[] = [];

        if (!isNaN(this.strictMin) || this.getStartFit() === AxisFit.VALUE) {
            while (steps.length > 1 && min > steps[0]) {
                steps.shift();
            }
        } else {
            if (!based) {
                while (steps.length > 2 && steps[1] <= min) {
                    steps.shift();
                }
                if (!isNaN(tick._step)) {
                    while (steps[0] > min) {
                        steps.unshift(tick.getNextStep(steps[0], -1));
                    }
                }
            }
            min = steps[0];
        }
        if (!isNaN(this.strictMax) || this.getEndFit() === AxisFit.VALUE) {
            while (max < steps[steps.length - 1] && steps.length > 1) {
                steps.pop();
            }
        } else {
            if (!based) {
                while (steps.length > 2 && steps[steps.length - 2] >= max) {
                    steps.pop();
                }
                if (!isNaN(tick._step)) {
                    while (steps[steps.length - 1] < max) {
                        steps.push(tick.getNextStep(steps[steps.length - 1], 1));
                    }
                }
            }
            max = steps[steps.length - 1];
        }

        this._setMinMax(min, max);

        // if (min !== max) {
            if (this._runBreaks) {
                steps = this.$_getBrokenSteps(this._runBreaks, length, min, max);
            }
    
            for (let i = 0; i < steps.length; i++) {
                const tick = this._createTick(length, i, steps[i]);
                ticks.push(tick);
            }
        // }
        return ticks;
    }

    protected _getTickLabel(index: number, value: number): string {
        return this.label.getTick(index, value) || String(value);
    }

    protected _createTick(length: number, index: number, step: number): IAxisTick {
        return {
            pos: NaN,//this.getPosition(length, step),
            value: step,
            label: this._getTickLabel(index, step)
        }
    }

    calcPoints(length: number, phase: number): void {
        super.calcPoints(length, phase);

        this._markPoints = this._ticks.map(t => t.pos);
    }

    private $_buildBrokenSteps(sect: IAxisBreakSect): number[] {
        const tick = this.tick as ContinuousAxisTick;
        const steps = tick.buildSteps(sect.len, void 0, sect.from, sect.to, true);

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
                len: this._vlen - p
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

            if (this.reversed) {
                return length - p - sect.pos;
            } else {
                return p + sect.pos;
            }
        } else {
            const p = this._single ? length * 0.5 : length * (value - this._min) / (this._max - this._min);

            return this.reversed ? length - p : p;
        }
    }

    getValueAt(length: number, pos: number): number {
        if (this._isHorz) {
            if (this.reversed) pos = length - pos;
        } else {
            if (!this.reversed) pos = length - pos;
        }
        return (this._max - this._min) * pos / length + this._min;
    }

    getUnitLength(length: number, value: number): number {
        if (isNaN(this._unitLen)) {
            this._unitLen = this.$_calcUnitLength(length);
        }
        return this._unitLen;
    }

    getLabelLength(length: number, value: number): number {
        return Math.floor(length / this._ticks.length);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _adjustMinMax(min: number, max: number): { min: number, max: number } {
        this._minBased = this._maxBased = false;

        this._series.forEach(ser => {
            const base = ser.getBaseValue(this);
            
            if (!isNaN(base)) {
                if (isNaN(this._hardMin) && base <= min) {
                    min = base;
                    this._minBased = true;
                } else if (isNaN(this._hardMax) && base >= max) {
                    max = base;
                    this._maxBased = true;
                }
            }
            if (!this._minBased && !ser.canMinPadding(this)) {
                this._minBased = true;
            }
            if (!this._maxBased && !ser.canMaxPadding(this)) {
                this._maxBased = true;
            }
        })

        let minPad = 0;
        let maxPad = 0;

        if (!isNaN(this.strictMin)) {
            min = this.strictMin;
        } else {
            // _hardMin이 적용되면 minPadding은 무시된다.
            if (this._hardMin < min) {
                min = this._hardMin;
            } else if (!this._minBased) {
                minPad = pickNum3(this.minPadding, this.padding, 0);
            }
        }

        if (!isNaN(this.strictMax)) {
            max = this.strictMax;
        } else {
            // _hardMax가 적용되면 maxPadding은 무시된다.
            if (this._hardMax > max) {
                max = this._hardMax;
            } if (!this._maxBased) {
                maxPad = pickNum3(this.maxPadding, this.padding, 0);
            }
        }

        let len = Math.max(0, max - min);

        min -= len * (this._minPad = minPad);
        max += len * (this._maxPad = maxPad);

        return { min, max };
    }

    protected _setMinMax(min: number, max: number): void {
        this._min = min;
        this._max = max;
        this._single = min === max;
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

/**
 * 선형 연속 축.
 * 값 사아의 비율과 축 길이 비율이 항상 동일한 축.
 * 
 * @config chart.xAxis[type=linear]
 * @config chart.yAxis[type=linear]
 */
export class LinearAxis extends ContinuousAxis {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'linear';
    }

    protected _adjustMinMax(min: number, max: number): { min: number; max: number; } {
        const v = super._adjustMinMax(min, max);
        const series = this._series;

        if (series.length === 1 && series[0] instanceof SeriesGroup && series[0].layout === SeriesGroupLayout.FILL) {
            v.max = series[0].layoutMax;
        }
        return v;
    }
}