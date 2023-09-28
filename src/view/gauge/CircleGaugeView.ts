////////////////////////////////////////////////////////////////////////////////
// CircleGuageView.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, pickNum } from "../../common/Common";
import { ElementPool } from "../../common/ElementPool";
import { RcAnimation } from "../../common/RcAnimation";
import { LayerElement } from "../../common/RcControl";
import { ORG_ANGLE, deg2rad } from "../../common/Types";
import { SectorElement } from "../../common/impl/SectorElement";
import { TextElement } from "../../common/impl/TextElement";
import { CircleGauge } from "../../model/gauge/CircleGauge";
import { CircularGaugeView } from "./CirclularGaugeView";

class GaugeAnimation extends RcAnimation {

    constructor(public view: CircleGaugeView, public from: number, public to: number) {
        super();
    }

    protected _doUpdate(rate: number): boolean {
        this.view._runValue = this.from + (this.to - this.from) * rate;
        console.log(this.view._runValue);
        this.view.$_renderValue(this.view.model)
        return true;
    }
}

export class CircleGaugeView extends CircularGaugeView<CircleGauge> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _background: SectorElement;
    private _container: LayerElement;
    private _foregrounds: ElementPool<SectorElement>;
    private _textView: TextElement;

    private _center: {x: number, y: number};
    private _rds: {size: number, inner: number};
    private _prevValue = 0;
    _runValue: number;
    private _ani: RcAnimation;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);

        this.add(this._background = new SectorElement(doc, 'rct-circle-gauge-back'));
        this.add(this._container = new LayerElement(doc, void 0));
        this._foregrounds = new ElementPool(this._container, SectorElement, 'rct-circle-gauge-value');
        this.add(this._textView = new TextElement(doc, 'rct-circle-gauge-label'));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareGauge(doc: Document, model: CircleGauge): void {
        const ranges = model.ranges;

        if (isArray(ranges)) {
            this._foregrounds.prepare(ranges.length);
        } else {
            this._foregrounds.prepare(1);
        }

        this._textView.internalSetStyleOrClass(model.label.style);
    }

    protected _renderGauge(width: number, height: number): void {
        const m = this.model;
        const center = m.getCenter(width, height);
        const rds = m.getSize(width, height);

        if (this._ani) {
            this._ani.stop();
            this._ani = null;
        }
        this.$_renderBackground(m, center, rds);
        this.$_renderValue(m);

        if (this._animatable && m.animatable && m.value !== this._prevValue) {
            this._ani = new GaugeAnimation(this, this._prevValue, m.value).start(() => this._runValue = NaN);
            this._prevValue = m.value;
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_renderBackground(m: CircleGauge, center: {x: number, y: number}, rds: {size: number, inner: number}): void {
        const start = ORG_ANGLE + deg2rad(m.startAngle);

        this._center = center;
        this._rds = rds;

        this._background.setSector({
            cx: center.x,
            cy: center.y,
            rx: rds.size / 2,
            ry: rds.size / 2,
            innerRadius: rds.inner / rds.size,
            start: start,
            angle: Math.PI * 2,
            clockwise: true
        });
    }

    $_renderValue(m: CircleGauge): void {
        const value = pickNum(this._runValue, m.value);
        const rate = pickNum((value - m.minValue) / (m.maxValue - m.minValue), 0);
        const start = ORG_ANGLE + deg2rad(m.startAngle);
        const center = this._center;
        const rds = this._rds;

        // foreground sectors
        if (this._foregrounds.count === 1) {
            this._foregrounds.first.setSector({
                cx: center.x,
                cy: center.y,
                rx: rds.size / 2,
                ry: rds.size / 2,
                innerRadius: rds.inner / rds.size,
                start: start,
                angle: Math.PI * 2 * rate,
                clockwise: true
            });
        }

        // label
        this.model.label.setText(m.getLabel(value)).buildSvg(this._textView, this.model, this.valueOf);
        const r = this._textView.getBBounds();
        this._textView.translate(center.x, center.y - r.height / 2);
    }
}