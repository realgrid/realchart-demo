////////////////////////////////////////////////////////////////////////////////
// ClockGuageView.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathElement } from "../../common/RcControl";
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
    private _faceView: CircleElement;
    private _textView: TextElement;
    private _hourView: PathElement;
    private _minuteView: PathElement;
    private _secondView: PathElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-clock-gauge');

        this.add(this._faceView = new CircleElement(doc, 'rct-clock-gauge-face'));
        this.add(this._textView = new TextElement(doc));
        this.add(this._hourView = new PathElement(doc, 'rct-clock-hour-hand'));
        this.add(this._minuteView = new PathElement(doc, 'rct-clock-minute-hand'));
        this.add(this._secondView = new PathElement(doc, 'rct-clock-second-hand'));
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
        const m = this.model;
        const exts = m.getExtendts(width, height);

        this.$_renderFace(exts);

        // this.model.label.setText('good').buildSvg(this._textView, this.model, this.getValueOf);
        // this._textView.translate(this._margins.left + this._paddings.left, this._margins.top + this._paddings.top);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_renderFace(exts: {cx: number, cy: number, rd: number}): void {
        this._faceView.setCircle(exts.cx, exts.cy, exts.rd);
    }
}