////////////////////////////////////////////////////////////////////////////////
// BulletGuageView.ts
// 2023. 10. 05. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { LayerElement, RcElement } from "../../common/RcControl";
import { IRect } from "../../common/Rectangle";
import { RectElement } from "../../common/impl/RectElement";
import { TextElement } from "../../common/impl/TextElement";
import { BulletGauge, BulletGaugeGroup } from "../../model/gauge/BulletGauge";
import { LinearGaugeBaseView, LinearScaleView } from "../GaugeView";
import { LinearGaugeGroupBaseView } from "./LinearGaugeView";

export class BulletGaugeView extends LinearGaugeBaseView<BulletGauge> {

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
    private _scaleView: LinearScaleView;
    private _labelView: TextElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-bullet-gage');
    }

    protected _doInitContents(doc: Document, container: LayerElement): void {
        container.add(this._background = new RectElement(doc, 'rct-bullet-gauge-background'));
        container.add(this._barContainer = new LayerElement(doc, void 0));
        this._barViews = new ElementPool(this._barContainer, RectElement);
        container.add(this._valueView = new RectElement(doc, 'rct-bullet-gauge-value'));
        container.add(this._targetView = new RectElement(doc, 'rct-bullet-gauge-target'));
        container.add(this._scaleView = new LinearScaleView(doc));
        container.add(this._labelView = new TextElement(doc));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _backgroundView(): RcElement {
        return this._background;
    }

    protected labelView(): TextElement {
        return this._labelView;
    }

    protected scaleView(): LinearScaleView {
        return this._scaleView;
    }

    protected background(): RectElement {
        return this._background;
    }

    protected _prepareGauge(doc: Document, model: BulletGauge): void {
    }

    protected _renderBand(m: BulletGauge, r: IRect, value: number): void {
        const group = m.group as BulletGaugeGroup;
        const reversed = m.reversed;
        const vertical = this._vertical;
        const scale = group ? group.scale : m.scale;
        const vActual = this._valueView;
        const vTarget = this._targetView;

        if (this._barContainer.setVis(!scale.isEmpty())) {
            const ranges = m.getRanges(scale._min, scale._max, false) || group?.getRanges(scale._min, scale._max, false);

            if (ranges) {
                this._barContainer.setRect(r);
                this._barViews.prepare(ranges.length);

                if (vertical) {
                    this._barViews.forEach((v, i) => {
                        const range = ranges[i];
                        const h = r.height * scale.getRate(range.toValue - range.fromValue);
                        const y2 = r.height * scale.getRate(range.fromValue);
        
                        v.setBounds(0, reversed ? y2 : r.height - y2 - h, r.width, h);
                        v.internalClearStyleAndClass();
                        v.setFill(range.color);
                        range.style && v.addStyleOrClass(range.style);
                    });
                } else {
                    this._barViews.forEach((v, i) => {
                        const range = ranges[i];
                        const w = r.width * scale.getRate(range.toValue - range.fromValue);
                        const x2 = r.width * scale.getRate(range.fromValue);
        
                        v.setBounds(reversed ? r.width - w - x2 : x2, 0, w, r.height);
                        v.internalClearStyleAndClass();
                        v.setFill(range.color);
                        range.style && v.addStyleOrClass(range.style);
                    });
                }
            }
        }

        // value bar
        if (vActual.setVis(!scale.isEmpty() && !isNaN(value))) {
            vActual.setStyleOrClass(m.valueBar.style);
            if (value < m.targetValue && m.valueBar.belowStyle) {
                vActual.internalSetStyleOrClass(m.valueBar.belowStyle);
            }
            vActual.internalSetStyleOrClass(m.valueBar.getStyle(value));

            if (vertical) {
                const h = r.height * scale.getRate(value);
                const y = reversed ? r.y : r.y + r.height - h;

                vActual.setBounds(r.x + r.width / 3, y, r.width / 3, h);
            } else {
                const w = r.width * scale.getRate(value);
                const x = reversed ? r.x + r.width - w : r.x;
    
                vActual.setBounds(x, r.y + r.height / 3, w, r.height / 3);
            }
        }

        // target bar
        if (vTarget.setVis(!scale.isEmpty() && !isNaN(m.targetValue))) {
            vTarget.setStyleOrClass(m.targetBar.style);

            if (vertical && r.width > 10) {
                let y = r.height * scale.getRate(m.targetValue);

                y = reversed ? r.y + y : r.y + r.height - y;
                vTarget.setBounds(r.x + 5, y - 1, r.width - 10, 3);
            } else if (!vertical && r.height > 10) {
                let x = r.width * scale.getRate(m.targetValue);
            
                x = reversed ? (r.x + r.width - x) : (r.x + x);
                vTarget.setBounds(x - 1, r.y + 5, 3, r.height - 10);
            }
        }
   }
}

/**
 * @internal
 * 
 * View for BulletGaugeGroup.
 */
export class BulletGaugeGroupView extends LinearGaugeGroupBaseView<BulletGauge, BulletGaugeGroup, BulletGaugeView> {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-bullet-gauge-group');
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createPool(container: LayerElement): ElementPool<BulletGaugeView> {
        return new ElementPool(container, BulletGaugeView);
    }
}