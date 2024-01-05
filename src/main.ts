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
export const createData = Globals.createData;

export { 
    RcChartData 
} from "./api/RcChartData";
export { 
    RcChartControl 
} from "./api/RcChartControl";
export { 
    RcChartObject,
    RcNamedObject,

    RcChartAxis,
    RcChartSeries,
    RcSeriesGroup,
    RcChartGauge,
    RcGaugeGroup,
    RcAnnotation,

    RcTitle,
    RcSubtitle,
    RcLegend,
    RcBody
} from "./api/RcChartModels";