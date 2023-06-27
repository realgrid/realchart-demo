////////////////////////////////////////////////////////////////////////////////
// LegendView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ISize } from "../common/Size";
import { Legend } from "../model/Legend";
import { ChartElement } from "./ChartElement";

export class LegendView extends ChartElement<Legend> {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(model: Legend, hintWidth: number, hintHeight: number, phase: number): ISize {
        throw new Error("Method not implemented.");
    }
    
    protected _doLayout(): void {
        throw new Error("Method not implemented.");
    }
}