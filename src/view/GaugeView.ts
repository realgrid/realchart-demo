////////////////////////////////////////////////////////////////////////////////
// GuageView.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isNumber, pickNum, pickProp } from "../common/Common";
import { ElementPool } from "../common/ElementPool";
import { NumberFormatter } from "../common/NumberFormatter";
import { IPoint } from "../common/Point";
import { RcAnimation } from "../common/RcAnimation";
import { LayerElement, RcElement } from "../common/RcControl";
import { IRect, Rectangle } from "../common/Rectangle";
import { ISize } from "../common/Size";
import { LineElement } from "../common/impl/PathElement";
import { RectElement } from "../common/impl/RectElement";
import { TextAnchor, TextElement, TextLayout } from "../common/impl/TextElement";
import { CircularGauge, Gauge, GaugeBase, GaugeGroup, GaugeItemPosition, GaugeScale, LinearGaugeScale, ValueGauge } from "../model/Gauge";
import { LinearGaugeBase, LinearGaugeLabel } from "../model/gauge/LinearGauge";
import { ChartElement } from "./ChartElement";

export abstract class GaugeView<T extends GaugeBase> extends ChartElement<T> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly BACKGROUND_CLASS = 'rct-gauge-background';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _backElement: RectElement;

    protected _inverted = false;
    protected _animatable = true;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);

        this.add(this._backElement = new RectElement(doc, GaugeView.BACKGROUND_CLASS));
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    _setChartOptions(inverted: boolean, animatable: boolean): void {
        this._inverted = inverted;
        this._animatable = animatable;
    }

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
        // this.dom에 설정되지 않고 back에 설정되도록 한다.
        this._backElement.setStyleOrClass(model.style);
    }

    protected _doMeasure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        return model.getSize(hintWidth, hintHeight);
    }

    protected _doLayout(): void {
        const w = this.width;
        const h = this.height;

        // back
        this._backElement.resizeRect(w, h);

        // gauge
        this._renderGauge(w, h);
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

    protected _checkValueAnimation(): void {
        const m = this.model;

        if (this._animatable && m.animatable && m.value !== this._prevValue) {
            this._ani = new GaugeValueAnimation(this, this._prevValue, m.value).start(() => this._runValue = NaN);
            this._prevValue = m.value;
        }
    }
}

