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
import { ClipRectElement, LayerElement, PathElement, RcControl, RcElement } from "../common/RcControl";
import { ISize, Size } from "../common/Size";
import { Align, FILL, PI_2, VerticalAlign, _undef, assert } from "../common/Types";
import { ImageElement } from "../common/impl/ImageElement";
import { LineElement } from "../common/impl/PathElement";
import { BoxElement, RectElement } from "../common/impl/RectElement";
import { Axis, AxisGrid, AxisGuide, AxisLineGuide, AxisRangeGuide, IAxisGridRow } from "../model/Axis";
import { Body, IPolar } from "../model/Body";
import { Chart, IChart } from "../model/Chart";
import { Crosshair } from "../model/Crosshair";
import { DataPoint } from "../model/DataPoint";
import { Series } from "../model/Series";
import { CategoryAxis } from "../model/axis/CategoryAxis";
import { AxisBreak, LinearAxis } from "../model/axis/LinearAxis";
import { Gauge, GaugeBase } from "../model/Gauge";
import { ChartElement } from "./ChartElement";
import { GaugeView } from "./GaugeView";
import { IPointView, SeriesView } from "./SeriesView";
import { CircleGaugeGroupView, CircleGaugeView } from "./gauge/CircleGaugeView";
import { ClockGaugeView } from "./gauge/ClockGaugeView";
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
import { LinearGaugeGroupView, LinearGaugeView } from "./gauge/LinearGaugeView";
import { BulletGaugeGroupView, BulletGaugeView } from "./gauge/BulletGaugeView";
import { ButtonElement } from "../common/ButtonElement";
import { TextAnnotationView } from "./annotation/TextAnnotationView";
import { Annotation } from "../model/Annotation";
import { AnnotationView } from "./AnnotationView";
import { ImageAnnotationView } from "./annotation/ImageAnnotationView";
import { ShapeAnnotationView } from "./annotation/ShapeAnnotationView";
import { LabelElement } from "../common/impl/LabelElement";
import { CircleBarSeriesView } from "./series/CircleBarSeriesView";
import { cos, isArray, pickNum, sin } from "../common/Common";
import { ArcPolyElement } from "../common/impl/CircleElement";
import { SectorElement } from "../common/impl/SectorElement";
import { SvgShapes } from "../common/impl/SvgShape";

const series_types = {
    'area': AreaSeriesView,
    'arearange': AreaRangeSeriesView,
    'bar': BarSeriesView,
    'barrange': BarRangeSeriesView,
    'bellcurve': BellCurveSeriesView,
    'boxplot': BoxPlotSeriesView,
    'bubble': BubbleSeriesView,
    'candlestick': CandlestickSeriesView,
    'circlebar': CircleBarSeriesView,
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
};
const gauge_types = {
    'circle': CircleGaugeView,
    'linear': LinearGaugeView,
    'bullet': BulletGaugeView,
    'clock': ClockGaugeView,
    'circlegroup': CircleGaugeGroupView,
    'lineargroup': LinearGaugeGroupView,
    'bulletgroup': BulletGaugeGroupView,
};

const annotation_types = {
    'text': TextAnnotationView,
    'image': ImageAnnotationView,
    'shape': ShapeAnnotationView,
}

export function createAnnotationView(doc: Document, annotation: Annotation): AnnotationView<Annotation> {
    return new annotation_types[annotation._type()](doc);
}

