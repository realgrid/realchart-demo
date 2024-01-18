////////////////////////////////////////////////////////////////////////////////
// Chart.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, isString, mergeObj, pickProp3, assign, isNumber } from "../common/Common";
import { RcEventProvider } from "../common/RcObject";
import { Align, SectionDir, VerticalAlign, _undef } from "../common/Types";
import { AssetCollection } from "./Asset";
import { Axis, AxisCollection, IAxis, PaneXAxisMatrix, PaneYAxisMatrix } from "./Axis";
import { Body } from "./Body";
import { ChartItem, n_char_item } from "./ChartItem";
import { DataPoint } from "./DataPoint";
import { ILegendSource, Legend } from "./Legend";
import { IPlottingItem, ISeries, PlottingItemCollection, Series, SeriesGroup, SeriesGroupLayout } from "./Series";
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
import { AreaRangeSeries, AreaSeries, AreaSeriesGroup, LineSeries, LineSeriesGroup, SplineSeries } from "./series/LineSeries";
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
import { TextAnnotation } from "./annotation/TextAnnotation";
import { ImageAnnotation } from "./annotation/ImageAnnotation";
import { Annotation, AnnotationCollection } from "./Annotation";
import { ShapeAnnotation } from "./annotation/ShapeAnnotation";
import { CircleBarSeries, CircleBarSeriesGroup } from "./series/CircleBarSeries";
import { Utils } from "../common/Utils";
import { ITooltipContext, ITooltipOwner, Tooltip, TooltipLevel } from "./Tooltip";
import { PaletteMode } from "./ChartTypes";
import { ChartDataCollection } from "../data/ChartData";

export interface IChartProxy {
    getChartObject(model: any): object;
}

export interface IChart {
    _proxy: IChartProxy;
    data: ChartDataCollection;
    type: string;
    gaugeType: string;
    assets: AssetCollection;
    _xPaneAxes: PaneXAxisMatrix;
    _yPaneAxes: PaneYAxisMatrix;
    options: ChartOptions;
    exportOptions: IExportOptions;
    first: IPlottingItem;
    firstSeries: Series;
    xAxis: IAxis;
    yAxis: IAxis;
    subtitle: Subtitle;
    tooltip: Tooltip;
    body: Body;
    split: Split;
    colors: string[];
    startOfWeek: number;
    timeOffset: number;

    _createChart(config: any): IChart;
    assignTemplates(target: any): any;

    isEmpty(visibleOnly: boolean): boolean;
    isGauge(): boolean;
    isPolar(): boolean;
    isInverted(): boolean;
    isSplitted(): boolean;
    animatable(): boolean;
    loadAnimatable(): boolean;

    seriesByName(series: string): Series;
    axisByName(axis: string): Axis;
    // getGroup(group: String): SeriesGroup2;
    getAxes(dir: SectionDir, visibleOnly: boolean): Axis[];

    _getGroupType(type: string): any;
    _getSeriesType(type: string): any;
    _getAxisType(type: string): any;
    _getGaugeType(type: string): any;
    _getGaugeGroupType(type: string): any;
    _getAnnotationType(type: string): any;
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

    getParam(target: any, param: string): any;
    setParam(param: string, value: any, redraw?: boolean): void;

    dataChanged(): void;
    isDataChanged(): boolean;
}

const group_types = {
    // TODO: '...group'으로 통일한다.
    'bar': BarSeriesGroup,
    'circlebar': CircleBarSeriesGroup,
    'line': LineSeriesGroup,
    'area': AreaSeriesGroup,
    'pie': PieSeriesGroup,
    'bargroup': BarSeriesGroup,
    'circlebargroup': BarSeriesGroup,
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
    'circlebar': CircleBarSeries,
    'dumbbell': DumbbellSeries,
    'equalizer': EqualizerSeries,
    'errorbar': ErrorBarSeries,
    'funnel': FunnelSeries,
    'heatmap': HeatmapSeries,
    'histogram': HistogramSeries,
    'line': LineSeries,
    'spline': SplineSeries,
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
};

