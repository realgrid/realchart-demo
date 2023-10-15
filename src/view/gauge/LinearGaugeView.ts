////////////////////////////////////////////////////////////////////////////////
// LinearGuageView.ts
// 2023. 10. 05. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../../common/Common";
import { ElementPool } from "../../common/ElementPool";
import { LayerElement, RcElement } from "../../common/RcControl";
import { IRect } from "../../common/Rectangle";
import { ISize } from "../../common/Size";
import { RectElement } from "../../common/impl/RectElement";
import { TextElement } from "../../common/impl/TextElement";
import { GaugeItemPosition, GuageRangeBand, IGaugeValueRange } from "../../model/Gauge";
import { BulletGaugeGroup } from "../../model/gauge/BulletGauge";
import { LinearGauge, LinearGaugeGroup } from "../../model/gauge/LinearGauge";
import { ChartElement } from "../ChartElement";
import { GaugeGroupView, LineGaugeView, LinearScaleView } from "../GaugeView";

class BandView extends ChartElement<GuageRangeBand> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _barViews: ElementPool<RectElement>;
    private _labelContainer: LayerElement;
    private _labels: ElementPool<TextElement>;

    private _ranges: IGaugeValueRange[];
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
    protected _doMeasure(doc: Document, model: GuageRangeBand, hintWidth: number, hintHeight: number, phase: number): ISize {
        const g = model.gauge as LinearGauge;
        const scale = g.scale;
        const thick = this._thick = model.position === GaugeItemPosition.INSIDE ? (g.vertical ? hintWidth : hintHeight) : pickNum(model.thickness, 0) + (this._gap = pickNum(model.gap, 0));
        let width = g.vertical ? thick : hintWidth;
        let height = g.vertical ? hintHeight : thick;
        const ranges = this._ranges = model.ranges;

        if (this._labelContainer.setVisible(model.tickLabel.visible && ranges.length > 0)) {
            const vals = [ranges[0].fromValue].concat(ranges.map(r => r.toValue));

            this._labelContainer.internalSetStyleOrClass(model.tickLabel.style);
            this._labels.prepare(ranges.length + 1);

            if (g.vertical) {
                let w = 0;
                this._labels.forEach((v, i) => {
                    v.text = String(vals[i]);
                    w = Math.max(v.getBBounds().width);
                })
                width += w;
            } else {
                let h = 0;
                this._labels.forEach((v, i) => {
                    v.text = String(vals[i]);
                    h = Math.max(v.getBBounds().height);
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

        if (this.$_layoutBars(g, sum, this._ranges) && this._labelContainer.visible) {
            this.$_layoutLabels(g, sum, this._ranges);
        }
    }

    private $_layoutBars(gauge: LinearGauge, sum: number, ranges: IGaugeValueRange[]): boolean {
        this._barViews.prepare(ranges.length);

        if (!this._barViews.isEmpty) {
            const vert = gauge.vertical;
            const width = this.width;
            const height = this.height;
            const len = vert ? height : width;
            let p = 0;

            this._barViews.prepare(ranges.length).forEach((v, i) => {
                const range = ranges[i];
                const w = len * (range.toValue - range.fromValue) / sum;

                if (vert) {
                    v.setBounds(0, height - p - w, this._thick, w);
                } else {
                    v.setBounds(p, 0, w, this._thick);
                }
                
                v.setStyle('fill', range.color);
                p += w;
            });
            return true;
        }
    }

    private $_layoutLabels(gauge: LinearGauge, sum: number, ranges: IGaugeValueRange[]): void {
        const vert = gauge.vertical;
        const width = this.width;
        const height = this.height;
        const len = vert ? height : width;
        const y = this._thick;
        let v: TextElement = this._labels.get(0);

        v.translate(0, y);

        for (let i = 1; i <= ranges.length; i++) {
            const x = len * ranges[i - 1].toValue / sum;
            const v = this._labels.get(i);

            v.translate(x, y);
        }
    }
}

export class LinearGaugeView extends LineGaugeView<LinearGauge> {

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
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);

        this.add(this._background = new RectElement(doc, 'rct-linear-gauge-background'));
        this.add(this._bandView = new BandView(doc));
        this.add(this._scaleView = new LinearScaleView(doc));
        this.add(this._valueView = new RectElement(doc, 'rct-linear-gauge-value'));
        this.add(this._labelView = new TextElement(doc));
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

        if (bandView.setVisible(band.visible)) {
            const gap = +band.gap || 0;
            const sz = bandView.measure(this.doc, band, r.width, r.height, 1);

            bandView.resizeByMeasured().layout();

            if (this._vertical) {
                if (band.position === GaugeItemPosition.INSIDE) {
                    bandView.translate(r.x, r.y);
                } else if (band.position === GaugeItemPosition.OPPOSITE) {
                    bandView.translate(r.x + r.width - sz.width, r.y);
                    r.width -= sz.width + gap;
                } else {
                    bandView.translate(r.x, r.y);
                    r.width -= sz.width + gap;
                    r.x += sz.width + gap;
                }
            } else {
                if (band.position === GaugeItemPosition.INSIDE) {
                    bandView.translate(r.x, r.y);
                } else if (band.position === GaugeItemPosition.OPPOSITE) {
                    bandView.translate(r.x, r.y);
                    r.height -= sz.height + gap;
                    r.y += sz.height + gap;
                } else {
                    bandView.translate(r.x, r.y + r.height - sz.height);
                    r.height -= sz.height + gap;
                }
            }
        }
    }

    protected _renderBand(m: LinearGauge, r: IRect, value: number): void {
        const reversed = m.reversed;
        const sum = m.scale._max - m.scale._min;

        // value bar
        if (this._valueView.setVisible(!isNaN(m.value))) {
            if (this._vertical) {
                const h = r.height * (value - m.scale._min) / sum;
                const y = reversed ? r.y : r.y + r.height - h;

                this._valueView.setBounds(r.x, r.y + r.height - h, r.width, h);
            } else {
                const w = r.width * (value - m.scale._min) / sum;
                const x = reversed ? r.x + r.width - w : r.x;

                this._valueView.setBounds(x, r.y, w, r.height);
            }
        }
   }
}

/**
 * @internal
 * 
 * View for LinearGaugeGroup.
 */
export class LinearGaugeGroupView extends GaugeGroupView<LinearGauge, LinearGaugeGroup, LinearGaugeView> {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createPool(container: LayerElement): ElementPool<any> {
        return new ElementPool(container, LinearGaugeView);
    }

    protected _doPrepareGauges(doc: Document, model: LinearGaugeGroup, views: ElementPool<LinearGaugeView>): void {
    }

    protected _doRenderGauges(container: RcElement, views: ElementPool<LinearGaugeView>, width: number, height: number): void {
    }
}