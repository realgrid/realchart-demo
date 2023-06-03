////////////////////////////////////////////////////////////////////////////////
// Chart.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcObject } from "../common/RcObject";
import { Axis } from "./Axis";
import { ChartItem } from "./ChartItem";
import { SeriesCollection } from "./Series";

export interface IChart {
    visibleChanged(item: ChartItem): void;
}

export class Chart extends RcObject implements IChart {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _xAxis: Axis;
    private _yAxis: Axis;
    private _series: SeriesCollection;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    visibleChanged(item: ChartItem): void {
    }
}