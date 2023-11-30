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
import { LayerElement, PathElement, RcElement } from "../../common/RcControl";
import { ISize } from "../../common/Size";
import { RAD_DEG, fixnum, pixel } from "../../common/Types";
import { ArcElement } from "../../common/impl/CircleElement";
import { SectorElement } from "../../common/impl/SectorElement";
import { TextAnchor, TextElement, TextLayout } from "../../common/impl/TextElement";
import { GaugeItemPosition, GaugeRangeBand, ICircularGaugeExtents } from "../../model/Gauge";
import { CircleGauge, CircleGaugeGroup, CircleGaugeHand, CircleGaugePin, CircleGaugeScale } from "../../model/gauge/CircleGauge";
import { ChartElement } from "../ChartElement";
import { CircularGaugeView, GaugeGroupView, ScaleView } from "../GaugeView";

/**
 * @internal
 */
class CircularScaleView extends ScaleView<CircleGaugeScale> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _center: IPoint;
    private _exts: ICircularGaugeExtents;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setExtents(center: IPoint, exts: ICircularGaugeExtents): void {
        this._center = center;
        this._exts = exts;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createLine(doc: Document, styleName: string): RcElement {
        return new ArcElement(doc, styleName);
    }

    protected _doMeasure(doc: Document, model: CircleGaugeScale, hintWidth: number, hintHeight: number, phase: number): ISize {
        const steps = model._steps;
        const nStep = steps.length - ((model.gauge as CircleGauge).sweepAngle === 360 ? 1 : 0);

        if (this._line.setVisible(model.line.visible)) {
            this._line.internalSetStyleOrClass(model.line.style);
        }

        if (this._tickContainer.setVisible(model.tick.visible)) {
            this._tickContainer.internalSetStyleOrClass(model.tick.style);
            this._ticks.prepare(nStep);
        }

        if (this._labelContainer.setVisible(model.tickLabel.visible)) {
            this._labelContainer.internalSetStyleOrClass(model.tickLabel.style);
            this._labels.prepare(nStep, v => {
                v.layout = TextLayout.MIDDLE;
            });
        }

        return { width: hintWidth, height: hintHeight}
    }

    protected _doLayout(param: any): void {
        const m = this.model;
        const steps = m._steps;
        const g = m.gauge as CircleGauge;
        const opposite = m.position === GaugeItemPosition.OPPOSITE ? -1 : 1;
        const gprops = g.props;
        const cx = this._center.x;
        const cy = this._center.y;
        const exts = this._exts;
        const rd = exts.scale;
        const rd2 = rd + this.model.tick.length * opposite;
        const sweep = gprops._sweepRad;
        const start = gprops._startRad;
        const sum = g.maxValue - g.minValue;
        let x1: number, y1: number, x2: number, y2: number, a: number;

        // line
        if (this._line.visible) {
            (this._line as ArcElement).setArc(cx, cy, rd, start, sweep, true);
        }

        // ticks
        if (this._tickContainer.visible) {
            this._ticks.forEach((v, i, count) => {
                const a = m.getRate(steps[i]) * sweep + start;

                x1 = cx + Math.cos(a) * rd;
                y1 = cy + Math.sin(a) * rd;
                x2 = cx + Math.cos(a) * rd2;
                y2 = cy + Math.sin(a) * rd2;
                v.setLine(x1, y1, x2, y2);
            });
        }

        // tick labels
        if (this._labelContainer.visible) {
            this._labels.get(0).text = String(g.maxValue);
            const rd = rd2 + this._labels.get(0).getBBounds().height * 0.5 * opposite;

            this._labels.forEach((v, i, count) => {
                const a = m.getRate(steps[i]) * sweep + start;

                x2 = cx + Math.cos(a) * rd;
                y2 = cy + Math.sin(a) * rd;
                v.text = String(fixnum(g.minValue + m.getRate(steps[i]) * sum));
                v.translate(x2, y2);
            });
        }
    }
}

/**
 * @internal
 */
