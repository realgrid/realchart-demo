////////////////////////////////////////////////////////////////////////////////
// LogAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { floor, log10, pow10, round } from "../../common/Common";
import { fixnum } from "../../common/Types";
import { AxisTick, IAxisTick } from "../Axis";
import { ContinuousAxis, ContinuousAxisTick } from "./LinearAxis";

export class LogAxisTick extends ContinuousAxisTick {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    detailed = true;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    /**
     * scale은 0, ..., 0.1, 1, 10, 100, ...
     * 정수화 되는 scale만 적용되도록 한다.
     */
    protected _getStepMultiples(scale: number): number[] {
        if (scale <= 0.1) {
            return [1 / scale];
        }
        return [1, 2, 3, 4, 5, 10];
    }

    protected _getStepsByInterval(interval: any, base: number, min: number, max: number): number[] {
        let steps: number[];

        // 0보다는 크다.
        if (interval < 1 && this.detailed) {
            const threshold = interval >= 0.5 ? 8 : interval >= 0.3 ? 4 : interval >= 0.15 ? 2 : 1;
            let start = floor(min);
            let v = pow10(start);
            let prev = v - threshold;
            let i = 1;
            let v2: number;

            steps = [];

            if (start <= 0) {
                steps.push(0);
                prev = 0;
                start = start == 0 ? 1 : 0;
            }
            if (start < min) {
                while (i <= 9) {
                    v = log10(pow10(start) * interval * i++);
                    // console.log('#', i - 1, v);
                    if (v >= min) {
                        v2 = fixnum(pow10(v));
                        if ((v2 - prev) >= threshold && floor(v2) === v2) {
                            steps.push(v);
                            prev = v2;
                        }
                    }
                }
                start++;
            }
            i = 1;
            while (v < max) {
                v = log10(pow10(start) * interval * i++);
                v2 = fixnum(pow10(v));
                // if ((v2 - prev) >= threshold * Math.max(1, v) && floor(v2) === v2) {
                if ((v2 - prev) >= threshold && floor(v2) === v2) {
                    steps.push(v);
                    prev = v2;
                }
                if (i > 9) {
                    start++;
                    i = 1;
                }
            } 
            if (steps[steps.length - 1] < max && v > max) {
                steps.push(v);
            }
        } else {
            steps = super._getStepsByInterval(round(interval), base, min, max);
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
        this._values = this._values.filter(v => v > 0);
    }

    protected _doCalcluateRange(values: number[]): { min: number; max: number; } {
        const v = super._doCalcluateRange(values);

        v.min = log10(v.min);
        v.max = log10(v.max);
        return v;
    }

    protected _createTick(length: number, index: number, step: number): IAxisTick {
        return super._createTick(length, index, fixnum(pow10(step)));
    }

    getPosition(length: number, value: number): number {
        value = value > 0 ? log10(value) : -1;
        return super.getPosition(length, value);
    }
}