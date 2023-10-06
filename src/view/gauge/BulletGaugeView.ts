////////////////////////////////////////////////////////////////////////////////
// BulletGuageView.ts
// 2023. 10. 05. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { LayerElement, PathElement } from "../../common/RcControl";
import { TextElement } from "../../common/impl/TextElement";
import { BulletGauge } from "../../model/gauge/BulletGauge";
import { GaugeView } from "../GaugeView";

export class BulletGaugeView extends GaugeView<BulletGauge> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _background: PathElement;
    private _barContainer: LayerElement;
    private _barViews: ElementPool<PathElement>;
    private _labelView: TextElement;
    getValueOf = (target: any, param: string): any => {
        return;
    }

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-bullet-gage');

        this.add(this._background = new PathElement(doc));
        this.add(this._barContainer = new LayerElement(doc, void 0));
        this._barViews = new ElementPool(this._barContainer, PathElement);
        this.add(this._labelView = new TextElement(doc));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareGauge(doc: Document, model: BulletGauge): void {
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