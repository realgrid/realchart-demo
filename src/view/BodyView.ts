////////////////////////////////////////////////////////////////////////////////
// BodyView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../common/ElementPool";
import { PathBuilder } from "../common/PathBuilder";
import { IPoint } from "../common/Point";
import { ClipElement, LayerElement, PathElement, RcControl, RcElement } from "../common/RcControl";
import { ISize, Size } from "../common/Size";
import { Align, VerticalAlign, _undefined, assert } from "../common/Types";
import { ImageElement } from "../common/impl/ImageElement";
import { LineElement } from "../common/impl/PathElement";
import { BoxElement, RectElement } from "../common/impl/RectElement";
import { TextAnchor, TextElement, TextLayout } from "../common/impl/TextElement";
import { Axis, AxisGrid, AxisGuide, AxisGuideLine, AxisGuideRange } from "../model/Axis";
import { Body } from "../model/Body";
import { Chart, IChart } from "../model/Chart";
import { Crosshair } from "../model/Crosshair";
import { DataPoint } from "../model/DataPoint";
import { Series } from "../model/Series";
import { AxisBreak, LinearAxis } from "../model/axis/LinearAxis";
import { ChartElement } from "./ChartElement";
import { IPointView, SeriesView } from "./SeriesView";
import { AreaRangeSeriesView } from "./series/AreaRangeSeriesView";
import { AreaSeriesView } from "./series/AreaSeriesView";
import { BarRangeSeriesView } from "./series/BarRangeSeriesView";
import { BarSeriesView } from "./series/BarSeriesView";
import { BellCurveSeriesView } from "./series/BellCurveSeriesView";
import { BoxPlotSeriesView } from "./series/BoxPlotSeriesView";
import { BubbleSeriesView } from "./series/BubbleSeriesView";
import { CandlestickSeriesView } from "./series/CandlestickSeriesView";
import { DumbbellSeriesView } from "./series/DumbbellSeriesView";
import { EqualizerSeriesView } from "./series/EqualizerSeriesView";
import { ErrorBarSeriesView } from "./series/ErrorBarSeriesView";
import { FunnelSeriesView } from "./series/FunnelSeriesView";
import { HeatmapSeriesView } from "./series/HeatmapSeriesView";
import { HistogramSeriesView } from "./series/HistogramSeriesView";
import { LineSeriesView } from "./series/LineSeriesView";
import { LollipopSeriesView } from "./series/LollipopSeriesView";
import { OhlcSeriesView } from "./series/OhlcSeriesView";
import { ParetoSeriesView } from "./series/ParetoSeriesView";
import { PieSeriesView } from "./series/PieSeriesView";
import { ScatterSeriesView } from "./series/ScatterSeriesView";
import { TreemapSeriesView } from "./series/TreemapSeriesView";
import { VectorSeriesView } from "./series/VectorSeriesView";
import { WaterfallSeriesView } from "./series/WaterfallSeriesView";

const series_types = {
    'area': AreaSeriesView,
    'arearange': AreaRangeSeriesView,
    'bar': BarSeriesView,
    'barrange': BarRangeSeriesView,
    'bellcurve': BellCurveSeriesView,
    'boxplot': BoxPlotSeriesView,
    'bubble': BubbleSeriesView,
    'candlestick': CandlestickSeriesView,
    'dumbbell': DumbbellSeriesView,
    'equalizer': EqualizerSeriesView,
    'errorbar': ErrorBarSeriesView,
    'funnel': FunnelSeriesView,
    'heatmap': HeatmapSeriesView,
    'histogram': HistogramSeriesView,
    'line': LineSeriesView,
    'lollipop': LollipopSeriesView,
    'ohlc': OhlcSeriesView,
    'pareto': ParetoSeriesView,
    'pie': PieSeriesView,
    'scatter': ScatterSeriesView,
    'treemap': TreemapSeriesView,
    'vector': VectorSeriesView,
    'waterfall': WaterfallSeriesView,
}

