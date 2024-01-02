////////////////////////////////////////////////////////////////////////////////
// GuageView.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isNumber, pickNum, pickProp, assign, maxv, minv } from "../common/Common";
import { Dom } from "../common/Dom";
import { ElementPool } from "../common/ElementPool";
import { NumberFormatter } from "../common/NumberFormatter";
import { IPoint } from "../common/Point";
import { RcAnimation } from "../common/RcAnimation";
import { LayerElement, RcElement } from "../common/RcControl";
import { IRect, createRect, toSize } from "../common/Rectangle";
import { ISize } from "../common/Size";
import { Align } from "../common/Types";
import { LabelElement } from "../common/impl/LabelElement";
import { LineElement } from "../common/impl/PathElement";
import { RectElement } from "../common/impl/RectElement";
import { TextAnchor, TextElement, TextLayout } from "../common/impl/TextElement";
import { CircularGauge, GaugeBase, GaugeGroup, GaugeItemPosition, GaugeScale, LinearGaugeScale, ValueGauge } from "../model/Gauge";
import { LinearGaugeBase, LinearGaugeGroupBase, LinearGaugeLabel } from "../model/gauge/LinearGauge";
import { ChartElement, ContentView } from "./ChartElement";

export abstract class GaugeView<T extends GaugeBase> extends ContentView<T> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly GAUGE_CLASS = 'rct-gauge';
    static readonly PANE_CLASS = 'rct-gauge-pane';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _paneElement: RectElement;
    private _contentContainer: LayerElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);

        this.dom.classList.add(this._defaultCalss());
        this.add(this._paneElement = new RectElement(doc, GaugeView.PANE_CLASS));
        this.add(this._contentContainer = new LayerElement(doc, null));
        this._doInitContents(doc, this._contentContainer);
    }

    protected _defaultCalss() { return GaugeView.GAUGE_CLASS; }

    protected abstract _doInitContents(doc: Document, container: LayerElement): void;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    clicked(elt: Element): void {
    }

    prepareGauge(doc: Document, model: T): void {
        // this.internalClearStyleAndClass();
        // this.internalSetStyleOrClass(model.style);
        // if (model.color) {
        //     this.internalSetStyle('fill', model.color);
        //     this.internalSetStyle('stroke', model.color);
        // }
        // model._calcedColor = getComputedStyle(this.dom).fill;

        this._prepareGauge(doc, model);
    }

    getPosition(width: number, height: number): IPoint {
        const m = this.model;
        let x = m.getLeft(width);
        let y = m.getTop(height);

        if (isNaN(x)) {
            x = m.getRight(width) - this.width;
            if (isNaN(x)) {
                x = (width - this.width) / 2;
            }
        }
        if (isNaN(y)) {
            y = m.getBottom(height) - this.height;
            if (isNaN(y)) {
                y = (height - this.height) / 2;
            }
        }

        return { x, y };
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareStyleOrClass(model: T): void {
        super._prepareStyleOrClass(model);

        this._paneElement.setStyleOrClass(model.paneStyle);
    }

    protected _doMeasure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        return model.getSize(hintWidth, hintHeight);
    }

    protected _doLayout(): void {
        let w = this.width;
        let h = this.height;

        // back
        this._paneElement.resizeRect(w, h);

        // gauge
        const pads = assign(Dom.getPadding(this.dom));

        w -= pads.left + pads.right;
        h -= pads.top + pads.bottom;

        this._renderGauge(w, h);
        
        this._contentContainer.trans(pads.left, pads.top);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _prepareGauge(doc: Document, model: T): void;
    protected abstract _renderGauge(width: number, height: number): void;

    _getGroupView(): GaugeGroupView<any, any, any> {
        let p = this.parent;
        while (p) {
            if (p instanceof GaugeGroupView) {
                return p;
            }
            p = p.parent;
        }
    }
}

