////////////////////////////////////////////////////////////////////////////////
// WaterfallSeriesView.ts
// 2023. 07. 29. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { LayerElement, RcElement } from "../../common/RcControl";
import { LineElement } from "../../common/impl/PathElement";
import { WaterfallSeries, WaterfallSeriesPoint } from "../../model/series/WaterfallSeries";
import { BarElement, RangedSeriesView } from "../SeriesView";

export class WaterfallSeriesView extends RangedSeriesView<WaterfallSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lineContainer: LayerElement;
    private _bars: ElementPool<BarElement> = new ElementPool(this._pointContainer, BarElement);
    private _lines: ElementPool<LineElement>;
    private _xPrev: number;
    private _wPrev: number;
    private _rd: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-waterfall-series')

        this.add(this._lineContainer = new LayerElement(doc, 'rct-waterfall-series-lines'));
        this._lines = new ElementPool(this._lineContainer, LineElement);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._bars;
    }

    protected _getLowValue(p: WaterfallSeriesPoint): number {
        return p.low;
    }

    protected _prepareSeries(doc: Document, model: WaterfallSeries): void {
        super._prepareSeries(doc, model);

        this._rd = +model.cornerRadius || 0;
    }

    protected _preparePoints(doc: Document, model: WaterfallSeries, points: WaterfallSeriesPoint[]): void {
        this.$_parepareBars(doc, model, points);
    }

    protected _layoutPoint(view: BarElement, i: number, x: number, y: number, wPoint: number, hPoint: number): void {
        const p = view.point as WaterfallSeriesPoint;

        view.wPoint = wPoint;
        view.hPoint = hPoint;
        y += hPoint;
        view.layout(x, y, this._rd, this._rd);
        
        if (i > 0) {
            const line = this._lines.get(i - 1);
            const y2 = p._isSum ? y - hPoint : p.y >= 0 ? y : y - hPoint;

            line.setHLine(y2, this._xPrev + this._wPrev / 2, x - wPoint / 2);
        }

        this._xPrev = x;
        this._wPrev = wPoint;
    }

    protected _layoutPoints(width: number, height: number): void {
        if (this._inverted) {
            this._lineContainer.dom.style.transform = `translate(0px, ${height}px) rotate(90deg) scale(-1, 1)`;
        } else {
            this._lineContainer.dom.style.transform = '';
        }

        super._layoutPoints(width, height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareBars(doc: Document, model: WaterfallSeries, points: WaterfallSeriesPoint[]): void {
        this._bars.prepare(points.length, (v, i) => {
            const p = v.point = points[i];

            this._setPointStyle(v, model, p);
            v.setStyleOrClass(p._isSum ? 'rct-waterfall-point-sum' : p.y < 0 ? 'rct-waterfall-point-negative' : '');
        });

        this._lines.prepare(points.length - 1, (v, i) => {
            v.visible = !points[i].isNull && !points[i + 1].isNull;
        });
    }
}