////////////////////////////////////////////////////////////////////////////////
// CandlestickSeriesView.ts
// 2023. 07. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { RcElement } from "../../common/RcControl";
import { GroupElement } from "../../common/impl/GroupElement";
import { LineElement } from "../../common/impl/PathElement";
import { RectElement } from "../../common/impl/RectElement";
import { CandlestickSeries, CandlestickSeriesPoint } from "../../model/series/CandlestickSeries";
import { IPointView, RangedSeriesView, SeriesView } from "../SeriesView";

class StickView extends GroupElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: CandlestickSeriesPoint;

    // private _back: RectElement;
    private _wickUpper: LineElement;
    private _wickLower: LineElement;
    private _body: RectElement;

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
        const x = 0;
        let y = 0;
        const yOpen = y + h - h * (Math.min(p.openValue, p.closeValue) - p.lowValue) / len;
        const yClose = y + h - h * (Math.max(p.openValue, p.closeValue) - p.lowValue) / len;
        const yBox = Math.min(yClose, yOpen);
        const hBox = Math.max(1, Math.abs(yOpen - yClose));
        const fall = p.close < p.open;

        this._body.setStyle('fill', fall ? '' : p.color);

        // this._back.setBox(-w / 2, 0, w, h);
        this._wickUpper.setVLine(x, y, yClose);
        this._wickLower.setVLine(x, yOpen, h);
        this._body.setBox(-w / 2, yBox, w, hBox);
        this._body.setStyleName(fall ? 'rct-candlestick-point-fall' : '')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doInitChildren(doc: Document): void {
        this.add(this._wickUpper = new LineElement(doc, 'rct-candlestick-point-wick'));
        this.add(this._wickLower = new LineElement(doc, 'rct-candlestick-point-wick'));
        this.add(this._body = new RectElement(doc));

        // for hit testing
        // this.add(this._back = new RectElement(doc, SeriesView.POINT_STYLE + ' rct-candlestick-point-back'));
        // Dom.setImportantStyle(this._back.dom.style, 'fill', 'transparent'); // 'none'으로 지정하면 hit testing이 되지 않는다.
    }
}

export class CandlestickSeriesView extends RangedSeriesView<CandlestickSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _sticks = new ElementPool(this._pointContainer, StickView);

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-candlestick-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._sticks;
    }

    protected _getLowValue(p: CandlestickSeriesPoint): number {
        return p.lowValue;
    }

    protected _preparePointViews(doc: Document, model: CandlestickSeries, points: CandlestickSeriesPoint[]): void {
        this._sticks.prepare(points.length, (box, i) => {
            box.point = points[i];
        })
    }

    protected _layoutPointView(box: StickView, i: number, x: number, y: number, wPoint: number, hPoint: number): void {
        box.setBounds(x, y, wPoint, hPoint);
        box.layout();
    } 
}