const gauge_types = {
    'circle': CircleGauge,
    'linear': LinearGauge,
    'bullet': BulletGauge,
    'clock': ClockGauge,
};
const gauge_group_types = {
    'circle': CircleGaugeGroup,
    'linear': LinearGaugeGroup,
    'bullet': BulletGaugeGroup,
    'circlegroup': CircleGaugeGroup,
    'lineargroup': LinearGaugeGroup,
    'bulletgroup': BulletGaugeGroup,
};

const annotation_type = {
    'text': TextAnnotation,
    'image': ImageAnnotation,
    'shape': ShapeAnnotation,
};

/**
 * 차트 제작 주체 등을 표시하는 영역에 대한 모델.<br/>
 * 기본적으로 차트 오른쪽 아래에 표시되지만, {@link align}, {@link verticalAlign} 등으로 위치를 지정할 수 있다.
 * {@link url}을 설정하면 마우스 클릭 시 새창을 열고 해당 위치로 이동시킨다.
 */
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
     * 이 속성을 지정하면 click시 해당 새 창(혹은 tab)을 열어서 해당 위치로 이동한다.
     * 
     * @config
     */
    url = 'http://realgrid.com';
    /**
     * true이면 별도의 영역을 차지하지 않고 chart view위에 표시된다.<br/>
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
    /**
     * 크레딧과 차트 영역 사이의 간격.
     */
    gap = 4;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isFloating(): boolean {
        return this.floating || (this.verticalAlign === VerticalAlign.MIDDLE && this.align === Align.CENTER);
    }
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
     * x축 값이 설정되지 않은 시리즈 첫번째 데이터 point에 설정되는 x값.\
     * 이 후에는 {@link xStep}씩 증가시키면서 설정한다.
     * 시리즈의 {@link Series.xStart}가 설정되면 그 값이 사용된다.
     * 
     * @config
     */
    xStart: any = 0;
    /**
     * x축 값이 설정되지 않은 데이터 point에 지정되는 x값의 간격.\
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
     * 
     * @config
     */
    credits = new Credits(null, true);
    /**
     * 데이터포인트에 마우스가 올라가면 나머지 시리즈들을 반투명 처리해서 연결된 데이터포인터의 시리즈를 강조한다.
     */
    seriesHovering = false;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
}

export enum ExportType {
    /** @config */
    PNG = 'png',
    /** @config */
    JPEG = 'jpeg',
    /** @config */
    SVG = 'svg',
    /** @config */
    PDF = 'pdf',
    /** @config */
    PRINT = 'print',
}

export interface IExportOptions {
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 표시 여부 지정
     */
    visible?: boolean
    /**
     * 내보내기 메뉴에 포함할 export type
     */
    menus?: ExportType[];
    /**
     * 내보내기시 저장되는 파일명
     */
    fileName?: string;
    /**
     * 너비, 지정한 너비에 맞춰 높이가 결정됩니다.
     */
    width?: number;
    /**
     * 이미지의 scale
     */
    scale?: number;
    /**
     * 내보내기 실패시 api요청을 보낼 경로
     */
    url?: string;
    /**
     * true로 지정하면 내보내기 결과에 {@link AxisScrollBar}가 포함되지 않는다.
     */
    hideScrollbar?: boolean
    /**
     * true로 지정하면 내보내기 결과에 {@link SeriesNavigator}가 포함되지 않는다.
     */
    hideNavigator?: boolean
    /**
     * true로 지정하면 내보내기 결과에 {@link ZoomButton}가 포함되지 않는다.
     */
    hideZoomButton?: boolean

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
}

export interface IChartEventListener {
    onModelChanged?(chart: Chart, item: ChartItem, tag?: any): void;
    onVisibleChanged?(chart: Chart, item: ChartItem): void;
    onPointVisibleChange?(chart: Chart, series: Series, point: DataPoint): void;
}

/**
 * 차트 설정 모델.
 * 
 * @config chart
 */
