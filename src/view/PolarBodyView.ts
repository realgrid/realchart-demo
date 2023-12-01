////////////////////////////////////////////////////////////////////////////////
// PolarBodyView.ts
// 2023. 07. 18. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../common/ElementPool";
import { LayerElement, RcElement } from "../common/RcControl";
import { ISize } from "../common/Size";
import { PI_2 } from "../common/Types";
import { CircleElement, CircumElement } from "../common/impl/CircleElement";
import { LineElement, PolylineElement } from "../common/impl/PathElement";
import { TextAnchor, TextElement, TextLayout } from "../common/impl/TextElement";
import { Axis, AxisTick, IAxisTick } from "../model/Axis";
import { Body } from "../model/Body";
import { BodyView, IPlottingOwner } from "./BodyView";

class PolarAxisTickMarkView extends RcElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lineView: CircleElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-polar-axis-tick-mark');

        this.add(this._lineView = new CircleElement(doc));
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    layout(): void {
        //this._lineView.setHLineC(0, 0, this.width);
    }
}

abstract class PolarAxisView extends RcElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _model: Axis;
    private _markContainer: RcElement;
    private _markViews: ElementPool<PolarAxisTickMarkView>;
    protected _gridContainer: RcElement;
    protected _labelContainer: RcElement;
    protected _labelViews: ElementPool<TextElement>;
    private _markLen: number;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);

        this.add(this._markContainer = new LayerElement(doc, 'rct-polar-axis-markers'));
        this._markViews = new ElementPool(this._markContainer, PolarAxisTickMarkView);
        this.add(this._gridContainer = new RcElement(doc, 'rct-polar-axis-grids'));
        this.add(this._labelContainer = new LayerElement(doc, 'rct-polar-axis-labels'));
        this._labelViews = new ElementPool(this._labelContainer, TextElement, 'rct-polar-axis-label')
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepare(doc: Document, model: Axis, circular: boolean): void {
        this._model = model;

        // tick marks
        this._markLen = model.tick.length;;
        this.$_prepareTickMarks(doc, model);
        //this._markViews.forEach(v => v.measure(doc, model.tick.mark, hintWidth, hintHeight, phase));

        // labels
        this.$_prepareLabels(doc, model);

        this._doPrepare(model, model._ticks, circular);
    }

    layout(other: Axis, cx: number, cy: number, rd: number): PolarAxisView {
        const ticks = this._model._ticks;// .getTicks();
        
        // this._gridViews.prepare(ticks.length);
        this._doLayout(this._model, cx, cy, rd, ticks, other);

        return this;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _doPrepare(model: Axis, ticks: IAxisTick[], circular: boolean): void;
    protected abstract _doLayout(model: Axis, cx: number, cy: number, rd: number, ticks: IAxisTick[], other: Axis): void;

    private $_prepareTickMarks(doc: Document, m: Axis): void {
        this._markViews.prepare(m._ticks.length);
    }

    // protected _prepareLabel(view: AxisLabelView, tick: IAxisTick): void {
    //     view.value = tick.value;
    //     view.setText(tick.label);
    //     // view.text = ticks[i].label;
    // }

    private $_prepareLabels(doc: Document, m: Axis): void {
        if (this._labelContainer.setVisible(m.label.visible)) {
            const ticks = m._ticks;

            this._labelViews.prepare(ticks.length, (view, i) => {
                view.text = ticks[i].label;
            }, view => {
                view.anchor = TextAnchor.START;
            });
        }
    }
}

class PolarXAxisView extends PolarAxisView {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly LINE_CLASS = 'rct-polar-xaxis-line';
    static readonly GRID_CLASS = 'rct-polar-xaxis-grid-line';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lineView: RcElement;
    private _gridLines: ElementPool<LineElement>;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document, lineContainer: LayerElement) {
        super(doc, 'rct-polar-xaxis');

        this._gridLines = new ElementPool(this._gridContainer, LineElement, PolarXAxisView.GRID_CLASS);

        lineContainer.add(this._lineView = new CircumElement(doc, PolarXAxisView.LINE_CLASS));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doPrepare(model: Axis, ticks: IAxisTick[], circular: boolean): void {
        // grid lines
        if (this._gridContainer.setVisible(model.grid.visible !== false)) {
            this._gridLines.prepare(ticks.length);
        }

        // line
        if (this._lineView.visible = model.line.visible) {
            if (circular && this._lineView instanceof PolylineElement) {
                this._lineView.remove();
                this.add(this._lineView = new CircumElement(this.doc, PolarXAxisView.LINE_CLASS));
            } else if (!circular && this._lineView instanceof CircleElement) {
                this._lineView.remove();
                this.add(this._lineView = new PolylineElement(this.doc, PolarXAxisView.LINE_CLASS));
            }
            this._lineView.setStyleOrClass(model.line.style);
        }
    }

    protected _doLayout(axis: Axis, cx: number, cy: number, rd: number, ticks: IAxisTick[], other: Axis): void {
        const start = axis.getStartAngle();

        ticks.forEach(tick => tick.pos = tick.pos / rd);

        // grid lines
        if (this._gridContainer.visible) {
            this._gridLines.forEach((view, i) => {
                const tick = ticks[i];
                const p = tick.pos;
                const x = cx + Math.cos(start + p) * rd;
                const y = cy + Math.sin(start + p) * rd;
    
                view.setLine(cx, cy, x, y);
            });
        }

        // labels
        if (this._labelContainer.visible) {
            const count = this._labelViews.count;
            // TODO: 가장 긴 label이 겹쳐지는 지로 확인할 것!
            const step = Math.ceil(9 / (360 / count));
            const rd2 = rd + axis.tick.length;

            this._labelViews.forEach((view, i) => {
                if (view.setVisible(i % step === 0)) {
                    const tick = ticks[i];
    
                    view.anchor = TextAnchor.MIDDLE;
                    view.layout = TextLayout.MIDDLE;
                    view.text = tick.label;
        
                    const r = view.getBBounds();
                    const p = tick.pos;
                    const x = cx + Math.cos(start + p) * (rd2 + r.width / 2);
                    const y = cy + Math.sin(start + p) * (rd2 + r.height / 2);
        
                    view.translate(x, y);
                }
            });
            // 마지막이 겹치는 지 확인한다.
            if (count > 2) {
                if (Math.abs(ticks[count - 1].pos - ticks[count - 2].pos) < PI_2 / 24) {
                    this._labelViews.get(count - 1).setVisible(false);
                }
            }
        }

        // line
        if (this._lineView.visible) {
            if (this._lineView instanceof CircleElement) {
                this._lineView.setCircle(cx, cy, rd);
            } else {
                const pts: number[] = [];

                ticks.forEach(tick => {
                    const p = tick.pos;
                    pts.push(cx + Math.cos(start + p) * rd, cy + Math.sin(start + p) * rd);
                });
                (this._lineView as PolylineElement).setPoints(...pts);
            }
        }
    }
}

