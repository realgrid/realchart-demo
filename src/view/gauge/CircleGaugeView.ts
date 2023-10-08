////////////////////////////////////////////////////////////////////////////////
// CircleGuageView.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../../common/Common";
import { ElementPool } from "../../common/ElementPool";
import { PathBuilder } from "../../common/PathBuilder";
import { IPoint } from "../../common/Point";
import { RcAnimation } from "../../common/RcAnimation";
import { LayerElement, PathElement } from "../../common/RcControl";
import { RAD_DEG } from "../../common/Types";
import { SectorElement } from "../../common/impl/SectorElement";
import { TextElement } from "../../common/impl/TextElement";
import { ICircularGaugeExtents } from "../../model/Gauge";
import { CircleGauge, CircleGaugeHand, CircleGaugePin } from "../../model/gauge/CircleGauge";
import { CircularGaugeView } from "./CirclularGaugeView";

class PinView extends PathElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _radius: number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    render(model: CircleGaugePin, gaugeRadius: number): PinView {
        const r = model.getRadius(gaugeRadius);

        if (r !== this._radius) {
            this._radius = r;
            this.setPath(new PathBuilder().circle(0, 0, r).end());
        }
        this.internalSetStyleOrClass(model.style);
        return this;
    }
}

class HandView extends PathElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _radius: number;
    private _length: number;
    private _offset: number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    render(model: CircleGaugeHand, gaugeRadius: number): HandView {
        const exts = model.getExtents(gaugeRadius);

        if (exts.radius !== this._radius || exts.length !== this._length || exts.offset !== this._offset) {
            const rd = this._radius = exts.radius;
            const off = this._offset = exts.offset;
            this._length = exts.length;

            if (this._radius > 0 && this._length > 0) {
                const pb = new PathBuilder();

                pb.move(-rd, off).line(0, -this._length + off).line(rd, off);
                this.setPath(pb.end());
            } else {
                this.setPath('');
            }
        }
        this.internalSetStyleOrClass(model.style);
        return this;
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
    private _segContainer: LayerElement;
    private _segments: ElementPool<SectorElement>;
    private _foreground: SectorElement;
    private _innerView: SectorElement;
    private _handContainer: LayerElement;
    private _handView: HandView;
    private _pinView: PinView;
    private _textView: TextElement;

    private _center: {x: number, y: number};
    private _exts: ICircularGaugeExtents;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);

        this.add(this._background = new SectorElement(doc, 'rct-circle-gauge-back'));
        this.add(this._segContainer = new LayerElement(doc, void 0));
        this._segments = new ElementPool(this._segContainer, SectorElement, 'rct-circle-gauge-segment');
        this.add(this._foreground = new SectorElement(doc, 'rct-circle-gauge-value'));
        this.add(this._innerView = new SectorElement(doc, 'rct-circle-gauge-inner'));
        this.add(this._handContainer = new LayerElement(doc, void 0));
        this.add(this._textView = new TextElement(doc, 'rct-circle-gauge-label'));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareGauge(doc: Document, model: CircleGauge): void {
        // backgroun rim
        this._background.setVisible(model.rim.visible);

        // back segments
        if (model.rim.isRanged()) {
            this._segments.prepare(model.rim.rangeCount());
        } else {
            this._segments.prepare(0);
        }

        // foreground rim
        this._foreground.setVisible(model.valueRim.visible);

        // pin & hand
        if (model.hand.visible) {
            if (!this._handView) {
                this._handContainer.add(this._handView = new HandView(doc, 'rct-circle-gauge-hand'));
            }
            this._handView.visible = true;
        } else if (this._handView) {
            this._handView.visible = false;
        }
        if (model.pin.visible) {
            if (!this._pinView) {
                this._handContainer.add(this._pinView = new PinView(doc, 'rct-circle-gauge-pin'));
            }
            this._pinView.visible = true;
        } else if (this._pinView) {
            this._pinView.visible = false;
        }

        // label
        this._textView.internalSetStyleOrClass(model.label.style);
    }

    protected _renderGauge(width: number, height: number): void {
        const m = this.model;
        const center = m.getCenter(width, height);
        const exts = m.getExtents(width, height);

        this.$_renderBackground(m, center, exts);
        this._renderValue();
    }

    _renderValue(): void {
        const m = this.model;
        const value = pickNum(this._runValue, m.value);
        const rate = pickNum((value - m.minValue) / (m.maxValue - m.minValue), 0);
        const center = this._center;
        const exts = this._exts;
        const thick = m.valueRim.getThickness(exts.radius - exts.inner);

        // foreground rim
        if (this._foreground.visible) {
            const range = m.valueRim.getRange(value); // runValue가 아니다.
            if (range) {
                this._foreground.setStyle('fill', range.color);
            }
            this._foreground.setSector({
                cx: center.x,
                cy: center.y,
                rx: exts.value,
                ry: exts.value,
                innerRadius: (exts.value - thick) / exts.value,
                start: m._startRad,
                angle: m._sweepRad * rate,
                clockwise: m.clockwise
            });
        }

        // hand
        if (this._handView) {
            const a = (m._handRad + m._sweepRad * rate) * RAD_DEG;

            this._handView.render(m.hand, exts.radius).translatep(center).rotate(m.clockwise ? a : -a);
        }

        // label
        if (this._textView.setVisible(m.label.visible)) {
            m.label.setText(m.getLabel(m.label, m.label.animatable ? value : m.value)).buildSvg(this._textView, m, this.valueOf);
            
            const r = this._textView.getBBounds();
            const off = m.label.getOffset(this.width, this.height);

            this._textView.translate(center.x + off.x, center.y - r.height / 2 + off.y);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_renderSegments(center: IPoint, exts: ICircularGaugeExtents): void {
        const m = this.model;
        const cx = center.x;
        const cy = center.y;
        const rd = exts.radius;
        const clockwise = m.clockwise;
        const innerRadius = exts.inner / exts.radius;
        const ranges = m.rim.ranges;
        const sweep = m._sweepRad;
        const sum = m.maxValue - m.minValue;
        let start = 0;

        this._segments.forEach((v, i) => {
            const angle = (ranges[i].endValue - ranges[i].startValue) * sweep / sum;

            v.setSector({
                cx,
                cy,
                rx: rd,
                ry: rd,
                innerRadius,
                start,
                angle,
                clockwise
            });
            v.setStyle('fill', ranges[i].color);
            start += angle;
        });
    }

    private $_renderBackground(m: CircleGauge, center: IPoint, exts: ICircularGaugeExtents): void {
        const start = m._startRad;

        this._center = center;
        this._exts = exts;

        // background rim
        this._background.setSector({
            cx: center.x,
            cy: center.y,
            rx: exts.radius,
            ry: exts.radius,
            innerRadius: exts.inner / exts.radius,
            start: start,
            angle: m._sweepRad,
            clockwise: m.clockwise
        });

        // backgroun segments
        !this._segments.isEmpty && this.$_renderSegments(center, exts);

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
        if (this._pinView) {
            this._pinView.render(m.pin, r).translate(center.x, center.y);
        }
    }
}