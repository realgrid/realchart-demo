////////////////////////////////////////////////////////////////////////////////
// ClockGuageView.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathBuilder } from "../../common/PathBuilder";
import { LayerElement, PathElement } from "../../common/RcControl";
import { ORG_ANGLE, PI_2, RAD_DEG } from "../../common/Types";
import { CircleElement } from "../../common/impl/CircleElement";
import { LineElement } from "../../common/impl/PathElement";
import { SectorElement } from "../../common/impl/SectorElement";
import { TextElement } from "../../common/impl/TextElement";
import { ClockGauge, ClockGaugeHand } from "../../model/gauge/ClockGauge";
import { GaugeView } from "../GaugeView";

export class ClockGaugeView extends GaugeView<ClockGauge> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _faceView: CircleElement;
    private _rimView: SectorElement;
    private _tickContainer: LayerElement;
    private _tickViews: ElementPool<LineElement>;
    private _minorTickViews: ElementPool<LineElement>;
    private _textView: TextElement;
    private _hourView: PathElement;
    private _minuteView: PathElement;
    private _secondView: PathElement;
    private _pinView: CircleElement;

    private _exts: {cx: number, cy: number, rd: number};
    private _rimThick = 0;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-clock-gauge');

        this.add(this._faceView = new CircleElement(doc, 'rct-clock-gauge-face'));
        this.add(this._rimView = new SectorElement(doc, 'rct-clock-gauge-rim'));
        this.add(this._textView = new TextElement(doc));
        this.add(this._tickContainer = new LayerElement(doc, ''));
        this.add(this._hourView = new PathElement(doc, 'rct-clock-gauge-hour'));
        this.add(this._minuteView = new PathElement(doc, 'rct-clock-gauge-minute'));
        this.add(this._secondView = new PathElement(doc, 'rct-clock-gauge-second'));
        this.add(this._pinView = new CircleElement(doc, 'rct-clock-gauge-pin'));

        this._tickViews = new ElementPool(this._tickContainer, LineElement, 'rct-clock-tick');
        this._minorTickViews = new ElementPool(this._tickContainer, LineElement, 'rct-clock-minor-tick');

        setInterval(() => {
            this.$_renderHands(this.model, this._exts);
        }, 1000)
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareGauge(doc: Document, model: ClockGauge): void {
        this._tickViews.prepare(model.tick.visible ? 12 : 0, v => {
            v.setLine
        });
        this._minorTickViews.prepare(model.minorTick.visible ? 12 * 4 : 0);
    }

    protected _renderGauge(width: number, height: number): void {
        const m = this.model;
        const exts = this._exts = m.getExtendts(width, height);

        this.$_renderFace(m, exts);
        this.$_renderHands(m, exts);

        // this.model.label.setText('good').buildSvg(this._textView, this.model, this.getValueOf);
        // this._textView.translate(this._margins.left + this._paddings.left, this._margins.top + this._paddings.top);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_renderFace(model: ClockGauge, exts: {cx: number, cy: number, rd: number}): void {
        const {cx, cy, rd} = exts;
        const thick = this._rimThick = this._rimView.visible ? this.model.rim.getThickness(rd) : 0;

        // face
        this._faceView.setCircle(cx, cy, rd);
        // rim
        this._rimView.visible && this._rimView.setSector({
            cx: cx,
            cy: cy,
            rx: rd,
            ry: rd,
            innerRadius: 1 - thick / rd,
            start: 0,
            angle: Math.PI * 2,
            clockwise: true
        });
        
        // ticks
        const rd1 = rd - thick;
        let rd2 = rd1 - this.model.tick.length;
        let a = ORG_ANGLE;
        let step = PI_2 / 12;

        this._tickViews.forEach((v, i) => {
            v.setLine(
                cx + Math.cos(a) * rd1,
                cy + Math.sin(a) * rd1,
                cx + Math.cos(a) * rd2,
                cy + Math.sin(a) * rd2
            )
            a += step;
        });

        // minor ticks
        if (!this._minorTickViews.isEmpty) {
            let i = 0;

            rd2 = rd1 - this.model.minorTick.length;
            a = ORG_ANGLE;
            step = PI_2 / 60;
    
            this._minorTickViews.forEach(v => {
                if (i % 5 === 0) {
                    a += step;
                    i++;
                }
                v.setLine(
                    cx + Math.cos(a) * rd1,
                    cy + Math.sin(a) * rd1,
                    cx + Math.cos(a) * rd2,
                    cy + Math.sin(a) * rd2
                )
                a += step;
                i++;
            });
        }

        // pin
        this._pinView.setCircle(cx, cy, model.pin.raidus);
    }

    private $_renderHands(model: ClockGauge, exts: {cx: number, cy: number, rd: number}): void {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();
        const {cx, cy, rd} = exts;
        const pb = new PathBuilder();
        let hand: ClockGaugeHand;
        let len: number;
        let a: number;

        // hour hand
        hand = model.hourHand;
        if (this._hourView.setVisible(hand.visible)) {
            a = PI_2 * (h / 12 + m / 60 / 12 + s / 60 / 60 / 12);
            len = hand.getLength(rd - this._rimThick);
            pb.rect(-hand.thickness / 2, -len, hand.thickness, len);
            this._hourView.setPath(pb.close(true)).translate(cx, cy).rotate(a * RAD_DEG);
        }

        // minute hand
        hand = model.minuteHand;
        if (this._minuteView.setVisible(hand.visible)) {
            a = PI_2 * (m / 60 + s / 60 / 60);
            len = hand.getLength(rd - this._rimThick);
            pb.rect(-hand.thickness / 2, -len, hand.thickness, len);
            this._minuteView.setPath(pb.close(true)).translate(cx, cy).rotate(a * RAD_DEG);
        }

        // second hand
        hand = model.secondHand;
        if (this._secondView.setVisible(hand.visible)) {
            a = PI_2 * s / 60;
            len = hand.getLength(rd - this._rimThick);
            pb.rect(-hand.thickness / 2, -len, hand.thickness, len);
            this._secondView.setPath(pb.close(true)).translate(cx, cy).rotate(a * RAD_DEG);
        }
    }
}