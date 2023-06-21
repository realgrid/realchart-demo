////////////////////////////////////////////////////////////////////////////////
// Series.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcObject } from "../common/RcObject";
import { IChart } from "./Chart";
import { ChartItem, IAxis, ISeries } from "./ChartItem";
import { DataPointCollection } from "./DataPoint";

export abstract class Series extends ChartItem implements ISeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    readonly name: string;
    group: string;
    xAxis: string | number;
    yAxis: string | number;
    xField = 'x';
    yField = 'y';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _xAxisObj: IAxis;
    private _yAxisObj: IAxis;
    private _points: DataPointCollection;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart);

        this.name = name;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    points(): DataPointCollection {
        return this._points;
    }
    
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
}

export class SeriesCollection {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly chart: IChart;
    private _items: Series[] = [];
    private _map = new Map<string, Series>();

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        this.chart = chart;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    first(): Series {
        return this._items[0];
    }

    items(): Series[] {
        return this._items.slice(0);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    get(name: string): Series {
        return this._map.get(name);
    }
}

export class SeriesGroup extends RcObject {

}