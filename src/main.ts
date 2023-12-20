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
export const setLogging = Globals.setLogging;
export const setAnimatable = Globals.setAnimatable;
export const createChart = Globals.createChart;

export { 
    RcChartControl 
} from "./api/RcChartControl";
export { 
    RcChartObject, 

    // axis
    RcChartAxis,
    // RcCategoryAxis,
    // RcContinuousAxis,
    // RcLinearAxis,
    // RcTimeAxis,
    // RcLogAxis,

    // series
    RcPointLabel,
    RcChartSeries,
    // RcLineSeries,
    // RcAreaSeries,
    // RcAreaRangeSeries,
    // RcBarSeries,
    // RcBarRangeSeries,
    // RcBellCurveSeries,
    // RcBoxPlotSeries,
    // RcBubbleSeries,
    // RcScatterSeries,
    // RcCandlestickSeries,
    // RcDumbbellSeries,
    // RcEqualizerSeries,
    // RcFunnelSeries,
    // RcHeatmapSeries,
    // RcTreemapSeries,
    // RcHistogramSeries,
    // RcLollipopSeries,
    // RcParetoSeries,
    // RcPieSeries,
    // RcVectorSeries,
    // RcWaterfallSeries,
    RcSeriesGroup,
    // RcBarSeriesGroup,
    // RcLineSeriesGroup,
    // RcAreaSeriesGroup,
    // RcPieSeriesGroup,
    // RcBumpSeriesGroup,

    // gauge
    RcGaugeRangeBand,
    RcGaugeScale,
    RcChartGaugeBase,
    RcChartGauge,
    RcValueGauge,
    RcCircularGauge,
    RcCircleGauge,
    RcLinearGaugeBase as RcLinerGaugeBase,
    RcLinearGauge,
    RcBulletGauge,
    RcClockGauge,
    RcGaugeGroup,
    // RcCircleGaugeGroup,
    // RcLinearGaugeGroup,
    // RcBulletGaugeGroup,

    // annotation
    RcTextAnnotation,
    RcImageAnnotation,
    RcShapeAnnotation,

    // chart
    RcTitle,
    RcSubtitle,
    RcLegend,
    RcBody
} from "./api/RcChartModels";