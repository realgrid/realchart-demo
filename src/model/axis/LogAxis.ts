////////////////////////////////////////////////////////////////////////////////
// LogAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { AxisTick, IAxisTick } from "../Axis";
import { ContinuousAxis, LinearAxis, ContinuousAxisTick } from "./LinearAxis";

export class LogAxisTick extends ContinuousAxisTick {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    // buildSteps(length: number, base: number, min: number, max: number): number[] {
    //     min = Math.log10(min);
    //     max = Math.log10(max);

    //     const steps =  super.buildSteps(length, base, min, max);
    //     return steps;
    // }
}

/**
 * 이 축에 연결된 시리즈들의 point y값을 log10으로 재설정한다.
 * <br>
 * y축으로만 사용될 수 있다.
 */
export class LogAxis extends ContinuousAxis {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'log';
    }

    canBeX(): boolean {
        return false;
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

    protected _createTick(length: number, step: number): IAxisTick {
        return super._createTick(length, Math.pow(10, step));
    }

    getPosition(length: number, value: number): number {
        value = value > 0 ? Math.log10(value) : 0;
        return super.getPosition(length, value);
    }
}