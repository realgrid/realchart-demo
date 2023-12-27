////////////////////////////////////////////////////////////////////////////////
// LinearGuageView.ts
// 2023. 10. 05. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { copyObj, pickNum } from "../../common/Common";
import { ElementPool } from "../../common/ElementPool";
import { LayerElement, RcElement } from "../../common/RcControl";
import { IRect, createRect } from "../../common/Rectangle";
import { ISize } from "../../common/Size";
import { IValueRange } from "../../common/Types";
import { RectElement } from "../../common/impl/RectElement";
import { TextElement } from "../../common/impl/TextElement";
import { GaugeItemPosition, GaugeRangeBand } from "../../model/Gauge";
import { LinearGauge, LinearGaugeBase, LinearGaugeGroup, LinearGaugeGroupBase } from "../../model/gauge/LinearGauge";
import { ChartElement } from "../ChartElement";
import { GaugeGroupView, LinearGaugeBaseView, LinearScaleView } from "../GaugeView";

class BandView extends ChartElement<GaugeRangeBand> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _barViews: ElementPool<RectElement>;
    private _labelContainer: LayerElement;
    private _labels: ElementPool<TextElement>;

    private _ranges: IValueRange[];
    private _vertical: boolean;
    _thick = 0;
    _gap = 0;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-linear-gauge-band');

        this._barViews = new ElementPool(this, RectElement);
        this.add(this._labelContainer = new LayerElement(doc, 'rct-linear-gauge-band-tick-labels'));
        this._labels = new ElementPool(this._labelContainer, TextElement);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: GaugeRangeBand, hintWidth: number, hintHeight: number, phase: number): ISize {
        const g = model.gauge as LinearGauge | LinearGaugeGroup;
        const vertical = this._vertical = g instanceof LinearGauge ? g.isVertical() : !g.vertical;
        const pos = model.position;
        const thick = this._thick = model.getThickness(vertical ? hintWidth : hintHeight) + (pos === GaugeItemPosition.INSIDE ? 0 : (this._gap = pickNum(model.gap, 0)));
        let width = vertical ? thick : hintWidth;
        let height = vertical ? hintHeight : thick;
        const ranges = this._ranges = model.ranges;

        if (this._labelContainer.setVis(model.tickLabel.visible && ranges.length > 0)) {
            const vals = [ranges[0].fromValue].concat(ranges.map(r => r.toValue));

            this._labelContainer.setStyleOrClass(model.tickLabel.style);
            this._labels.prepare(ranges.length + 1);

            if (vertical) {
                let w = 0;
                this._labels.forEach((v, i) => {
                    v.text = String(vals[i]);
                    w = Math.max(v.getBBox().width);
                })
                width += w;
            } else {
                let h = 0;
                this._labels.forEach((v, i) => {
                    v.text = String(vals[i]);
                    h = Math.max(v.getBBox().height);
                })
                height += h;
            }
        }
        return { width, height };
    }
    
    protected _doLayout(param: any): void {
        const m = this.model;
        const g = (m.gauge) as LinearGauge;
        const scale = g.scale;
        const sum = scale._max - scale._min;

        if (this._labelContainer.setVis(this.$_layoutBars(g, sum, this._ranges) && this._labelContainer.visible && m.position !== GaugeItemPosition.INSIDE)) {
            this.$_layoutLabels(g, sum, this._ranges);
        }
    }

    private $_layoutBars(gauge: LinearGauge, sum: number, ranges: IValueRange[]): boolean {
        this._barViews.prepare(ranges.length);

        if (!this._barViews.isEmpty && sum > 0) {
            const vert = this._vertical;
            const opposite = this.model.position === GaugeItemPosition.OPPOSITE;
            const width = this.width;
            const height = this.height;
            const len = vert ? height : width;
            const thick = this._thick;
            let p = 0;

            this._barViews.prepare(ranges.length).forEach((v, i) => {
                const range = ranges[i];
                const w = len * (range.toValue - range.fromValue) / sum;

                if (vert) {
                    v.setBounds(0, height - p - w, thick, w);
                } else {
                    const y = opposite ? height - thick : 0;
                    v.setBounds(p, y, w, this._thick);
                }
                
                v.internalClearStyleAndClass();
                v.setFill(range.color);
                range.style && v.addStyleOrClass(range.style);
                p += w;
            });
            return true;
        }
    }

    private $_layoutLabels(gauge: LinearGauge, sum: number, ranges: IValueRange[]): void {
        const vert = this._vertical;
        const opposite = this.model.position === GaugeItemPosition.OPPOSITE;
        const width = this.width;
        const height = this.height;
        const len = vert ? height : width;
        const p = opposite ? 0 : this._thick;
        let v = this._labels.get(0);

        if (vert) {
            v.trans(p, 0);
        } else {
            v.trans(0, p);
        }

        for (let i = 1; i <= ranges.length; i++) {
            const xy = len * ranges[i - 1].toValue / sum;
            const v = this._labels.get(i);

            if (vert) {
                v.trans(p, xy);
            } else {
                v.trans(xy, p);
            }
        }
    }
}

