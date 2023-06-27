////////////////////////////////////////////////////////////////////////////////
// BodyView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from "../common/RcControl";
import { ISize } from "../common/Size";
import { AxisGrid } from "../model/Axis";
import { Body } from "../model/Body";
import { Series } from "../model/Series";
import { BarSeries, ColumnSeries } from "../model/series/BarSeries";
import { BoxPlotSeries } from "../model/series/BoxPlotSeries";
import { BubbleSeries } from "../model/series/BubbleSeries";
import { HistogramSeries } from "../model/series/HistogramSeries";
import { LineSeries } from "../model/series/LineSeries";
import { PieSeries } from "../model/series/PieSeries";
import { ScatterSeries } from "../model/series/ScatterSeries";
import { ChartElement } from "./ChartElement";
import { SeriesView } from "./SeriesView";
import { BarSeriesView } from "./impl/BarSeriesView";
import { BoxPlotSeriesView } from "./impl/BoxPlotSeriesView";
import { BubbleSeriesView } from "./impl/BubbleSeriesView";
import { ColumnSeriesView } from "./impl/ColumnSeriesView";
import { HistogramSeriesView } from "./impl/HistogramSeriesView";
import { LineSeriesView } from "./impl/LineSeriesView";
import { PieSeriesView } from "./impl/PieSeriesView";
import { ScatterSeriesView } from "./impl/ScatterSeriesView";

const series_map = new Map<any, any>([
    [BarSeries, BarSeriesView],
    [ColumnSeries, ColumnSeriesView],
    [LineSeries, LineSeriesView],
    [BoxPlotSeries, BoxPlotSeriesView],
    [BubbleSeries, BubbleSeriesView],
    [ScatterSeries, ScatterSeriesView],
    [HistogramSeries, HistogramSeriesView],
    [PieSeries, PieSeriesView],
]);

class GridView extends ChartElement<AxisGrid> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: AxisGrid, hintWidth: number, hintHeight: number, phase: number): ISize {
        throw new Error("Method not implemented.");
    }

    protected _doLayout(): void {
        throw new Error("Method not implemented.");
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}

export class BodyView extends ChartElement<Body> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _gridContainer: RcElement;
    private _gridViews: GridView[];
    private _seriesContainer: RcElement;
    private _seriesViews: SeriesView<Series>[];

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: Body, hintWidth: number, hintHeight: number, phase: number): ISize {
        throw new Error("Method not implemented.");
    }
    
    protected _doLayout(): void {
        throw new Error("Method not implemented.");
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_createSeriesView(doc: Document, series: Series): SeriesView<Series> {
        for (const cls in series_map) {
            if (series instanceof (cls as any)) {
                return new (series_map.get(cls))(doc);
            }
        }
    }
}