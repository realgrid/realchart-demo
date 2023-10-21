////////////////////////////////////////////////////////////////////////////////
// RcChartControl.ts
// 2023. 09. 15. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartControl } from "../ChartControl";
import { Axis } from "../model/Axis";
import { Body } from "../model/Body";
import { ChartItem } from "../model/ChartItem";
import { Gauge } from "../model/Gauge";
import { Legend } from "../model/Legend";
import { Series } from "../model/Series";
import { Subtitle, Title } from "../model/Title";
import { RcAreaRangeSeries, RcAreaSeries, RcBarRangeSeries, RcBarSeries, RcBellCurveSeries, RcBody, RcBoxPlotSeries, RcBubbleSeries, RcBulletGauge, RcCandlestickSeries, RcCategoryAxis, RcChartAxis, RcChartGauge, RcChartObject, RcChartSeries, RcCircleGauge, RcClockGauge, RcDumbbellSeries, RcEqualizerSeries, RcErrorBarSeries, RcFunnelSeries, RcGaugeGroup, RcHeatmapSeries, RcHistogramSeries, RcLegend, RcLineSeries, RcLinearGauge, RcLogAxis, RcLollipopSeries, RcOhlcSeries, RcParetoSeries, RcPieSeries, RcScatterSeries, RcSubtitle, RcTimeAxis, RcTitle, RcTreemapSeries, RcVectorSeries, RcWaterfallSeries } from "./RcChartModels";

const axis_types = {
    'category': RcCategoryAxis,
    'linear': RcLineSeries,
    'time': RcTimeAxis,
    'log': RcLogAxis,
}
const series_types = {
    'area': RcAreaSeries,
    'arearange': RcAreaRangeSeries,
    'bar': RcBarSeries,
    'barrange': RcBarRangeSeries,
    'bellcurve': RcBellCurveSeries,
    'boxplot': RcBoxPlotSeries,
    'bubble': RcBubbleSeries,
    'candlestick': RcCandlestickSeries,
    'dumbbell': RcDumbbellSeries,
    'equalizer': RcEqualizerSeries,
    'errorbar': RcErrorBarSeries,
    'funnel': RcFunnelSeries,
    'heatmap': RcHeatmapSeries,
    'histogram': RcHistogramSeries,
    'line': RcLineSeries,
    'lollipop': RcLollipopSeries,
    'ohlc': RcOhlcSeries,
    'pareto': RcParetoSeries,
    'pie': RcPieSeries,
    'scatter': RcScatterSeries,
    'treemap': RcTreemapSeries,
    'vector': RcVectorSeries,
    'waterfall': RcWaterfallSeries,
};
const gauge_types = {
    'circle': RcCircleGauge,
    'linear': RcLinearGauge,
    'bullet': RcBulletGauge,
    'clock': RcClockGauge,
}

function getObject(map: Map<any, any>, obj: ChartItem): RcChartObject {
    if (obj) {
        let p = map.get(obj);

        if (!p) {
            if (obj instanceof Series) {
                p = new series_types[obj._type()](obj);
            } else if (obj instanceof Gauge) {
                p = new gauge_types[obj._type()](obj);
            } else if (obj instanceof Axis) {
                p = new axis_types[obj.type()](obj);
            } else if (obj instanceof Title) {
                p = new (RcTitle as any)(obj);
            } else if (obj instanceof Subtitle) {
                p = new (RcSubtitle as any)(obj);
            } else if (obj instanceof Legend) {
                p = new (RcLegend as any)(obj);
            } else if (obj instanceof Body) {
                p = new (RcBody as any)(obj);
            }
            map.set(obj, p);
        }
        return p;
    }
}

/**
 * RealChart 컨트롤.
 */
export class RcChartControl {

    private $_p: ChartControl;
    private _objects = new Map<ChartItem, RcChartObject>();

    /** 
     * @internal 
     */
    private constructor(control: ChartControl) {
        this.$_p = control;
    }

    /**
     * 기존 설정 모델을 제거하고 새로운 설정으로 차트를 재구성한다.
     */
    load(config: any, animate?: boolean): void {
        this.$_p.load(config, animate);
        this._objects.clear();
    }
    /**
     * 차트를 다시 그린다.
     * 
     * @param now true로 지정하면 즉시 차트 SVG를 디시 구축한다.
     */
    render(now = false): void {
        this.$_p.refresh(now);
    }
    /**
     * 첫번째 x 축.
     */
    get xAxis(): RcChartAxis {
        return getObject(this._objects, this.$_p.model.xAxis as Axis) as RcChartAxis;
    }
    /**
     * name 매개변수가 문자열이면 지정한 이름의 x 축을,
     * 숫자이면 해당 index에 위치하는 x 축을 리턴한다.
     * 
     * @param name 이름이나 index
     * @returns 축 객체
     */
    getXAxis(name: string | number): RcChartAxis {
        return getObject(this._objects, this.$_p.model.getXAxis(name)) as RcChartAxis;
    }
    /**
     * 첫번째 y 축.
     */
    get yAxis(): RcChartAxis {
        return getObject(this._objects, this.$_p.model.yAxis as Axis) as RcChartAxis;
    }
    /**
     * name 매개변수가 문자열이면 지정한 이름의 y 축을,
     * 숫자이면 해당 index에 위치하는 y 축을 리턴한다.
     * 
     * @param name 이름이나 index
     * @returns 축 객체
     */
    getYAxis(name: string | number): RcChartAxis {
        return getObject(this._objects, this.$_p.model.getYAxis(name)) as RcChartAxis;
    }
    /**
     * 첫번째 시리즈.
     */
    get series(): RcChartSeries {
        return getObject(this._objects, this.$_p.model.firstSeries) as RcChartSeries;
    }
    /**
     * 시리즈 이름에 해당하는 시리즈 객체를 리턴한다.
     * 
     * @param name 시리즈 이름
     * @returns 시리즈 객체
     */
    getSeries(name: string): RcChartSeries {
        return getObject(this._objects, this.$_p.model.seriesByName(name)) as RcChartSeries;
    }
    /**
     * 첫번째 게이지.
     */
    get gauge(): RcChartGauge {
        return getObject(this._objects, this.$_p.model.firstGauge) as RcChartGauge;
    }
    /**
     * 게이지 이름에 해당하는 게이지 객체를 리턴한다.
     * 
     * @param name 게이지 이름
     * @returns 게이지 객체
     */
    getGauge(name: string): RcChartGauge {
        return getObject(this._objects, this.$_p.model.gaugeByName(name)) as RcChartGauge;
    }
    /**
     * 차트 타이틀 모델.
     */
    get title(): RcTitle {
        return getObject(this._objects, this.$_p.model.title) as RcTitle;
    }
    /**
     * 차트 sub 타이틀 모델.
     */
    get subtitle(): RcSubtitle {
        return getObject(this._objects, this.$_p.model.subtitle) as RcSubtitle;
    }
    /**
     * 차트 범례 모델.
     */
    get legend(): RcLegend {
        return getObject(this._objects, this.$_p.model.legend) as RcLegend;
    }
    /**
     * 차트 시리즈들이 그려지는 plotting 영역 모델.
     */
    get body(): RcBody {
        return getObject(this._objects, this.$_p.model.legend) as RcBody;
    }

    setZoom(axis: RcChartAxis, length: number | string): void {
        this.$_p.setZoom(axis.$_p as any, length);
    }

    clearZoom(axis: RcChartAxis): void {
        this.$_p.clearZoom(axis.$_p as any);
    }

    scroll(axis: RcChartAxis, pos: number): void {
        this.$_p.scroll(axis.$_p as any, pos);
    }
}