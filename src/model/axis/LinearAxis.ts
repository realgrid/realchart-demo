////////////////////////////////////////////////////////////////////////////////
// LinearAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Axis, IAxisTick } from "../Axis";
import { ISeries } from "../ChartItem";

export class LinearAxis extends Axis {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doPrepareRender(): void {
    }

    protected _doCalcluateRange(): { min: number; max: number; } {
        return;
    }

    protected _doPrepareTicks(min: number, max: number, length: number): IAxisTick[] {
        return;
    }
}