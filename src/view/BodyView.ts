////////////////////////////////////////////////////////////////////////////////
// BodyView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../common/ElementPool";
import { LayerElement, RcElement } from "../common/RcControl";
import { ISize, Size } from "../common/Size";
import { Align, VerticalAlign, _undefined } from "../common/Types";
import { LineElement } from "../common/impl/PathElement";
import { RectElement } from "../common/impl/RectElement";
import { TextAnchor, TextElement, TextLayout } from "../common/impl/TextElement";
import { Chart } from "../main";
import { Axis, AxisGrid, AxisGuide, AxisGuideLine, AxisGuideRange } from "../model/Axis";
import { Body } from "../model/Body";
import { PlotItem } from "../model/PlotItem";
import { Series } from "../model/Series";
import { BarSeries, ColumnSeries } from "../model/series/BarSeries";
import { BoxPlotSeries } from "../model/series/BoxPlotSeries";
import { BubbleSeries } from "../model/series/BubbleSeries";
import { FunnelSeries } from "../model/series/FunnelSeries";
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
import { FunnelSeriesView } from "./impl/FunnelSeriesView";
import { HistogramSeriesView } from "./impl/HistogramSeriesView";
import { LineSeriesViewImpl } from "./impl/LineSeriesView";
import { PieSeriesView } from "./impl/PieSeriesView";
import { ScatterSeriesView } from "./impl/ScatterSeriesView";

const series_types = new Map<any, any>([
    [BoxPlotSeries, BoxPlotSeriesView],
    [BarSeries, BarSeriesView],
    [ColumnSeries, BarSeriesView],
    [AreaRangeSeries, AreaRangeSeriesView],
    [AreaSeries, AreaSeriesView],
    [LineSeries, LineSeriesViewImpl],
    [BubbleSeries, BubbleSeriesView],
    [ScatterSeries, ScatterSeriesView],
    [HistogramSeries, HistogramSeriesView],
    [PieSeries, PieSeriesView],
    [FunnelSeries, FunnelSeriesView]
]);

export class AxisGridView extends ChartElement<AxisGrid> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lines = new ElementPool(this, LineElement);

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
        const axis = model.axis;
        const ticks = axis._ticks;

        this._lines.prepare(ticks.length, (line) => {
        });
        return Size.create(hintWidth, hintHeight);
    }

    protected _doLayout(): void {
        const axis = this.model.axis;
        const ticks = axis._ticks;

        if (axis._isHorz) {
            this._lines.forEach((line, i) => {
                line.setVLineC(ticks[i].pos, 0, this.height);
            });
        } else {
            this._lines.forEach((line, i) => {
                line.setHLineC(ticks[i].pos, 0, this.width);
            });
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}

export abstract class AxisGuideView<T extends AxisGuide> extends RcElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    model: T;
    protected _label: TextElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-axis-guid');

        this.add(this._label = new TextElement(doc));
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    vertical(): boolean {
        return !this.model.axis._isHorz;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    prepare(model: T): void {
        this.model = model;
        this._label.text = model.label.text;
        this._label.setStyles(model.label.style);
    }

    abstract layout(width: number, height: number): void;
}

export class AxisGuideLineView extends AxisGuideView<AxisGuideLine> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _line: LineElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc);

        this.insertFirst(this._line = new LineElement(doc, 'rct-axis-guide-line'));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    prepare(model: AxisGuideLine): void {
        super.prepare(model);

        this._line.setStyles(model.style);
    }

    layout(width: number, height: number): void {
        const label = this.model.label;
        const labelView = this._label;
        let x: number;
        let y: number;
        let anchor: TextAnchor;
        let layout: TextLayout;

        if (this.vertical) {
            this._line.setVLineC(0, 0, height);

            switch (label.align) {
                case Align.CENTER:
                    x = 0;
                    anchor = TextAnchor.MIDDLE;
                    break;

                case Align.RIGHT:
                    x = 0;
                    anchor = TextAnchor.START;
                    break;

                default:
                    x = 0;
                    anchor = TextAnchor.END;
                    break;
            }

            switch (label.verticalAlign) {
                case VerticalAlign.BOTTOM:
                    y = height;
                    layout = TextLayout.BOTTOM;
                    break;

                case VerticalAlign.MIDDLE:
                    y = height / 2;
                    layout = TextLayout.MIDDLE;
                    break;

                default:
                    y = 0;
                    layout = TextLayout.TOP;
                    break;
            }
        } else {
            this._line.setHLineC(0, 0, width);

            switch (label.align) {
                case Align.CENTER:
                    x = width / 2;
                    anchor = TextAnchor.MIDDLE;
                    break;

                case Align.RIGHT:
                    x = width;
                    anchor = TextAnchor.END;
                    break;

                default:
                    x = 0;
                    anchor = TextAnchor.START;
                    break;
            }

            switch (label.verticalAlign) {
                case VerticalAlign.BOTTOM:
                    y = 1;
                    layout = TextLayout.TOP;
                    break;

                case VerticalAlign.MIDDLE:
                    y = 0;
                    layout = TextLayout.MIDDLE;
                    break;

                default:
                    // y = -3; 
                    // layout = TextLayout.BOTTOM;
                    y = -labelView.getBBounds().height;
                    layout = TextLayout.TOP;
                    break;
            }
        }
        labelView.anchor = anchor;
        labelView.layout = layout;
        labelView.translate(x, y);
    }
}

