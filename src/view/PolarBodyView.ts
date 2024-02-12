////////////////////////////////////////////////////////////////////////////////
// PolarBodyView.ts
// 2023. 07. 18. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { absv, cos, sin } from "../common/Common";
import { ElementPool } from "../common/ElementPool";
import { ClipCircleElement, LayerElement, RcElement } from "../common/RcControl";
import { ISize } from "../common/Size";
import { Align, PI_2 } from "../common/Types";
import { ArcPolyElement, CircleElement } from "../common/impl/CircleElement";
import { LineElement, PolylineElement } from "../common/impl/PathElement";
import { Axis, AxisLabel, AxisTick, IAxisTick } from "../model/Axis";
import { Body } from "../model/Body";
import { AxisLabelView, axis_label_reg } from "./AxisView";
import { AxisGuideContainer, BodyView, IPlottingOwner } from "./BodyView";

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
    protected _labelViews: ElementPool<AxisLabelView>;
    protected _labelContainer: LayerElement;
    private _markLen: number;
    protected _circular: boolean;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string, labelContainer: LayerElement, isX: boolean) {
        super(doc, styleName);

        this.add(this._markContainer = new LayerElement(doc, 'rct-polar-axis-markers'));
        this._markViews = new ElementPool(this._markContainer, PolarAxisTickMarkView);
        this.add(this._gridContainer = new RcElement(doc, 'rct-polar-axis-grids'));
        this._labelViews = new ElementPool(this._labelContainer = labelContainer, AxisLabelView, isX ? 'rct-polar-xaxis-label' : 'rct-polar-yaxis-label')
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepare(doc: Document, model: Axis, circular: boolean, arced: boolean): void {
        this._model = model;
        this._circular = circular;

        // tick marks
        this._markLen = model.tick.length;;
        this.$_prepareTickMarks(doc, model);
        //this._markViews.forEach(v => v.measure(doc, model.tick.mark, hintWidth, hintHeight, phase));

        // labels
        this.$_prepareLabels(doc, model);

        this._doPrepare(model, model._ticks, circular, arced);
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
    protected abstract _doPrepare(model: Axis, ticks: IAxisTick[], circular: boolean, arced: boolean): void;
    protected abstract _doLayout(model: Axis, cx: number, cy: number, rd: number, ticks: IAxisTick[], other: Axis): void;

    private $_prepareTickMarks(doc: Document, m: Axis): void {
        this._markViews.prepare(m._ticks.length);
    }


    protected _prepareLabel(view: AxisLabelView, tick: IAxisTick, model: AxisLabel, count: number): void {
        const text = model.getLabelText(tick, count);
        const label = tick.label;

        view.value = tick.value;

        view.internalClearStyleAndClass();
        view.internalSetStyleOrClass(model.style);
        view.internalSetStyleOrClass(model.getLabelStyle(tick, count));

        // model.getLabelText()에서 빈 문자열를 리턴할 수 있다.
        if (text != null) {
            const m = label && text.match(axis_label_reg);
            
            if (m) {
                view.setLabel(model, tick, text.replace(axis_label_reg, label), 1000, 1000);
            } else {
                model.prepareRich(text);
                model._paramTick = tick;
                model.buildSvg(view._text, view._outline, NaN, NaN, model, model._domain);
            }
        } else {
            // view.setText(tick.label);
            view.setLabel(model, tick, label, 1000, 1000);
        }
    }

    // protected _prepareLabel(view: AxisLabelView, tick: IAxisTick): void {
    //     view.value = tick.value;
    //     view.setText(tick.label);
    //     // view.text = ticks[i].label;
    // }

    private $_prepareLabels(doc: Document, m: Axis): void {
        const labels = m.label;

        if (this._labelContainer.setVis(labels.visible)) {
            const ticks = m._ticks;

            this._labelContainer.setStyleOrClass(labels.style);

            this._labelViews.prepare(ticks.length, (v, i, count) => {
                v.setVis(true);
                this._prepareLabel(v, ticks[i], labels, count);
            });

            // this._labelViews.prepare(ticks.length, (view, i) => {
            //     view.text = ticks[i].label;
            // }, view => {
            //     view.anchor = TextAnchor.START;
            // });
        }
    }

    prepareGuides(doc: Document, container: AxisGuideContainer, frontContainer: AxisGuideContainer): void {
        let guides = this._model.guides.filter(g => !g.front);
        container.addAll(doc, guides, true);

        guides = this._model.guides.filter(g => g.front);
        frontContainer.addAll(doc, guides, true);
    }
}

class PolarXAxisView extends PolarAxisView {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly LINE_CLASS = 'rct-polar-xaxis-line';
    static readonly SECTOR_LINE_CLASS = 'rct-polar-xaxis-sector-line';
    static readonly GRID_CLASS = 'rct-polar-xaxis-grid-line';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lineView: ArcPolyElement;
    private _startView: LineElement;
    private _endView: LineElement;
    private _gridLines: ElementPool<LineElement>;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document, lineContainer: LayerElement, labelContainer: LayerElement) {
        super(doc, 'rct-polar-xaxis', labelContainer, true);

        this._gridLines = new ElementPool(this._gridContainer, LineElement, PolarXAxisView.GRID_CLASS);

        // [주의] yAxis line이 start/end 선보다 나중에 표시되도록 한다.
        lineContainer.insertFirst(this._startView = new LineElement(doc, PolarXAxisView.SECTOR_LINE_CLASS));
        lineContainer.insertFirst(this._endView = new LineElement(doc, PolarXAxisView.SECTOR_LINE_CLASS));
        lineContainer.insertFirst(this._lineView = new ArcPolyElement(doc, PolarXAxisView.LINE_CLASS));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doPrepare(model: Axis, ticks: IAxisTick[], circular: boolean): void {
        let vLine = this._lineView;

        // grid lines
        if (this._gridContainer.setVis(model.grid.isVisible(true))) {
            this._gridLines.prepare(ticks.length);
        }

        // line
        if (vLine.setVis(model.line.visible)) {
            vLine.setStyleOrClass(model.line.style);
            vLine.setFill('none');
        }

        // sector lines
        if (this._startView.setVis(circular && model.isArced() && model.sectorLine.visible)) {
            this._startView.setStyleOrClass(model.sectorLine.style);
            this._endView.setVis(true);
            this._endView.setStyleOrClass(model.sectorLine.style);
        } else {
            this._endView.setVis(false);
        }
    }

    protected _doLayout(axis: Axis, cx: number, cy: number, rd: number, ticks: IAxisTick[], other: Axis): void {
        const start = axis.getStartAngle();
        const total = axis.getTotalAngle();

        ticks.forEach(tick => tick.pos = tick.pos / rd * total / PI_2);

        // grid lines
        if (this._gridContainer.visible) {
            this._gridLines.forEach((view, i) => {
                const tick = ticks[i];
                const p = tick.pos;
                const x = cx + cos(start + p) * rd;
                const y = cy + sin(start + p) * rd;
    
                view.setLine(cx, cy, x, y);
            });
        }

        // labels
        if (this._labelContainer.visible) {
            const count = this._labelViews.count;
            // TODO: 가장 긴 label이 겹쳐지는 지로 확인할 것!
            const step = Math.ceil(9 / (360 / count));
            const rd2 = rd + axis.tick.length;
            const align = Align.CENTER;

            this._labelViews.forEach((view, i) => {
                if (view.setVis(i % step === 0)) {
                    const tick = ticks[i];
    
                    const r = view.getBBox();
                    const p = start + tick.pos;
                    const x = cx + cos(p) * (rd2 + r.width / 2) - r.width / 2;
                    const y = cy + sin(p) * (rd2 + r.height / 2) - r.height / 2;
        
                    view.layout(align).trans(x, y);

                    // TODO: label을 회전 시킬 때...?
                    // const x = cx + cos(p) * (rd2 + r.width / 2);// - (cos(p) * (r.width / 2));
                    // const y = cy + sin(p) * (rd2 + r.width / 2);// - (sin(p) * (r.height / 2));
                    // view.layout(align).translate(x - r.width / 2, y - r.height / 2);
                    // view.setRotation(r.width / 2, r.height / 2, p * RAD_DEG);
                }
            });
            // 마지막이 겹치는 지 확인한다.
            if (count > 2) {
                if (absv(ticks[count - 1].pos - ticks[count - 2].pos) < PI_2 / 24) {
                    this._labelViews.get(count - 1).setVis(false);
                }
            }
        }

        // line
        if (this._lineView.visible) {
            if (this._circular) {
                this._lineView.setArc(cx, cy, rd, start, axis.getTotalAngle(), true);
            } else {
                const pts: number[] = [];

                ticks.map(tick => {
                    const p = tick.pos;
                    pts.push(cx + cos(start + p) * rd, cy + sin(start + p) * rd);
                });
                this._lineView.setPolyline(pts);
            }
        }

        // sector lines
        if (this._startView.visible) {
            this._startView.setLine(cx, cy, cx + cos(start) * rd, cy + sin(start) * rd);
            this._endView.setLine(cx, cy, cx + cos(start + total) * rd, cy + sin(start + total) * rd);
        }
    }
}

class PolarYAxisView extends PolarAxisView {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly GRID_LINE_STYLE = 'rct-polar-yaxis-grid-line';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lineView: LineElement;
    private _gridLines: ElementPool<ArcPolyElement>;
    xAxisTicks: AxisTick[];

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document, lineContainer: LayerElement, labelContainer: LayerElement) {
        super(doc, 'rct-polar-yaxis', labelContainer, false);

        this._gridLines = new ElementPool(this._gridContainer, ArcPolyElement, PolarYAxisView.GRID_LINE_STYLE);

        lineContainer.add(this._lineView = new LineElement(doc, 'rct-polar-yaxis-line'));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doPrepare(model: Axis, ticks: IAxisTick[], circular: boolean, arced: boolean): void {
        const container = this._gridContainer;

        // grid lines
        if (container.setVis(model.grid.visible !== false)) {
            this._gridLines.prepare(ticks.length, null);
        }

        // line
        if (this._lineView.visible = model.line.visible) {
            this._lineView.setStyleOrClass(model.line.style);
        }
    }

    protected _doLayout(axis: Axis, cx: number, cy: number, rd: number, ticks: IAxisTick[], other: Axis): void {
        const start = other.getStartAngle();
        const total = other.getTotalAngle();

        // grid lines
        if (this._gridContainer.visible) {
            const circular = this._circular;

            this._gridLines.forEach((view, i) => {
                const pos = ticks[i].pos;
    
                if (circular) {
                    view.setArc(cx, cy, pos, start, total, true);
                    view.setFill('none');
                } else if (view instanceof PolylineElement) {
                    const start = axis.getStartAngle();
                    const pts: number[] = [];

                    other._ticks.forEach(tick => {
                        const p = tick.pos;
                        pts.push(cx + cos(start + p) * pos, cy + sin(start + p) * pos);
                    });
                    view.setPoints(...pts);
                }
            });
        }

        // labels
        if (this._labelContainer.visible) {
            if (other.isArced()) {
                const start = other.getStartAngle();
                this._labelViews.forEach((view, i) => {
                    const x = cx + cos(start) * (ticks[i].pos) - (view.getBBox().width / 2);
                    const y = cy + sin(start) * (ticks[i].pos) - (view.getBBox().height / 2);
                    view.setContrast(null).trans(x, y);
                });
            } else {
                this._labelViews.forEach((view, i) => {
                    view.setContrast(null).trans(cx + 2, cy - ticks[i].pos - view.getBBox().height / 2);
                });
            }
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
    private _axisLabelContainer: LayerElement;
    private _polarClip: ClipCircleElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, owner: IPlottingOwner) {
        super(doc, owner);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected override _doMeasure(doc: Document, model: Body, hintWidth: number, hintHeight: number, phase: number): ISize {
        const chart = model.chart;
        const sz = super._doMeasure(doc, model, hintWidth, hintHeight, phase);

        this.$_prepareAxes(doc, chart.xAxis as Axis, chart._getYAxes().items, this.model.circular, (chart.xAxis as Axis).isArced());

        return sz;
    }

    protected override _doLayout(): void {
        const m = this.model.setPolar(this.width, this.height);
        const {cx, cy, rd} = m.getPolar(null);

        // series
        this._seriesViews.forEach(v => {
            // [주의] 명시적으로 false일 때만, undefined나 null이면 true로 간주.
            if (v.model.needClip(true)) {
                if (!this._polarClip) {
                    this._polarClip = this.control.clipCircle();
                }
                this._polarClip.setCircle(cx, cy, rd);
                v.getClipContainer().setClip(this._polarClip);
                v.getClipContainer2()?.setClip(this._polarClip);
            }
            v.resize(rd * 2, rd * 2);
            v.layout();//.translate(x, y);
        });
        // 그룹에 포함된 시리즈들 간의 관계 설정 후에 그리기가 필요한 경우가 있다.
        this._seriesViews.forEach(v => {
            v.afterLayout();
        });

        // axes
        this._xAxisView.layout(m.chart.yAxis as Axis, cx, cy, rd);
        this._yAxisViews.forEach(v => {
            v.layout(m.chart.xAxis as Axis, cx, cy, rd);
        });

        // axis guides
        [this._guideContainer, this._frontGuideContainer].forEach(c => {
            c._views.forEach(v => v.layout(this.width, this.height, m.getPolar(v.model.axis)));
        });

        // annotations
        this._layoutAnnotations(false, this, this.width, this.height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareAxes(doc: Document, xAxis: Axis, yAxes: Axis[], circular: boolean, arced: boolean): void {
        if (!this._axisContainer) {
            this.insertFirst(this._axisLabelContainer = new LayerElement(doc, 'rct-polar-axis-labels'));
            this.insertFirst(this._lineContainer = new LayerElement(doc, 'rct_axis-lines'));
            this.insertFirst(this._axisContainer = new LayerElement(doc, 'rct-polar-axes'));
        }

        // y axes
        const views = this._yAxisViews;

        while (views.length < yAxes.length) {
            const view = new PolarYAxisView(doc, this._lineContainer, this._axisLabelContainer);

            this._axisContainer.add(view);
            views.push(view);
        }
        while (views.length > yAxes.length) {
            views.pop().remove();
        }
        views.forEach((v, i) => {
            v.prepare(doc, yAxes[i], circular, arced);
            v.prepareGuides(doc, this._guideContainer, this._frontGuideContainer,)
        });

        // [주의] x axis가 나중에 그려지게 해야 한다.
        // x axis
        if (!this._xAxisView) {
            this._axisContainer.add(this._xAxisView = new PolarXAxisView(doc, this._lineContainer, this._axisLabelContainer));
        }
        this._xAxisView.prepare(doc, xAxis, circular, arced);
    }
}