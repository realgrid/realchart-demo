////////////////////////////////////////////////////////////////////////////////
// Chart.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcObject } from "../common/RcObject";
import { SectionDir } from "../common/Types";
import { Axis, AxisCollection, IAxis } from "./Axis";
import { Body } from "./Body";
import { ChartItem } from "./ChartItem";
import { ILegendSource, Legend } from "./Legend";
import { ISeries, Series, SeriesCollection, SeriesGroup } from "./Series";
import { Title } from "./Title";
import { CategoryAxis } from "./axis/CategoryAxis";
import { LinearAxis } from "./axis/LinearAxis";
import { LogAxis } from "./axis/LogAxis";
import { TimeAxis } from "./axis/TimeAxis";
import { BarSeries, ColumnSeries } from "./series/BarSeries";
import { BoxPlotSeries } from "./series/BoxPlotSeries";
import { BubbleSeries } from "./series/BubbleSeries";
import { HistogramSeries } from "./series/HistogramSeries";
import { AreaRangeSeries, AreaSeries, LineSeries } from "./series/LineSeries";
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

    isInverted(): boolean;

    seriesByBame(series: string): Series;
    axisByName(axis: string): Axis;
    getGroup(group: String): SeriesGroup;
    getAxes(dir: SectionDir): Axis[];

    _getSeriesType(type: string): any;
    _getAxisType(type: string): any;
    _getSeries(): SeriesCollection;
    _getXAxes(): AxisCollection;
    _getYAxes(): AxisCollection;
    _connectSeries(series: Series, isX: boolean): Axis;
    _getLegendSources(): ILegendSource[];
    _visibleChanged(item: ChartItem): void;
    _modelChanged(item: ChartItem): void;
}

const series_types = {
    'bar': BarSeries,
    'column': ColumnSeries,
    'line': LineSeries,
    'area': AreaSeries,
    'arearange': AreaRangeSeries,
    'boxplot': BoxPlotSeries,
    'bubble': BubbleSeries,
    'scatter': ScatterSeries,
    'histogram': HistogramSeries,
    'pie': PieSeries
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
    private _title: Title;
    private _subtitle: Title;
    private _legend: Legend;
    private _series: SeriesCollection;
    private _xAxes: AxisCollection;
    private _yAxes: AxisCollection;
    private _groups = new Map<string, SeriesGroup>();
    private _body: Body;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(source?: any) {
        super();

        this._title = new Title(this);
        this._subtitle = new Title(this, false);
        this._legend = new Legend(this);
        this._series = new SeriesCollection(this);
        this._xAxes = new AxisCollection(this, true);
        this._yAxes = new AxisCollection(this, false);
        this._body = new Body(this);

        source && this.load(source);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get title(): Title {
        return this._title;
    }

    get subtitle(): Title {
        return this._subtitle;
    }

    get series(): ISeries {
        return this._series.first;
    }

    get legend(): Legend {
        return this._legend;
    }

    get xAxis(): IAxis {
        return this._xAxes.first;
    }

    get yAxis(): IAxis {
        return this._yAxes.first;
    }

    get body(): Body {
        return this._body;
    }

    isPolar(): boolean {
        return this._series.first?.isPolar();
    }

    _getSeries(): SeriesCollection {
        return this._series;
    }

    _getXAxes(): AxisCollection {
        return this._xAxes;
    }

    _getYAxes(): AxisCollection {
        return this._yAxes;
    }

    isInverted(): boolean {
        return this._series.isInverted();
    }

    isEmpty(): boolean {
        return this._series.isEmpty();
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

    getAxes(dir: SectionDir): Axis[] {
        const xAxes = this._xAxes.items;
        const yAxes = this._yAxes.items;
        let axes: Axis[];

        if (this.isInverted()) {
            switch (dir) {
                case SectionDir.LEFT:
                    axes = xAxes.filter(a => !a.opposite);
                    break;
                case SectionDir.RIGHT:
                    axes = xAxes.filter(a => a.opposite);
                    break;
                case SectionDir.BOTTOM:
                    axes = yAxes.filter(a => !a.opposite);
                    break;
                case SectionDir.TOP:
                    axes = yAxes.filter(a => a.opposite);
                    break;
            } 
        } else {
            switch (dir) {
                case SectionDir.LEFT:
                    axes = yAxes.filter(a => !a.opposite);
                    break;
                case SectionDir.RIGHT:
                    axes = yAxes.filter(a => a.opposite);
                    break;
                case SectionDir.BOTTOM:
                    axes = xAxes.filter(a => !a.opposite);
                    break;
                case SectionDir.TOP:
                    axes = xAxes.filter(a => a.opposite);
                    break;
            } 
        }
        return axes || [];
    }

    _getLegendSources(): ILegendSource[] {
        return this._series.getLegendSources();
    }

    load(source: any): void {
        // titles
        this._title.load(source.title);
        this._subtitle.load(source.subtitle);

        // legend
        this._legend.load(source.legend);

        // series - 시리즈를 먼저 로드해야 디폴트 axis를 지정할 수 있다.
        this._series.load(source.series);

        // axes
        // 축은 반드시 존재해야 한다.
        this._xAxes.load(source.xAxes || source.xAxis || {});
        this._yAxes.load(source.yAxes || source.yAxis || {});

        // body
        this._body.load(source.body);
    }

    _connectSeries(series: Series, isX: boolean): Axis {
        return isX ? this._xAxes.connect(series) : this._yAxes.connect(series);
    }

    prepareRender(): void {
        // 축에 연결한다.
        this._series.prepareRender();

        // 카테고리 목록을 만든다.
        // 축의 값 범위를 계산한다.
        this._xAxes.prepareRender();
        this._yAxes.prepareRender();

        // legend 위치를 결정한다.
        this._legend.prepareRender();
    }

    // 여러번 호출될 수 있다.
    layoutAxes(width: number, height: number, inverted: boolean, phase: number): void {
        this._xAxes.buildTicks(inverted ? height : width);
        this._yAxes.buildTicks(inverted ? width : height);
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