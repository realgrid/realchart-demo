////////////////////////////////////////////////////////////////////////////////
// Chart.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, isString, mergeObj } from "../common/Common";
import { RcEventProvider } from "../common/RcObject";
import { Align, SectionDir, VerticalAlign } from "../common/Types";
import { AssetCollection } from "./Asset";
import { Axis, AxisCollection, IAxis, YAxisCollection } from "./Axis";
import { Body } from "./Body";
import { ChartItem, n_char_item } from "./ChartItem";
import { DataPoint } from "./DataPoint";
import { ILegendSource, Legend } from "./Legend";
import { IPlottingItem, PlottingItemCollection, Series } from "./Series";
import { PaletteMode, ThemeCollection } from "./Theme";
import { Subtitle, Title } from "./Title";
import { CategoryAxis } from "./axis/CategoryAxis";
import { LinearAxis } from "./axis/LinearAxis";
import { LogAxis } from "./axis/LogAxis";
import { TimeAxis } from "./axis/TimeAxis";
import { CircleGauge, CircleGaugeGroup } from "./gauge/CircleGauge";
import { ClockGauge } from "./gauge/ClockGauge";
import { Gauge, GaugeCollection } from "./Gauge";
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
import { HeatmapSeries } from "./series/HeatmapSeries";
import { HistogramSeries } from "./series/HistogramSeries";
import { AreaRangeSeries, AreaSeries, AreaSeriesGroup, LineSeries, LineSeriesGroup } from "./series/LineSeries";
import { LollipopSeries } from "./series/LollipopSeries";
import { OhlcSeries } from "./series/OhlcSeries";
import { ParetoSeries } from "./series/ParetoSeries";
import { PieSeries, PieSeriesGroup } from "./series/PieSeries";
import { ScatterSeries } from "./series/ScatterSeries";
import { TreemapSeries } from "./series/TreemapSeries";
import { VectorSeries } from "./series/VectorSeries";
import { WaterfallSeries } from "./series/WaterfallSeries";
import { LinearGauge, LinearGaugeGroup } from "./gauge/LinearGauge";
import { BulletGauge, BulletGaugeGroup } from "./gauge/BulletGauge";
import { SeriesNavigator } from "./SeriesNavigator";
import { Split } from "./Split";

export interface IChart {
    type: string;
    gaugeType: string;
    xStart: number;
    xStep: number;
    _splitted: boolean;
    _splits: number[];
    // series2: ISeries;
    first: IPlottingItem;
    firstSeries: Series;
    xAxis: IAxis;
    yAxis: IAxis;
    subtitle: Title;
    colors: string[];

    _createChart(config: any): IChart;
    assignTemplates(target: any): any;

    isGauge(): boolean;
    isPolar(): boolean;
    isInverted(): boolean;
    animatable(): boolean;
    startAngle(): number;

    seriesByName(series: string): Series;
    axisByName(axis: string): Axis;
    // getGroup(group: String): SeriesGroup2;
    getAxes(dir: SectionDir): Axis[];

    _getGroupType(type: string): any;
    _getSeriesType(type: string): any;
    _getAxisType(type: string): any;
    _getGaugeType(type: string): any;
    _getGaugeGroupType(type: string): any;
    _getSeries(): PlottingItemCollection;
    _getGauges(): GaugeCollection;
    _getXAxes(): AxisCollection;
    _getYAxes(): AxisCollection;
    getAxesGap(): number;
    _connectSeries(series: IPlottingItem, isX: boolean): Axis;
    _getLegendSources(): ILegendSource[];
    _visibleChanged(item: ChartItem): void;
    _pointVisibleChanged(series: Series, point: DataPoint): void;
    _modelChanged(item: ChartItem, tag?: any): void;

    // for series navigator
    prepareRender(): void;
    layoutAxes(width: number, height: number, inverted: boolean, phase: number): void;
}

