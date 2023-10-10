////////////////////////////////////////////////////////////////////////////////
// ClockGuageView.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathBuilder } from "../../common/PathBuilder";
import { RcAnimation } from "../../common/RcAnimation";
import { LayerElement, PathElement } from "../../common/RcControl";
import { ORG_ANGLE, PI_2, RAD_DEG } from "../../common/Types";
import { CircleElement } from "../../common/impl/CircleElement";
import { LineElement } from "../../common/impl/PathElement";
import { SectorElement } from "../../common/impl/SectorElement";
import { TextElement, TextLayout } from "../../common/impl/TextElement";
import { ClockGauge, ClockGaugeHand } from "../../model/gauge/ClockGauge";
import { GaugeView } from "../GaugeView";

class SecondAnimation extends RcAnimation {

    constructor(public view: ClockGaugeView) {
        super();
    }

    protected _doUpdate(rate: number): boolean {
        this.view._secRate = rate;
        this.view.$_renderHands(this.view.model, this.view._exts);
        return true;
    }
}

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
    private _tickLabelContainer: LayerElement;
    private _tickLabelViews: ElementPool<TextElement>;
    private _labelView: TextElement;
    private _hourView: PathElement;
    private _minuteView: PathElement;
    private _secondView: PathElement;
    private _pinView: CircleElement;

    private _runner: any;
    _exts: {cx: number, cy: number, rd: number};
    private _rimThick = 0;
    private _prevSec: number;
    private _aniSec: number;
    _secRate = 1;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-clock-gauge');

        this.add(this._faceView = new CircleElement(doc, 'rct-clock-gauge-face'));
        this.add(this._rimView = new SectorElement(doc, 'rct-clock-gauge-rim'));
        this.add(this._labelView = new TextElement(doc, 'rct-clock-gauge-label'));
        this._labelView.layout = TextLayout.MIDDLE;
        this.add(this._tickContainer = new LayerElement(doc, 'rct-clock-gauge-ticks'));
        this.add(this._tickLabelContainer = new LayerElement(doc, 'rct-clock-gauge-tick-labels'));
        this.add(this._hourView = new PathElement(doc, 'rct-clock-gauge-hour'));
        this.add(this._minuteView = new PathElement(doc, 'rct-clock-gauge-minute'));
        this.add(this._secondView = new PathElement(doc, 'rct-clock-gauge-second'));
        this.add(this._pinView = new CircleElement(doc, 'rct-clock-gauge-pin'));

        this._tickViews = new ElementPool(this._tickContainer, LineElement, 'rct-clock-gauge-tick');
        this._minorTickViews = new ElementPool(this._tickContainer, LineElement, 'rct-clock-gauge-minor-tick');
        this._tickLabelViews = new ElementPool(this._tickLabelContainer, TextElement, 'rct-clock-gauge-tick-label');
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareGauge(doc: Document, model: ClockGauge): void {
        this._tickViews.prepare(model.tick.visible ? 12 : 0);
        this._minorTickViews.prepare(model.minorTick.visible ? 12 * 4 : 0);

        const cnt = Math.round(12 / Math.max(1, (Math.floor(model.tickLabel.step) || 1)));
        this._tickLabelViews.prepare(model.tickLabel.visible ? cnt : 0, v => {
            v.layout = TextLayout.MIDDLE;
        });
    }

    protected _renderGauge(width: number, height: number): void {
        const m = this.model;
        const exts = this._exts = m.getExtendts(width, height);

        this._secRate = 1;
        this.$_renderFace(m, exts);
        this.$_renderHands(m, exts);

        if (m.active && !m.getTime()) {
            if (!this._runner) {
                this._runner = setInterval(() => {
                    const prev = this._prevSec;
                    this.$_renderHands(this.model, this._exts);
                    if (Math.abs(prev - this._prevSec) >= 1) {
                        if (this._secondView.visible && m.chart.animatable() && m.secondHand.animatable) {
                            this.$_moveSecond(prev);
                        }
                    }
                }, 1000);
            }
        } else if (this._runner) {
            clearInterval(this._runner);
            this._runner = void 0;
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_renderFace(model: ClockGauge, exts: {cx: number, cy: number, rd: number}): void {
        const labelView = this._labelView;
        const {cx, cy, rd} = exts;
        const thick = this._rimThick = this._rimView.visible ? this.model.rim.getThickness(rd) : 0;

        // face
        this._faceView.setCircle(cx, cy, rd);

        // rim
        if (this._rimView.visible) {
            this._rimView.internalSetStyleOrClass(model.rim.style);
            this._rimView.setSector({
                cx: cx,
                cy: cy,
                rx: rd,
                ry: rd,
                innerRadius: 1 - thick / rd,
                start: 0,
                angle: Math.PI * 2,
                clockwise: true
            });
        }
        
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

        // tick labels
        if (!this._tickLabelViews.isEmpty) {
            const step = 12 / this._tickLabelViews.count;
            const astep = PI_2 / 12 * step;

            a = ORG_ANGLE;

            this._tickLabelViews.get(0).text = '12';
            rd2 = rd1 - ((this.model.tick.length + this.model.tickLabel.offset) || 0);
            rd2 -= this._tickLabelViews.get(0).getBBounds().height * 0.5;

            this._tickLabelViews.forEach((v, i, cnt) => {
                v.text = String(i === 0 ? 12 : i * step);
                v.translate(cx + Math.cos(a) * rd2, cy + Math.sin(a) * rd2);
                a += astep;
            })
        }

        // pin
        this._pinView.setCircle(cx, cy, model.pin.raidus);

        // label
        if (labelView.setVisible(model.label.visible)) {
            labelView.internalSetStyleOrClass(model.label.style);
            model.label.buildSvg(labelView, NaN, NaN, null, null);

            if (model.label.position === 'bottom') {
                labelView.translate(cx, cy + rd2 / 2);
            } else {
                labelView.translate(cx, cy - rd2 / 2);
            }
        }
    }

    private $_getNow(): Date {
        const off = this.model.timezone;
        let d = this.model.getTime() || new Date();

        if (!isNaN(off)) {
            const m = d.getMinutes() + (d.getTimezoneOffset() + off);
            d.setMinutes(m);
        }
        return d;
    }

    $_renderHands(model: ClockGauge, exts: {cx: number, cy: number, rd: number}): void {
        const now = this.$_getNow();
        const h = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();
        const {cx, cy, rd} = exts;
        const pb = new PathBuilder();
        let hand: ClockGaugeHand;
        let handView: PathElement;
        let len: number;
        let a: number;

        // hour hand
        hand = model.hourHand;
        handView = this._hourView;
        if (handView.setVisible(hand.visible)) {
            a = PI_2 * (h / 12 + m / 60 / 12 + s / 60 / 60 / 12);
            len = hand.getLength(rd - this._rimThick);
            pb.rect(-hand.thickness / 2, -len, hand.thickness, len);
            handView.internalSetStyleOrClass(hand.style);
            handView.setPath(pb.close(true)).translate(cx, cy).rotate(a * RAD_DEG);
        }

        // minute hand
        hand = model.minuteHand;
        handView = this._minuteView;
        if (handView.setVisible(hand.visible)) {
            a = PI_2 * (m / 60 + s / 60 / 60);
            len = hand.getLength(rd - this._rimThick);
            pb.rect(-hand.thickness / 2, -len, hand.thickness, len);
            handView.internalSetStyleOrClass(hand.style);
            handView.setPath(pb.close(true)).translate(cx, cy).rotate(a * RAD_DEG);
        }

        // second hand
        hand = model.secondHand;
        handView = this._secondView;
        if (handView.setVisible(hand.visible)) {
            if (this._secRate < 1) {
                a = PI_2 * (this._aniSec + this._secRate) / 60;
            } else {
                a = PI_2 * s / 60;
            }
            len = hand.getLength(rd - this._rimThick);
            pb.rect(-hand.thickness / 2, -len, hand.thickness, len);
            handView.internalSetStyleOrClass(hand.style);
            handView.setPath(pb.close(true)).translate(cx, cy).rotate(a * RAD_DEG);
            this._prevSec = s;
        }
    }

    private $_moveSecond(prev: number): void {
        if (!isNaN(prev)) {
            this._aniSec = prev;
            const ani = new SecondAnimation(this);
            ani.duration = this.model.secondHand.duration || 200;
            ani.start();
        }
    }
}