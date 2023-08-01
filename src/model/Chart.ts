////////////////////////////////////////////////////////////////////////////////
// Chart.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcObject } from "../common/RcObject";
import { SectionDir } from "../common/Types";
import { Axis, AxisCollection, AxisPosition, IAxis } from "./Axis";
import { Body } from "./Body";
import { ChartItem } from "./ChartItem";
import { ILegendSource, Legend } from "./Legend";
import { IPlottingItem, PlottingItemCollection, Series } from "./Series";
import { Title } from "./Title";
import { CategoryAxis } from "./axis/CategoryAxis";
import { LinearAxis } from "./axis/LinearAxis";
import { LogAxis } from "./axis/LogAxis";
import { TimeAxis } from "./axis/TimeAxis";
import { BarRangeSeries } from "./series/BarRangeSeries";
import { BarSeries, BarSeriesGroup } from "./series/BarSeries";
import { BellCurveSeries } from "./series/BellCurveSeries";
import { BoxPlotSeries } from "./series/BoxPlotSeries";
import { BubbleSeries } from "./series/BubbleSeries";
import { BumpSeriesGroup } from "./series/BumpSeriesGroup";
import { CandlestickSeries } from "./series/CandlestickSeries";
import { DumbbellSeries } from "./series/DumbbellSeries";
import { EqualizerSeries } from "./series/EqualizerSeries";
import { ErrorBarSeries } from "./series/ErrorBarSeries";
import { FunnelSeries } from "./series/FunnelSeries";
import { HistogramSeries } from "./series/HistogramSeries";
import { AreaRangeSeries, AreaSeries, LineSeries, LineSeriesGroup } from "./series/LineSeries";
import { LollipopSeries } from "./series/LollipopSeries";
import { PieSeries, PieSeriesGroup } from "./series/PieSeries";
import { ScatterSeries } from "./series/ScatterSeries";
import { WaterfallSeries } from "./series/WaterfallSeries";

export interface IChart {

    type: string;
    xStart: number;
    xStep: number;
    // series2: ISeries;
    first: IPlottingItem;
    firstSeries: Series;
    xAxis: IAxis;
    yAxis: IAxis;
    colors: string[];

    _polar: boolean;
    isInverted(): boolean;
    startAngle(): number;

    seriesByBame(series: string): Series;
    axisByName(axis: string): Axis;
    // getGroup(group: String): SeriesGroup2;
    getAxes(dir: SectionDir): Axis[];

    _getGroupType(type: string): any;
    _getSeriesType(type: string): any;
    _getAxisType(type: string): any;
    _getSeries(): PlottingItemCollection;
    // _getSeries2(): SeriesCollection;
    _getXAxes(): AxisCollection;
    _getYAxes(): AxisCollection;
    _connectSeries(series: IPlottingItem, isX: boolean): Axis;
    _getLegendSources(): ILegendSource[];
    _visibleChanged(item: ChartItem): void;
    _modelChanged(item: ChartItem): void;
}

const group_types = {
    'bar': BarSeriesGroup,
    'line': LineSeriesGroup,
    'pie': PieSeriesGroup,
    'bump': BumpSeriesGroup
};

const series_types = {
    'bar': BarSeries,
    'barrange': BarRangeSeries,
    'lollipop': LollipopSeries,
    'dumbbell': DumbbellSeries,
    'equalizer': EqualizerSeries,
    'line': LineSeries,
    'area': AreaSeries,
    'arearange': AreaRangeSeries,
    'boxplot': BoxPlotSeries,
    'bubble': BubbleSeries,
    'scatter': ScatterSeries,
    'candlestick': CandlestickSeries,
    'waterfall': WaterfallSeries,
    'errorbar': ErrorBarSeries,
    'histogram': HistogramSeries,
    'bellcurve': BellCurveSeries,
    'pie': PieSeries,
    'funnel': FunnelSeries
};

const axis_types = {
    'category': CategoryAxis,
    'linear': LinearAxis,
    'time': TimeAxis,
    'date': TimeAxis,
    'log': LogAxis
}

export class Credit extends ChartItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    text = 'realreport-chart.com';
}

export class ChartOptions extends ChartItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * true면 차트가 {@link https://en.wikipedia.org/wiki/Polar_coordinate_system 극좌표계}로 표시된다.
     * <br>
     * 기본은 {@link https://en.wikipedia.org/wiki/Cartesian_coordinate_system 직교좌표계}이다.
     * <br>
     * 극좌표계일 때,
     * x축이 원호에, y축은 방사선에 위치하고, 아래의 제한 사항이 있다.
     * 1. x축은 첫번째 축 하나만 사용된다.
     * 2. axis.position 속성은 무시된다.
     * 3. chart, series의 inverted 속성이 무시된다.
     * 4. 극좌표계에 표시할 수 없는 series들은 표시되지 않는다.
     */
    polar = false;
    /**
     * true면 x축이 수직, y축이 수평으로 배치된다.
     * <br>
     * 기본값은 undefined로 첫번째 series의 종류에 따라 결정된다.
     * 즉, bar 시리즈 계통이면 true가 된다.
     */
    inverted: boolean;
    /**
     * x값이 설정되지 않은 포인트들의 시작 x값.
     * {@link Series.xStart}의 기본값.
     */
    xStart = 0;
    /**
     * 시리즈 데이타에 x축 값이 설정되지 않은 경우, 포인트 간의 간격 x 크기.
     * {@link Series.xStep}의 기본값.
     * time 축일 때, 정수 값 대신 시간 단위로 지정할 수 있다.
     */
    xStep = 1;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
}

export class Chart extends RcObject implements IChart {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * 기본 시리즈 type.
     * <br>
     * {@link Series.type}의 기본값.
     * 시리즈에 type을 지정하지 않으면 이 속성 type의 시리즈로 생성된다.
     * 
     * @default 'bar'
     */
    type = 'bar';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _options: ChartOptions;
    private _title: Title;
    private _subtitle: Title;
    private _legend: Legend;
    private _series: PlottingItemCollection;
    // private _series2: SeriesCollection;
    // private _groups2: SeriesGroupCollection2;
    private _xAxes: AxisCollection;
    private _yAxes: AxisCollection;
    private _body: Body;