class GaugeValueAnimation extends RcAnimation {

    constructor(public view: ValueGaugeView<ValueGauge>, public from: number, public to: number) {
        super();
    }

    protected _doUpdate(rate: number): boolean {
        this.view._runValue = this.from + (this.to - this.from) * rate;
        this.view._renderValue();
        return true;
    }
}

export abstract class ValueGaugeView<T extends ValueGauge> extends GaugeView<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    valueOf = (target: any, param: string, format: string): any => {
        const v = target.getParam(param);

        if (isNumber(v)) {
            return NumberFormatter.getFormatter(format || target.label.numberFormat).toStr(v);
        }
        return v;
    }

    private _prevValue = 0;
    _runValue: number;
    private _ani: RcAnimation;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLayout(): void {
        if (this._ani) {
            this._ani.stop();
            this._ani = null;
        }

        super._doLayout();

        this._checkValueAnimation();
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    // value가 변경될 때 animation 등에서 호출된다.
    abstract _renderValue(): void;

    protected _getValue(m: ValueGauge): number {
        return maxv(m.minValue, minv(m.maxValue, pickNum(this._runValue, m.value)));
    }

    protected _checkValueAnimation(): void {
        const m = this.model;

        if (this._animatable && m.animatable && m.value !== this._prevValue) {
            this._ani = new GaugeValueAnimation(this, this._prevValue, m.value).start(() => this._runValue = NaN);
            this._prevValue = m.value;
        }
    }
}

export class ScaleLabelView extends LabelElement {
}

export abstract class ScaleView<T extends GaugeScale> extends ChartElement<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _line: RcElement;
    protected _tickContainer: LayerElement;
    protected _ticks: ElementPool<LineElement>;
    protected _labelContainer: LayerElement;
    protected _labels: ElementPool<ScaleLabelView>;
    
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-gauge-scale');

        this.add(this._line = this._createLine(doc, 'rct-gauge-scale-line'));
        this.add(this._tickContainer = new LayerElement(doc, 'rct-gauge-scale-ticks'));
        this._ticks = new ElementPool(this._tickContainer, LineElement);
        this.add(this._labelContainer = new LayerElement(doc, 'rct-gauge-scale-tick-labels'));
        this._labels = new ElementPool(this._labelContainer, ScaleLabelView);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _createLine(doc: Document, styleName: string): RcElement;
}

