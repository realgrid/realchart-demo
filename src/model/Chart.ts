////////////////////////////////////////////////////////////////////////////////
// Chart.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcObject } from "../common/RcObject";
import { Axis, AxisCollection } from "./Axis";
import { ChartItem } from "./ChartItem";
import { Series, SeriesCollection } from "./Series";

export interface IChart {
    _visibleChanged(item: ChartItem): void;
    _modelChanged(item: ChartItem): void;
}

export class Chart extends RcObject implements IChart {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _xAxes: AxisCollection;
    private _yAxes: AxisCollection;
    private _series: SeriesCollection;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor() {
        super();

        this._xAxes = new AxisCollection(this);
        this._yAxes = new AxisCollection(this);
        this._series = new SeriesCollection(this);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(source: any): void {
    }

    prepareRender(): void {
        // series를 axis에 연결한다.
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    _visibleChanged(item: ChartItem): void {
    }

    _modelChanged(item: ChartItem): void {
    }
}