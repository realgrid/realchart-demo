////////////////////////////////////////////////////////////////////////////////
// BulletGuageView.ts
// 2023. 10. 05. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isNumber, pickNum } from "../../common/Common";
import { ElementPool } from "../../common/ElementPool";
import { NumberFormatter } from "../../common/NumberFormatter";
import { LayerElement, PathElement } from "../../common/RcControl";
import { TextElement } from "../../common/impl/TextElement";
import { BulletGauge } from "../../model/gauge/BulletGauge";
import { GaugeView, ValueGaugeView } from "../GaugeView";

export class BulletGaugeView extends ValueGaugeView<BulletGauge> {

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
    valueOf = (target: any, param: string, format: string): any => {
        const v = target.getParam(param);

        if (isNumber(v)) {
            return NumberFormatter.getFormatter(format || target.label.numberFormat).toStr(v);
        }
        return v;
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
        const m = this.model;

        this._renderValue();
    }

    _renderValue(): void {
        const m = this.model;
        const value = pickNum(this._runValue, m.value);

        // label
        if (this._labelView.setVisible(m.label.visible)) {
            m.label.setText(m.getLabel(m.label, m.label.animatable ? value : m.value)).buildSvg(this._labelView, m, this.valueOf);
            
            const r = this._labelView.getBBounds();
            let x = 0;
            let y = 0;

            switch (m.label.position) {
                case 'top':
                    break;
                case 'bottom':
                    break;
                case 'right':
                    break;
                default:
                    break;
            }

            this._labelView.translate(x, y);
        }
    }
}