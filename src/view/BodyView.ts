////////////////////////////////////////////////////////////////////////////////
// BodyView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from "../common/RcControl";
import { ISize, Size } from "../common/Size";
import { RectElement } from "../common/impl/RectElement";
import { AxisGrid } from "../model/Axis";
import { Body } from "../model/Body";
import { Series } from "../model/Series";
import { BarSeries, ColumnSeries } from "../model/series/BarSeries";
import { BoxPlotSeries } from "../model/series/BoxPlotSeries";
import { BubbleSeries } from "../model/series/BubbleSeries";
import { HistogramSeries } from "../model/series/HistogramSeries";
import { AreaRangeSeries, AreaSeries, LineSeries } from "../model/series/LineSeries";
import { PieSeries } from "../model/series/PieSeries";
import { ScatterSeries } from "../model/series/ScatterSeries";
import { ChartElement } from "./ChartElement";
import { SeriesView } from "./SeriesView";
import { AreaRangeSeriesView } from "./impl/AreaRangeSeriesView";
import { AreaSeriesView } from "./impl/AreaSeriesView";
import { BarSeriesView } from "./impl/BarSeriesView";
import { BoxPlotSeriesView } from "./impl/BoxPlotSeriesView";
import { BubbleSeriesView } from "./impl/BubbleSeriesView";
import { ColumnSeriesView } from "./impl/ColumnSeriesView";
import { HistogramSeriesView } from "./impl/HistogramSeriesView";
import { LineSeriesViewImpl } from "./impl/LineSeriesView";
import { PieSeriesView } from "./impl/PieSeriesView";
import { ScatterSeriesView } from "./impl/ScatterSeriesView";

const series_types = new Map<any, any>([
    [BarSeries, BarSeriesView],
    [ColumnSeries, ColumnSeriesView],
    [AreaRangeSeries, AreaRangeSeriesView],
    [AreaSeries, AreaSeriesView],
    [LineSeries, LineSeriesViewImpl],
    [BoxPlotSeries, BoxPlotSeriesView],
    [BubbleSeries, BubbleSeriesView],
    [ScatterSeries, ScatterSeriesView],
    [HistogramSeries, HistogramSeriesView],
    [PieSeries, PieSeriesView],
]);

class AxisGridView extends ChartElement<AxisGrid> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-axis-grid');
    }

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
    private _polar = false;
    private _background: RectElement;
    private _gridContainer: RcElement;
    private _gridViews: AxisGridView[];
    private _seriesContainer: RcElement;
    private _seriesViews: SeriesView<Series>[] = [];
    private _seriesMap = new Map<Series, SeriesView<Series>>();
    private _series: Series[];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-body');

        this.add(this._background = new RectElement(doc));
        this.add(this._gridContainer = new RcElement(doc));
        this.add(this._seriesContainer = new RcElement(doc));
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setPolar(value: boolean): void {
        if (value !== this._polar) {
            this._polar = value;
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: Body, hintWidth: number, hintHeight: number, phase: number): ISize {
        this.$_prepareSeries(doc, model.chart._getSeries().visibles())

        this._seriesViews.forEach((v, i) => {
            v.measure(doc, this._series[i], hintWidth, hintHeight, phase);
        })

        return Size.create(hintWidth, hintHeight);
    }
    
    protected _doLayout(): void {
        this._seriesViews.forEach(v => {
            v.resize(this.width, this.height);
            v.layout();
        })
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_createSeriesView(doc: Document, series: Series): SeriesView<Series> {
        for (const cls of series_types.keys()) {
            if (series instanceof (cls as any)) {
                return new (series_types.get(cls))(doc);
            }
        }
    }

    private $_prepareSeries(doc: Document, series: Series[]): void {
        const container = this._seriesContainer;
        const map = this._seriesMap;
        const views = this._seriesViews;

        this._series = series;
        views.forEach(v => v.remove());
        views.length = 0;

        series.forEach(ser => {
            let v = map.get(ser);
            
            if (v) {
                map.delete(ser);
            } else {
                v = this.$_createSeriesView(doc, ser);
            }
            views.push(v);
        });
    
        map.clear();

        views.forEach((v, i) => {
            container.add(v);
            map.set(series[i], v);
        });
    }
}