class PolarYAxisView extends PolarAxisView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lineView: LineElement;
    private _gridLines: ElementPool<RcElement>;
    xAxisTicks: AxisTick[];

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document, lineContainer: LayerElement) {
        super(doc, 'rct-polar-yaxis');

        this._gridLines = new ElementPool(this._gridContainer, CircumElement, 'rct-polar-yaxis-grid-line');
        (this._gridLines as any).circular = false;

        lineContainer.add(this._lineView = new LineElement(doc, 'rct-polar-yaxis-line'));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doPrepare(model: Axis, ticks: IAxisTick[], circular: boolean): void {
        // grid lines
        if (this._gridContainer.setVisible(model.grid.visible !== false)) {
            if (circular !== (this._gridContainer as any).circular) {
                this._gridLines.destroy();
                if (circular) {
                    this._gridLines = new ElementPool(this._gridContainer, CircumElement, 'rct-polar-yaxis-grid-line');
                } else {
                    this._gridLines = new ElementPool(this._gridContainer, PolylineElement, 'rct-polar-yaxis-grid-line');
                }
                (this._gridContainer as any).circular = circular;
            }
            this._gridLines.prepare(ticks.length, null);
        }

        // line
        if (this._lineView.visible = model.line.visible) {
            this._lineView.setStyleOrClass(model.line.style);
        }
    }

    protected _doLayout(axis: Axis, cx: number, cy: number, rd: number, ticks: IAxisTick[], other: Axis): void {
        // grid lines
        if (this._gridContainer.visible) {
            this._gridLines.forEach((view, i) => {
                const pos = ticks[i].pos;
    
                if (view instanceof CircumElement) {
                    view.setCircle(cx, cy, pos);
                } else if (view instanceof PolylineElement) {
                    const start = axis.getStartAngle();
                    const pts: number[] = [];

                    other._ticks.forEach(tick => {
                        const p = tick.pos;
                        pts.push(cx + Math.cos(start + p) * pos, cy + Math.sin(start + p) * pos);
                    });
                    (view as PolylineElement).setPoints(...pts);
                }
            });
        }

        // labels
        if (this._labelContainer.visible) {
            this._labelViews.forEach((view, i) => {
                const tick = ticks[i];
    
                view.anchor = TextAnchor.END;
                view.layout = TextLayout.MIDDLE;
                view.text = tick.label;
    
                view.translate(cx - 4, cy - tick.pos);
            });
        }

        // line
        if (this._lineView.visible) {
            this._lineView.setVLine(cx, cy, cy - rd);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}

export class PolarBodyView extends BodyView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _axisContainer: LayerElement;
    private _lineContainer: LayerElement;
    private _xAxisView: PolarXAxisView;
    private _yAxisViews: PolarYAxisView[] = [];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, owner: IPlottingOwner) {
        super(doc, owner);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: Body, hintWidth: number, hintHeight: number, phase: number): ISize {
        const chart = model.chart;
        const sz = super._doMeasure(doc, model, hintWidth, hintHeight, phase);

        this.$_prepareAxes(doc, chart.xAxis as Axis, chart._getYAxes().items, this.model.circular);

        return sz;
    }

    protected _doLayout(): void {
        const m = this.model.setPolar(this.width, this.height);
        const {cx, cy, rd} = m.getPolar(null);

        // series
        this._seriesViews.forEach(v => {
            v.resize(rd * 2, rd * 2);
            v.layout();//.translate(x, y);
        })

        // axes
        this._xAxisView.layout(m.chart.yAxis as Axis, cx, cy, rd);
        this._yAxisViews.forEach(v => {
            v.layout(m.chart.xAxis as Axis, cx, cy, rd);
        })
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareAxes(doc: Document, xAxis: Axis, yAxes: Axis[], circular: boolean): void {
        // x axis
        if (!this._axisContainer) {
            this.insertFirst(this._lineContainer = new LayerElement(doc, 'rct_axis-lines'));
            this.insertFirst(this._axisContainer = new LayerElement(doc, 'rct-polar-axes'));

            this._axisContainer.add(this._xAxisView = new PolarXAxisView(doc, this._lineContainer));
        }
        this._xAxisView.prepare(doc, xAxis, circular);

        // y axes
        const views = this._yAxisViews;

        while (views.length < yAxes.length) {
            const view = new PolarYAxisView(doc, this._lineContainer);

            this._axisContainer.add(view);
            views.push(view);
        }
        while (views.length > yAxes.length) {
            views.pop().remove();
        }
        views.forEach((v, i) => v.prepare(doc, yAxes[i], circular));
    }
}