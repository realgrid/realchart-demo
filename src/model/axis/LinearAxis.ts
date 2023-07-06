////////////////////////////////////////////////////////////////////////////////
// LinearAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { assert, ceil, fixnum } from "../../common/Types";
import { Axis, AxisTick, IAxisTick } from "../Axis";
import { IChart } from "../Chart";
import { DataPoint } from "../DataPoint";
import { ISeries } from "../Series";

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
    private _getStepsByCount(count: number, base: number, min: number, max: number): number[] {
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

    private _getStepsBySize(size: number, base: number, min: number, max: number): number[] {
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

    private _getStepsByPixels(length: number, pixels: number, base: number, min: number, max: number): number[] {
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

export class LinearAxis extends Axis {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * data point의 이 축 값이 NaN일 때도 point를 표시할 지 여부.
     */
    nullable = true;
    /**
     * 적어도 이 값이 최소값으로 표시된다.
     */
    baseValue: number;
    minValue: number;
    maxValue: number;
    /**
     * baseValue가 설정되고,
     * 계산된 최소값이 baseValue보다 작고 최대값이 baseValue보다 클 때,
     * min max를 둘 중 큰 절대값으로 맞춘다.
     * 두 시리즈가 양쪽으로 벌어지는 컬럼/바 시리즈에 활용할 수 있다.
     */
    syncMinMax = false;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _hardMin: number;
    private _hardMax: number;
    private _min: number;
    private _max: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart, name);

        this.baseValue = 0;
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

    protected _doPrepareRender(): void {
        this._hardMin = this.minValue;
    }

    protected _doBuildTicks(calcedMin: number, calcedMax: number, length: number): IAxisTick[] {
        const tick = this.tick as LinearAxisTick;
        let { min, max } = this.$_adjustMinMax(calcedMin, calcedMax);
        const steps = tick.buildSteps(length, this.baseValue, min, max);

        min = this._min = Math.min(min, steps[0]);
        max = this._max = Math.max(max, steps[steps.length - 1]);

        const ticks: IAxisTick[] = [];

        for (let i = 0; i < steps.length; i++) {
            ticks.push({
                pos: this.getPosition(length, steps[i]),
                value: steps[i],
                label: String(steps[i])
            });
        }
        return ticks;
    }

    getPosition(length: number, value: number): number {
        return length * (value - this._min) / (this._max - this._min);
    }

    getPointWidth(length: number, series: ISeries, point: DataPoint): number {
        return;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_adjustMinMax(min: number, max: number): { min: number, max: number } {
        const base = this.baseValue;
        const minPad = this.minPadding;
        const maxPad = this.maxPadding;

        if (!isNaN(base)) {
            if (this.syncMinMax && min <= base && max >= base) {
                const v = Math.max(Math.abs(min), Math.abs(max));
    
                max = base + v;
                min = base - v;
            }
         
            if (!isNaN(this._hardMin)) {
                min = this._hardMin;
            }
            if (!isNaN(this._hardMax)) {
                max = this._hardMax;
            }
        }

        let len = Math.max(0, max - min);

        if (!isNaN(minPad)) {
            min -= len * minPad;
        }
        if (!isNaN(maxPad)) {
            max += len * maxPad;
        }

        return { min, max };
    }
}