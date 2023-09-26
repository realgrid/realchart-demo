////////////////////////////////////////////////////////////////////////////////
// CircularGuageView.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray } from "../../common/Common";
import { ElementPool } from "../../common/ElementPool";
import { LayerElement, PathElement } from "../../common/RcControl";
import { Path } from "../../common/Types";
import { RectElement } from "../../common/impl/RectElement";
import { TextElement } from "../../common/impl/TextElement";
import { CircluarGauge } from "../../model/gauge/Gauge";
import { GaugeView } from "../GaugeView";

export class CircularGaugeView extends GaugeView<CircluarGauge> {

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
    protected _setBackgroundStyle(back: RectElement): void {
    }

    protected _prepareGauge(doc: Document, model: CircluarGauge): void {
        const ranges = model.ranges;

        if (isArray(ranges)) {
            this._foregrounds.prepare(ranges.length);
        } else {
            this._foregrounds.prepare(1);
        }
    }

    protected _renderGauge(width: number, height: number): void {
        this.model.label.setText('good').buildSvg(this._textView, this.model, this.getValueOf);
        // this._textView.translate(this._margins.left + this._paddings.left, this._margins.top + this._paddings.top);
    }
}