class BandView extends ChartElement<GaugeRangeBand> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _sectorViews: ElementPool<SectorElement>;
    private _labelContainer: LayerElement;
    private _labels: ElementPool<TextElement>; // TODO

    private _center: IPoint;
    private _exts: ICircularGaugeExtents;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-circle-gauge-band');

        this._sectorViews = new ElementPool(this, SectorElement);
        this.add(this._labelContainer = new LayerElement(doc, 'rct-circle-gauge-band-tick-labels'));
        this._labels = new ElementPool(this._labelContainer, TextElement);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setExtends(center: IPoint, exts: ICircularGaugeExtents): void {
        this._center = center;
        this._exts = exts;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLayout(param: any): void {
        const m = this.model;
        const g = m.gauge as CircleGauge;
        const scale = g.scale;
        const gprops = g.props;
        const cx = this._center.x;
        const cy = this._center.y;
        const rd = this._exts.band;
        const clockwise = g.clockwise;
        const innerRadius = 1 - this._exts.bandThick / rd;
        const ranges = m.ranges;
        const sweep = gprops._sweepRad;
        const sum = g.maxValue - g.minValue;
        let start = gprops._startRad;

        this._sectorViews.prepare(ranges.length).forEach((v, i) => {
            const angle = scale.getRate(ranges[i].toValue - ranges[i].fromValue) * sweep;

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
            v.internalClearStyleAndClass();
            v.setStyle('fill', ranges[i].color);
            ranges[i].style && v.addStyleOrClass(ranges[i].style);
            start += angle;
        });
    }
}

/**
 * @internal
 * 
 * 게이지 중심 핀 view.
 */
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

/**
 * 게이지 침 view.
 */
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

/**
 * @internal
 * 
 * View for CircleGauge.
 */
