////////////////////////////////////////////////////////////////////////////////
// LinearGuageView.ts
// 2023. 10. 05. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../../common/Common";
import { ElementPool } from "../../common/ElementPool";
import { LayerElement, PathElement } from "../../common/RcControl";
import { IRect } from "../../common/Rectangle";
import { RectElement } from "../../common/impl/RectElement";
import { TextAnchor, TextElement } from "../../common/impl/TextElement";
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
    protected _prepareGauge(doc: Document, model: LinearGauge): void {
    }

    protected _renderGauge(width: number, height: number): void {
        const m = this.model;

        this._measureGauge(m, m.label, m.vertical, width, height);
        this._renderValue();
    }

    _renderValue(): void {
        const m = this.model;
        // const scale = m.scale;
        const value = pickNum(this._runValue, m.value);
        const rBand = Object.assign({}, this._rBand);

        // band background
        this._background.setRect(rBand);

        // label
        // this._rLabel.height = this._stepContainer.height;
        // this._renderLabel(m, m.label, this._labelView, value);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
//     private $_renderBand(m: LinearGauge, r: IRect, value: number): void {
//         const sum = m.scale._max - m.scale._min;
//         const ranges = m.getRanges(m.scale._min, m.scale._max);

//         if (ranges) {
//             let x = 0;

//             this._barViews.prepare(ranges.length).forEach((v, i) => {
//                 const range = ranges[i];
//                 const w = r.width * (range.toValue - range.fromValue) / sum;

//                 v.setBounds(x, 0, w, r.height);
//                 v.setStyle('fill', range.color);
//                 x += w;
//             });
//         }

//         // value bar
//         if (this._valueView.setVisible(!isNaN(m.value))) {
//             const w = r.width * (value - m.scale._min) / sum;
//             this._valueView.setBounds(r.x, r.y + r.height / 3, w, r.height / 3);
//         }
//    }
}