export class AxisGridView extends ChartElement<AxisGrid> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _pts: number[];
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
        this._pts = model.getPoints(model.axis._isHorz ? hintWidth : hintHeight);
        this._lines.prepare(this._pts.length, (line) => {
            line.setClass('rct-axis-grid-line');
        });
        return Size.create(hintWidth, hintHeight);
    }

    protected _doLayout(): void {
        const axis = this.model.axis;
        const w = this.width;
        const h = this.height;
        const pts = this._pts;
        const lines = this._lines;

        if (pts[0] === 0) {
            lines.first.setClass('rct-axis-grid-line-start');
        } 
        if (pts[pts.length - 1] === (axis._isHorz ? w : h)) {
            lines.last.setClass('rct-axis-grid-line-end');
        }

        if (axis._isHorz) {
            lines.forEach((line, i) => {
                // line.setVLine(pts[i], 0, h);
                line.setVLineC(pts[i], 0, h);
            });
        } else {
            lines.forEach((line, i) => {
                // line.setHLine(h - pts[i], 0, w);
                line.setHLineC(h - pts[i], 0, w);
            });
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}

export class AxisBreakView extends RcElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _model: AxisBreak;
    private _upLine: PathElement;
    private _downLine: PathElement;
    private _mask: PathElement;
    private _clip: ClipElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-axis-break');

        this.add(this._mask = new PathElement(doc));
        this._mask.setStyle('stroke', 'none');
        this.add(this._upLine = new PathElement(doc));
        this._upLine.setStyle('fill', 'none');
        this.add(this._downLine = new PathElement(doc));
        this._downLine.setStyle('fill', 'none');
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setModel(model: AxisBreak): void {
        this._model = model;
    }

    layout(width: number, height: number, vertical: boolean): void {
        if (this._clip) {
            this._clip.resize(width, height);
        } else {
            this._clip = this.control.clipBounds(0, 0, width, height);
        }
        this.setClip(this._clip);

        const m = this._model;
        const len = m._sect.len;
        const pb = new PathBuilder();

        if (vertical) {
            let y = 0;
            let x1 = 0;
            let x2 = len / 2;
            let x3 = len;

            pb.move(x1, y);
            while (y < height) {
                y += 20;
                pb.line(x2, y);
                y += 20;
                pb.line(x1, y);
            }
            this._downLine.setPath(pb.end(false));

            y = 0;
            pb.clear().move(x2, y);
            while (y < height) {
                y += 20;
                pb.line(x3, y);
                y += 20;
                pb.line(x2, y);
            }
            this._upLine.setPath(pb.end(false));

            y = 0;
            pb.clear().move(x1);
            while (y < height) {
                y += 20;
                pb.line(x2, y);
                y += 20;
                pb.line(x1, y);
            }
            pb.line(x2, y);
            while (y >= 0) {
                y -= 20;
                pb.line(x3, y);
                y -= 20;
                pb.line(x2, y);
            }
            this._mask.setPath(pb.end());
        } else {
            let x = 0;
            let y1 = 0;
            let y2 = len / 2;
            let y3 = len;

            pb.move(x, y2);
            while (x < width) {
                x += 20;
                pb.line(x, y1);
                x += 20;
                pb.line(x, y2);
            }
            this._upLine.setPath(pb.end(false));

            x = 0;
            pb.clear().move(x, y3);
            while (x < width) {
                x += 20;
                pb.line(x, y2);
                x += 20;
                pb.line(x, y3);
            }
            this._downLine.setPath(pb.end(false));

            x = 0;
            pb.clear().move(x, y2);
            while (x < width) {
                x += 20;
                pb.line(x, y1);
                x += 20;
                pb.line(x, y2);
            }
            pb.line(x, y3);
            while (x >= 0) {
                x -= 20;
                pb.line(x, y2);
                x -= 20;
                pb.line(x, y3);
            }
            this._mask.setPath(pb.end());
        }
    }
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
        super(doc, 'rct-axis-guide');

        this.add(this._label = new TextElement(doc, 'rct-axis-guide-label'));
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    vertical(): boolean {
        return this.model.axis._isHorz;
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
        const m = this.model;
        const label = m.label;
        const labelView = this._label;
        let x: number;
        let y: number;
        let anchor: TextAnchor;
        let layout: TextLayout;

        if (this.vertical()) {
            const p = m.axis.getPosition(width, m.value, true);

            this._line.setVLineC(p, 0, height);

            switch (label.align) {
                case Align.CENTER:
                    x = p;
                    anchor = TextAnchor.MIDDLE;
                    break;

                case Align.RIGHT:
                    x = p;
                    anchor = TextAnchor.START;
                    break;

                default:
                    x = p;
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
            const p = height - m.axis.getPosition(height, m.value, true);

            this._line.setHLineC(p, 0, width);

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
                    y = p + 1;
                    layout = TextLayout.TOP;
                    break;

                case VerticalAlign.MIDDLE:
                    y = p;
                    layout = TextLayout.MIDDLE;
                    break;

                default:
                    // y = -3; 
                    // layout = TextLayout.BOTTOM;
                    y = p - labelView.getBBounds().height;
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
    private _box: BoxElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc);

        this.insertFirst(this._box = new BoxElement(doc, 'rct-axis-guide-range'));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    prepare(model: AxisGuideRange): void {
        super.prepare(model);
    }

    layout(width: number, height: number): void {
        const m = this.model;
        const label = this._label;

        if (this.vertical()) {
            const x1 = m.axis.getPosition(width, m.start, true);
            const x2 = m.axis.getPosition(width, m.end, true);

            let x: number;
            let y: number;
            let anchor: TextAnchor;
            let layout: TextLayout;

            switch (m.label.align) {
                case Align.CENTER:
                    x = x + (x2 - x1) / 2;
                    anchor = TextAnchor.MIDDLE;
                    break;

                case Align.RIGHT:
                    x = x2;
                    anchor = TextAnchor.END;
                    break;

                default:
                    x = x1;
                    anchor = TextAnchor.START;
                    break;
            }

            switch (m.label.verticalAlign) {
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

            label.anchor = anchor;
            label.layout = layout;
            label.translate(x, y);

            this._box.setBox(x1, 0, x2, height);

        } else {
            const y1 = height - this.model.axis.getPosition(height, Math.min(m.start, m.end), true);
            const y2 = height - this.model.axis.getPosition(height, Math.max(m.start, m.end), true);
            let x: number;
            let y: number;
            let anchor: TextAnchor;
            let layout: TextLayout;

            switch (m.label.align) {
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

            switch (m.label.verticalAlign) {
                case VerticalAlign.BOTTOM:
                    y = y1;
                    layout = TextLayout.BOTTOM;
                    break;

                case VerticalAlign.MIDDLE:
                    y = y2 + (y1 - y2) / 2;
                    layout = TextLayout.MIDDLE;
                    break;

                default:
                    y = y2;
                    layout = TextLayout.TOP;
                    break;
            }

            label.anchor = anchor;
            label.layout = layout;
            label.translate(x, y);

            this._box.setBox(0, y2, width, y1);
        }
    }
}

export class AxisGuideContainer extends LayerElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _linePool: AxisGuideLineView[] = []; 
    _rangePool: AxisGuideRangeView[] = [];
    _views: AxisGuideView<AxisGuide>[] = [];

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepare(): void {
        const views = this._views as (AxisGuideLineView | AxisGuideRangeView)[];

        // 뒤쪽에서 부터 pool로 return 시킨다.
        for (let i = views.length - 1; i >= 0; i--) {
            const v = views.pop();

            v.remove();
            if (v instanceof AxisGuideRangeView) {
                this._rangePool.push(v);
            } else {
                this._linePool.push(v);
            }
        }
        assert(views.length === 0, 'GuideContainer.prepare');
    }

    addAll(doc: Document, guides: AxisGuide[]): void {
        guides.forEach(g => {
            if (g instanceof AxisGuideRange) {
                let v = this._rangePool.pop() || new AxisGuideRangeView(doc);

                this.add(v);
                v.prepare(g)
                this._views.push(v);
            } else if (g instanceof AxisGuideLine) {
                let v = this._linePool.pop() || new AxisGuideLineView(doc);

                this.add(v);
                v.prepare(g)
                this._views.push(v);
            }
        });
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    add(child: AxisGuideView<AxisGuide>): RcElement {
        this._views.push(child);
        return super.add(child);
    }
}

class CrosshairLineView extends LineElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _model: Crosshair;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-crosshair-line');

        this.setStyle('pointerEvents', 'none');
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setModel(model: Crosshair): void {
        if (model != this._model) {
            this._model = model;
        }
    }

    layout(x: number, y: number, width: number, height: number): void {
        if (this._model.axis._isHorz) {
            this.setVLine(x, 0, height);
        } else {
            this.setHLine(y, 0, width);
        }
    }
}

export interface IPlottingOwner {

    clipSeries(view: RcElement, x: number, y: number, w: number, h: number, invertable: boolean): void;
    showTooltip(series: Series, point: DataPoint): void;
    hideTooltip(): void;
}

export class BodyView extends ChartElement<Body> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly BODY_CLASS = 'rct-plot';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _owner: IPlottingOwner;
    private _polar: boolean;
    private _background: RectElement;
    private _image: ImageElement;
    private _gridContainer: LayerElement;
    protected _gridViews = new Map<Axis, AxisGridView>();
    private _breakViews: AxisBreakView[] = [];
    private _seriesContainer: LayerElement;
    protected _seriesViews: SeriesView<Series>[] = [];
    private _seriesMap = new Map<Series, SeriesView<Series>>();
    private _series: Series[];
    // guides
    _guideContainer: AxisGuideContainer;
    _frontGuideContainer: AxisGuideContainer;
    // axis breaks
    _axisBreakContainer: LayerElement;
    // items
    // private _itemMap = new Map<PlotItem, PlotItemView>();
    // feedbacks
    private _feedbackContainer: LayerElement;
    private _crosshairLines: ElementPool<CrosshairLineView>;
    private _focused: IPointView = null;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, owner: IPlottingOwner) {
        super(doc, BodyView.BODY_CLASS);

        this._owner = owner;
        this.add(this._background = new RectElement(doc, 'rct-plot-background'));
        this.add(this._image = new ImageElement(doc, 'rct-plot-image'));
        this.add(this._gridContainer = new LayerElement(doc, 'rct-grids'));
        this.add(this._guideContainer = new AxisGuideContainer(doc, 'rct-guides'));
        this.add(this._seriesContainer = new LayerElement(doc, 'rct-series-container'));
        this.add(this._axisBreakContainer = new LayerElement(doc, 'rct-axis-breaks'));
        this.add(this._frontGuideContainer = new AxisGuideContainer(doc, 'rct-front-guides'));
        this.add(this._feedbackContainer = new LayerElement(doc, 'rct-feedbacks'));
        
        this._crosshairLines = new ElementPool(this._feedbackContainer, CrosshairLineView);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepareSeries(doc: Document, chart: IChart): void {
        this.$_prepareSeries(doc, chart, chart._getSeries().visibleSeries());
    }

    prepareGuideContainers(): void {
        this._guideContainer.prepare();
        this._frontGuideContainer.prepare();
    }

    pointerMoved(p: IPoint, target: EventTarget): void {
        const w = this.width;
        const h = this.height;

        this._crosshairLines.forEach(v => {
            if (v.setVisible(p.x >= 0 && p.x < w && p.y >= 0 && p.y < h)) {
                v.layout(p.x, p.y, w, h);
            }
        });

        if (target instanceof SVGElement && (target.classList.contains(SeriesView.POINT_CLASS) || target.parentElement instanceof SVGElement && target.parentElement.classList.contains(SeriesView.POINT_CLASS))) {
            for (let i = this._seriesViews.length - 1; i >= 0; i--) {
                const p = this._seriesViews[i].pointByDom(target) as IPointView;

                if (p) {
                    this.$_setFocused(this._seriesViews[i].model, p);
                    break;
                }
            }
        } else {
            this.$_setFocused(null, null);
        }
    }

    private $_setFocused(series: Series, p: IPointView): boolean {
        if (p != this._focused) {
            if (this._focused) {
                (this._focused as any as RcElement).unsetData(SeriesView.DATA_FOUCS);
            }
            this._focused = p;
            if (this._focused) {
                (this._focused as any as RcElement).setData(SeriesView.DATA_FOUCS);
                this._owner.showTooltip(series, p.point);
            } else {
                this._owner.hideTooltip();
            }
            return true;
        }
    }

    seriesByDom(elt: Element): SeriesView<Series> {
        return this._seriesViews.find(v => v.dom.contains(elt));
    }

    findSeries(ser: Series): SeriesView<Series> {
        return this._seriesViews.find(v => v.model === ser);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: Body, hintWidth: number, hintHeight: number, phase: number): ISize {
        const chart = model.chart as Chart;

        this._polar = chart.isPolar();

        // background
        this._background.setStyleOrClass(model.style);
        this._background.setBoolData('polar', this._polar || chart.isWidget());

        // series
        this._seriesViews.forEach((v, i) => {
            v.measure(doc, this._series[i], hintWidth, hintHeight, phase);
        })

        if (!this._polar) {
            // axis grids
            this.$_prepareGrids(doc, chart);

            for (const axis of this._gridViews.keys()) {
                this._gridViews.get(axis).measure(doc, axis.grid, hintWidth, hintHeight, phase);
            }

            this.$_prepareAxisBreaks(doc, chart);
            this.$_preppareCrosshairs(doc, chart);
        }

        return Size.create(hintWidth, hintHeight);
    }
    
    protected _doLayout(): void {
        const w = this.width;
        const h = this.height;
        const img = this._image;

        // background
        this._background.resize(w, h);

        if (img.setVisible(img.setImage(this.model.image.url, w, h))) {
            img.setStyleOrClass(this.model.image.style);
        }

        // series
        this._seriesViews.forEach(v => {
            this._owner.clipSeries(v.getClipContainer(), 0, 0, w, h, v.invertable());
            v.resize(w, h);
            v.layout();
        })
        
        if (!this._polar) {
            // axis grids
            for (const v of this._gridViews.values()) {
                v.resize(w, h);
                v.layout();
            }

            // axis breaks
            this._breakViews.forEach(v => {
                const m = v._model;
                const axis = m.axis;

                if (axis._isHorz) {
                    if (axis.reversed) {
                        v.translate(w - m._sect.pos, 0);
                    } else {
                        v.translate(m._sect.pos, 0);
                    }
                } else {
                    if (axis.reversed) {
                        v.translate(0, m._sect.pos);
                    } else {
                        v.translate(0, h - m._sect.pos - m._sect.len);
                    }
                }
                v.layout(w, h, m.axis._isHorz);
            });

            // axis guides
            [this._guideContainer, this._frontGuideContainer].forEach(c => {
                c._views.forEach(v => v.layout(w, h));
            });
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_createSeriesView(doc: Document, series: Series): SeriesView<Series> {
        return new series_types[series._type()](doc);

        // for (const cls of series_types.keys()) {
        //     if (series instanceof (cls as any)) {
        //         return new (series_types.get(cls))(doc);
        //     }
        // }
    }

    private $_prepareGrids(doc: Document, chart: Chart): void {
        const needAxes = chart.needAxes();
        const container = this._gridContainer;
        const views = this._gridViews;

        for (const axis of views.keys()) {
            if (!needAxes || !chart.containsAxis(axis) || !axis.grid.isVisible()) {
                views.get(axis).remove();
                views.delete(axis);
            }
        }

        [chart._getXAxes(), chart._getYAxes()].forEach(axes => axes.forEach(axis => {
            if (needAxes && axis.grid.isVisible() && !views.has(axis)) {
                const v = new AxisGridView(doc);

                views.set(axis, v);
                container.add(v);
            }
        }));
    }

    private $_prepareSeries(doc: Document, chart: IChart, series: Series[]): void {
        const container = this._seriesContainer;
        const inverted = chart.isInverted();
        const animatable = RcControl._animatable && chart.animatable();
        const map = this._seriesMap;
        const views = this._seriesViews;

        // series들이 다시 생성됐을 수 있다.
        for (const ser of map.keys()) {
            if (series.indexOf(ser) < 0) {
                map.delete(ser);
            }
        }

        this._series = series;
        views.forEach(v => v.remove());
        views.length = 0;

        series.forEach(ser => {
            const v = map.get(ser) ||this.$_createSeriesView(doc, ser);

            v._setChartOptions(inverted, animatable);
            container.add(v);
            map.set(ser, v);
            views.push(v);
            v.prepareSeries(doc, ser);
        });
    }

    private $_prepareAxisBreaks(doc: Document, chart: IChart): void {
        const container = this._axisBreakContainer;
        const views = this._breakViews;
        const breaks: AxisBreak[] = [];

        [chart._getXAxes(), chart._getYAxes()].forEach(axes => axes.forEach(axis => {
            if (axis instanceof LinearAxis) {
                breaks.push(...(axis.runBreaks() || []));
            }
        }));

        while (views.length < breaks.length) {
            const view = new AxisBreakView(doc);

            container.add(view);
            views.push(view);
        }
        while (views.length > breaks.length) {
            views.pop().remove();
        }

        views.forEach((v, i) => v.setModel(breaks[i]));
    }

    private $_preppareCrosshairs(doc: Document, chart: IChart): void {
        const views = this._crosshairLines;
        const hairs: Crosshair[] = [];

        [chart._getXAxes(), chart._getYAxes()].forEach(axes => axes.forEach(axis => {
            axis.crosshair.visible && hairs.push(axis.crosshair);
        }));

        views.prepare(hairs.length, (v, i) => {
            v.setModel(hairs[i])
        });
    }
}
