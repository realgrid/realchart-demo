////////////////////////////////////////////////////////////////////////////////
// CircleGuageView.ts
// 2023. 09. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray } from "../../common/Common";
import { ElementPool } from "../../common/ElementPool";
import { LayerElement } from "../../common/RcControl";
import { ORG_ANGLE, deg2rad } from "../../common/Types";
import { RectElement } from "../../common/impl/RectElement";
import { SectorElement } from "../../common/impl/SectorElement";
import { TextElement } from "../../common/impl/TextElement";
import { CircleGauge } from "../../model/gauge/CircleGauge";
import { GaugeView } from "../GaugeView";

export class CircleGaugeView extends GaugeView<CircleGauge> {

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
    getValueOf = (target: any, param: string): any => {
        return;
    }

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);

        this.add(this._background = new SectorElement(doc, 'rct-circle-gauge-back'));
        this.add(this._container = new LayerElement(doc, void 0));
        this._foregrounds = new ElementPool(this._container, SectorElement, 'rct-circle-gauge-value');
        this.add(this._textView = new TextElement(doc, 'rct-circle-gauge-label'));
        // this._textView.anchor = TextAnchor.START;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _setBackgroundStyle(back: RectElement): void {
    }

    protected _prepareGauge(doc: Document, model: CircleGauge): void {
        const ranges = model.ranges;

        if (isArray(ranges)) {
            this._foregrounds.prepare(ranges.length);
        } else {
            this._foregrounds.prepare(1);
        }
    }

    protected _renderGauge(width: number, height: number): void {
        const m = this.model;
        const center = m.getCenter(width, height);
        const rds = m.getSize(width, height);
        let start = ORG_ANGLE + deg2rad(this.model.startAngle);

        // background arc
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

        // foreground sectors
        if (this._foregrounds.count === 1) {
            this._foregrounds.first.setSector({
                cx: center.x,
                cy: center.y,
                rx: rds.size / 2,
                ry: rds.size / 2,
                innerRadius: rds.inner / rds.size,
                start: start,
                angle: Math.PI * 2 * 0.8,
                clockwise: true
            });
        }

        // label
        this.model.label.setText('Gauge Title').buildSvg(this._textView, this.model, this.getValueOf);
        const r = this._textView.getBBounds();
        this._textView.translate(center.x, center.y - r.height / 2);
    }
}