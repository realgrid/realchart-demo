////////////////////////////////////////////////////////////////////////////////
// ClockGuageView.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { LayerElement, PathElement } from "../../common/RcControl";
import { CircleElement } from "../../common/impl/CircleElement";
import { TextElement } from "../../common/impl/TextElement";
import { ClockGauge } from "../../model/gauge/ClockGauge";
import { GaugeView } from "../GaugeView";

export class ClockGaugeView extends GaugeView<ClockGauge> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _background: CircleElement;
    private _container: LayerElement;
    private _foregrounds: ElementPool<PathElement>;
    private _textView: TextElement;
    getValueOf = (target: any, param: string): any => {
        return;
    }

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);

        this.add(this._background = new CircleElement(doc));
        this.add(this._container = new LayerElement(doc, void 0));
        this._foregrounds = new ElementPool(this._container, PathElement);
        this.add(this._textView = new TextElement(doc));
        // this._textView.anchor = TextAnchor.START;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareGauge(doc: Document, model: ClockGauge): void {
        // const ranges = model.ranges;

        // if (isArray(ranges)) {
        //     this._foregrounds.prepare(ranges.length);
        // } else {
        //     this._foregrounds.prepare(1);
        // }
    }

    protected _renderGauge(width: number, height: number): void {
        // this.model.label.setText('good').buildSvg(this._textView, this.model, this.getValueOf);
        // this._textView.translate(this._margins.left + this._paddings.left, this._margins.top + this._paddings.top);
    }
}