////////////////////////////////////////////////////////////////////////////////
// LinearGuageView.ts
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
import { LinearGauge } from "../../model/gauge/LinearGauge";
import { LineGaugeView, LinearScaleView } from "../GaugeView";

export class LinearGaugeView extends LineGaugeView<LinearGauge> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _background: RectElement;
    private _stepContainer: LayerElement;
    private _stepViews: ElementPool<RectElement>;
    private _valueView: RectElement;
    private _scaleView: LinearScaleView;
    private _labelView: TextElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);

        this.add(this._background = new RectElement(doc, 'rct-linear-gauge-background'));
        this.add(this._stepContainer = new LayerElement(doc, void 0));
        this._stepViews = new ElementPool(this._stepContainer, RectElement);
        this.add(this._valueView = new RectElement(doc, 'rct-linear-gauge-value'));
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

    protected itemContainer(): LayerElement {
        return this._stepContainer;
    }

    protected _prepareGauge(doc: Document, model: LinearGauge): void {
    }

    protected _renderBand(m: LinearGauge, r: IRect, value: number): void {
        const reversed = m.reversed;
        const sum = m.scale._max - m.scale._min;
        // const ranges = m.getRanges(m.scale._min, m.scale._max);

        // if (ranges) {
        //     let x = 0;

        //     this._barViews.prepare(ranges.length).forEach((v, i) => {
        //         const range = ranges[i];
        //         const w = r.width * (range.toValue - range.fromValue) / sum;

        //         v.setBounds(x, 0, w, r.height);
        //         v.setStyle('fill', range.color);
        //         x += w;
        //     });
        // }

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