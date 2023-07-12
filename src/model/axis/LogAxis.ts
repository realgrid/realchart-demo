////////////////////////////////////////////////////////////////////////////////
// LogAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { AxisTick, IAxisTick } from "../Axis";
import { LinearAxis, LinearAxisTick } from "./LinearAxis";

export class LogAxisTick extends LinearAxisTick {

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

export class LogAxis extends LinearAxis {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createTick(): AxisTick {
        return new LogAxisTick(this);
    }

    protected _doCalcluateRange(values: number[]): { min: number; max: number; } {
        const v = super._doCalcluateRange(values);

        v.min = Math.log10(v.min);
        v.max = Math.log10(v.max);
        return v;
    }

    // protected _adjustMinMax(min: number, max: number): { min: number; max: number; } {
    //     const v = super._adjustMinMax(min, max);

    //     v.min = Math.log10(v.min);
    //     v.max = Math.log10(v.max);
    //     return v;
    // }

    protected _doBuildTicks(min: number, max: number, length: number): IAxisTick[] {
        const ticks =  super._doBuildTicks(min, max, length);

        ticks.forEach(t => {
            t.label = String(Math.pow(10, t.value));
        });
        return ticks;
    }

    getPosition(length: number, value: number): number {
        value = value > 0 ? Math.log10(value) : 0;
        return super.getPosition(length, value);
    }

    getStepPosition(length: number, value: number): number {
        return super.getPosition(length, value);
    }
}