export class Chart extends RcEventProvider<IChartEventListener> implements IChart, ITooltipOwner {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _proxy: IChartProxy;
    private _data = new ChartDataCollection();
    private _templates: {[key: string]: any};
    private _assets: AssetCollection;
    private _options: ChartOptions;
    private _title: Title;
    private _subtitle: Subtitle;
    private _legend: Legend;
    private _tooltip: Tooltip;
    private _series: PlottingItemCollection;
    private _xAxes: AxisCollection;
    private _yAxes: AxisCollection;
    private _split: Split;
    _xPaneAxes: PaneXAxisMatrix;
    _yPaneAxes: PaneYAxisMatrix;
    private _gauges: GaugeCollection;
    private _body: Body;
    private _annotations: AnnotationCollection;
    private _navigator: SeriesNavigator;
    private _exportOptions = {
        visible: true,
        useLibrary: false,
        menus: [ExportType.PNG, ExportType.JPEG],
        // menus: [ExportType.PNG, ExportType.JPEG, ExportType.SVG, ExportType.PDF, ExportType.PRINT],
        fileName: 'realchart',
        scale: 1,
        hideNavigator: false,
        hideScrollbar: false,
        hideZoomButton: false
    };
    private _params = {};

    private _inverted: boolean;
    private _splitted: boolean;
    private _polar: boolean;
    private _gaugeOnly: boolean;
    private _config: {[key: string]: any};
    colors: string[];
    assignTemplates: (target: any) => any;
    _loadAnimatable = true;
    _dataChanged = false;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(source?: any) {
        super();

        this._assets = new AssetCollection();
        this._options = new ChartOptions(this, true);
        this._title = new Title(this);
        this._subtitle = new Subtitle(this);
        this._legend = new Legend(this);
        this._tooltip = new Tooltip(this);
        this._split = new Split(this);
        this._series = new PlottingItemCollection(this);
        this._xAxes = new AxisCollection(this, true);
        this._yAxes = new AxisCollection(this, false);
        this._xPaneAxes = new PaneXAxisMatrix(this);
        this._yPaneAxes = new PaneYAxisMatrix(this);
        this._gauges = new GaugeCollection(this);
        this._body = new Body(this);
        this._annotations = new AnnotationCollection(this);
        this._navigator = new SeriesNavigator(this);

        source && this.load(source);
    }

    //-------------------------------------------------------------------------
    // IChart
    //-------------------------------------------------------------------------
    _createChart(config: any): IChart {
        return new Chart(config);
    }

    animatable(): boolean {
        return this._options.animatable !== false;
    }

    loadAnimatable(): boolean {
        return this._loadAnimatable;
    }

    //-------------------------------------------------------------------------
    // ITooltipOwner
    //-------------------------------------------------------------------------
    getTooltipContext(level: TooltipLevel, series: ISeries, point: DataPoint): ITooltipContext {

        // [주의] Axis class에서 SeriesGroup 등을 직접 참조할 수 없어서 여기서 생성한다.
        class AxisContext {
            series: ISeries[];
            constructor(public axis: Axis) {
                this.series = axis.getVisibleSeries();
            }
            getTooltipText(series: ISeries, point: DataPoint): string {
                return SeriesGroup.collectTooltipText(this.axis, this.series, point);
            }
            getTooltipParam(series: ISeries, point: DataPoint, param: string): string {
                return SeriesGroup.inflateTooltipParam(this.series, series, point, param);
            }
        }

        if (level === TooltipLevel.AUTO) {
            const g = series.group;
            if (g && (g.layout === SeriesGroupLayout.OVERLAP || g.layout === SeriesGroupLayout.STACK || g.layout === SeriesGroupLayout.FILL)) {
                level = TooltipLevel.GROUP;
            } 
        }

        switch (level) {
            case TooltipLevel.AXIS:
                return new AxisContext((series as Series)._xAxisObj as Axis);
            case TooltipLevel.GROUP:
                return series.group as SeriesGroup<Series>;
            default:
                return series as Series;
        }
    }