    _polar: boolean;
    colors = ["#2caffe", "#544fc5", "#00e272", "#fe6a35", "#6b8abc", "#d568fb", "#2ee0ca", "#fa4b42", "#feb56a", "#91e8e12"];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(source?: any) {
        super();

        this._options = new ChartOptions(this);
        this._title = new Title(this);
        this._subtitle = new Title(this, false);
        this._legend = new Legend(this);
        this._series = new PlottingItemCollection(this);
        // this._series2 = new SeriesCollection(this);
        // this._groups2 = new SeriesGroupCollection2(this);
        this._xAxes = new AxisCollection(this, true);
        this._yAxes = new AxisCollection(this, false);
        this._body = new Body(this);

        source && this.load(source);
        this._polar = this.options.polar === true;
    }

    //-------------------------------------------------------------------------
    // IChart
    //-------------------------------------------------------------------------
    startAngle(): number {
        return this.body.getStartAngle();
    }

    get xStart(): number {
        return this._options.xStart;
    }

    get xStep(): number {
        return this._options.xStep;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get options(): ChartOptions {
        return this._options;
    }

    get title(): Title {
        return this._title;
    }

    get subtitle(): Title {
        return this._subtitle;
    }

    get first(): IPlottingItem {
        return this._series.first;
    }

    get firstSeries(): Series {
        return this._series.firstSeries;
    }

    // get series2(): ISeries {
    //     return this._series2.first;
    // }

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

    /**
     * 좌표축이 필요하면true이다.
     * <br>
     * 현재, 모든 시리즈가 pie 이면 false가 된다.
     * false이면 직교 좌표가 표시되지 않는다.
     */
    needAxes(): boolean {
        return this._series.needAxes();
    }

    _getSeries(): PlottingItemCollection {
        return this._series;
    }

    // _getSeries2(): SeriesCollection {
    //     return this._series2;
    // }

    // _getGroups2(): SeriesGroupCollection2 {
    //     return this._groups2;
    // }

    _getXAxes(): AxisCollection {
        return this._xAxes;
    }

    _getYAxes(): AxisCollection {
        return this._yAxes;
    }

    isInverted(): boolean {
        return this._options.inverted === true;
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

    // getGroup(group: string): SeriesGroup2 {
    //     return this._groups2.get(group);
    // }

    containsAxis(axis: Axis): boolean {
        return this._xAxes.contains(axis) || this._yAxes.contains(axis);
    }

    getAxes(dir: SectionDir): Axis[] {
        const xAxes = this._xAxes.items;
        const yAxes = this._yAxes.items;
        let axes: Axis[];

        if (this.isInverted()) {
            switch (dir) {
                case SectionDir.LEFT:
                    axes = xAxes.filter(a => !a._isOpposite);
                    break;
                case SectionDir.RIGHT:
                    axes = xAxes.filter(a => a._isOpposite);
                    break;
                case SectionDir.BOTTOM:
                    axes = yAxes.filter(a => !a._isOpposite);
                    break;
                case SectionDir.TOP:
                    axes = yAxes.filter(a => a._isOpposite);
                    break;
            } 
        } else {
            switch (dir) {
                case SectionDir.LEFT:
                    axes = yAxes.filter(a => !a._isOpposite);
                    break;
                case SectionDir.RIGHT:
                    axes = yAxes.filter(a => a._isOpposite);
                    break;
                case SectionDir.BOTTOM:
                    axes = xAxes.filter(a => !a._isOpposite);
                    break;
                case SectionDir.TOP:
                    axes = xAxes.filter(a => a._isOpposite);
                    break;
            } 
        }
        return axes || [];
    }

    _getLegendSources(): ILegendSource[] {
        return this._series.getLegendSources();
    }

    load(source: any): void {
        // properites
        ['type'].forEach(prop => {
            if (prop in source) {
                this[prop] = source[prop];
            }
        })

        // options
        this._options.load(source.options);

        // titles
        this._title.load(source.title);
        this._subtitle.load(source.subtitle);

        // legend
        this._legend.load(source.legend);

        // series - 시리즈를 먼저 로드해야 디폴트 axis를 지정할 수 있다.
        this._series.load(source.series);
        // this._series2.load(source.series);
        // series group
        // this._groups2.load(source.groups);

        // axes
        // 축은 반드시 존재해야 한다.
        this._xAxes.load(source.xAxes || source.xAxis || {});
        this._yAxes.load(source.yAxes || source.yAxis || {});

        // body
        this._body.load(source.body);
    }

    _connectSeries(series: IPlottingItem, isX: boolean): Axis {
        return isX ? this._xAxes.connect(series) : this._yAxes.connect(series);
    }

    prepareRender(): void {
        // 축에 연결한다.
        this._series.prepareRender();
        // this._series2.prepareRender();
        // group에 연결한다.
        // this._groups2.prepareRender();

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
    _getGroupType(type: string): any {
        return group_types[type];
    }

    _getSeriesType(type: string): any {
        return series_types[String(type).toLowerCase()];
    }

    _getAxisType(type: string): any {
        return axis_types[String(type).toLowerCase()];
    }

    _visibleChanged(item: ChartItem): void {
    }

    _modelChanged(item: ChartItem): void {
    }
}