export function createSeriesView(doc: Document, series: Series): SeriesView<Series> {
    return new series_types[series._type()](doc);
}

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
        return Size.create(hintWidth, hintHeight);
    }

    protected _doLayout(): void {
        const m = this.model;
        const axis = m.axis;
        const reversed = axis.reversed;
        const w = this.width;
        const h = this.height;
        const pts = m.getPoints(axis._isHorz ? w : h);
        const lines = this._lines.prepare(pts.length, (line) => {
            line.internalClearStyleAndClass();
            line.internalSetStyleOrClass(axis.grid.style);
            line.setClass('rct-axis-grid-line');
        });
        const end = lines.count - 1;
        let p: number;
        let vis: boolean;

        lines.forEach((line, i) => {
            line.setBoolData('first', i === 0);
            line.setBoolData('last', pts[i] === (axis._isHorz ? w : h));
        })

        if (axis._isHorz) {
            lines.forEach((line, i) => {
                // 최소/최대값이 tick에 해당되지 않을 때는 표시한다.
                if (i === 0) {
                    vis = m.startVisible || !reversed && pts[i] > 0 || reversed && pts[i] < w;
                } else if (i === end) {
                    vis = m.endVisible || !reversed && pts[i] < w || reversed && pts[i] > 0;
                } else {
                    vis = true;
                }
                if (line.setVis(true)) {
                    // line.setVLineC(pts[i], 0, h);
                    line.setVLine(axis.prev(pts[i]), 0, h);
                }
            });
        } else {
            lines.forEach((line, i) => {
                p = h - pts[i];
                // 최소/최대값이 tick에 해당되지 않을 때는 표시한다.
                if (i === 0) {
                    vis = m.startVisible || !reversed && p < h || reversed && p > 0;
                } else if (i === end) {
                    vis = m.endVisible || !reversed && p > 0 || reversed && p < h;
                } else {
                    vis = true;
                }
                if (line.setVis(vis)) {
                    // line.setHLineC(h - pts[i], 0, w); // TODO: grid line과 pointer가 1 정도 틀어진다. #369
                    line.setHLine(h - axis.prev(pts[i]), 0, w);
                }
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
    private _clip: ClipRectElement;

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
            pb.clear().move(x1, y);
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
    protected _labelView: LabelElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-axis-guide');

        this.add(this._labelView = new LabelElement(doc, 'rct-axis-guide-label'));
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    vertical(): boolean {
        return this.model.axis._isHorz;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepare(doc: Document, model: T): void {
        this.model = model;
        if (this._labelView.setVis(!!model.label.text)) {
            this._labelView.setModel(doc, model.label, null);
            this._labelView.setStyles(model.label.style);
        }
    }

    layout(width: number, height: number, polar?: IPolar): void {
        if (this._labelView.visible) {
            this.model.label.buildSvg(this._labelView._text, this._labelView._outline, width, height, null, null);
            this._labelView.layout(Align.CENTER);
        }
        if (polar) {
            this._doLayoutPolar(width, height, polar);
        } else {
            this._doLayout(width, height);
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    abstract _doLayout(width: number, height: number): void;
    abstract _doLayoutPolar(width: number, height: number, polar: IPolar): void;
}

export class AxisGuideLineView extends AxisGuideView<AxisLineGuide> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _line: RcElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, polar: boolean) {
        super(doc);

        this.insertFirst(this._line = new (polar ? ArcPolyElement : LineElement)(doc, 'rct-axis-guide-line'));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    prepare(doc: Document, model: AxisLineGuide): void {
        super.prepare(doc, model);

        this._line.setStyles(model.style);
    }

    _doLayout(width: number, height: number): void {
        const m = this.model;
        const label = m.label;
        const line = this._line as LineElement;
        const labelView = this._labelView.setVis(label.visible) && this._labelView;
        const rLabel = labelView.getBBox();
        const xOff = pickNum(label.offsetX, 0);
        const yOff = pickNum(label.offsetY, 0);
        let x: number;
        let y: number;

        if (this.vertical()) {
            const p = m.axis.getPos(width, m.value);

            if (labelView.setVis(line.setVis(!isNaN(p)))) {
                line.setVLineC(p, 0, height);

                if (labelView) {
                    switch (label.align) {
                        case Align.CENTER:
                            x = p - rLabel.width / 2 + xOff;
                            break;
                        case Align.RIGHT:
                            x = p + xOff;
                            break;
                        default:
                            x = p - rLabel.width - xOff;
                            break;
                    }
        
                    switch (label.verticalAlign) {
                        case VerticalAlign.BOTTOM:
                            y = height - rLabel.height - yOff;
                            break;
        
                        case VerticalAlign.MIDDLE:
                            y = (height - rLabel.height) / 2 - yOff;
                            break;
        
                        default:
                            y = yOff;
                            break;
                    }
                }
            }
        } else {
            const p = height - m.axis.getPos(height, m.value);

            if (labelView.setVis(line.setVis(!isNaN(p)))) {
                line.setHLineC(p, 0, width);

                if (labelView) {
                    switch (label.align) {
                        case Align.CENTER:
                            x = (width - rLabel.width) / 2 - xOff;
                            break;
                        case Align.RIGHT:
                            x = width - rLabel.width - xOff;
                            break;
                        default:
                            x = xOff;
                            break;
                    }
        
                    switch (label.verticalAlign) {
                        case VerticalAlign.BOTTOM:
                            y = p + yOff;
                            break;
                        case VerticalAlign.MIDDLE:
                            y = p - rLabel.height / 2 - yOff;
                            break;
                        default:
                            y = p - rLabel.height - yOff;
                            break;
                    }
                }
            }
        }
        labelView && labelView.translate(x, y);
    }

    _doLayoutPolar(width: number, height: number, polar: IPolar): void {
        const m = this.model;
        const line = this._line as ArcPolyElement;
        const labelView = this._labelView.setVis(m.label.visible) && this._labelView;
        const start = m.axis.getStartAngle();
        const p = m.axis.getPos(polar.rd, m.value);

        line.setArc(polar.cx, polar.cy, p, start, m.axis.getTotalAngle(), false);
        line.setStyle(FILL, 'none');

        if (labelView) {
            labelView.translate(polar.cx + p * cos(polar.start), polar.cy + p * sin(polar.start));
        }
    }
}

export class AxisGuideRangeView extends AxisGuideView<AxisRangeGuide> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _box: BoxElement | SectorElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, polar: boolean) {
        super(doc);

        this.insertFirst(this._box = new (polar ? SectorElement : BoxElement)(doc, 'rct-axis-guide-range'));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    prepare(doc: Document, model: AxisRangeGuide): void {
        super.prepare(doc, model);

        this._box.setStyleOrClass(model.style);
    }

    _doLayout(width: number, height: number): void {
        const m = this.model;
        const label = m.label;
        const box = this._box as BoxElement;
        const start = Math.min(m.startValue, m.endValue);
        const end = Math.max(m.startValue, m.endValue);
        const labelView = this._labelView.setVis(label.visible) && this._labelView;
        const rLabel = labelView.getBBox();
        const xOff = pickNum(label.offsetX, 0);
        const yOff = pickNum(label.offsetY, 0);

        if (this.vertical()) {
            const x1 = m.axis.getPos(width, start);
            const x2 = m.axis.getPos(width, end);

            if (!isNaN(x1) && !isNaN(x2) && labelView.setVis(box.setVis(x2 !== x1))) {
                let x: number;
                let y: number;
    
                switch (label.align) {
                    case Align.CENTER:
                        x = x1 + (x2 - x1 - rLabel.width) / 2 + xOff;
                        break;
                    case Align.RIGHT:
                        x = x2 - rLabel.width - xOff;
                        break;
                    default:
                        x = x1 + xOff;
                        break;
                }
    
                switch (label.verticalAlign) {
                    case VerticalAlign.BOTTOM:
                        y = height - rLabel.height - yOff;
                        break;
                    case VerticalAlign.MIDDLE:
                        y = (height - rLabel.height) / 2 - yOff;
                        break;
                    default:
                        y = yOff;
                        break;
                }
    
                box.setBox(x1, 0, x2, height);
                labelView && labelView.translate(Math.max(0, Math.min(width, x)), y);
            }
        } else {
            const y1 = height - m.axis.getPos(height, start);
            const y2 = height - m.axis.getPos(height, end);

            if (!isNaN(y1) && !isNaN(y2) && labelView.setVis(box.setVis(y1 !== y2))) {
                let x: number;
                let y: number;
    
                switch (label.align) {
                    case Align.CENTER:
                        x = (width - rLabel.width) / 2 - xOff;
                        break;
                    case Align.RIGHT:
                        x = width - rLabel.width - xOff;
                        break;
                    default:
                        x = xOff;
                        break;
                }
    
                switch (label.verticalAlign) {
                    case VerticalAlign.BOTTOM:
                        y = y1 - rLabel.height - yOff;
                        break;
    
                    case VerticalAlign.MIDDLE:
                        y = y2 + (y1 - y2 - rLabel.height) / 2 - yOff;
                        break;
    
                    default:
                        y = y2 + yOff;
                        break;
                }
    
                labelView && labelView.translate(x, y);
                box.setBox(0, y2, width, y1);
            }
        }
    }

    _doLayoutPolar(width: number, height: number, polar: IPolar): void {
        const m = this.model;
        const sector = this._box as SectorElement;
        const labelView = this._labelView.setVis(m.label.visible) && this._labelView;
        const start = m.axis.getStartAngle();
        const p1 = m.axis.getPos(polar.rd, m.startValue);
        const p2 = m.axis.getPos(polar.rd, m.endValue);

        // line.setArc(polar.cx, polar.cy, p, start, m.axis.getTotalAngle(), true);
        // line.setStyle(FILL, 'none');

        sector.setSector({
            cx: polar.cx,
            cy: polar.cy,
            rx: p2,
            ry: p2,
            innerRadius: p1 / p2,
            start: start,
            angle: PI_2,
            clockwise: true
        });

        if (labelView) {
            const p = p1 + (p2 - p1) / 2;
            labelView.translate(polar.cx + p * cos(polar.start), polar.cy + p * sin(polar.start));
        }
    }
}

export class AxisGridRowContainer extends LayerElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _views = new ElementPool(this, PathElement);
    private _rows: IAxisGridRow[];

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepare(): void {
        this._rows = [];
    }

    addAll(doc: Document, axes: Axis[]): void {
        const rows: IAxisGridRow[] = this._rows;

        axes.forEach(axis => {
            if (axis.grid.rows.isEnabled()) {
                rows.push(...axis.grid.rows.getRows());
            }
        });
    }

    layout(width: number, height: number, polar: boolean): void {
        const rows = this._rows;

        this._views.prepare(rows.length);

        this._views.forEach((v, i) => {
            const row = rows[i];

            if (row.axis._isHorz) {
                const x1 = row.axis.getPos(width, row.from);
                const x2 = row.axis.getPos(width, row.to);

                v.setPath(SvgShapes.rectangle(x1, 0, x2 - x1, height));
            } else {
                const y1 = row.axis.getPos(height, row.from);
                const y2 = row.axis.getPos(height, row.to);

                v.setPath(SvgShapes.rectangle(0, height - y1, width, y1 - y2));
            }
            v.setStyle('fill', row.color);
        })
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
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
        const views = this._views;

        // 뒤쪽에서 부터 pool로 return 시킨다.
        while (views.length) {
            const v = views.pop().remove();

            if (v instanceof AxisGuideRangeView) {
                this._rangePool.push(v);
            } else {
                this._linePool.push(v as any);
            }
        }
    }

    addAll(doc: Document, guides: AxisGuide[], polar: boolean): void {
        guides.forEach(g => {
            let v: AxisGuideView<AxisGuide>;

            if (g instanceof AxisRangeGuide) {
                v = this._rangePool.pop() || new AxisGuideRangeView(doc, polar);
            } else if (g instanceof AxisLineGuide) {
                v = this._linePool.pop() || new AxisGuideLineView(doc, polar);
            }
            this.add(v);
            v.prepare(doc, g)
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

class CrosshairView extends PathElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    model: Crosshair;
    private _bar: boolean;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc);

        this.ignorePointer();
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setModel(model: Crosshair): void {
        if (model != this.model) {
            this.model = model;
            this._bar = model.isBar();
            this.setClass(this._bar ? 'rct-crosshair-bar' : 'rct-crosshair-line');
        }
    }

    layout(pv: IPointView, x: number, y: number, width: number, height: number): void {
        const axis = this.model.axis;
        const horz = axis._isHorz;
        const pb = new PathBuilder();

        if (this._bar) {
            const len = axis._isHorz ? width : height;
            let xVal = -1;

            if (pv) {
                xVal = pv.point.xValue;
            } else if (this.model.showAlways && axis instanceof CategoryAxis) {
                if (axis.reversed) {
                    xVal = axis.xValueAt(horz ? width - x : y);
                } else {
                    xVal = axis.xValueAt(horz ? x : height - y);
                }
            }

            // TODO: scrolling
            if (xVal >= 0) {
                const p = axis.getPos(len, xVal);
                const w = axis.getUnitLen(len, xVal);

                if (isNaN(p)) {
                    debugger;
                    console.log(axis.getPos(len, xVal));
                }

                if (horz) {
                    pb.rect(p - w / 2, 0, w, height);
                } else {
                    pb.rect(0, height - p - w / 2, width, w);
                }
            }
        } else if (pv || this.model.showAlways) {
            if (horz) {
                pb.vline(x, 0, height);
            } else {
                pb.hline(y, 0, width);
            }
        }
        this.setPath(pb.end());
    }
}

export class ZoomButton extends ButtonElement {
    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly CLASS_NAME = 'rct-reset-zoom';

    constructor(doc: Document) {
        super(doc, 'Reset Zoom', ZoomButton.CLASS_NAME);

        this.setVis(false);
    }
}

export interface IPlottingOwner {

    clipSeries(view: RcElement, view2: RcElement, x: number, y: number, w: number, h: number, invertable: boolean): void;
    showTooltip(series: Series, point: DataPoint, body: RcElement, p: IPoint): void;
    hideTooltip(): void;
}

export class BodyView extends ChartElement<Body> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly BODY_CLASS = 'rct-body';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _owner: IPlottingOwner;
    private _polar: boolean;
    private _hitTester: RectElement;
    private _background: RectElement;
    private _image: ImageElement;
    _gridRowContainer: AxisGridRowContainer;
    private _gridContainer: LayerElement;
    protected _gridViews = new Map<Axis, AxisGridView>();
    private _breakViews: AxisBreakView[] = [];
    private _seriesContainer: LayerElement;
    private _labelContainer: LayerElement;
    _seriesViews: SeriesView<Series>[] = [];
    private _seriesMap = new Map<Series, SeriesView<Series>>();
    private _series: Series[];
    // annotations
    private _annotationContainer: LayerElement;
    private _frontAnnotationContainer: LayerElement;
    _annotationViews: AnnotationView<Annotation>[] = [];
    private _annotationMap = new Map<Annotation, AnnotationView<Annotation>>();
    private _annotations: Annotation[];
    // guides
    private _gaugeViews: GaugeView<GaugeBase>[] = [];
    private _gaugeMap = new Map<GaugeBase, GaugeView<GaugeBase>>();
    private _gauges: GaugeBase[];
    _guideContainer: AxisGuideContainer;
    _frontGuideContainer: AxisGuideContainer;
    _guideClip: ClipRectElement;
    // axis breaks
    _axisBreakContainer: LayerElement;
    // items
    // private _itemMap = new Map<PlotItem, PlotItemView>();
    private _zoomButton: ZoomButton;
    // feedbacks
    private _feedbackContainer: LayerElement;
    private _crosshairViews: ElementPool<CrosshairView>;

    private _focused: IPointView = null;
    private _focusedSeries: SeriesView<Series>;

    private _inverted: boolean;
    private _zoomRequested: boolean;
    protected _animatable: boolean;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, owner: IPlottingOwner) {
        super(doc, BodyView.BODY_CLASS);

        this._owner = owner;
        this.add(this._hitTester = new RectElement(doc));
        this._hitTester.setStyle('fill', 'transparent');
        this.add(this._background = new RectElement(doc, 'rct-body-background'));
        this.add(this._image = new ImageElement(doc, 'rct-body-image'));
        this.add(this._gridRowContainer = new AxisGridRowContainer(doc, 'rct-grid-rows'));
        this.add(this._gridContainer = new LayerElement(doc, 'rct-grids'));
        this.add(this._guideContainer = new AxisGuideContainer(doc, 'rct-guides'));
        this.add(this._annotationContainer = new LayerElement(doc, 'rct-annotations'));
        this.add(this._seriesContainer = new LayerElement(doc, 'rct-series-container'));
        this.add(this._axisBreakContainer = new LayerElement(doc, 'rct-axis-breaks'));
        this.add(this._labelContainer = new LayerElement(doc, 'rct-label-container'));
        this.add(this._frontGuideContainer = new AxisGuideContainer(doc, 'rct-front-guides'));
        this.add(this._frontAnnotationContainer = new LayerElement(doc, 'rct-front-annotations'));
        this.add(this._feedbackContainer = new LayerElement(doc, 'rct-feedbacks'));
        this.add(this._zoomButton = new ZoomButton(doc));
        
        this._crosshairViews = new ElementPool(this._feedbackContainer, CrosshairView);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepareRender(doc: Document, chart: IChart): void {
        this._animatable = RcControl._animatable && chart.animatable();

        this._prepareSeries(doc, chart, chart._getSeries().getVisibleSeries());
        this._prepareGauges(doc, chart, chart._getGauges().getVisibles());
        this._prepareAnnotations(doc, chart.body.getAnnotations());
    }

    prepareGuideContainers(): void {
        this._guideContainer.prepare();
        this._frontGuideContainer.prepare();
    }

    pointerMoved(p: IPoint, target: EventTarget): boolean {
        const w = this.width;
        const h = this.height;
        const inBody = p.x >= 0 && p.x < w && p.y >= 0 && p.y < h;
        let sv: SeriesView<any>;
        let pv: IPointView;

        if (target instanceof SVGElement && (target.classList.contains(SeriesView.POINT_CLASS) || target.parentElement instanceof SVGElement && target.parentElement.classList.contains(SeriesView.POINT_CLASS))) {
            for (let i = this._seriesViews.length - 1; i >= 0; i--) {
                pv = this._seriesViews[i].pointByDom(target) as IPointView;

                if (pv) {
                    sv = this._seriesViews[i];
                    break;
                }
            }
        }

        // 새로운 zoom이 요청된 상태이고 아직 화면에 반영되지 않았다.
        // crosshair가 zoom이 반영된 것으로 계산하므로 다음 render까지 기다리게 해야한다.
        // TODO: _zoomRequested 필요 없는 깔끔한 방식 필요. 

        const cl = (target as Element)?.classList;
        const isContextMenu = cl?.value && (cl.contains('rct-contextmenu-item') || cl.contains('rct-contextmenu-list'));

        if (!this._zoomRequested) {
            this._crosshairViews.forEach(v => {
                if (v.setVis(inBody && !isContextMenu)) {
                    v.layout(pv, p.x, p.y, w, h);
                }
            });
        }

        if (pv) {
            this.$_setFocused(sv, pv, p);
        } else {
            this.$_setFocused(null, null, p);
        }
        return inBody;
    }

    hoverSeries(series: Series): void {
        const sv = this._seriesMap.get(series);
        this.$_hoverSeries(sv);
    }

    private $_setFocused(sv: SeriesView<Series>, pv: IPointView, p: IPoint): void {
        if (pv != this._focused || this.model.chart.tooltip.followPointer) {
            let fs = this._focusedSeries;

            if (pv != this._focused) {
                if (this._focused) {
                    fs.setFocusPoint(this._focused, null);
                }
                if (pv) {
                    sv.setFocusPoint(pv, p);
                }
            }

            this._focused = pv;
            if (sv !== fs) {
                fs && this.$_focusSeries(fs, false);
                fs = this._focusedSeries = sv;
                fs && this.$_focusSeries(fs, true);
                if (this.chart().options.seriesHovering) {
                    this.$_hoverSeries(sv);
                }
            }
            
            if (this._focused) {
                this._owner.showTooltip(sv.model, pv.point, this, p);
            } else {
                this._owner.hideTooltip();
            }
        }
    }

    private $_focusSeries(sv: SeriesView<Series>, focused: boolean): void {
        if (focused) {
            if (sv.model.group) {
                sv.front(this._seriesViews, this._seriesViews.filter(sv2 => sv2.model.group === sv.model.group));
            } else {
                sv.front(this._seriesViews);
            }
        } else if (sv && sv.parent) {
            sv.back(this._seriesViews);
        }
    }

    private $_hoverSeries(sv: SeriesView<Series>): void {
        this._seriesViews.forEach(sv2 => {
            sv2.setBoolData('unfocus', sv && sv2 !== sv);
            sv2._labelContainer.setBoolData('unfocus', sv && sv2 !== sv);
        })
    }

    seriesByDom(elt: Element): SeriesView<Series> {
        return this._seriesViews.find(v => v.dom.contains(elt));
    }

    findSeries(ser: Series): SeriesView<Series> {
        return this._seriesViews.find(v => v.model === ser);
    }

    isConnected(axis: Axis): boolean {
        return !!this._seriesViews.find(v => v.model._xAxisObj == axis || v.model._yAxisObj == axis)
    }

    getButton(dom: Element): ButtonElement {
        if (this._zoomButton.contains(dom)) {
            return this._zoomButton;
        }
    }

    buttonClicked(button: ButtonElement): void {
        if (button === this._zoomButton) {
            this.model.chart._getXAxes().resetZoom();
            this.model.chart._getYAxes().resetZoom();
        }
    }

    addFeedback(view: RcElement): void {
        view && this._feedbackContainer.add(view);
    }

    setZoom(x1: number, y1: number, x2: number, y2: number): void {
        const chart = this.chart();
        const inverted = chart.isInverted();
        const xAxis = chart.xAxis;
        const len = inverted ? this.height : this.width;
        const v1 = xAxis.valueAt(len, inverted ? len - y2 : x1);
        const v2 = xAxis.valueAt(len, inverted ? len - y1 : x2);

        if (xAxis.zoom(v1, v2)) {
            this._zoomRequested = true;
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    getBounds(): DOMRect {
        return this._hitTester.getBounds();
    }

    protected _doMeasure(doc: Document, model: Body, hintWidth: number, hintHeight: number, phase: number): ISize {
        const chart = model.chart as Chart;

        this._polar = chart.isPolar();
        this._zoomRequested = false;

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
        }

        // gauges
        this._gaugeViews.forEach((v, i) => {
            v.measure(doc, this._gauges[i], hintWidth, hintHeight, phase);
        });

        // annotations
        this._annotationViews.forEach((v, i) => {
            v.measure(doc, this._annotations[i], hintWidth, hintHeight, phase);
        });

        // zoom button
        if (this._zoomButton.setVis(model.zoomButton.isVisible())) {
            this._zoomButton.layout();
        }

        return Size.create(hintWidth, hintHeight);
    }
    
    protected _doLayout(): void {
        const w = this.width;
        const h = this.height;
        const img = this._image;

        // background
        this._hitTester.resize(w, h);
        this._background.resize(w, h);

        if (img.setVis(img.setImage(this.model.image.url, w, h))) {
            img.setStyleOrClass(this.model.image.style);
        }

        // series
        this._seriesViews.forEach(v => {
            if (v.model.needClip(false)) {
                this._owner.clipSeries(v.getClipContainer(), v.getClipContainer2(), 0, 0, w, h, v.invertable());
            }
            v.resize(w, h);
            v.translate(0, 0);
            v.layout();
        })
        // 그룹에 포함된 시리즈들 간의 관계 설정 후에 그리기가 필요한 경우가 있다.
        this._seriesViews.forEach(v => {
            v.afterLayout();
        });
        
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
            if (!this._guideClip) {
                this._guideClip = this.control.clipBounds(0, 0, w, h);
            } else {
                this._guideClip.resize(w, h);
            }
            [this._guideContainer, this._frontGuideContainer].forEach(c => {
                c._views.forEach(v => v.layout(w, h));
                c.setClip(this._guideClip);
            });
            this._gridRowContainer.layout(w, h, false);
        }

        this.$_prepareCrosshairs(this.chart());

        // gauges
        this._gaugeViews.forEach(v => {
            // this._owner.clipSeries(v.getClipContainer(), 0, 0, w, h, v.invertable());
            v.resizeByMeasured();
            v.layout().translatep(v.getPosition(w, h));
        });

        // annotations
        this._layoutAnnotations(this._inverted, w, h);

        // zoom button
        if (this._zoomButton.visible) {
            this._zoomButton.translate(w - this._zoomButton.getBBox().width - 10, 10);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_createGaugeView(doc: Document, gauge: GaugeBase): GaugeView<Gauge> {
        return new gauge_types[gauge._type()](doc);
    }

    private $_prepareGrids(doc: Document, chart: Chart): void {
        const needAxes = chart.needAxes();
        const container = this._gridContainer;
        const views = this._gridViews;

        for (const axis of views.keys()) {
            if (!needAxes || !chart.containsAxis(axis) || !axis.grid.isVisible(false)) {
                views.get(axis).remove();
                views.delete(axis);
            }
        }

        [chart._getXAxes(), chart._getYAxes()].forEach(axes => axes.forEach(axis => {
            if (needAxes && axis.grid.isVisible(false) && !views.has(axis)) {
                const v = new AxisGridView(doc);

                views.set(axis, v);
                container.add(v);
            }
        }));
    }

    protected _prepareSeries(doc: Document, chart: IChart, series: Series[]): void {
        const inverted = this._inverted = chart.isInverted();
        const map = this._seriesMap;
        const views = this._seriesViews;

        // series들이 다시 생성됐을 수 있다.(?)
        for (const ser of map.keys()) {
            if (series.indexOf(ser) < 0) {
                map.delete(ser);
            }
        }

        this._series = series;
        views.forEach(v => {
            if (series.indexOf(v.model) < 0) {
                v.remove();
                v._labelContainer.remove();
            }
        });
        views.length = 0;

        series.forEach(ser => {
            const v = map.get(ser) || createSeriesView(doc, ser);

            v._setChartOptions(inverted, this._animatable);
            if (!v.parent) {
                this._seriesContainer.add(v);
                this._labelContainer.add(v._labelContainer);
            }

            map.set(ser, v);
            views.push(v);
            v.prepareSeries(doc, ser);
        });
        this._seriesContainer.sort(views);
        views.forEach(v => this._labelContainer.dom.appendChild(v._labelContainer.dom));
    }

    protected _prepareGauges(doc: Document, chart: IChart, gauges: GaugeBase[]): void {
        const container = this._seriesContainer;
        const inverted = chart.isInverted();
        const map = this._gaugeMap;
        const views = this._gaugeViews;

        for (const g of map.keys()) {
            if (gauges.indexOf(g) < 0) {
                map.delete(g);
            }
        }

        this._gauges = gauges;
        views.forEach(v => v.remove());
        views.length = 0;

        gauges.forEach(g => {
            const v = map.get(g) || this.$_createGaugeView(doc, g);

            container.add(v);
            map.set(g, v);
            views.push(v);
            v.prepareGauge(doc, g);
            v._setChartOptions(inverted, this._animatable);
        });
    }

    protected _prepareAnnotations(doc: Document, annotations: Annotation[]): void {
        const container = this._annotationContainer;
        const frontContainer = this._frontAnnotationContainer;
        const map = this._annotationMap;
        const views = this._annotationViews;

        for (const a of map.keys()) {
            if (annotations.indexOf(a) < 0) {
                map.delete(a);
            }
        }

        views.forEach(v => v.remove());
        views.length = 0;

        (this._annotations = annotations).forEach(a => {
            const v = map.get(a) || createAnnotationView(doc, a);

            (a.front ? frontContainer : container).add(v);
            map.set(a, v);
            views.push(v);
            // v.prepare(doc, a);
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

    private $_prepareCrosshairs(chart: IChart): void {
        const views = this._crosshairViews;
        const hairs: Crosshair[] = [];

        [chart._getXAxes(), chart._getYAxes()].forEach(axes => axes.forEach(axis => {
            axis.crosshair.visible && hairs.push(axis.crosshair);
        }));

        views.prepare(hairs.length, (v, i) => {
            v.setModel(hairs[i]);
        });
    }

    protected _layoutAnnotations(inverted: boolean, w: number, h: number): void {
        this._annotationViews.forEach(v => {
            v.resizeByMeasured();
            v.layout().translatep(v.model.getPosition(inverted, 0, 0, w, h, v.width, v.height));
        });
    }
}
