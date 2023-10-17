////////////////////////////////////////////////////////////////////////////////
// RcChartControl.ts
// 2023. 09. 15. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartControl } from "../ChartControl";
import { ChartItem } from "../model/ChartItem";
import { Gauge } from "../model/Gauge";
import { Series } from "../model/Series";
import { RcAreaRangeSeries, RcAreaSeries, RcBarRangeSeries, RcBarSeries, RcBellCurveSeries, RcBoxPlotSeries, RcBubbleSeries, RcBulletGauge, RcCandlestickSeries, RcChartGauge, RcChartObject, RcChartSeries, RcCircleGauge, RcClockGauge, RcDumbbellSeries, RcEqualizerSeries, RcErrorBarSeries, RcFunnelSeries, RcGaugeGroup, RcHeatmapSeries, RcHistogramSeries, RcLineSeries, RcLinearGauge, RcLollipopSeries, RcOhlcSeries, RcParetoSeries, RcPieSeries, RcScatterSeries, RcTreemapSeries, RcVectorSeries, RcWaterfallSeries } from "./RcChartModels";

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

    /** @internal */
    constructor(control: ChartControl) {
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
     */
    refresh(): void {
        this.$_p.refresh();
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
}