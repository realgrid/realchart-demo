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
    collectTicks(min: number, max: number, length: number): IAxisTick[] {
        throw new Error("Method not implemented.");
    }
}