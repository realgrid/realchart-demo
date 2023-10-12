////////////////////////////////////////////////////////////////////////////////
// LinearGuageView.ts
// 2023. 10. 05. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../../common/Common";
import { ElementPool } from "../../common/ElementPool";
import { IRect } from "../../common/Rectangle";
import { ISize } from "../../common/Size";
import { RectElement } from "../../common/impl/RectElement";
import { TextElement } from "../../common/impl/TextElement";
import { GaugeRangeBandPosition, GuageRangeBand } from "../../model/Gauge";
import { LinearGauge } from "../../model/gauge/LinearGauge";
import { ChartElement } from "../ChartElement";
import { LineGaugeView, LinearScaleView } from "../GaugeView";

class BandView extends ChartElement<GuageRangeBand> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _barViews: ElementPool<RectElement>;
    _gap = 0;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-linear-gauge-band');

        this._barViews = new ElementPool(this, RectElement);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: GuageRangeBand, hintWidth: number, hintHeight: number, phase: number): ISize {
        const g = model.gauge as LinearGauge;
        const sz = model.position === GaugeRangeBandPosition.INSIDE ? (g.vertical ? hintWidth : hintHeight) : pickNum(model.thickness, 0) + (this._gap = pickNum(model.gap, 0));
        const width = g.vertical ? sz : hintWidth;
        const height = g.vertical ? hintHeight : sz;

        return { width, height };
    }
    
    protected _doLayout(param: any): void {
        const m = this.model;
        const g = (m.gauge) as LinearGauge;
        const scale = g.scale;
        const sum = scale._max - scale._min;
        const ranges = m.getRanges(scale._min, scale._max);

        this._barViews.prepare(ranges.length);

        if (!this._barViews.isEmpty) {
            const vert = g.vertical;
            const width = this.width;
            const height = this.height;
            const len = vert ? height : width;
            const thick = vert ? width : height;
            let p = 0;

            this._barViews.prepare(ranges.length).forEach((v, i) => {
                const range = ranges[i];
                const w = len * (range.toValue - range.fromValue) / sum;

                if (vert) {
                    v.setBounds(0, height - p - w, thick, w);
                } else {
                    v.setBounds(p, 0, w, thick);
                }
                
                v.setStyle('fill', range.color);
                p += w;
            });
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
                if (band.position === GaugeRangeBandPosition.INSIDE) {
                    bandView.translate(r.x, r.y);
                } else if (band.position === GaugeRangeBandPosition.OPPOSITE) {
                    bandView.translate(r.x + r.width - sz.width, r.y);
                    r.width -= sz.width + gap;
                } else {
                    bandView.translate(r.x, r.y);
                    r.width -= sz.width + gap;
                    r.x += sz.width + gap;
                }
            } else {
                if (band.position === GaugeRangeBandPosition.INSIDE) {
                    bandView.translate(r.x, r.y);
                } else if (band.position === GaugeRangeBandPosition.OPPOSITE) {
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