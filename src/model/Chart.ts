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
    /**
     * 기본 시리즈 type.
     * 시리즈에 type을 지정하지 않으면 이 속성 type의 시리즈로 생성된다.
     * 
     * @default 'column'
     */
    type = 'column';

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
        this._xAxes.prepareRender();
        this._yAxes.prepareRender();
        
        this._series.prepareRender();

        this._xAxes.calculateRange();
        this._yAxes.calculateRange();
    }

    // 여러번 호출될 수 있다.
    layoutAxes(width: number, height: number, phase: number): void {
    }

    /**
     * 데이터 및 속성 변경 후 다시 그리게 한다.
     */
    update(): void {
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    _visibleChanged(item: ChartItem): void {
    }

    _modelChanged(item: ChartItem): void {
    }
}