const group_types = {
    // TODO: '...group'으로 통일한다.
    'bar': BarSeriesGroup,
    'line': LineSeriesGroup,
    'area': AreaSeriesGroup,
    'pie': PieSeriesGroup,
    'bargroup': BarSeriesGroup,
    'linegroup': LineSeriesGroup,
    'areagroup': AreaSeriesGroup,
    'piegroup': PieSeriesGroup,
    'bump': BumpSeriesGroup
};
const series_types = {
    'area': AreaSeries,
    'arearange': AreaRangeSeries,
    'bar': BarSeries,
    'barrange': BarRangeSeries,
    'bellcurve': BellCurveSeries,
    'boxplot': BoxPlotSeries,
    'bubble': BubbleSeries,
    'candlestick': CandlestickSeries,
    'dumbbell': DumbbellSeries,
    'equalizer': EqualizerSeries,
    'errorbar': ErrorBarSeries,
    'funnel': FunnelSeries,
    'heatmap': HeatmapSeries,
    'histogram': HistogramSeries,
    'line': LineSeries,
    'lollipop': LollipopSeries,
    'ohlc': OhlcSeries,
    'pareto': ParetoSeries,
    'pie': PieSeries,
    'scatter': ScatterSeries,
    'treemap': TreemapSeries,
    'vector': VectorSeries,
    'waterfall': WaterfallSeries,
};
const axis_types = {
    'category': CategoryAxis,
    'linear': LinearAxis,
    'time': TimeAxis,
    'date': TimeAxis,
    'log': LogAxis,
}

const gauge_types = {
    'circle': CircleGauge,
    'linear': LinearGauge,
    'bullet': BulletGauge,
    'clock': ClockGauge,
}
const gauge_group_types = {
    'circle': CircleGaugeGroup,
    'linear': LinearGaugeGroup,
    'bullet': BulletGaugeGroup,
    'circlegroup': CircleGaugeGroup,
    'lineargroup': LinearGaugeGroup,
    'bulletgroup': BulletGaugeGroup,
}

export class Credits extends ChartItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 표시할 문자열.
     * 
     * @config
     */
    text = 'RealChart v1.0';
    /**
     * 이 속성을 지정하면 click시 해당 url로 이동한다.
     * 
     * @config
     */
    url = 'http://realgrid.com';
    /**
     * true이면 {@link verticalAlign}이 'top', 'bottom'일 때도,
     * 별도의 영역을 차지하지 않고 chart view위에 표시된다.
     * 
     * @config
     */
    floating = false;
    /**
     * @config
     */
    align = Align.RIGHT;
    /**
     * @config
     */
    verticalAlign = VerticalAlign.BOTTOM;
    /**
     * {@link align}으로 지정된 수평 위치에서, 양수로 지정하면 안쪽으로 음수면 바깥쪽으로 밀어서 표시한다.
     * 
     * @config
     */
    offsetX = 2;
    /**
     * {@link verticalAlign}으로 지정된 수직 위치에서, 양수로 지정하면 안쪽으로 음수면 바깥쪽으로 밀어서 표시한다.
     * 
     * @config
     */
    offsetY = 1;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

/**
 * @config chart.options
 */
export class ChartOptions extends ChartItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * theme 이름.
     */
    theme: string;
    /**
     * 시리즈 및 데이터포인트에 적용되는 기본 색상 팔레트 이름.
     */
    palette: string;
    /**
     * {@link palette}로 지정된 팔레트 색상들을 시리즈에 적용하는 방식.
     */
    paletteMode = PaletteMode.NORMAL;
    /**
     * false로 지정하면 차트 전체척으로 animation 효과를 실행하지 않는다.
     * 
     * @config
     */
    animatable = true;
    /**
     * x축 값이 설정되지 않은 시리즈 첫번째 데이터 point에 설정되는 x값.
     * 이 후에는 {@link xStep}씩 증가시키면서 설정한다.
     * 시리즈의 {@link Series.xStart}가 설정되면 그 값이 사용된다.
     * 
     * @config
     */
    xStart: any = 0;
    /**
     * x축 값이 설정되지 않은 데이터 point에 지정되는 x값의 간격.
     * 첫번째 값은 {@link xStart}로 설정한다.
     * time 축일 때, 정수 값 대신 시간 단위('y', 'm', 'd', 'h', 'n', 's')로 지정할 수 있다.
     * 시리즈의 {@link Series.xStep}이 설정되면 그 값이 사용된다.
     * 
     * @config
     */
    xStep: number | string = 1;
    /**
     * 복수 axis가 표시되는 경우 axis 사이의 간격
     * 
     * @default 8 pixels
     * @config
     */
    axisGap = 8;
    /**
     * 크레딧 모델.
     * @config
     */
    credits = new Credits(null);

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
}