    //-------------------------------------------------------------------------
    // IAnnotationOwner
    //-------------------------------------------------------------------------
    get chart(): IChart { return this }

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
     * 4. 극좌표계에 표시할 수 없는 series들은 표시되지 않는다.
     * 
     * [주의] 차트 로딩 후 변경할 수 없다.
     * 
     * @config
     */
    polar = false;
    /**
     * {@link polar}가 아닌 기본 직교 좌표계일 때 true로 지정하면 x축이 수직, y축이 수평으로 배치된다.\
     * [주의] 차트 로딩 후 변경할 수 없다.
     *
     * @config
     */
    inverted: boolean;
    /**
     * javascript에서 숫자 단위로 전달되는 날짜값은 기본적으로 local이 아니라 new Date 기준이다.
     * 그러므로 보통 숫자로 지정된 날짜값은 utc 값이다.
     * local 기준으로 표시하기 위해, 숫자로 지정된 날짜값에 더해야 하는 시간을 분단위로 지정한다.\
     * ex) 한국은 -9 * 60
     * 
     * 명시적으로 지정하지 않으면 현재 위치에 따른 값으로 자동 설정된다.\
     * [주의] 차트 로딩 후 변경할 수 없다.
     * 
     * @config  
     */
    readonly timeOffset = new Date().getTimezoneOffset();
    /**
     * //TODO: locale에서 기본값 가져오기
     * 한 주의 시작 요일.\
     * ex) 0: 일요일, 1: 월요일
     * 
     * [주의] 차트 로딩 후 변경할 수 없다.
     * 
     * @config
     */
    startOfWeek = 0;

    get data(): ChartDataCollection {
        return this._data;
    }

    get assets(): AssetCollection {
        return this._assets;
    }

    get options(): ChartOptions {
        return this._options;
    }

