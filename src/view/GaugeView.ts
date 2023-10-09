////////////////////////////////////////////////////////////////////////////////
// GuageView.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isNumber, pickProp } from "../common/Common";
import { ElementPool } from "../common/ElementPool";
import { NumberFormatter } from "../common/NumberFormatter";
import { IPoint } from "../common/Point";
import { RcAnimation } from "../common/RcAnimation";
import { LayerElement } from "../common/RcControl";
import { IRect, Rectangle } from "../common/Rectangle";
import { ISize } from "../common/Size";
import { LineElement } from "../common/impl/PathElement";
import { RectElement } from "../common/impl/RectElement";
import { TextAnchor, TextElement } from "../common/impl/TextElement";
import { Gauge, LinearGaugeLabel, LinearGaugeScale, ValueGauge } from "../model/Gauge";
import { ChartElement } from "./ChartElement";

export abstract class GaugeView<T extends Gauge> extends ChartElement<T> {

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
    protected _doMeasure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        return model.getSize(hintWidth, hintHeight);
    }

    protected _doLayout(): void {
        // back
        this._backElement.resize(this.width, this.height);
        // gauge
        this._renderGauge(this.width, this.height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _prepareGauge(doc: Document, model: T): void;
    protected abstract _renderGauge(width: number, height: number): void;
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

export class LinearScaleView extends ChartElement<LinearGaugeScale> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _line: LineElement;
    private _tickContainer: LayerElement;
    private _ticks: ElementPool<LineElement>;
    private _labelContainer: LayerElement;
    private _labels: ElementPool<TextElement>;
    
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-linear-scale');

        this.add(this._line = new LineElement(doc, 'rct-linear-scale-line'));
        this.add(this._tickContainer = new LayerElement(doc, 'rct-linear-scale-ticks'));
        this._ticks = new ElementPool(this._tickContainer, LineElement);
        this.add(this._labelContainer = new LayerElement(doc, 'rct-linear-scale-tick-labels'));
        this._labels = new ElementPool(this._labelContainer, TextElement);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: LinearGaugeScale, hintWidth: number, hintHeight: number, phase: number): ISize {
        const vertical = model._vertical;
        const steps = model._steps;
        let width = vertical ? model.gap : hintWidth;
        let height = vertical ? hintHeight : model.gap;

        if (this._tickContainer.setVisible(model.tick.visible)) {
            this._tickContainer.internalSetStyleOrClass(model.tick.style);
            this._ticks.prepare(steps.length);
        }
        height += model.tick.length;

        if (this._labelContainer.setVisible(model.tickLabel.visible)) {
            this._labelContainer.internalSetStyleOrClass(model.tickLabel.style);
            this._labels.prepare(steps.length);

            if (steps.length > 0) {
                let h = 0;

                this._labels.forEach((v, i) => {
                    v.text = String(steps[i]);
                    h = Math.max(v.getBBounds().height);
                })
                height += h;
            }
        }

        return { width, height };
    }

    protected _doLayout(): void {
        const m = this.model;
        const steps = m._steps;
        const w = this.width / (steps.length - 1);
        let y = m.gap;
        let x = 0;

        // line
        if (this._line.setVisible(m.line.visible)) {
            this._line.internalSetStyleOrClass(m.line.style);
            this._line.setHLineC(y, x, x + this.width);
        }

        // ticks
        if (this._tickContainer.setVisible(m.tick.visible)) {
            this._ticks.forEach((v, i) => {
                v.setVLineC(x, y, y + m.tick.length);
                x += w;
            })
        }
        y += m.tick.length;

        // labels
        x = 0;
        this._labels.forEach((v, i) => {
            v.anchor = i < steps.length - 1 ? TextAnchor.MIDDLE : TextAnchor.END;
            v.translate(x, y);
            x += w;
        });
    }
}

export abstract class LineGaugeView<T extends ValueGauge> extends ValueGaugeView<T> {

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

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _measureGauge(m: ValueGauge, label: LinearGaugeLabel, vertical: boolean, width: number, height: number): void {
        const r = this._rBand = Rectangle.create(0, 0, width, height);

        this._vertical = pickProp(vertical, height > width);

        if (label.visible) {
            const pos = pickProp(label.position, this._vertical ? 'top' : 'left');
            const vert = pos === 'top' || pos === 'bottom';
            const w = vert ? width : label.getWidth(vert, width);
            const h = vert ? label.getHeight(vert, height) : height;
            const gap = label.getGap(vert ? height : width);
            
            this._rLabel = Rectangle.create(0, 0, w, h);

            switch (pos) {
                case 'top':
                    break;
                case 'bottom':
                    break;
                case 'right':
                    break;
                default:
                    r.width -= w;
                    r.x = w;
                    break;
            }

            if (vert) {
                r.height -= gap;
                r.y += gap;
            } else {
                r.width -= gap;
                r.x += gap;
            }

        } else {
            this._rLabel = null;
        }
    }

    protected _renderLabel(m: ValueGauge, label: LinearGaugeLabel, view: TextElement, value: number): void {
        if (view.visible) {
            const r = this._rLabel;

            view.anchor = TextAnchor.END;
            label.setText(m.getLabel(label, label.animatable ? value : m.value)).buildSvg(view, r.width, m, this.valueOf);
            view.translate(r.x + r.width, r.y + Math.max(0, (r.height - view.getBBounds().height) / 2));
        }
   }
}