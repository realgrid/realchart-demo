////////////////////////////////////////////////////////////////////////////////
// ZoomTracker.ts
// 2023. 10. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartDragTracker } from "./PointerHandler";

export class ZoomTracker extends ChartDragTracker {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doDrag(target: Element, xPrev: number, yPrev: number, x: number, y: number): boolean {
        return true;
    }
}