export class LinearGaugeView extends LinearGaugeBaseView<LinearGauge> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _background: RectElement;
    private _valueView: RectElement;
    private _bandView: BandView;
    private _scaleView: LinearScaleView;
    private _labelView: TextElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-linear-gauge');
    }

    protected _doInitContents(doc: Document, container: LayerElement): void {
        container.add(this._background = new RectElement(doc, 'rct-linear-gauge-background'));
        container.add(this._bandView = new BandView(doc));
        container.add(this._scaleView = new LinearScaleView(doc));
        container.add(this._valueView = new RectElement(doc, 'rct-linear-gauge-value'));
        container.add(this._labelView = new TextElement(doc));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected labelView(): TextElement {
        return this._labelView;
    }

    protected scaleView(): LinearScaleView {
        return this._scaleView;
    }

    protected background(): RectElement {
        return this._background;
    }

    protected _prepareGauge(doc: Document, model: LinearGauge): void {
    }

    _renderScale(r: IRect): void {
        const m = this.model;
        const band = m.band;
        const bandView = this._bandView;

        super._renderScale(r);

        if (bandView.setVis(band.visible)) {
            const gap = +band.gap || 0;
            const sz = bandView.measure(this.doc, band, r.width, r.height, 1);

            bandView.resizeByMeasured().layout();

            if (this._vertical) {
                if (band.position === GaugeItemPosition.INSIDE) {
                    bandView.trans(r.x, r.y);
                } else if (band.position === GaugeItemPosition.OPPOSITE) {
                    bandView.trans(r.x + r.width - sz.width, r.y);
                    r.width -= sz.width + gap;
                } else {
                    bandView.trans(r.x, r.y);
                    r.width -= sz.width + gap;
                    r.x += sz.width + gap;
                }
            } else {
                if (band.position === GaugeItemPosition.INSIDE) {
                    bandView.trans(r.x, r.y);
                } else if (band.position === GaugeItemPosition.OPPOSITE) {
                    bandView.trans(r.x, r.y);
                    r.height -= sz.height + gap;
                    r.y += sz.height + gap;
                } else {
                    bandView.trans(r.x, r.y + r.height - sz.height);
                    r.height -= sz.height + gap;
                }
            }
        }
    }

    protected _renderBand(m: LinearGauge, r: IRect, value: number): void {
        const reversed = m.reversed;
        const scale = m.group ? (m.group as LinearGaugeGroup).scale : m.scale;

        // value bar
        if (this._valueView.setVis(!scale.isEmpty() && !isNaN(m.value))) {
            if (this._vertical) {
                const h = r.height * scale.getRate(value);
                const y = reversed ? r.y : r.y + r.height - h;

                this._valueView.setBounds(r.x, y, r.width, h);
            } else {
                const w = r.width * scale.getRate(value);
                const x = reversed ? r.x + r.width - w : r.x;

                this._valueView.setBounds(x, r.y, w, r.height);
            }
        }
    }
}

/**
 * @internal
 * 
 * View for LinearGaugeGroupBase.
 */