export interface IChartEventListener {
    onModelChanged?(chart: Chart, item: ChartItem): void;
    onVisibleChanged?(chart: Chart, item: ChartItem): void;
    onPointVisibleChange?(chart: Chart, series: Series, point: DataPoint): void;
}

/**
 * @config chart
 */
export class Chart extends RcEventProvider<IChartEventListener> implements IChart {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _templates: {[key: string]: any};
    private _assets: AssetCollection;
    private _themes: ThemeCollection;
    private _options: ChartOptions;
    private _title: Title;
    private _subtitle: Subtitle;
    private _legend: Legend;
    private _split: Split;
    private _series: PlottingItemCollection;
    private _xAxes: AxisCollection;
    private _yAxes: YAxisCollection;
    private _gauges: GaugeCollection;
    private _body: Body;
    private _navigator: SeriesNavigator;

    _splitted: boolean;
    _splits: number[];
    private _inverted: boolean;
    private _polar: boolean;
    private _gaugeOnly: boolean;
    colors: string[];
    assignTemplates: (target: any) => any;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(source?: any) {
        super();

        this._assets = new AssetCollection();
        this._themes = new ThemeCollection();
        this._options = new ChartOptions(this);
        this._title = new Title(this);
        this._subtitle = new Subtitle(this);
        this._legend = new Legend(this);
        this._split = new Split(this);
        this._series = new PlottingItemCollection(this);
        this._xAxes = new AxisCollection(this, true);
        this._yAxes = new YAxisCollection(this, false);
        this._gauges = new GaugeCollection(this);
        this._body = new Body(this);
        this._navigator = new SeriesNavigator(this);

        source && this.load(source);
    }

    //-------------------------------------------------------------------------
    // IChart
    //-------------------------------------------------------------------------
    _createChart(config: any): IChart {
        return new Chart(config);
    }

    startAngle(): number {
        return this.body.getStartAngle();
    }

    get xStart(): number {
        return +this._options.xStart;
    }

    get xStep(): number {
        return +this._options.xStep;
    }

    get xStepUnit(): string {
        return;
    }

