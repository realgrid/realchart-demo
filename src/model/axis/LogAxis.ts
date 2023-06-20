////////////////////////////////////////////////////////////////////////////////
// LogAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IAxisTick } from "../Axis";
import { LinearAxis } from "./LinearAxis";

export class LogAxis extends LinearAxis {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    collectTicks(min: number, max: number, length: number): IAxisTick[] {
        throw new Error("Method not implemented.");
    }
}