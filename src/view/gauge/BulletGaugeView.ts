////////////////////////////////////////////////////////////////////////////////
// BulletGuageView.ts
// 2023. 10. 05. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isNumber, pickNum, pickProp } from "../../common/Common";
import { ElementPool } from "../../common/ElementPool";
import { NumberFormatter } from "../../common/NumberFormatter";
import { LayerElement, PathElement } from "../../common/RcControl";
import { IRect, Rectangle } from "../../common/Rectangle";
import { ISize } from "../../common/Size";
import { LineElement } from "../../common/impl/PathElement";
import { RectElement } from "../../common/impl/RectElement";
import { TextAnchor, TextElement, TextLayout } from "../../common/impl/TextElement";
import { BulletGauge, BulletGaugeScale } from "../../model/gauge/BulletGauge";
import { ChartElement } from "../ChartElement";
import { ValueGaugeView } from "../GaugeView";

export class BulletScaleView extends ChartElement<BulletGaugeScale> {

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
        super(doc, 'rct-bullet-gauge-scale');

        this.add(this._line = new LineElement(doc, 'rct-bullet-gauge-scale-line'));
        this.add(this._tickContainer = new LayerElement(doc, 'rct-bullet-gauge-scale-ticks'));
        this._ticks = new ElementPool(this._tickContainer, LineElement);
        this.add(this._labelContainer = new LayerElement(doc, 'rct-bullet-gauge-scale-tick-labels'));
        this._labels = new ElementPool(this._labelContainer, TextElement);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: BulletGaugeScale, hintWidth: number, hintHeight: number, phase: number): ISize {
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

export class BulletGaugeView extends ValueGaugeView<BulletGauge> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _background: RectElement;
    private _barContainer: LayerElement;
    private _barViews: ElementPool<RectElement>;
    private _valueView: RectElement;
    private _targetView: RectElement;
    private _scaleView: BulletScaleView;
    private _labelView: TextElement;
    valueOf = (target: any, param: string, format: string): any => {
        const v = target.getParam(param);

        if (isNumber(v)) {
            return NumberFormatter.getFormatter(format || target.label.numberFormat).toStr(v);
        }
        return v;
    }

    private _vertical: boolean;
    private _rLabel: IRect;
    private _rBand: IRect;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-bullet-gage');

        this.add(this._background = new RectElement(doc, 'rct-bullet-gauge-background'));
        this.add(this._barContainer = new LayerElement(doc, void 0));
        this._barViews = new ElementPool(this._barContainer, RectElement);
        this.add(this._valueView = new RectElement(doc, 'rct-bullet-gauge-value'));
        this.add(this._targetView = new RectElement(doc, 'rct-bullet-gauge-target'));
        this.add(this._scaleView = new BulletScaleView(doc));
        this.add(this._labelView = new TextElement(doc));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareGauge(doc: Document, model: BulletGauge): void {
        // const ranges = model.ranges;

        // if (isArray(ranges)) {
        //     this._foregrounds.prepare(ranges.length);
        // } else {
        //     this._foregrounds.prepare(1);
        // }
    }

    protected _renderGauge(width: number, height: number): void {
        const m = this.model;
        const label = m.label;
        const r = this._rBand = Rectangle.create(0, 0, width, height);

        this._vertical = pickProp(m.vertical, height > width);

        if (this._labelView.setVisible(label.visible)) {
            const pos = pickProp(label.position, this._vertical ? 'top' : 'left');
            const vert = pos === 'top' || pos === 'bottom';
            const w = vert ? width : label.getWidth(vert, width);
            const h = vert ? label.getHeight(vert, height) : height;
            const gap = m.getGap(vert ? height : width);
            
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

        this._renderValue();
    }

    _renderValue(): void {
        const m = this.model;
        const label = m.label;
        const scale = m.scale;
        const value = pickNum(this._runValue, m.value);
        const rBand = Object.assign({}, this._rBand);
        let x = 0;
        let y = 0;

        // scale
        if (this._scaleView.setVisible(scale.visible)) {
            scale._vertical = this._vertical;
            const len = this._vertical ? rBand.height : rBand.width;
            
            scale.buildSteps(len, value, m.targetValue);
            const sz = this._scaleView.measure(this.doc, scale, rBand.width, rBand.height, 1);

            if (this._vertical) {
                if (scale.opposite) {
                } else {
                }
            } else {
                if (scale.opposite) {
                } else {
                    rBand.height -= sz.height;
                }
            }
            this._scaleView.resizeByMeasured().layout().translate(rBand.x, rBand.height);
        }

        // band background
        this._background.setRect(rBand);
        // band
        this._barContainer.setRect(rBand);
        this.$_renderBand(m, rBand, value);

        // label
        this._rLabel.height = this._barContainer.height;
        this.$_renderLabel(m, value);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_renderLabel(m: BulletGauge, value: number): void {
        const label = m.label;

        if (this._labelView.visible) {
            const r = this._rLabel;

            this._labelView.anchor = TextAnchor.END;
            label.setText(m.getLabel(label, m.label.animatable ? value : m.value)).buildSvg(this._labelView, r.width, m, this.valueOf);
            this._labelView.translate(r.x + r.width, r.y + Math.max(0, (r.height - this._labelView.getBBounds().height) / 2));
        }
   }

   private $_renderBand(m: BulletGauge, r: IRect, value: number): void {
        const sum = m.scale._max - m.scale._min;
        const ranges = m.getRanges(m.scale._min, m.scale._max);

        if (ranges) {
            let x = 0;

            this._barViews.prepare(ranges.length).forEach((v, i) => {
                const range = ranges[i];
                const w = r.width * (range.toValue - range.fromValue) / sum;

                v.setBounds(x, 0, w, r.height);
                v.setStyle('fill', range.color);
                x += w;
            });
        }

        // value bar
        if (this._valueView.setVisible(!isNaN(m.value))) {
            const w = r.width * (value - m.scale._min) / sum;
            this._valueView.setBounds(r.x, r.y + r.height / 3, w, r.height / 3);
        }

        // target bar
        if (this._targetView.setVisible(!isNaN(m.targetValue))) {
            const x = r.x + r.width * (m.targetValue - m.scale._min) / sum;
            this._targetView.setBounds(x - 1, r.y + 5, 3, r.height - 10);
        }
   }
}