    animatable(): boolean {
        return this._options.animatable !== false;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 기본 시리즈 type.\
     * {@link Series._type}의 기본값.
     * 시리즈에 type을 지정하지 않으면 이 속성 type의 시리즈로 생성된다.\
     * [주의] 차트 로딩 후 변경할 수 없다.
     * 
     * @config
     */
    type = 'bar';
    /**
     * 기본 게이지 type.\
     * 게이지에 type을 지정하지 않으면 이 속성 type의 시리즈로 생성된다.\
     * [주의] 차트 로딩 후 변경할 수 없다.
     * 
     * @config
     */
    gaugeType = 'circle';
    /**
     * true면 차트가 {@link https://en.wikipedia.org/wiki/Polar_coordinate_system 극좌표계}로 표시된다.\
     * 기본은 {@link https://en.wikipedia.org/wiki/Cartesian_coordinate_system 직교좌표계}이다.
     * 극좌표계일 때,
     * x축이 원호에, y축은 방사선에 위치하고, 아래의 제한 사항이 있다.
     * 1. x축은 첫번째 축 하나만 사용된다.
     * 2. axis.position 속성은 무시된다.
     * 3. chart, series의 inverted 속성이 무시된다.
     * 4. 극좌표계에 표시할 수 없는 series들은 표시되지 않는다.\
     * 
     * [주의] 차트 로딩 후 변경할 수 없다.
     * 
     * @config
     */
    polar = false;
    /**
     * true면 x축이 수직, y축이 수평으로 배치된다.\
     * [주의] 차트 로딩 후 변경할 수 없다.
     *
     * @config
     */
    inverted: boolean;
    /**
     * true면 x축 방향을 기준으로 body 영역을 분할한다.\
     * [주의] 차트 로딩 후 변경할 수 없다.
     *
     * @config
     */
    splitted: boolean;

    get assets(): AssetCollection {
        return this._assets;
    }

    get options(): ChartOptions {
        return this._options;
    }

    get title(): Title {
        return this._title;
    }

    get subtitle(): Subtitle {
        return this._subtitle;
    }

    get first(): IPlottingItem {
        return this._series.first;
    }

    get firstSeries(): Series {
        return this._series.firstSeries;
    }

    get firstGauge(): Gauge {
        return this._gauges.firstGauge;
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

    get split(): Split {
        return this._split;
    }

    get seriesNavigator(): SeriesNavigator {
        return this._navigator;
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

    _getGauges(): GaugeCollection {
        return this._gauges;
    }

    _getXAxes(): AxisCollection {
        return this._xAxes;
    }

    _getYAxes(): AxisCollection {
        return this._yAxes;
    }

    isGauge(): boolean {
        return this._gaugeOnly;
    }

    isPolar(): boolean {
        return this._polar;
    }

    isWidget(): boolean {
        return this._series.isWidget();
    }

    isInverted(): boolean {
        return this._inverted;
    }

    isEmpty(): boolean {
        return this._series.isEmpty() && this._gauges.count === 0;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    seriesByName(series: string): Series {
        return this._series.getSeries(series);
    }

    seriesByPoint(point: DataPoint): Series {
        return this._series.seriesByPoint(point);
    }

    gaugeByName(gauge: string): Gauge {
        return this._gauges.getGauge(gauge);
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

    getXAxis(name: string | number): Axis {
        return this._xAxes.get(name);
    }

    getYAxis(name: string | number): Axis {
        return this._yAxes.get(name);
    }

    getAxes(dir: SectionDir): Axis[] {
        const xAxes = this._xAxes.items;
        const yAxes = this._yAxes.items;
        let axes: Axis[];

        if (this.isInverted()) {
            switch (dir) {
                case SectionDir.LEFT:
                    axes = xAxes.filter(a => !a._isOpposite && !a._isBetween);
                    break;
                case SectionDir.RIGHT:
                    axes = xAxes.filter(a => a._isOpposite);
                    break;
                case SectionDir.BOTTOM:
                    axes = yAxes.filter(a => !a._isOpposite && !a._isBetween);
                    break;
                case SectionDir.TOP:
                    axes = yAxes.filter(a => a._isOpposite);
                    break;
                case SectionDir.CENTER:
                    axes = xAxes.filter(a => a._isBetween);
                    break;
            } 
        } else {
            switch (dir) {
                case SectionDir.LEFT:
                    axes = yAxes.filter(a => !a._isOpposite && !a._isBetween);
                    break;
                case SectionDir.RIGHT:
                    axes = yAxes.filter(a => a._isOpposite);
                    break;
                case SectionDir.BOTTOM:
                    axes = xAxes.filter(a => !a._isOpposite && !a._isBetween);
                    break;
                case SectionDir.TOP:
                    axes = xAxes.filter(a => a._isOpposite);
                    break;
                case SectionDir.MIDDLE:
                    axes = xAxes.filter(a => a._isBetween);
                    break;
            } 
        }
        return axes || [];
    }

    _getLegendSources(): ILegendSource[] {
        return this._series.getLegendSources();
    }

    /**
     * @internal
     * 
     * [주의] 원본 array를 그대로 사용한다.
     */
    private $_assignTemplates(target: any): any {
        const templ = target.template;

        if (isString(templ)) {
            let v = this._templates[templ];
            if (v) {
                return mergeObj(v, target);
            }
        } else if (isArray(templ)) {
            templ.forEach(t => {
                let v = this._templates[t];
                if (v) {
                    v = mergeObj(v, target);
                }
                return v;
            });
        }
        return target;
    }

    load(source: any): void {
        const sTime = 'load chart ' + Math.random() * 1000000;
        console.time(sTime);

        // defaults
        this.$_loadTemplates(source.templates);

        // properites
        ['type', 'gaugeType', 'polar', 'inverted'].forEach(prop => {
            if (prop in source) {
                this[prop] = source[prop];
            }
        })
        this._polar = this.polar === true;
        this.type = this.type || 'bar';
        this.gaugeType = this.gaugeType || 'circle';

        // assets
        this._assets.load(source.assets);

        // themes
        this._themes.load(source.themes);

        // options
        this._options.load(source.options);

        // titles
        this._title.load(source.title);
        this._subtitle.load(source.subtitle);

        // legend
        this._legend.load(source.legend);

        // series - 시리즈를 먼저 로드해야 디폴트 axis를 지정할 수 있다.
        this._series.load(source.series);

        this._gauges.load(source.gauges || source.gauge);
        this._gaugeOnly = this._series.count == 0 && this._gauges.count > 0;

        if (!this._gaugeOnly) {
            // axes
            // 축은 반드시 존재해야 한다. (TODO: 동적으로 series를 추가하는 경우)
            this._xAxes.load(source.xAxes || source.xAxis || {});
            this._yAxes.load(source.yAxes || source.yAxis || {});
        }

        // body
        this._body.load(source.body || source.plot); // TODO: plot 제거

        // series navigator
        this._navigator.load(source.seriesNavigator);

        console.log('chart-items:', n_char_item);
        console.timeEnd(sTime);
    }

    _connectSeries(series: IPlottingItem, isX: boolean): Axis {
        return isX ? this._xAxes.connect(series) : this._yAxes.connect(series);
    }

    prepareRender(): void {
        this._inverted = !this._polar && this.inverted;
        
        if (this._splitted = !this._polar && this._body.split.visible) {
            this._splits = this._body.getSplits();
            this._yAxes.split(this._splits);
        }

        this._xAxes.disconnect();
        this._yAxes.disconnect();

        // 축에 연결한다.
        this._series.prepareRender();

        // 축의 값 범위를 계산한다. 
        // [주의] 반드시 x축을 먼저 준비해야 한다. seriesGroup.$_collectPoints에서 point.xValue를 사용한다.
        this._xAxes.collectValues();
        this._yAxes.collectValues();
        this._xAxes.collectReferentsValues();
        this._yAxes.collectReferentsValues();
        this._xAxes.prepareRender();
        this._yAxes.prepareRender();

        // split
        this._split.prepareRender();

        // 축이 설정된 후
        this._series.prepareAfter();

        // legend 위치를 결정한다.
        this._legend.prepareRender();

        // gauges
        this._gauges.prepareRender();

        // navigator
        this._navigator.visible && this._navigator.prepareRender();
    }

    // 여러번 호출될 수 있다.
    layoutAxes(width: number, height: number, inverted: boolean, phase: number): void {
        this._xAxes.$_buildTicks(inverted ? height : width);
        this._yAxes.$_buildTicks(inverted ? width : height);
        this.$_calcAxesPoints(width, height, inverted, 0);
    }

    calcAxesPoints(width: number, height: number, inverted: boolean): void {
        this.$_calcAxesPoints(width, height, inverted, 1);
    }

    private $_calcAxesPoints(width: number, height: number, inverted: boolean, phase: number): void {
        let len = inverted ? height : width;
        this._xAxes.forEach(axis => {
            axis.calcPoints(len, phase);
        });
        len = inverted ? width : height;
        this._yAxes.forEach(axis => {
            let len2 = len;
            if (this._splitted) {
                len2 *= this._splits[axis.side ? 1 : 0];
            }
            axis.calcPoints(len2, phase);
        });
    }

    /**
     * 데이터 및 속성 변경 후 다시 그리게 한다.
     */
    update(): void {
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadTemplates(src: any): void {
        if (isObject(src)) {
            const templs = this._templates = {};

            for (const p in src) {
                const v = src[p];
                if (isObject(v)) {
                    templs[p] = Object.assign({}, v);
                }
            }
            this.assignTemplates = this.$_assignTemplates.bind(this);
        } else {
            this.assignTemplates = void 0;
        }
    }

    _getGroupType(type: string): any {
        return isString(type) && group_types[type.toLowerCase()];
    }

    _getSeriesType(type: string): any {
        return isString(type) && series_types[type.toLowerCase()];
    }

    _getAxisType(type: string): any {
        return isString(type) && axis_types[type.toLowerCase()];
    }

    _getGaugeType(type: string): any {
        return isString(type) && gauge_types[type.toLowerCase()];
    }

    _getGaugeGroupType(type: string): any {
        return isString(type) && gauge_group_types[type.toLowerCase()];
    }

    getAxesGap(): number {
        return this._options.axisGap || 0;
    }

    _modelChanged(item: ChartItem): void {
        this._fireEvent('onModelChanged', item);
    }

    _visibleChanged(item: ChartItem): void {
        this._fireEvent('onVisibleChanged', item);
    }

    _pointVisibleChanged(series: Series, point: DataPoint): void {
        this._fireEvent('onPointVisibleChanged', series, point);
    }
}