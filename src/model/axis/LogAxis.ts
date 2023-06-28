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
    buildSteps(length: number, base: number, min: number, max: number): number[] {
        min = Math.log10(min);
        max = Math.log10(max);

        return super.buildSteps(length, base, min, max);
    }
}

export class LogAxis extends LinearAxis {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createTick(): AxisTick {
        return new LogAxisTick(this);
    }

    protected _doBuildTicks(min: number, max: number, length: number): IAxisTick[] {
        return;
    }

    getPosition(length: number, value: number): number {
        return;
    }
}