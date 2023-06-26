////////////////////////////////////////////////////////////////////////////////
// Chart.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcObject } from "../common/RcObject";
import { Axis, AxisCollection, IAxis } from "./Axis";
import { ChartItem } from "./ChartItem";
import { ILegendSource } from "./Legend";
import { ISeries, Series, SeriesCollection, SeriesGroup } from "./Series";
import { CategoryAxis } from "./axis/CategoryAxis";
import { LinearAxis } from "./axis/LinearAxis";
import { LogAxis } from "./axis/LogAxis";
import { TimeAxis } from "./axis/TimeAxis";
import { BarSeries, ColumnSeries } from "./series/BarSeries";
import { BoxPlotSeries } from "./series/BoxPlotSeries";
import { BubbleSeries } from "./series/BubbleSeries";
import { LineSeries } from "./series/LineSeries";
import { PieSeries } from "./series/PieSeries";
import { ScatterSeries } from "./series/ScatterSeries";

export interface IChart {

    /**
     * 기본 시리즈 타입.
     */
    type: string;
    series: ISeries;
    xAxis: IAxis;
    yAxis: IAxis;

    _getSeriesType(type: string): any;
    _getAxisType(type: string): any;
    getSeries(): SeriesCollection;
    getXAxes(): AxisCollection;
    getYAxes(): AxisCollection;
    seriesByBame(series: string): Series;
    axisByName(axis: string): Axis;
    connectSeries(series: Series, isX: boolean): Axis;
    getGroup(group: String): SeriesGroup;
    getLegendSources(): ILegendSource[];
    _visibleChanged(item: ChartItem): void;
    _modelChanged(item: ChartItem): void;
}

const series_types = {
    'bar': BarSeries,
    'column': ColumnSeries,
    'line': LineSeries,
    'boxplot': BoxPlotSeries,
    'bubble': BubbleSeries,
    'scatter': ScatterSeries,
    'pine': PieSeries
};

const axis_types = {
    'linear': LinearAxis,
    'category': CategoryAxis,
    'time': TimeAxis,
    'date': TimeAxis,
    'log': LogAxis
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
    private _series: SeriesCollection;
    private _xAxes: AxisCollection;
    private _yAxes: AxisCollection;
    private _groups = new Map<string, SeriesGroup>();

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(source?: any) {
        super();

        this._series = new SeriesCollection(this);
        this._xAxes = new AxisCollection(this, true);
        this._yAxes = new AxisCollection(this, false);

        source && this.load(source);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get series(): ISeries {
        return this._series.first;
    }

    get xAxis(): IAxis {
        return this._xAxes.first;
    }

    get yAxis(): IAxis {
        return this._yAxes.first;
    }

    getSeries(): SeriesCollection {
        return this._series;
    }

    getXAxes(): AxisCollection {
        return this._xAxes;
    }

    getYAxes(): AxisCollection {
        return this._yAxes;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    seriesByBame(series: string): Series {
        return this._series.get(series);
    }

    axisByName(axis: string): Axis {
        return this._xAxes.get(axis) || this._yAxes.get(axis);
    }

    getGroup(group: string): SeriesGroup {
        return this._groups.get(group);
    }

    getLegendSources(): ILegendSource[] {
        return this._series.getLegendSources();
    }

    load(source: any): void {
        // series - 시리즈를 먼저 로드해야 디폴트 axis를 지정할 수 있다.
        this._series.load(source["series"])

        // axes
        // 축은 반드시 존재해야 한다.
        this._xAxes.load(source["xAxes"] || source["xAxis"] || {});
        this._yAxes.load(source["yAxes"] || source["yAxis"] || {});
    }

    connectSeries(series: Series, isX: boolean): Axis {
        return isX ? this._xAxes.connect(series) : this._yAxes.connect(series);
    }

    prepareRender(): void {
        // 축에 연결한다.
        this._series.prepareRender();

        // 카테고리 목록을 만든다.
        // 축의 값 범위를 계산한다.
        this._xAxes.prepareRender();
        this._yAxes.prepareRender();
    }

    // 여러번 호출될 수 있다.
    layoutAxes(width: number, height: number, phase: number): void {
        this._xAxes.buildTicks(width);
        this._yAxes.buildTicks(height);
    }

    /**
     * 데이터 및 속성 변경 후 다시 그리게 한다.
     */
    update(): void {
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    _getSeriesType(type: string): any {
        return series_types[type];
    }

    _getAxisType(type: string): any {
        return axis_types[type];
    }

    _visibleChanged(item: ChartItem): void {
    }

    _modelChanged(item: ChartItem): void {
    }
}