export class AxisGuideRangeView extends AxisGuideView<AxisGuideRange> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _rect: RectElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc);

        this.insertFirst(this._rect = new RectElement(doc, 'rct-axis-guide-range'));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    prepare(model: AxisGuideRange): void {
        super.prepare(model);
    }

    layout(width: number, height: number): void {
        const label = this._label;

        if (this.vertical) {
        } else {
            const m = this.model.label;
            let x: number;
            let y: number;
            let anchor: TextAnchor;
            let layout: TextLayout;

            switch (m.align) {
                case Align.CENTER:
                    x = width / 2;
                    anchor = TextAnchor.MIDDLE;
                    break;

                case Align.RIGHT:
                    x = width;
                    anchor = TextAnchor.END;
                    break;

                default:
                    x = 0;
                    anchor = TextAnchor.START;
                    break;
            }

            switch (m.verticalAlign) {
                case VerticalAlign.BOTTOM:
                    y = height - label.getBBounds().height;
                    layout = TextLayout.TOP;
                    break;

                case VerticalAlign.MIDDLE:
                    y = height / 2;
                    layout = TextLayout.MIDDLE;
                    break;

                default:
                    y = 0;
                    layout = TextLayout.TOP;
                    break;
            }

            label.anchor = anchor;
            label.layout = layout;
            label.translate(x, y);

            this._rect.setBounds(0, 0, width, height);
        }
    }
}

export class BodyView extends ChartElement<Body> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _polar: boolean;
    private _background: RectElement;
    private _gridContainer: RcElement;
    protected _gridViews = new Map<Axis, AxisGridView>();
    private _seriesContainer: RcElement;
    protected _seriesViews: SeriesView<Series>[] = [];
    private _seriesMap = new Map<Series, SeriesView<Series>>();
    private _series: Series[];
    // guides
    private _guideMap: any = {};
    private _guideContainer: RcElement;
    private _guideLines: ElementPool<AxisGuideLineView>;
    private _guideRanges: ElementPool<AxisGuideRangeView>;
    private _frontGuideContainer: RcElement;
    private _frontGuideLines: ElementPool<AxisGuideLineView>;
    private _frontGuideRanges: ElementPool<AxisGuideRangeView>;
    // items
    // private _itemMap = new Map<PlotItem, PlotItemView>();

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-body');

        this.add(this._background = new RectElement(doc));
        this.add(this._gridContainer = new LayerElement(doc, 'rct-grids'));
        this.add(this._guideContainer = new LayerElement(doc, 'rct-guides'));
        this.add(this._seriesContainer = new LayerElement(doc, 'rct-series-container'));
        this.add(this._frontGuideContainer = new LayerElement(doc, 'rct-front-guides'));

        this._guideLines = new ElementPool(this._guideContainer, AxisGuideLineView);
        this._guideRanges = new ElementPool(this._guideContainer, AxisGuideRangeView);
        this._frontGuideLines = new ElementPool(this._frontGuideContainer, AxisGuideLineView);
        this._frontGuideRanges = new ElementPool(this._frontGuideContainer, AxisGuideRangeView);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: Body, hintWidth: number, hintHeight: number, phase: number): ISize {
        const chart = model.chart as Chart;

        // series
        this.$_prepareSeries(doc, chart._getSeries().visibles())

        this._seriesViews.forEach((v, i) => {
            v.measure(doc, this._series[i], hintWidth, hintHeight, phase);
        })

        this._polar = chart._polar;

        if (!this._polar) {
            // axis grids
            this.$_prepareGrids(doc, chart);

            for (const axis of this._gridViews.keys()) {
                this._gridViews.get(axis).measure(doc, axis.grid, hintWidth, hintHeight, phase);
            }

            // guides
            this.$_prepareGuides(doc, chart);
        }

        return Size.create(hintWidth, hintHeight);
    }
    
    protected _doLayout(): void {
        const w = this.width;
        const h = this.height;

        // series
        this._seriesViews.forEach(v => {
            v.resize(w, h);
            v.layout();
        })
        
        if (!this._polar) {
            // axis grids
            for (const v of this._gridViews.values()) {
                v.resize(w, h);
                v.layout();
            }
        }
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

    private $_prepareGrids(doc: Document, chart: Chart): void {
        const polar = !chart.needAxes();
        const container = this._gridContainer;
        const views = this._gridViews;

        for (const axis of views.keys()) {
            if (polar || !chart.containsAxis(axis) || !axis.grid.isVisible()) {
                views.get(axis).remove();
                views.delete(axis);
            }
        }

        [chart._getXAxes(), chart._getYAxes()].forEach(axes => axes.forEach(axis => {
            if (!polar && axis.grid.isVisible() && !views.has(axis)) {
                const v = new AxisGridView(doc);

                views.set(axis, v);
                container.add(v);
            }
        }));
    }

    private $_prepareGuides(doc: Document, chart: Chart): void {
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
