////////////////////////////////////////////////////////////////////////////////
// OhlcSeriesView.ts
// 2023. 08. 08. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Dom } from "../../common/Dom";
import { ElementPool } from "../../common/ElementPool";
import { RcElement } from "../../common/RcControl";
import { LineElement } from "../../common/impl/PathElement";
import { RectElement } from "../../common/impl/RectElement";
import { OhlcSeries, OhlcSeriesPoint } from "../../model/series/OhlcSeries";
import { IPointView, RangeElement, RangedSeriesView, SeriesView } from "../SeriesView";

class StickView extends RangeElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: OhlcSeriesPoint;

    private _back: RectElement;
    private _tickOpen: LineElement;
    private _tickClose: LineElement;
    private _bar: LineElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    layout(): void {
        const p = this.point;
        const w = this.width;
        const h = this.height;
        const len = p.highValue - p.lowValue;
        const x = 0;//this.width / 2;
        const x1 = -w / 2;
        let y = 0;
        const yOpen = y + h - h * (Math.min(p.openValue, p.closeValue) - p.lowValue) / len;
        const yClose = y + h - h * (Math.max(p.openValue, p.closeValue) - p.lowValue) / len;
        const decline = p.close < p.open;

        this._back.setBox(x1, 0, w, h);
        this._tickOpen.setHLine(yOpen, x1, x);
        this._tickClose.setHLine(yClose, x, this.width);
        this._bar.setVLine(x, y, y + h);
        //this._bar.setBounds(0, Math.min(yClose, yOpen), w, Math.max(1, Math.abs(yOpen - yClose)));
        this.setBoolData('decline', decline);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doInitChildren(doc: Document): void {
        this.add(this._tickOpen = new LineElement(doc, 'rct-ohlc-point-tick'));
        this.add(this._tickClose = new LineElement(doc, 'rct-ohlc-point-tick'));
        this.add(this._bar = new LineElement(doc));
        this.add(this._back = new RectElement(doc, 'rct-ohlc-point-back'));

        this._back.setTransparent();
    }
}

export class OhlcSeriesView extends RangedSeriesView<OhlcSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _sticks = new ElementPool(this._pointContainer, StickView);

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-ohlc-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._sticks;
    }

    protected _getLowValue(p: OhlcSeriesPoint): number {
        return p.lowValue;
    }

    protected _preparePointViews(doc: Document, model: OhlcSeries, points: OhlcSeriesPoint[]): void {
        this.$_prepareSticks(model, points);
    }

    protected _layoutPointView(view: StickView, index: number, x: number, y: number, wPoint: number, hPoint: number): void {
        view.setBounds(x, y, wPoint, hPoint);
        view.layout();
    }

    protected _setPointStyle(v: RcElement, model: OhlcSeries, p: OhlcSeriesPoint, styles?: any[]): void {
        super._setPointStyle(v, model, p, styles);

        if (p.closeValue < p.openValue && model.declineStyle) {
            v.addStyleOrClass(model.declineStyle);
        }
     }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareSticks(model: OhlcSeries, points: OhlcSeriesPoint[]): void {
        this._sticks.prepare(points.length, (box, i) => {
            const p = box.point = points[i];

            this._setPointStyle(box, model, p);
        })
    }
}