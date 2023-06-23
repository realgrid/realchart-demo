////////////////////////////////////////////////////////////////////////////////
// LinearAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Axis, IAxisTick } from "../Axis";

export class LinearAxis extends Axis {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doPrepareRender(): void {
    }

    protected _doCalcluateRange(values: number[]): { min: number; max: number; } {
        return super._doCalcluateRange(values);
    }

    protected _doPrepareTicks(min: number, max: number, length: number): IAxisTick[] {
        return;
    }
}