////////////////////////////////////////////////////////////////////////////////
// LogAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { floor, log10, minv, pickNum, pow10 } from "../../common/Common";
import { fixnum } from "../../common/Types";
import { AxisTick, IAxisTick } from "../Axis";
import { ContinuousAxis, ContinuousAxisTick } from "./LinearAxis";

export class LogAxisTick extends ContinuousAxisTick {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 소수점을 갖는 step들을 역로그된 값이 최대한 정수가 되는 위치로 재배치한다.
     * 
     * @config
     */
    arrangeDecimals = true;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    canUseNumSymbols(): boolean {
        return this.axis.axisMax() > 3;
    }

    protected _getStepMultiples(scale: number): number[] {
        // 그냥 scale이 사용되게 한다. 아래 _normalizeSteps()에서 정돈될 수 있다.
        if (scale <= 0.1) { 
            // return [1 / scale];
        }
        return [1, 2, 3, 4, 5, 10];
        // return [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }

    /**
     * 소수점을 갖는 step들을 역로그된 값이 최대한 정수가 되게 조정한다.
     */
    _normalizeSteps(steps: number[], min: number, max: number): number[] {
        if (!this.arrangeDecimals) return  steps;

        for (let i = 0; i < steps.length; i++) {
            let v = steps[i];
            let f = floor(v);

            if (v > 0 && v > f) {
                v = f + log10((v - f) * 10);
                if (v <= max) {
                    steps[i] = v;
                } else if (i > 0) {
                    if (steps[i - 1] >= max) {
                        steps.splice(i, steps.length);
                        break;
                    } else {
                        const scale = pow10(floor(log10(steps[i] - steps[i - 1])));
                        const v2 = steps[i];
                        const v3 = v2 - floor(v2);

                        if (scale < 1) {
                            for (let j = 1; j < 10; j++) {
                                if (v3 > log10(j) && v3 < log10(j + 1)) {
                                    const v4 = floor(v2) + log10(j);
                                    if (v4 >= max) {
                                        v = v3;
                                        break;
                                    }
                                }
                            }
                        }
                        steps[i] = v;
                    }
                }
            }
        }
        return steps;
    }
}

/**
 * 이 축에 연결된 시리즈들의 point y값을 {@link Math.log10}으로 계산된 위치에 표시한다.
 * 
 * @config chart.xAxis[type=log]
 * @config chart.yAxis[type=log]
 */
export class LogAxis extends ContinuousAxis {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'log';
    }

    protected _createTickModel(): AxisTick {
        return new LogAxisTick(this);
    }
    
    collectValues(): void {
        super.collectValues();
        
        // 0보다 작은 값을 log할 수 없다.
        this._values = this._values.filter(v => v > 0);
    }

    /**
     * 내부에서는 log 값들을 사용하고...
     */
    getPos(length: number, value: number): number {
        value = value > 0 ? log10(value) : -1;
        return super.getPos(length, value);
    }

    protected _doCalculateRange(values: number[]): { min: number; max: number; } {
        const v = super._doCalculateRange(values);

        v.min = log10(v.min);
        v.max = log10(v.max);
        return v;
    }

    /**
     * 화면 표시는 역log 값들을 사용한다.
     */
    protected _createTick(length: number, index: number, step: number): IAxisTick {
        return super._createTick(length, index, fixnum(pow10(step)));
    }

    protected _calcUnitLen(vals: number[], length: number, axisMin: number, axisMax: number): { len: number; min: number; } {
        let min = log10(vals[1]) - log10(vals[0]);
    
        for (let i = 2; i < vals.length; i++) {
            min = minv(min, log10(vals[i]) - log10(vals[i - 1]));
        }

        const len = axisMax - axisMin;
        const n = min / len;

        // const len = axisMax -  axisMin;
        // const n = log10(valueGap) / (len + log10(valueGap));

        length *= n;
        return { len: pickNum(length, 1), min: len * n };
    }
}