export abstract class LinearGaugeGroupBaseView<G extends LinearGaugeBase, T extends LinearGaugeGroupBase<G>, GV extends LinearGaugeBaseView<G>> extends GaugeGroupView<G, T, GV> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _textView: TextElement;
    protected _scaleView: LinearScaleView;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);
    }

    protected _doInitContents(doc: Document, container: LayerElement): void {
        super._doInitContents(doc, container);

        container.insertFirst(this._scaleView = new LinearScaleView(doc));
        container.insertFirst(this._textView = new TextElement(doc, 'rct-linear-gauge-group-label'));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareGauge(doc: Document, model: T): void {
        // label
        if (this._textView.setVis(model.label.visible)) {
            this._textView.setStyleOrClass(model.label.style);
        }
        // scale
        if (this._scaleView.setVis(model.scale.visible)) {
            this._scaleView.setStyleOrClass(model.scale.style);
        }

        super._prepareGauge(doc, model);
    }

    protected _doRenderGauges(container: RcElement, views: ElementPool<LinearGaugeBaseView<G>>, width: number, height: number): void {
        const m = this.model;
        const tv = this._textView;
        const r = createRect(0, 0, width, height);

        if (tv.visible) {
            tv.text = m.label.text;
            m.label.buildSvg(tv, null, NaN, NaN, m, null);

            const rText = this._textView.getBBox();
            const h = rText.height + m.label.getGap(height);
            r.y += h;
            r.height -= h;

            tv.trans(this.width / 2, 0);
        }

        m._labelWidth = m._labelHeight = 0;
        this._gaugeViews.forEach((v, i) => {
            const sz = (v as LinearGaugeBaseView<G>).measureLabelSize(m.get(i), width, height);
            m._labelWidth = Math.max(m._labelWidth, sz.width);
            m._labelHeight = Math.max(m._labelHeight, sz.height);
        })

        const rBody = copyObj(r) as IRect;
        const gap = m.itemLabel.gap;

        if (m.vertical) {
            // 자식 label이 left or right
            rBody.width -= m._labelWidth + gap;
            if (!m.itemLabel.opposite) {
                rBody.x += m._labelWidth + gap;
            }
        } else {
            rBody.height -= m._labelHeight + gap;
            if (!m.itemLabel.opposite) {
                rBody.x += m._labelHeight + gap;
            }
        }

        this._renderScale(m, r, rBody);

        if (m.vertical) {
            this.$_layoutVert(this.doc, m, views, r);
        } else {
            this.$_layoutHorz(this.doc, m, views, r);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _renderScale(model: LinearGaugeGroupBase<G>, rGauge: IRect, rBody: IRect): void {
        const scaleView = this._scaleView;
        const scale = model.scale;
        const len = model.vertical ? rGauge.width : rGauge.height;
        const values: number[] = [];
        let x: number, y: number;

        this._gaugeViews.forEach((v, i) => {
            values.push(pickNum(v._runValue, model.get(i).value));
        })

        scale.buildGroupSteps(len, values);

        if (scaleView.setVis(scale.visible)) {
            if (model.vertical) { // 자식들이 수평 모드
                const sz = scaleView.measure(this.doc, scale, rBody.width, rBody.height, 1);

                rBody.height -= sz.height;
                rGauge.height -= sz.height;
                x = rBody.x;

                if (scale.position === GaugeItemPosition.OPPOSITE) {
                    y = rBody.y;
                    rBody.y += sz.height;
                    rGauge.y += sz.height;
                } else {
                    y = rBody.y + rBody.height;
                }
            } else { // 자식들이 수직 모드
                // TODO
            }

            scaleView.resizeByMeasured().layout().trans(x, y);
        }
    }

    private $_layoutHorz(doc: Document, model: LinearGaugeGroupBase<G>, views: ElementPool<LinearGaugeBaseView<G>>, bounds: IRect): void {
        const h = bounds.height;
        const w = bounds.width / views.count;
        const y = bounds.y;

        // TODO
    }

    private $_layoutVert(doc: Document, model: LinearGaugeGroupBase<G>, views: ElementPool<LinearGaugeBaseView<G>>, bounds: IRect): void {
        const w = bounds.width;
        const h = (bounds.height - model.itemGap * (views.count - 1)) / views.count;
        const x = bounds.x;
        let y = bounds.y;

        views.forEach((v, i) => {
            v.measure(doc, model.get(i), w, h, 0);
            v.resize(w, h);
            v.layout();
            v.trans(x, y);

            y += h + model.itemGap;
        });
    }
}

/**
 * @internal
 * 
 * View for LinearGaugeGroupBase.
 */
export class LinearGaugeGroupView extends LinearGaugeGroupBaseView<LinearGauge, LinearGaugeGroup, LinearGaugeView> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bandView: BandView;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-linear-gauge-group');
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doInitContents(doc: Document, container: LayerElement): void {
        super._doInitContents(doc, container);

        container.insertChild(this._bandView = new BandView(doc), this._scaleView);
    }

    protected _createPool(container: LayerElement): ElementPool<any> {
        return new ElementPool(container, LinearGaugeView);
    }

    protected _renderScale(model: LinearGaugeGroup, rGauge: IRect, rBody: IRect): void {
        super._renderScale(model, rGauge, rBody);

        const bandView = this._bandView;
        const band = model.band;
        let x: number, y: number;

        if (bandView.setVis(band.visible)) {
            const gap = +band.gap || 0;

            if (model.vertical) { // 자식들이 수평 모드
                const sz = bandView.measure(this.doc, band, rBody.width, rBody.height, 1);
                const h = sz.height + gap;

                rBody.height -= h;
                rGauge.height -= h;
                x = rBody.x;

                if (band.position === GaugeItemPosition.OPPOSITE) {
                    y = rBody.y;
                    rBody.y += h;
                    rGauge.y += h;
                } else {
                    y = rBody.y + rBody.height + gap;
                }
            } else { // 자식들이 수직 모드
                // TODO
            }

            bandView.resizeByMeasured().layout().trans(x, y);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}