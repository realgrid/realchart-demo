////////////////////////////////////////////////////////////////////////////////
// PolarBodyView.ts
// 2023. 07. 18. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../common/ElementPool";
import { LayerElement, PathElement, RcElement } from "../common/RcControl";
import { ISize } from "../common/Size";
import { LineElement } from "../common/impl/PathElement";
import { SvgShapes } from "../common/impl/SvgShape";
import { TextAnchor, TextElement, TextLayout } from "../common/impl/TextElement";
import { Axis, AxisLine, AxisTick } from "../model/Axis";
import { Body } from "../model/Body";
import { BodyView } from "./BodyView";

class PolarAxisTickMarkView extends RcElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lineView: LineElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-polar-axis-tick-mark');

        this.add(this._lineView = new LineElement(doc));
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
    protected _lineView: PathElement;
    private _markContainer: RcElement;
    private _markViews: ElementPool<PolarAxisTickMarkView>;
    private _gridContainer: RcElement;
    protected _gridViews: ElementPool<PathElement>;
    private _labelContainer: RcElement;
    protected _labelViews: ElementPool<TextElement>;
    private _markLen: number;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-polar-axis');

        this.add(this._lineView = new PathElement(doc, 'rct-polar-axis-line'));
        this.add(this._markContainer = new LayerElement(doc, 'rct-polar-axis-markers'));
        this._markViews = new ElementPool(this._markContainer, PolarAxisTickMarkView);
        this.add(this._gridContainer = new RcElement(doc, 'rct-polar-axis-grids'));
        this._gridViews = new ElementPool(this._gridContainer, PathElement, 'rct-polar-axis-grid');
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

        // line
        this._lineView.visible = model.line.visible;

        // tick marks
        this._markLen = model.tick.mark.length;;
        this.$_prepareTickMarks(doc, model);
        //this._markViews.forEach(v => v.measure(doc, model.tick.mark, hintWidth, hintHeight, phase));

        // labels
        this.$_prepareLabels(doc, model);
    }

    layout(model: Axis, other: Axis): void {
        const w = this.width;
        const h = this.height;
        const cx = w / 2;
        const cy = h / 2;
        const rd = Math.min(w, h) / 2;
        const len = this._getLength(rd);

        // model.layout(len);

        // const ticks = model.getTicks();
        
        // this._gridViews.prepare(ticks.length);
        // this._doLayout(model, cx, cy, rd, len, ticks, other);
    }


    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _getLength(rd: number): number;
    protected abstract _doLayout(model: Axis, cx: number, cy: number, rd: number, len: number, ticks: AxisTick[], other: Axis): void;

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
    // overriden members
    //-------------------------------------------------------------------------
    protected _getLength(rd: number): number {
        return rd * 2 * 2 * Math.PI;
    }

    protected _doLayout(axis: Axis, cx: number, cy: number, rd: number, len: number, ticks: AxisTick[], other: Axis): void {
        // const circular = axis.grid.circular;
        // const start = this.panel.getStartAngle();
        // const off = axis.tickLine.length;
        // const pts: number[] = [];
        // const pts2: number[] = [];
        // let a1: number;

        // // grid lines
        // for (let i = 0; i < ticks.length; i++) {
        //     const line = this._gridViews.get(i);
        //     const a = correctNum(start + ticks[i].pos * Math.PI * 2 / len);
        //     let x = cx + Math.cos(a) * rd;
        //     let y = cy + Math.sin(a) * rd;

        //     if (i == 0) {
        //         a1 = a;
        //     } else if (a - a1 >= Math.PI * 2) {
        //         break;
        //     } 

        //     line.setPath(SvgShapes.line(cx, cy, x, y));
        //     pts.push(x, y);

        //     x = cx + Math.cos(a) * (rd + off);
        //     y = cy + Math.sin(a) * (rd + off);
        //     pts2.push(x, y);
        // }

        // // axis line
        // if (axis.line.circular) {
        //     this._lineView.setPath(SvgShapes.circle(cx, cy, rd));
        // } else {
        //     this._lineView.setPath(SvgShapes.lines(pts));
        // }

        // // axis labels
        // const axisLabel = model.axis.label;
        // const labels = this._labelViews;

        // labels.prepare(pts.length / 2);
        // labels.forEach((label, i) => {
        //     const v = ticks[i].value;
        //     const s = axisLabel.getText(model.getLabelText(v), v, model.tickInterval);
        //     let x = pts2[i * 2];
        //     let y = pts2[i * 2 + 1];

        //     label.text = s;

        //     if (x >= cx - 1 && x <= cx + 1) {
        //         label.anchor = TextAnchor.MIDDLE;
        //         if (y > cy) {
        //             label.layout = TextLayout.TOP;
        //         } else {
        //             label.layout = TextLayout.BOTTOM;
        //         }
        //     } else {
        //         label.layout = TextLayout.MIDDLE;
        //         if (x < cx) {
        //             label.anchor = TextAnchor.END;
        //         } else {
        //             label.anchor = TextAnchor.START;
        //         }
        //     } 

        //     label.translate(x, y);
        // });
    }
}

