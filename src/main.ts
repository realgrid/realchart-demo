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
// export const createChartControl = Globals.createChartControl;
// export const loadChart = Globals.loadChart;
export const createChart = Globals.createChart;

export { ChartControl } from "./ChartControl";
export { Chart } from "./model/Chart";