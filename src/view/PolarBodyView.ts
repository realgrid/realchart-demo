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
import { CircleElement } from "../common/impl/CircleElement";
import { LineElement } from "../common/impl/PathElement";
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
    private _labelContainer: RcElement;
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
        this._labelViews = new ElementPool(this._labelContainer, TextElement)
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepare(doc: Document, model: Axis): void {
        this._model = model;

        // tick marks
        this._markLen = model.tick.length;;
        this.$_prepareTickMarks(doc, model);
        //this._markViews.forEach(v => v.measure(doc, model.tick.mark, hintWidth, hintHeight, phase));

        // labels
        this.$_prepareLabels(doc, model);

        this._doPrepare(model, model._ticks);
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
    protected abstract _doPrepare(model: Axis, ticks: IAxisTick[]): void;
    protected abstract _doLayout(model: Axis, cx: number, cy: number, rd: number, ticks: IAxisTick[], other: Axis): void;

    private $_prepareTickMarks(doc: Document, m: Axis): void {
        this._markViews.prepare(m._ticks.length);
    }

    private $_prepareLabels(doc: Document, m: Axis): void {
        const ticks = m._ticks;

        this._labelViews.prepare(ticks.length, (view, i) => {
            view.text = ticks[i].label;
        }, view => {
            view.anchor = TextAnchor.START;
        });
    }
}

class PolarXAxisView extends PolarAxisView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lineView: CircleElement;
    private _gridLines: ElementPool<LineElement>;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-polar-xaxis');

        this._gridLines = new ElementPool(this._gridContainer, LineElement, 'rct-polar-xaxis-grid-line');

        this.add(this._lineView = new CircleElement(doc, 'rct-polar-xaxis-line'));
        this._lineView.setStyle('fill', 'none');
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doPrepare(model: Axis, ticks: IAxisTick[]): void {
        // grid lines
        this._gridLines.prepare(ticks.length);

        // line
        this._lineView.visible = model.line.visible;
    }

    protected _doLayout(axis: Axis, cx: number, cy: number, rd: number, ticks: IAxisTick[], other: Axis): void {
        const start = axis.chart.startAngle();

        // grid lines
        this._gridLines.forEach((view, i) => {
            const tick = ticks[i];
            const p = tick.pos * Math.PI * 2;
            const x = cx + Math.cos(start + p) * rd;
            const y = cy + Math.sin(start + p) * rd;

            view.setLine(cx, cy, x, y);
        });

        // labels
        const rd2 = rd + axis.tick.length;

        this._labelViews.forEach((view, i) => {
            const tick = ticks[i];

            view.anchor = TextAnchor.MIDDLE;
            view.layout = TextLayout.MIDDLE;
            view.text = tick.label;

            const r = view.getBBounds();
            const p = tick.pos * Math.PI * 2;
            const x = cx + Math.cos(start + p) * (rd2 + r.width / 2);
            const y = cy + Math.sin(start + p) * (rd2 + r.height / 2);

            view.translate(x, y);
        });

        // line
        this._lineView.setCircle(cx, cy, rd);
    }
}

class PolarYAxisView extends PolarAxisView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lineView: LineElement;
    private _gridLines: ElementPool<CircleElement>;
    xAxisTicks: AxisTick[];

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-polar-yaxis');

        this._gridLines = new ElementPool(this._gridContainer, CircleElement, 'rct-polar-yaxis-grid-line');

        this.add(this._lineView = new LineElement(doc, 'rct-polar-yaxis-line'));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doPrepare(model: Axis, ticks: IAxisTick[]): void {
        // grid lines
        this._gridLines.prepare(ticks.length, null, v => {
            v.setStyle('fill', 'none');
        });

        // line
        this._lineView.visible = model.line.visible;
    }

    protected _doLayout(axis: Axis, cx: number, cy: number, rd: number, ticks: IAxisTick[], other: Axis): void {
        // grid lines
        this._gridLines.forEach((view, i) => {
            const tick = ticks[i];

            view.setCircle(cx, cy, tick.pos);
        });

        // labels
        this._labelViews.forEach((view, i) => {
            const tick = ticks[i];

            view.anchor = TextAnchor.END;
            view.layout = TextLayout.MIDDLE;
            view.text = tick.label;

            view.translate(cx - 4, cy - tick.pos);
        })

        // line
        this._lineView.setVLine(cx, cy, cy - rd);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}

export class PolarBodyView extends BodyView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _axisContainer: RcElement;
    private _xAxisView: PolarXAxisView;
    private _yAxisViews: PolarYAxisView[] = [];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, owner: IPlottingOwner) {
        super(doc, owner, false);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: Body, hintWidth: number, hintHeight: number, phase: number): ISize {
        const chart = model.chart;
        const sz = super._doMeasure(doc, model, hintWidth, hintHeight, phase);

        this.$_prepareAxes(doc, chart.xAxis as Axis, chart._getYAxes().items);

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
            v.layout(null, cx, cy, rd);
        })
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareAxes(doc: Document, xAxis: Axis, yAxes: Axis[]): void {
        // x axis
        if (!this._axisContainer) {
            this.add(this._axisContainer = new RcElement(doc, 'rct-polar-axes'));
            this._axisContainer.add(this._xAxisView = new PolarXAxisView(doc));
        }
        this._xAxisView.prepare(doc, xAxis);

        // y axes
        const views = this._yAxisViews;

        while (views.length < yAxes.length) {
            const view = new PolarYAxisView(doc);

            this._axisContainer.add(view);
            views.push(view);
        }
        while (views.length > yAxes.length) {
            views.pop().remove();
        }
        views.forEach((v, i) => v.prepare(doc, yAxes[i]));
    }
}