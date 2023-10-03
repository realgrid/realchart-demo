////////////////////////////////////////////////////////////////////////////////
// CircleGuageView.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, pickNum } from "../../common/Common";
import { ElementPool } from "../../common/ElementPool";
import { PathBuilder } from "../../common/PathBuilder";
import { RcAnimation } from "../../common/RcAnimation";
import { LayerElement, PathElement, RcElement } from "../../common/RcControl";
import { SVGStyleOrClass } from "../../common/Types";
import { SectorElement } from "../../common/impl/SectorElement";
import { TextElement } from "../../common/impl/TextElement";
import { ICircularGaugeExtents } from "../../model/Gauge";
import { CircleGauge } from "../../model/gauge/CircleGauge";
import { CircularGaugeView } from "./CirclularGaugeView";

class GaugeAnimation extends RcAnimation {

    constructor(public view: CircleGaugeView, public from: number, public to: number) {
        super();
    }

    protected _doUpdate(rate: number): boolean {
        this.view._runValue = this.from + (this.to - this.from) * rate;
        this.view.$_renderValue(this.view.model);
        return true;
    }
}

class PinView extends PathElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _radius: number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setPin(radius: number, style: SVGStyleOrClass): PinView {
        if (radius !== this._radius) {
            this.setPath(new PathBuilder().circle(0, 0, radius).end());
        }
        this.internalSetStyleOrClass(style);
        return this;
    }
}

class HandView extends PathElement {

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
}

export class CircleGaugeView extends CircularGaugeView<CircleGauge> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _background: SectorElement;
    private _innerView: SectorElement;
    private _handContainer: LayerElement;
    private _handView: HandView;
    private _pinView: PinView;
    private _container: LayerElement;
    private _foregrounds: ElementPool<SectorElement>;
    private _textView: TextElement;

    private _center: {x: number, y: number};
    private _exts: ICircularGaugeExtents;
    private _prevValue = 0;
    _runValue: number;
    private _ani: RcAnimation;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);

        this.add(this._background = new SectorElement(doc, 'rct-circle-gauge-back'));
        this.add(this._innerView = new SectorElement(doc, 'rct-circle-gauge-inner'));
        this.add(this._container = new LayerElement(doc, void 0));
        this._foregrounds = new ElementPool(this._container, SectorElement, 'rct-circle-gauge-value');
        this.add(this._handContainer = new LayerElement(doc, void 0));
        this.add(this._textView = new TextElement(doc, 'rct-circle-gauge-label'));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareGauge(doc: Document, model: CircleGauge): void {
        const ranges = model.ranges;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ranges 
        // circles
        if (isArray(ranges)) {
            this._foregrounds.prepare(ranges.length);
        } else {
            this._foregrounds.prepare(1);
        }

        // pin & hand
        if (model.pin.visible) {
            if (!this._pinView) {
                this._handContainer.add(this._pinView = new PinView(doc, 'rct-circle-gauge-pin'));
            }
            this._pinView.visible = true;
        } else if (this._pinView) {
            this._pinView.visible = false;
        }
        if (model.hand.visible) {
            if (!this._handView) {
                this._handContainer.add(this._handView = new HandView(doc, 'rct-circle-gauge-hand'));
            }
            this._handView.visible = true;
        } else if (this._handView) {
            this._handView.visible = false;
        }

        // label
        this._textView.internalSetStyleOrClass(model.label.style);
    }

    protected _renderGauge(width: number, height: number): void {
        const m = this.model;
        const center = m.getCenter(width, height);
        const exts = m.getExtents(width, height);

        if (this._ani) {
            this._ani.stop();
            this._ani = null;
        }
        this.$_renderBackground(m, center, exts);
        this.$_renderValue(m);

        if (this._animatable && m.animatable && m.value !== this._prevValue) {
            this._ani = new GaugeAnimation(this, this._prevValue, m.value).start(() => this._runValue = NaN);
            this._prevValue = m.value;
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_renderBackground(m: CircleGauge, center: {x: number, y: number}, exts: ICircularGaugeExtents): void {
        const start = m._startRad;

        this._center = center;
        this._exts = exts;

        // background sector
        this._background.setSector({
            cx: center.x,
            cy: center.y,
            rx: exts.radius,
            ry: exts.radius,
            innerRadius: exts.inner / exts.radius,
            start: start,
            angle: m._totalRad,
            clockwise: m.clockwise
        });

        // inner view
        this._innerView.internalSetStyleOrClass(m.innerStyle);

        let r = exts.inner;
        const cs = getComputedStyle(this._innerView.dom);
        const w = parseFloat(cs.strokeWidth);

        if (w > 1) {
            r -= w / 2;
        }
        this._innerView.setSector({
            cx: center.x,
            cy: center.y,
            rx: r,
            ry: r,
            innerRadius: 0,
            start: 0,
            angle: Math.PI * 2,
            clockwise: true
        })

        // pin
        this._pinView?.setPin(m.pin.getRadius(exts.radius), null).translatep(center);
    }

    $_renderValue(m: CircleGauge): void {
        const value = pickNum(this._runValue, m.value);
        const rate = pickNum((value - m.minValue) / (m.maxValue - m.minValue), 0);
        const center = this._center;
        const exts = this._exts;
        const foregrounds = this._foregrounds;

        // foreground sectors
        if (foregrounds.count === 1) {
            const range = m.getValueRange(value); // runValue가 아니다.
            if (range) {
                foregrounds.first.setStyle('fill', range.color);
            }
            foregrounds.first.setSector({
                cx: center.x,
                cy: center.y,
                rx: exts.value,
                ry: exts.value,
                innerRadius: (exts.value - exts.thick) / exts.value,
                start: m._startRad,
                angle: m._totalRad * rate,
                clockwise: m.clockwise
            });
        } else {
            debugger;
        }

        // label
        if (this._textView.setVisible(m.label.visible)) {
            m.label.setText(m.getLabel(m.label.animatable ? value : m.value)).buildSvg(this._textView, m, this.valueOf);
            const r = this._textView.getBBounds();
            this._textView.translate(center.x, center.y - r.height / 2);
        }
    }
}