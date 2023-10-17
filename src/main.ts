////////////////////////////////////////////////////////////////////////////////
// main.ts
// 2021. 11. 25. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Globals } from "./globals";

export const getVersion = Globals.getVersion;
export const setDebugging = Globals.setDebugging;
export const setAnimatable = Globals.setAnimatable;
export const createChart = Globals.createChart;

export { RcChartControl } from "./api/RcChartControl";
export { 
    RcChartObject, 
    RcChartSeries,
    RcLineSeries,
    RcAreaSeries,
    RcAreaRangeSeries,
    RcBarSeries,
    RcBarRangeSeries,
    RcBellCurveSeries,
    RcBoxPlotSeries,
    RcBubbleSeries,
    RcScatterSeries,
    RcCandlestickSeries,
    RcDumbbellSeries,
    RcEqualizerSeries,
    RcFunnelSeries,
    RcHeatmapSeries,
    RcTreemapSeries,
    RcHistogramSeries,
    RcLollipopSeries,
    RcParetoSeries,
    RcPieSeries,
    RcVectorSeries,
    RcWaterfallSeries,
    RcSeriesGroup,
    RcBarSeriesGroup,
    RcLineSeriesGroup,
    RcAreaSeriesGroup,
    RcPieSeriesGroup,
    RcBumpSeriesGroup,
    RcChartGauge,
    RcValueGauge,
    RcCircleGauge,
    RcLinearGauge,
    RcBulletGauge,
    RcClockGauge,
    RcGaugeGroup,
    RcCircleGaugeGroup,
    RcLinearGaugeGroup,
    RcBulletGaugeGroup,
} from "./api/RcChartModels";