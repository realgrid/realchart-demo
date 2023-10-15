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
import { RAD_DEG } from "../../common/Types";
import { CircleElement } from "../../common/impl/CircleElement";
import { SectorElement } from "../../common/impl/SectorElement";
import { TextAnchor, TextElement, TextLayout } from "../../common/impl/TextElement";
import { GuageRangeBand, ICircularGaugeExtents } from "../../model/Gauge";
import { CircleGauge, CircleGaugeGroup, CircleGaugeHand, CircleGaugePin, CircleGaugeScale } from "../../model/gauge/CircleGauge";
import { ChartElement } from "../ChartElement";
import { CircularGaugeView, GaugeGroupView, GaugeView, ScaleView } from "../GaugeView";

class CircularScaleView extends ScaleView<CircleGaugeScale> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _center: IPoint;
    private _exts: ICircularGaugeExtents;

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
    protected _createLine(doc: Document, styleName: string): RcElement {
        return new CircleElement(doc, styleName);
    }

    protected _doMeasure(doc: Document, model: CircleGaugeScale, hintWidth: number, hintHeight: number, phase: number): ISize {
        const steps = model._steps;
        const nStep = steps.length;

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
        const g = m.gauge as CircleGauge;
        const gprops = g.props;
        const cx = this._center.x;
        const cy = this._center.y;
        const exts = this._exts;
        const rd2 = exts.scale;
        const rd = rd2 - this.model.tick.length;
        const sweep = gprops._sweepRad;
        const sum = g.maxValue - g.minValue;
        let x1: number, y1: number, x2: number, y2: number, a: number;

        // line
        if (this._line.visible) {
            (this._line as CircleElement).setCircle(cx, cy, rd);
        }

        // ticks
        if (this._tickContainer.visible) {
            this._ticks.forEach((v, i, count) => {
                const a = i / count * sweep + gprops._startRad;

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
            const rd = rd2 + this._labels.get(0).getBBounds().height * 0.5;

            this._labels.forEach((v, i, count) => {
                const a = i / count * sweep + gprops._startRad;

                x2 = cx + Math.cos(a) * rd;
                y2 = cy + Math.sin(a) * rd;
                v.text = String(i * sum / count);
                v.translate(x2, y2);
            });
        }
    }
}

class BandView extends ChartElement<GuageRangeBand> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _sectorViews: ElementPool<SectorElement>;
    private _labelContainer: LayerElement;
    private _labels: ElementPool<TextElement>;

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
        const gprops = g.props;
        const cx = this._center.x;
        const cy = this._center.y;
        const rd = this._exts.band;
        const clockwise = g.clockwise;
        const innerRadius = 1 - m.thickness / rd;
        const ranges = m.ranges;
        const sweep = gprops._sweepRad;
        const sum = g.maxValue - g.minValue;
        let start = gprops._startRad;

        this._sectorViews.prepare(ranges.length).forEach((v, i) => {
            const angle = (ranges[i].toValue - ranges[i].fromValue) * sweep / sum;

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
    private _background: SectorElement;
    private _scaleView: CircularScaleView;
    private _bandView: BandView;
    private _segContainer: LayerElement;
    private _segments: ElementPool<SectorElement>;
    private _foreground: SectorElement;
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
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);

        this.add(this._background = new SectorElement(doc, 'rct-circle-gauge-back'));
        this.add(this._scaleView = new CircularScaleView(doc));
        this.add(this._bandView = new BandView(doc));
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

        // scale
        this._scaleView.setVisible(model.scaleRim.visible);

        // band
        this._bandView.setVisible(model.bandRim.visible);

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
        const exts = m.getExtents(Math.min(width, height));

        this.$_renderBackground(m, center, exts);
        this._renderValue();
    }

    _renderValue(): void {
        const m = this.model;
        const props = m.getProps();
        const value = pickNum(this._runValue, m.value);
        const rate = pickNum((value - m.minValue) / (m.maxValue - m.minValue), 0);
        const center = this._center;
        const exts = this._exts;
        const thick = m.valueRim.getThickness(exts.radius - exts.inner);
        const tv = this._textView;

        // foreground rim
        if (this._foreground.visible) {
            this._foreground.setStyleOrClass(m.valueRim.style);

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
                start: props._startRad,
                angle: props._sweepRad * rate,
                clockwise: m.clockwise
            });
        }

        // hand
        if (this._handView) {
            const a = (props._handRad + props._sweepRad * rate) * RAD_DEG;

            this._handView.render(m.hand, exts.radius).translatep(center).rotate(m.clockwise ? a : -a);
        }

        // label
        if (tv.setVisible(m.labelVisible())) {
            m.label.setText(m.getLabel(m.label, m.label.animatable ? value : m.value));
            tv.text = m.label.text;
            m.label.buildSvg(tv, NaN, NaN, m, this.valueOf);
            
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
    private $_renderSegments(center: IPoint, exts: ICircularGaugeExtents): void {
        const m = this.model;
        const props = m.getProps();
        const cx = center.x;
        const cy = center.y;
        const rd = exts.radius;
        const clockwise = m.clockwise;
        const innerRadius = exts.inner / exts.radius;
        const ranges = m.rim.ranges;
        const sweep = props._sweepRad;
        const sum = m.maxValue - m.minValue;
        let start = props._startRad;

        this._segments.forEach((v, i) => {
            const angle = (ranges[i].toValue - ranges[i].fromValue) * sweep / sum;

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
        const props = m.getProps();
        const start = props._startRad;

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
            angle: props._sweepRad,
            clockwise: m.clockwise
        });

        // backgroun segments
        !this._segments.isEmpty && this.$_renderSegments(center, exts);

        // scale rim
        if (this._scaleView.visible) {
            m.scaleRim.buildSteps(exts.scale * props._sweepRad, NaN);
            this._scaleView.measure(this.doc, m.scaleRim, this.width, this.height, 0);
            this._scaleView.setExtends(center, exts);
            this._scaleView.layout();
        }

        // band rim
        if (this._bandView.visible) {
            this._bandView.measure(this.doc, m.bandRim, this.width, this.height, 0);
            this._bandView.setExtends(center, exts);
            this._bandView.layout();
        }

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

    private $_layoutGroupedLabel(m: CircleGauge, tv: TextElement, exts: ICircularGaugeExtents): void {
        const rText = tv.getBBounds();
        const rBack = this._background.getBBounds();
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
    // overriden members
    //-------------------------------------------------------------------------
    protected _createPool(container: LayerElement): ElementPool<CircleGaugeView> {
        return new ElementPool(container, CircleGaugeView);
    }

    protected _doPrepareGauges(doc: Document, model: CircleGaugeGroup, views: ElementPool<CircleGaugeView>): void {
        views.forEach((v, i) => {
            v.prepareGauge(doc, model.getVisible(i));
        })
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