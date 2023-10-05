////////////////////////////////////////////////////////////////////////////////
// LinearGuageView.ts
// 2023. 10. 05. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { LayerElement, PathElement } from "../../common/RcControl";
import { RectElement } from "../../common/impl/RectElement";
import { TextElement } from "../../common/impl/TextElement";
import { LinearGauge } from "../../model/gauge/LinearGauge";
import { GaugeView } from "../GaugeView";

export class LinearGaugeView extends GaugeView<LinearGauge> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _background: PathElement;
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

        this.add(this._background = new PathElement(doc));
        this.add(this._container = new LayerElement(doc, void 0));
        this._foregrounds = new ElementPool(this._container, PathElement);
        this.add(this._textView = new TextElement(doc));
        // this._textView.anchor = TextAnchor.START;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareGauge(doc: Document, model: LinearGauge): void {
        // const ranges = model.ranges;

        // if (isArray(ranges)) {
        //     this._foregrounds.prepare(ranges.length);
        // } else {
        //     this._foregrounds.prepare(1);
        // }
    }

    protected _renderGauge(width: number, height: number): void {
        // this.model.label.setText('good').buildSvg(this._textView, this.model, this.getValueOf);
    }
}