    get exportOptions(): IExportOptions {
        return this._exportOptions;
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

    get tooltip(): Tooltip {
        return this._tooltip;
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

    get xPaneAxes(): PaneXAxisMatrix {
        return this._xPaneAxes;
    }

    get yPaneAxes(): PaneYAxisMatrix {
        return this._yPaneAxes;
    }

    get seriesNavigator(): SeriesNavigator {
        return this._navigator;
    }

    get config(): {[key: string]: any}{
        return this._config;
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

    /**
     * 차트 보조 요소 설정
     */
    '@config annotation': Annotation[];
    
    getAnnotations(): Annotation[] {
        return this._annotations.getVisibles();
    }

    isGauge(): boolean {
        return this._gaugeOnly;
    }

    isPolar(): boolean {
        return this._polar && this._series.seriesCount() > 0; // #353
    }

    isWidget(): boolean {
        return this._series.isWidget();
    }

    isInverted(): boolean {
        return this._inverted;
    }

    isSplitted(): boolean {
        return this._splitted;
    }

    isEmpty(visibleOnly: boolean): boolean {
        return this._series.isEmpty(visibleOnly) && this._gauges.isEmpty(visibleOnly);
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

    annotationByName(annotation: string): Annotation {
        return this._annotations.getAnnotation(annotation) || 
               (this._splitted ? this._split.getAnnotation(annotation) : this._body.getAnnotation(annotation));
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

    getAxes(dir: SectionDir, visibleOnly: boolean): Axis[] {
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

        if (axes) {
            return visibleOnly ? axes.filter(a => a.visible) : axes;
        }
        return [];
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
        Utils.LOGGING && console.time(sTime);

        this._config = source;

        this._data.load(source.data);

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
        this._assets.load(source.assets || source.asset);

        // options
        this._options.load(source.options);

        // options
        Object.assign(this._exportOptions, source.exportOptions);

        // titles
        this._title.load(source.title);
        this._subtitle.load(source.subtitle);

        // legend
        this._legend.load(source.legend);

        // tooltip
        this._tooltip.load(source.tooltip);

        // split
        this._split.load(source.split);

        // series - 시리즈를 먼저 로드해야 디폴트 axis를 지정할 수 있다.
        this._series.load(source.series);

        this._gauges.load(source.gauges || source.gauge);
        this._gaugeOnly = this._series.isEmpty(false) && !this._gauges.isEmpty(false);

        if (!this._gaugeOnly) {
            // axes
            // 축은 반드시 존재해야 한다. (TODO: 동적으로 series를 추가하는 경우)
            this._xAxes.load(pickProp3(source.xAxes, source.xAxis, {}));
            this._yAxes.load(pickProp3(source.yAxes, source.yAxis, {}));
        }

        // body
        this._body.load(source.body || source.plot); // TODO: plot 제거

        // annotations
        this._annotations.load(source.annotations || source.annotation, false);

        // series navigator
        this._navigator.load(source.seriesNavigator);

        Utils.log('chart-items:', n_char_item);
        Utils.LOGGING && console.timeEnd(sTime);
    }

    _connectSeries(series: IPlottingItem, isX: boolean): Axis {
        return isX ? this._xAxes.connect(series) : this._yAxes.connect(series);
    }

    dataChanged(): void {
        this._dataChanged = true;
    }

    isDataChanged(): boolean {
        return this._dataChanged;
    }

    prepareRender(): void {
        const xAxes = this._xAxes;
        const yAxes = this._yAxes;
        const split = this._split;

        [xAxes, yAxes].forEach(axes => {
            if (axes.count < 1 && !this._gaugeOnly) {
                // 축은 반드시 존재해야 한다. (TODO: 동적으로 series를 추가하는 경우)
                axes.load({});
            }
        })

        this._inverted = !this._polar && this.inverted;
        this._splitted = split.visible;
        
        xAxes.disconnect();
        yAxes.disconnect();

        // 축에 연결한다.
        this._series.prepareRender();

        // 축의 값 범위를 계산한다. 
        // [주의] 반드시 x축을 먼저 준비해야 한다. seriesGroup.$_collectPoints에서 point.xValue를 사용한다.
        xAxes.collectValues();
        yAxes.collectValues();
        xAxes.collectReferentsValues();
        yAxes.collectReferentsValues();
        // TODO: xAxes.collectRanges() ?
        yAxes.collectRanges();
        xAxes.prepareRender();
        yAxes.prepareRender();

        if (this._splitted && !this._gaugeOnly) {
            // split
            split.prepareRender();

            // axis matrix
            this._xPaneAxes.prepare(xAxes, split._vrows, split._vcols);            
            this._yPaneAxes.prepare(yAxes, split._vrows, split._vcols);            
        }

        // 축이 설정된 후
        this._series.prepareAfter();

        // legend 위치를 결정한다.
        this._legend.prepareRender();

        // gauges
        this._gauges.prepareRender();

        // body
        this._body.prepareRender();

        // annotations
        this._annotations.prepareRender();

        // navigator
        this._navigator.visible && this._navigator.prepareRender();
    }

    afterRender(): void {
        this._dataChanged = false;
        this._xAxes.afterRender();
        this._yAxes.afterRender();
    }

    // 여러번 호출될 수 있다.
    layoutAxes(width: number, height: number, inverted: boolean, phase: number): void {
        this._xAxes.$_buildTicks(inverted ? height : width);
        this._yAxes.$_buildTicks(inverted ? width : height);
        this.$_calcAxesPoints(width, height, inverted, 0);
    }

    private $_calcAxesPoints(width: number, height: number, inverted: boolean, phase: number): void {
        let len = inverted ? height : width;
        this._xAxes.forEach(axis => {
            axis.calcPoints(len, phase);
        });
        len = inverted ? width : height;
        this._yAxes.forEach(axis => {
            axis.calcPoints(len, phase);
        });
    }

    axesLayouted(width: number, height: number, inverted: boolean): void {
        this.$_calcAxesPoints(width, height, inverted, 1);
    }

    /**
     * 데이터 및 속성 변경 후 다시 그리게 한다.
     */
    update(): void {
    }

    getParam(target: any, param: string): any {
        return this._params[param];
    }

    setParam(param: string, value: any, redraw?: boolean): void {
        if (redraw && value !== this._params[param]) {
            this._params[param] = value;
            this._modelChanged(null);
        } else {
            this._params[param] = value;
        }
    }

    addSeries(source: any, animate: boolean): Series {
        const series = this._series.add(source);

        if (series) {
            this.dataChanged();
            this._modelChanged(series);
        }
        return series;
    }

    removeSeries(series: string | Series, animate: boolean): Series {
        const ser = this._series.remove(series);

        if (ser) {
            this.dataChanged();
            this._modelChanged(null);
            return ser; 
        }
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
                    templs[p] = assign({}, v);
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
    
    _getAnnotationType(type: string): any {
        return isString(type) && annotation_type[type.toLowerCase()];
    }

    getAxesGap(): number {
        return this._options.axisGap || 0;
    }

    _modelChanged(item: ChartItem, tag?: any): void {
        this._fireEvent('onModelChanged', item, tag);
    }

    _visibleChanged(item: ChartItem): void {
        this._fireEvent('onVisibleChanged', item);
    }

    _pointVisibleChanged(series: Series, point: DataPoint): void {
        this._fireEvent('onPointVisibleChanged', series, point);
    }
}