class PolarYAxisView extends PolarAxisView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    xAxisTicks: AxisTick[];

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getLength(rd: number): number {
        return rd;
    }

    private _ticks: number[] = [];

    protected _doLayout(axis: Axis, cx: number, cy: number, rd: number, len: number, ticks: AxisTick[], other: Axis): void {
        // const circular = axis.grid.circular;
        // const start = this.panel.getStartAngle();
        // const otherTicks = other.getTicks();

        // this._ticks = [];

        // // grid lines
        // for (let i = 0; i < ticks.length; i++) {
        //     const line = this._gridViews.get(i);
        //     const tick = ticks[i];
        //     const p = tick.pos;

        //     if (circular) {
        //         line.setPath(SvgShapes.circle(cx, cy, p));
        //     } else {
        //         const pts: number[] = [];

        //         for (let j = 0; j < otherTicks.length; j++) {
        //             const a = start + otherTicks[j].pos * Math.PI * 2 / other.length;
        //             const x = cx + Math.cos(a) * p;
        //             const y = cy + Math.sin(a) * p;
        //             pts.push(x, y);
        //         }
        //         line.setPath(SvgShapes.lines(pts));
        //     }

        //     const a = start;// + otherTicks[0].pos * Math.PI * 2 / other.length;
        //     const x = cx + Math.cos(a) * p;
        //     const y = cy + Math.sin(a) * p;
        //     this._ticks.push(x, y);
        // }

        // // axis line
        // this.$_layoutLine(axis.line, start, cx, cy, rd);
        // // axis labels
        // this.$_layoutLabels(model, start, cx, cy, rd);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_layoutLine(model: AxisLine, start: number, cx: number, cy: number, rd: number): void {
        // // line
        // const x = cx + Math.cos(start) * rd;
        // const y = cy + Math.sin(start) * rd;

        // this._lineView.setStyles(model.styles);
        // this._lineView.setPath(SvgShapes.line(cx, cy, x, y));
    }

    private $_layoutLabels(model: Axis, start: number, cx: number, cy: number, rd: number): void {
        // const axisLabel = model.axis.label;
        // const ticks = model.getTicks();
        // const cnt = ticks.length - 1;
        // const labels = this._labelViews;

        // labels.prepare(cnt);

        // // const x = cx + Math.cos(start) * rd;
        // // const y = cy + Math.sin(start) * rd;

        // labels.forEach((label, i) => {
        //     const v = ticks[i].value;
        //     const s = axisLabel.getText(model.getLabelText(v), v, model.tickInterval);

        //     label.text = s;
        //     label.anchor = TextAnchor.END;
        //     label.layout = TextLayout.BOTTOM;
        //     label.translate(this._ticks[i * 2], this._ticks[i * 2 + 1]);
        // });
    }
}

export class PolarBodyView extends BodyView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _axisContainer: RcElement;
    private _xAxisView: PolarXAxisView;
    private _yAxisViews: PolarYAxisView[] = [];

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: Body, hintWidth: number, hintHeight: number, phase: number): ISize {
        return super._doMeasure(doc, model, hintWidth, hintHeight, phase);
    }

    protected _doLayout(): void {
        super._doLayout();
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareAxes(doc: Document, yAxes: Axis[]): void {
        // x axis
        if (!this._axisContainer) {
            this.add(this._axisContainer = new RcElement(doc, 'rct-polar-axes'));
            this._axisContainer.add(this._xAxisView = new PolarXAxisView(doc));
        }
        // y axes
        const views = this._yAxisViews;

        while (views.length < yAxes.length) {
        }
        while (views.length > yAxes.length) {
        }
    }
}