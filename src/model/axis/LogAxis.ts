////////////////////////////////////////////////////////////////////////////////
// LogAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { AxisTick, IAxisTick } from "../Axis";
import { ContinuousAxis, ContinuousAxisTick } from "./LinearAxis";

export class LogAxisTick extends ContinuousAxisTick {

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

    protected _doCalcluateRange(values: number[]): { min: number; max: number; } {
        const v = super._doCalcluateRange(values);

        v.min = Math.log10(v.min);
        v.max = Math.log10(v.max);
        return v;
    }

    protected _createTick(length: number, index: number, step: number): IAxisTick {
        return super._createTick(length, index, Math.pow(10, step));
    }

    getPosition(length: number, value: number): number {
        value = value > 0 ? Math.log10(value) : 0;
        return super.getPosition(length, value);
    }
}