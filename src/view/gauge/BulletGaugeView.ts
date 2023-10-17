////////////////////////////////////////////////////////////////////////////////
// BulletGuageView.ts
// 2023. 10. 05. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { LayerElement } from "../../common/RcControl";
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

        this.add(this._background = new RectElement(doc, 'rct-bullet-gauge-background'));
        this.add(this._barContainer = new LayerElement(doc, void 0));
        this._barViews = new ElementPool(this._barContainer, RectElement);
        this.add(this._valueView = new RectElement(doc, 'rct-bullet-gauge-value'));
        this.add(this._targetView = new RectElement(doc, 'rct-bullet-gauge-target'));
        this.add(this._scaleView = new LinearScaleView(doc));
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

    protected _prepareGauge(doc: Document, model: BulletGauge): void {
    }

    protected _renderBand(m: BulletGauge, r: IRect, value: number): void {
        const group = m.group as BulletGaugeGroup;
        const reversed = m.reversed;
        const vertical = this._vertical;
        const scale = group ? group.scale : m.scale;
        const sum = scale._max - scale._min;

        if (this._barContainer.setVisible(sum > 0)) {
            const ranges = m.getRanges(scale._min, scale._max) || group?.getRanges(scale._min, scale._max);

            if (ranges) {
                this._barContainer.setRect(r);

                if (vertical) {
                    let y = reversed ? 0 : r.height;

                    this._barViews.prepare(ranges.length).forEach((v, i) => {
                        const range = ranges[i];
                        const h = r.height * (range.toValue - range.fromValue) / sum;
        
                        v.setBounds(0, reversed ? y : y - h, r.width, h);
                        v.setStyle('fill', range.color);
                        y += reversed ? h : -h;
                    });
                } else {
                    let x = reversed ? r.width : 0;

                    this._barViews.prepare(ranges.length).forEach((v, i) => {
                        const range = ranges[i];
                        const w = r.width * (range.toValue - range.fromValue) / sum;
        
                        v.setBounds(reversed ? x - w : x, 0, w, r.height);
                        v.setStyle('fill', range.color);
                        x += reversed ? -w : w;
                    });
                }
            }
        }

        // value bar
        if (this._valueView.setVisible(sum > 0 && !isNaN(m.value))) {
            if (vertical) {
                const h = r.height * (value - m.scale._min) / sum;
                const y = reversed ? r.y : r.y + r.height - h;

                this._valueView.setBounds(r.x + r.width / 3, y, r.width / 3, h);
            } else {
                const w = r.width * (value - m.scale._min) / sum;
                const x = reversed ? r.x + r.width - w : r.x;
    
                this._valueView.setBounds(x, r.y + r.height / 3, w, r.height / 3);
            }
        }

        // target bar
        if (this._targetView.setVisible(sum > 0 && !isNaN(m.targetValue))) {
            if (vertical && r.width > 10) {
                let y = r.height * (m.targetValue - m.scale._min) / sum;

                y = reversed ? r.y + y : r.y + r.height - y;
                this._targetView.setBounds(r.x + 5, y - 1, r.width - 10, 3);
            } else if (!vertical && r.height > 10) {
                let x = r.width * (m.targetValue - m.scale._min) / sum;;
            
                x = reversed ? (r.x + r.width - x) : (r.x + x);
                this._targetView.setBounds(x - 1, r.y + 5, 3, r.height - 10);
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
    // overriden members
    //-------------------------------------------------------------------------
    protected _createPool(container: LayerElement): ElementPool<BulletGaugeView> {
        return new ElementPool(container, BulletGaugeView);
    }
}