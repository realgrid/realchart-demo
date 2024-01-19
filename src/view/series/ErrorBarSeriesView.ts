////////////////////////////////////////////////////////////////////////////////
// ErrorBarSeriesView.ts
// 2023. 07. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { RcElement } from "../../common/RcControl";
import { LineElement } from "../../common/impl/PathElement";
import { RectElement } from "../../common/impl/RectElement";
import { RangedPoint } from "../../model/DataPoint";
import { ErrorBarSeries } from "../../model/series/ErrorBarSeries";
import { IPointView, RangeElement, RangedSeriesView, SeriesView } from "../SeriesView";

class BarElement extends RangeElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: RangedPoint;

    private _back: RectElement;
    private _whiskerUp: LineElement;
    private _whiskerDown: LineElement;
    private _stem: LineElement;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doInitChildren(doc: Document): void {
        this.add(this._stem = new LineElement(doc));
        this.add(this._whiskerUp = new LineElement(doc));
        this.add(this._whiskerDown = new LineElement(doc));
        this.add(this._back = new RectElement(doc, 'rct-errorbar-point-back'));

        this._back.setTransparent(false);
    }

    layout(w: number, h: number): void {
        const x = w / 2;

        this.x = this.tx + x; // savePrevs()에서 사용한다.

        this._stem.setVLine(x, 0, h);
        this._whiskerUp.setHLine(0, 0, w);
        this._whiskerDown.setHLine(h, 0, w);
        this._back.setBox(0, 0, w, h);
    }
}

export class ErrorBarSeriesView extends RangedSeriesView<ErrorBarSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars = new ElementPool(this._pointContainer, BarElement);

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-errorbar-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._bars;
    }

    protected _getLowValue(p: RangedPoint): number {
        return p.lowValue;
    }

    protected _preparePoints(doc: Document, model: ErrorBarSeries, points: RangedPoint[]): void {
        this._bars.prepare(points.length, (v, i) => {
            const p = v.point = points[i];

            this._setPointStyle(v, model, p);
        });
    }

    protected _layoutPoint(box: BarElement, i: number, x: number, y: number, wPoint: number, hPoint: number): void {
        box.trans(x - wPoint / 2, y);
        box.layout(wPoint, hPoint);
    }
}