export class LinearScaleView extends ScaleView<LinearGaugeScale> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createLine(doc: Document, styleName: string): RcElement {
        return new LineElement(doc, styleName);
    }    

    protected _doMeasure(doc: Document, model: LinearGaugeScale, hintWidth: number, hintHeight: number, phase: number): ISize {
        const reversed = model._reversed;
        const vertical = model._vertical;
        const labels = model.label;
        const steps = model._steps;
        const nStep = steps.length;
        let width = vertical ? model.gap : hintWidth;
        let height = vertical ? hintHeight : model.gap;

        if (this._tickContainer.setVis(model.tick.visible)) {
            this._tickContainer.setStyleOrClass(model.tick.style);
            this._ticks.prepare(nStep);
        }
        
        if (vertical) {
            width += model.tick.length;
        } else {
            height += model.tick.length;
        }

        if (this._labelContainer.setVis(model.label.visible)) {
            this._labelContainer.setStyleOrClass(model.label.style);
            this._labels.prepare(nStep, v => {
                v.setModel(doc, labels, null, null);
            });

            if (nStep > 0) {
                if (vertical) {
                    let w = 0;
                    this._labels.forEach((v, i) => {
                        // v.text = String(steps[reversed ? nStep - 1 - i : i]);
                        // v.text = String(steps[reversed ? i : nStep - 1 - i]);
                        v.setText(labels.getText(steps[reversed ? i : nStep - 1 - i]));
                        w = maxv(v.getBBox().width);
                    })
                    width += w;
                } else {
                    let h = 0;
                    this._labels.forEach((v, i) => {
                        // v.text = String(steps[reversed ? nStep - 1 - i : i]);
                        v.setText(labels.getText(steps[reversed ? nStep - 1 - i : i]));
                        h = maxv(v.getBBox().height);
                    })
                    height += h;
                }
            }
        }

        return { width, height };
    }

    protected _doLayout(): void {
        const m = this.model;
        m._vertical ? this.$_layoutVert(m, this.width, this.height) : this.$_layoutHorz(m, this.width, this.height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_layoutHorz(m: LinearGaugeScale, width: number, height: number): void {
        const line = this._line as LineElement;
        const tick = m.tick;
        const steps = m._steps;
        const w = width / (steps.length - 1);
        const opposite = m.position === GaugeItemPosition.OPPOSITE;
        const len = opposite ? -tick.length : tick.length;
        let y = opposite ? height - m.gap : m.gap;
        let x: number;

        // line
        if (line.setVis(m.line.visible)) {
            line.setStyleOrClass(m.line.style);
            line.setHLineC(y, 0, width);
        }

        // ticks
        if (this._tickContainer.setVis(tick.visible)) {
            this._ticks.forEach((v, i) => {
                x = m.getRate(steps[i]) * width;
                // v.setVLineC(x, y, y + len);
                v.setVLine(x, y, y + len);
            })
        }

        // labels
        if (this._labelContainer.visible) {
            let prev = Number.MIN_SAFE_INTEGER;
            y = opposite ? 0 : y + len;
            
            this._labels.forEach((v, i) => {
                const r = v.getBBox();
                x = m.getRate(steps[i]) * width;

                if (v.setVis(x - r.width / 2 > prev)) {
                    // v.anchor = i < steps.length - 1 ? TextAnchor.MIDDLE : TextAnchor.END;
                    v.layout(Align.CENTER).trans(x - r.width / 2, y);
                    prev = x + r.width / 2;
                }
            });
        }
    }

    private $_layoutVert(m: LinearGaugeScale, width: number, height: number): void {
        const line = this._line as LineElement;
        const tick = m.tick;
        const steps = m._steps;
        const h = this.height / (steps.length - 1);
        const opp = m.position === GaugeItemPosition.OPPOSITE;
        const len = opp ? tick.length : -tick.length;
        let x = opp ? m.gap : width - m.gap;
        let y: number;

        // line
        if (line.setVis(m.line.visible)) {
            line.setStyleOrClass(m.line.style);
            line.setVLineC(x, 0, height);
        }

        // ticks
        if (this._tickContainer.setVis(tick.visible)) {
            this._ticks.forEach((v, i) => {
                y = m.getRate(steps[i]) * height;
                // v.setHLineC(y, x, x + len);
                v.setHLine(y, x, x + len);
            })
        }

        // labels
        if (this._labelContainer.visible) {
            const anchor = opp ? TextAnchor.START : TextAnchor.END;
            const align = opp ? Align.LEFT : Align.RIGHT;

            x = opp ? x + len : width - m.gap + len;

            this._labels.forEach((v, i) => {
                const r = v.getBBox();
                const x2 =  opp ? x : x - r.width;

                y = m.getRate(steps[i]) * height;
                // v.anchor = anchor;
                // v.layout = i < steps.length - 1 ? TextLayout.MIDDLE : TextLayout.BOTTOM;
                v.layout(align).trans(x2, y - r.height / 2);
            });
        }
    }
}

export abstract class LinearGaugeBaseView<T extends LinearGaugeBase> extends ValueGaugeView<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _vertical: boolean;
    protected _rLabel: IRect;
    private _wLabel: number;
    protected _rBand: IRect;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    measureLabelSize(m: T, width: number, height: number): ISize {
        const label = m.label;
        const v = this.labelView();

        label.setText(m.getLabel(label, m.value));
        v.text = label.text;
        label.buildSvg(v, null, width, height, m, label._domain);

        return toSize(v.getBBox());
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _renderGauge(width: number, height: number): void {
        const m = this.model;
        const value = pickNum(this._runValue, m.value);

        this._measureGauge(m, m.label, this.labelView(), value, m.isVertical(), width, height);
        this._renderValue();
    }

    _renderValue(): void {
        const m = this.model;
        const label = m.label;
        const scale = m.scale;
        const labelView = this.labelView();
        const value = pickNum(this._runValue, m.value);
        const rBand = assign({}, this._rBand);

        this._renderScale(rBand);

        if (rBand.height > 0) {
            // band background
            this.background().setRect(rBand);
            // band
            this._renderBand(m, rBand, value);
        }

        // label
        if (label._runPos === 'top' || label._runPos === 'bottom') {
            this._rLabel.height = rBand.height;
        }
        this._renderLabel(m, label, labelView, value);

        // 아래쪽으로 넘치지 않게 한다.
        if (!this._vertical && (label._runPos === 'left' || label._runPos === 'right') && scale.visible && scale.position === GaugeItemPosition.OPPOSITE) {
            const r = labelView.getBBox();
            if (labelView.ty + r.height > this.height) {
                labelView.transY(maxv(0, this.height - r.height));
            }
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract labelView(): TextElement;
    protected abstract scaleView(): LinearScaleView;
    protected abstract background(): RectElement;
    protected abstract _renderBand(m: ValueGauge, r: IRect, value: number): void;

    protected _measureGauge(m: ValueGauge, label: LinearGaugeLabel, labelView: TextElement, value: number, vertical: boolean, width: number, height: number): void {
        const rBand = this._rBand = createRect(0, 0, width, height);

        this._vertical = m.group ? false : pickProp(vertical, height > width);

        if (label.visible) {
            const pos = label._runPos = pickProp(label.position, this._vertical ? 'top' : 'left');
            const vert = label._runVert = pos === 'top' || pos === 'bottom';
            const gap = m.group ? (m.group as LinearGaugeGroupBase<any>).itemLabel.gap : label._runGap = label.getGap(vert ? height : width);
            let w = vert ? width : label.getWidth(width);
            let h = vert ? label.getHeight(height) : height;
            const wMax = vert ? width : label.getMaxWidth(width);
            const hMax = vert ? label.getMaxHeight(height) : height;
            const rLabel = this._rLabel = createRect(0, 0, width, height);

            label.setText(m.getLabel(label, label.animatable ? value : m.value));
            labelView.text = label.text;
            label.buildSvg(labelView, null, pickNum(w, wMax), pickNum(h, hMax), m, label._domain);

            const rText = labelView.getBBox();

            if (vert) {
                rLabel.height = pickNum(h, rText.height);
                rBand.height = maxv(0, rBand.height - (rLabel.height + gap));
            } else {
                rLabel.width = pickNum(w, rText.width);
                this._wLabel = m.group ? (m.group as LinearGaugeGroupBase<any>)._labelWidth : rLabel.width;
                rBand.width = maxv(0, rBand.width - (this._wLabel + gap));
            }

            switch (pos) {
                case 'top':
                    rBand.y = rLabel.height + gap;
                    break;

                case 'bottom':
                    rLabel.y = rBand.height + gap;
                    break;

                case 'right':
                    rLabel.x = rBand.width + gap;
                    break;

                default:
                    rBand.x = this._wLabel + gap;
                    break;
            }
        } else {
            this._rLabel = null;
        }
    }

    protected _renderLabel(m: ValueGauge, label: LinearGaugeLabel, view: TextElement, value: number): void {
        if (view.visible) {
            const r = this._rLabel;
            const rText = view.getBBox();
            let x = r.x;
            let y = r.y;
            let w: number;

            switch (label._runPos) {
                case 'top':
                    x += r.width / 2;
                    break;

                case 'bottom':
                    x += r.width / 2;
                    break;

                case 'right':
                    x = this.width - r.width;
                    view.anchor = TextAnchor.START;
                    y += maxv(0, (r.height - rText.height) / 2);
                    break;

                default:
                    view.anchor = TextAnchor.END;
                    x += this._wLabel;
                    y += maxv(0, (r.height - rText.height) / 2);
                    break;
            }
            view.trans(x, y);
        }
   }

   _renderScale(rBand: IRect): void {
        const m = this.model;
        const label = m.label;
        const scale = m.scale;
        const scaleView = this.scaleView();
        const len = this._vertical ? rBand.height : rBand.width;
        let x: number, y: number;

        scale._vertical = this._vertical;
        scale._reversed = m.reversed;
        if (isNaN(this._runValue)) { // animation 중에 다시 할 필요 없다.
            scale.buildSteps(len, m.value);
        }

        if (scaleView.setVis(m.scaleVisible())) {
            const sz = scaleView.measure(this.doc, scale, rBand.width, rBand.height, 1);

            if (this._vertical) {
                x = 0;
                y = rBand.y;
                rBand.width = maxv(0, rBand.width - sz.width);

                if (scale.position === GaugeItemPosition.OPPOSITE) {
                    x = rBand.x + rBand.width;
                } else {
                    if (label._runVert) {
                        rBand.x += sz.width;
                    } else {
                        x = rBand.x;
                        rBand.x += sz.width;
                    }
                }
            } else {
                x = rBand.x;
                rBand.height = maxv(0, rBand.height - sz.height);

                if (scale.position === GaugeItemPosition.OPPOSITE) {
                    if (label._runVert) {
                        y = rBand.y;
                        rBand.y += sz.height;
                    } else {
                        this._rLabel.y = rBand.y += sz.height;
                        y = rBand.y - sz.height;
                    }
                } else {
                    y = rBand.y + rBand.height;
                }
            }
            scaleView.resizeByMeasured().layout().trans(x, y);
        }
    }
}

/**
 * @internal
 * 
 * View base for CircularGauge.
 */
export abstract class CircularGaugeView<T extends CircularGauge> extends ValueGaugeView<T> {
}

export abstract class GaugeGroupView<G extends ValueGauge, T extends GaugeGroup<G>, GV extends GaugeView<G>> extends GaugeView<T> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly GAUGE_GROUP_CLASS = 'rct-gauge-group';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _gaugeContainer: LayerElement;
    protected _gaugeViews: ElementPool<GV>;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _defaultCalss(): string { return GaugeGroupView.GAUGE_GROUP_CLASS; }

    protected _doInitContents(doc: Document, container: LayerElement): void {
        container.add(this._gaugeContainer = new LayerElement(doc, 'rct-gauge-group-container'));
        this._gaugeViews = this._createPool(this._gaugeContainer);
    }

    _setChartOptions(inverted: boolean, animatable: boolean, loadAnimatable: boolean): void {
        super._setChartOptions(inverted, animatable, loadAnimatable);
        this._gaugeViews.forEach(v => v._setChartOptions(inverted, animatable, loadAnimatable));
    }

    protected _prepareGauge(doc: Document, model: T): void {    
        this._gaugeViews.prepare(model.count())
        this._doPrepareGauges(doc, model, this._gaugeViews);
    }

    protected _renderGauge(width: number, height: number): void {
        this._doRenderGauges(this._gaugeContainer, this._gaugeViews, width, height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _createPool(container: LayerElement): ElementPool<GV>;
    protected abstract _doRenderGauges(container: RcElement, views: ElementPool<GV>, width: number, height: number): void;

    protected _doPrepareGauges(doc: Document, model: T, views: ElementPool<GV>): void {
        views.forEach((v, i) => {
            v.prepareGauge(doc, model.getVisible(i));
        })
    }
}