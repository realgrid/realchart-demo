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
import { Series, SeriesCollection, SeriesGroup } from "./Series";

export interface IChart {

    getSeries(series: string): Series;
    getAxis(axis: string): Axis;
    getGroup(group: String): SeriesGroup;
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
    private _groups = new Map<string, SeriesGroup>();

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
    // properties
    //-------------------------------------------------------------------------
    series(): SeriesCollection {
        return this._series;
    }

    axis(): AxisCollection {
        return this._xAxes;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getSeries(series: string): Series {
        return this._series.get(series);
    }

    getAxis(axis: string): Axis {
        return this._xAxes.get(axis) || this._yAxes.get(axis);
    }

    getGroup(group: string): SeriesGroup {
        return this._groups.get(group);
    }

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