export abstract class ScaleView<T extends GaugeScale> extends ChartElement<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _line: RcElement;
    protected _tickContainer: LayerElement;
    protected _ticks: ElementPool<LineElement>;
    protected _labelContainer: LayerElement;
    protected _labels: ElementPool<TextElement>;
    
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-gauge-scale');

        this.add(this._line = this._createLine(doc, 'rct-gauge-scale-line'));
        this.add(this._tickContainer = new LayerElement(doc, 'rct-gauge-scale-ticks'));
        this._ticks = new ElementPool(this._tickContainer, LineElement);
        this.add(this._labelContainer = new LayerElement(doc, 'rct-gauge-scale-tick-labels'));
        this._labels = new ElementPool(this._labelContainer, TextElement);
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
        const steps = model._steps;
        const nStep = steps.length;
        let width = vertical ? model.gap : hintWidth;
        let height = vertical ? hintHeight : model.gap;

        if (this._tickContainer.setVisible(model.tick.visible)) {
            this._tickContainer.internalSetStyleOrClass(model.tick.style);
            this._ticks.prepare(nStep);
        }
        
        if (vertical) {
            width += model.tick.length;
        } else {
            height += model.tick.length;
        }

        if (this._labelContainer.setVisible(model.tickLabel.visible)) {
            this._labelContainer.internalSetStyleOrClass(model.tickLabel.style);
            this._labels.prepare(nStep);

            if (nStep > 0) {
                if (vertical) {
                    let w = 0;
                    this._labels.forEach((v, i) => {
                        // v.text = String(steps[reversed ? nStep - 1 - i : i]);
                        v.text = String(steps[reversed ? i : nStep - 1 - i]);
                        w = Math.max(v.getBBounds().width);
                    })
                    width += w;
                } else {
                    let h = 0;
                    this._labels.forEach((v, i) => {
                        v.text = String(steps[reversed ? nStep - 1 - i : i]);
                        h = Math.max(v.getBBounds().height);
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
        let x = 0;

        // line
        if (line.setVisible(m.line.visible)) {
            line.internalSetStyleOrClass(m.line.style);
            line.setHLineC(y, x, x + width);
        }

        // ticks
        if (this._tickContainer.setVisible(tick.visible)) {
            this._ticks.forEach(v => {
                v.setVLineC(x, y, y + len);
                x += w;
            })
        }

        // labels
        if (this._labelContainer.visible) {
            y = opposite ? 0 : y + len;
            x = 0;
            this._labels.forEach((v, i) => {
                v.anchor = i < steps.length - 1 ? TextAnchor.MIDDLE : TextAnchor.END;
                v.translate(x, y);
                x += w;
            });
        }
    }

    private $_layoutVert(m: LinearGaugeScale, width: number, height: number): void {
        const line = this._line as LineElement;
        const tick = m.tick;
        const steps = m._steps;
        const h = this.height / (steps.length - 1);
        const opposite = m.position === GaugeItemPosition.OPPOSITE;
        const len = opposite ? tick.length : -tick.length;
        let y = 0;
        let x = opposite ? m.gap : width - m.gap;

        // line
        if (line.setVisible(m.line.visible)) {
            line.internalSetStyleOrClass(m.line.style);
            line.setVLineC(x, y, y + height);
        }

        // ticks
        if (this._tickContainer.setVisible(tick.visible)) {
            this._ticks.forEach((v, i) => {
                v.setHLineC(y, x, x + len);
                y += h;
            })
        }

        // labels
        if (this._labelContainer.visible) {
            const anchor = opposite ? TextAnchor.START : TextAnchor.END;
            x = opposite ? x + len : width - m.gap + len;
            y = 0;
            this._labels.forEach((v, i) => {
                v.anchor = anchor;
                v.layout = i < steps.length - 1 ? TextLayout.MIDDLE : TextLayout.BOTTOM;
                v.translate(x, y);
                y += h;
            });
        }
    }
}

export abstract class LineGaugeView<T extends LinearGaugeBase> extends ValueGaugeView<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _vertical: boolean;
    protected _rLabel: IRect;
    protected _rBand: IRect;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _renderGauge(width: number, height: number): void {
        const m = this.model;
        const value = pickNum(this._runValue, m.value);

        this._measureGauge(m, m.label, this.labelView(), value, m.vertical, width, height);
        this._renderValue();
    }

    _renderValue(): void {
        const m = this.model;
        const label = m.label;
        const scale = m.scale;
        const labelView = this.labelView();
        const value = pickNum(this._runValue, m.value);
        const rBand = Object.assign({}, this._rBand);

        this._renderScale(rBand);

        // band background
        this.background().setRect(rBand);

        // band
        this._renderBand(m, rBand, value);

        // label
        this._rLabel.height = rBand.height;
        this._renderLabel(m, label, labelView, value);

        // 아래쪽으로 넘치지 않게 한다.
        if (!this._vertical && (label._runPos === 'left' || label._runPos === 'right') && scale.visible && scale.position === GaugeItemPosition.OPPOSITE) {
            const r = labelView.getBBounds();
            if (labelView.ty + r.height > this.height) {
                labelView.translateY(Math.max(0, this.height - r.height));
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
        const rBand = this._rBand = Rectangle.create(0, 0, width, height);

        this._vertical = pickProp(vertical, height > width);

        if (label.visible) {
            const pos = label._runPos = pickProp(label.position, this._vertical ? 'top' : 'left');
            const vert = label._runVert = pos === 'top' || pos === 'bottom';
            const gap = label._runGap = label.getGap(vert ? height : width);
            let w = vert ? width : label.getWidth(width);
            let h = vert ? label.getHeight(height) : height;
            const wMax = vert ? width : label.getMaxWidth(width);
            const hMax = vert ? label.getMaxHeight(height) : height;
            const rLabel = this._rLabel = Rectangle.create(0, 0, width, height);

            label.setText(m.getLabel(label, label.animatable ? value : m.value))
                 .buildSvg(labelView, pickNum(w, wMax), pickNum(h, hMax), m, this.valueOf);
            const rText = labelView.getBBounds();

            if (vert) {
                rLabel.height = pickNum(h, rText.height);
                rBand.height = Math.max(0, rBand.height - (rLabel.height + gap));
            } else {
                rLabel.width = pickNum(w, rText.width);
                rBand.width = Math.max(0, rBand.width - (rLabel.width + gap));
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
                    rBand.x = rLabel.width + gap;
                    break;
            }
        } else {
            this._rLabel = null;
        }
    }

    protected _renderLabel(m: ValueGauge, label: LinearGaugeLabel, view: TextElement, value: number): void {
        if (view.visible) {
            const r = this._rLabel;
            const rText = view.getBBounds();
            let x = r.x;
            let y = r.y;

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
                    y += Math.max(0, (r.height - rText.height) / 2);
                    break;
                default:
                    view.anchor = TextAnchor.END;
                    x += r.width;
                    y += Math.max(0, (r.height - rText.height) / 2);
                    break;
            }
            view.translate(x, y);
        }
   }

   _renderScale(rBand: IRect): void {
        const m = this.model;
        const label = m.label;
        const scale = m.scale;
        const scaleView = this.scaleView();
        const value = pickNum(this._runValue, m.value);
        const len = this._vertical ? rBand.height : rBand.width;
        let x: number;
        let y: number;

        scale._vertical = this._vertical;
        scale._reversed = m.reversed;
        scale.buildSteps(len, value);

        if (scaleView.setVisible(scale.visible)) {
            const sz = scaleView.measure(this.doc, scale, rBand.width, rBand.height, 1);

            if (this._vertical) {
                x = 0;
                y = rBand.y;
                rBand.width = Math.max(0, rBand.width - sz.width);

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
                rBand.height = Math.max(0, rBand.height - sz.height);

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
            scaleView.resizeByMeasured().layout().translate(x, y);
        }
    }
}

/**
 * @internal
 * 
 * View base for CircularGauge.
 */
export abstract class CircularGaugeView<T extends CircularGauge> extends ValueGaugeView<T> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    valueOf = (target: CircularGauge, param: string, format: string): any => {
        const v = target.getParam(param);

        if (isNumber(v)) {
            return NumberFormatter.getFormatter(format || target.label.numberFormat).toStr(v);
        }
        return v;
    }

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _setBackgroundStyle(back: RectElement): void {
    }
}

export abstract class GaugeGroupView<G extends Gauge, T extends GaugeGroup<G>, GV extends GaugeView<G>> extends GaugeView<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _gaugeContainer: LayerElement;
    private _gaugeViews: ElementPool<GV>;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);

        this.add(this._gaugeContainer = new LayerElement(doc, 'rct-gauge-group-container'));
        this._gaugeViews = this._createPool(this._gaugeContainer);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
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
    protected abstract _doPrepareGauges(doc: Document, model: T, views: ElementPool<GV>): void;
    protected abstract _doRenderGauges(container: RcElement, views: ElementPool<GV>, width: number, height: number): void;
}