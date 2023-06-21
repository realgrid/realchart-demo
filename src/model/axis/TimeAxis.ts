////////////////////////////////////////////////////////////////////////////////
// TimeAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IAxisTick } from "../Axis";
import { LinearAxis } from "./LinearAxis";

/**
 *  timeUnit(기본값 1)밀리초가 1에 해당한다.
 */
export class TimeAxis extends LinearAxis {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _timeUnit = 1 // 1ms. 축에서 1로 간주하는 시간 간격.

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doPrepareTicks(min: number, max: number, length: number): IAxisTick[] {
        throw new Error("Method not implemented.");
    }
}