export class CircleGaugeView extends CircularGaugeView<CircleGauge> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _rimView: SectorElement;
    private _scaleView: CircularScaleView;
    private _bandView: BandView;
    private _valueView: SectorElement;
    private _innerView: SectorElement;
    private _handContainer: LayerElement;
    private _handView: HandView;
    private _pinView: PinView;
    private _textView: TextElement;

    private _center: IPoint;
    private _exts: ICircularGaugeExtents;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-circle-gauge');
    }

    protected _doInitContents(doc: Document, container: LayerElement): void {
        container.add(this._rimView = new SectorElement(doc, 'rct-circle-gauge-back'));
        container.add(this._valueView = new SectorElement(doc, 'rct-circle-gauge-value'));
        container.add(this._innerView = new SectorElement(doc, 'rct-circle-gauge-inner'));
        container.add(this._textView = new TextElement(doc, 'rct-circle-gauge-label'));
        container.add(this._handContainer = new LayerElement(doc, void 0));
        container.add(this._scaleView = new CircularScaleView(doc));
        container.add(this._bandView = new BandView(doc));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareGauge(doc: Document, model: CircleGauge): void {
        // rim
        this._rimView.setVisible(model.rim.visible);

        // scale
        this._scaleView.setVisible(model.scale.visible);

        // band
        this._bandView.setVisible(model.band.visible);

        // foreground rim
        this._valueView.setVisible(model.valueRim.visible);

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
        if (this._textView.setVisible(model.labelVisible())) {
            this._textView.setStyleOrClass(model.label.style);
        }
    }

    protected _renderGauge(width: number, height: number): void {
        const m = this.model;
        const center = m.getCenter(width, height);
        const exts = m.getExtents(Math.min(width, height));

        this.$_renderBackground(m, center, exts);
        this._renderValue();
    }

    _renderValue(): void {
        const m = this.model;
        const scale = m.scale;
        const props = m.getProps();
        const value = this._getValue(m);
        const rate = scale.getRate(pickNum(value, 0));
        const center = this._center;
        const exts = this._exts;
        const thick = m.valueRim.getThickness(exts.radiusThick);// exts.radius - exts.inner);
        const tv = this._textView;

        // value rim
        if (this._valueView.visible) {
            const rim = m.valueRim;
            const range = rim.getRange(value);
            // const rd = exts.value - (rim.stroked ? thick / 2 : 0);
            const rd = exts.value + (rim.stroked ? 0 : thick / 2);
            const valueView = this._valueView;

            valueView.setStyleOrClass(rim.style);
            if (range) {
                valueView.setStyle(rim.stroked ? 'stroke' : 'fill', range.color);
                range.style && valueView.addStyleOrClass(range.style);
            }
            if (rim.stroked) {
                valueView.setStyle('fill', 'none');
                valueView.setStyle('strokeWidth', pixel(thick));
            }

            valueView.setBoolData('stroked', rim.stroked);
            valueView.setSectorEx({
                cx: center.x,
                cy: center.y,
                rx: rd,
                ry: rd,
                innerRadius: (rd - thick) / rd,
                start: props._startRad,
                angle: props._sweepRad * rate,
                clockwise: m.clockwise
            }, m.valueRim.stroked);
        }

        // hand
        if (this._handView) {
            const a = (props._handRad + props._sweepRad * rate) * RAD_DEG;

            this._handView.render(m.hand, exts.radius).translatep(center).rotate(m.clockwise ? a : -a);
        }

        // label
        if (tv.visible) {
            m.label.setText(m.getLabel(m.label, m.label.animatable ? value : m.value));
            tv.text = m.label.text;
            m.label.buildSvg(tv, null, NaN, NaN, m, this.valueOf);
            
            tv.setBoolData('grouped', !!m.group);

            if (m.group) {
                // (this._getGroupView() as CircleGaugeGroupView).layoutChildLabel(this);
                this.$_layoutGroupedLabel(m, tv, exts);
            } else {
                const r = tv.getBBounds();
                const off = m.label.getOffset(this.width, this.height);
    
                tv.translate(center.x + off.x, center.y - r.height / 2 + off.y);
            }
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_renderBackground(m: CircleGauge, center: IPoint, exts: ICircularGaugeExtents): void {
        const props = m.getProps();
        const start = props._startRad;

        this._center = center;
        this._exts = exts;
        m.scale.buildSteps(exts.scale * props._sweepRad, NaN);

        // rim
        if (this._rimView.setVisible(m.rim.visible)) {
            this._rimView.setSector({
                cx: center.x,
                cy: center.y,
                rx: exts.radius,
                ry: exts.radius,
                innerRadius: 1 - exts.radiusThick / exts.radius,
                start: start,
                angle: props._sweepRad,
                clockwise: m.clockwise
            });
        }

        // scale rim
        if (this._scaleView.visible) {
            this._scaleView.measure(this.doc, m.scale, this.width, this.height, 0);
            this._scaleView.setExtents(center, exts);
            this._scaleView.layout();
        }

        // band rim
        if (this._bandView.visible) {
            this._bandView.measure(this.doc, m.band, this.width, this.height, 0);
            this._bandView.setExtends(center, exts);
            this._bandView.layout();
        }

        // inner view
        this._innerView.setStyleOrClass(m.innerStyle);

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

    private $_layoutGroupedLabel(m: CircleGauge, tv: TextElement, exts: ICircularGaugeExtents): void {
        const rText = tv.getBBounds();
        const rBack = this._rimView.getBBounds();
        // const off = m.label.getOffset(this.width, this.height);
        const gap = +(m.group as CircleGaugeGroup).labelGap || 0;

        tv.anchor = TextAnchor.END;
        tv.translate(rBack.x + rBack.width / 2 - gap, rBack.y + (exts.radius - exts.inner - rText.height) / 2);
    }
}

/**
 * @internal
 * 
 * View for CircleGaugeGroup.
 */
export class CircleGaugeGroupView extends GaugeGroupView<CircleGauge, CircleGaugeGroup, CircleGaugeView> {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-circle-gauge-group');
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createPool(container: LayerElement): ElementPool<CircleGaugeView> {
        return new ElementPool(container, CircleGaugeView);
    }

    protected _doRenderGauges(container: RcElement, views: ElementPool<CircleGaugeView>, width: number, height: number): void {
        const doc = this.doc;
        const m = this.model;
        const center = m.getCenter(width, height);
        const exts = m.getExtents(Math.min(width, height));

        m.setChildExtents(exts);
        width = height = exts.radius * 2;

        views.forEach((v, i) => {
            v.measure(doc, m.getVisible(i), width, height, 0);
            v.resize(width, height);
            v.layout();
        })

        container.translate(center.x - exts.radius, center.y - exts.radius);
    }
}