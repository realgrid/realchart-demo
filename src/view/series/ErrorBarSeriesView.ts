////////////////////////////////////////////////////////////////////////////////
// ErrorBarSeriesView.ts
// 2023. 07. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { RcElement } from "../../common/RcControl";
import { GroupElement } from "../../common/impl/GroupElement";
import { LineElement } from "../../common/impl/PathElement";
import { ErrorBarSeries, ErrorBarSeriesPoint } from "../../model/series/ErrorBarSeries";
import { IPointView, RangedSeriesView, SeriesView } from "../SeriesView";

class BarElement extends GroupElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: ErrorBarSeriesPoint;

    private _whiskerUp: LineElement;
    private _whiskerDown: LineElement;
    private _stem: LineElement;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_STYLE + ' rct-errorbar-point');

        this.add(this._stem = new LineElement(doc));
        this.add(this._whiskerUp = new LineElement(doc));
        this.add(this._whiskerDown = new LineElement(doc));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    layout(): void {
        const w = this.width
        const h = this.height;
        const x = w / 2;

        this._stem.setVLine(x, 0, h);
        this._whiskerUp.setHLine(0, 0, w);
        this._whiskerDown.setHLine(h, 0, w);
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

    protected _getLowValue(p: ErrorBarSeriesPoint): number {
        return p.lowValue;
    }

    protected _layoutPointView(box: BarElement, i: number, x: number, y: number, wPoint: number, hPoint: number): void {
        box.setBounds(x - wPoint / 2, y, wPoint, hPoint);
        box.layout();
    }

    protected _preparePointViews(doc: Document, model: ErrorBarSeries, points: ErrorBarSeriesPoint[]): void {
        this._bars.prepare(points.length, (v, i) => {
            v.point = points[i];
            v.setStyle('stroke', points[i].color);
        });
    }
}