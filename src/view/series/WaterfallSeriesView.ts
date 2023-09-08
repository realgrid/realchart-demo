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
import { SvgShapes } from "../../common/impl/SvgShape";
import { WaterfallSeries, WaterfallSeriesPoint } from "../../model/series/WaterfallSeries";
import { BoxPointElement, RangedSeriesView } from "../SeriesView";

class BarElement extends BoxPointElement {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    layout(x: number, y: number): void {
        this.setPath(SvgShapes.rect({
            x: x - this.wPoint / 2,
            y,
            width: this.wPoint,
            height: -this.hPoint
        }));
    }
}

export class WaterfallSeriesView extends RangedSeriesView<WaterfallSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lineContainer: LayerElement;
    private _bars: ElementPool<BarElement> = new ElementPool(this._pointContainer, BarElement);
    private _lines: ElementPool<LineElement>;
    private _xPrev: number;
    private _wPrev: number;

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

    protected _preparePointViews(doc: Document, model: WaterfallSeries, points: WaterfallSeriesPoint[]): void {
        this.$_parepareBars(doc, points);
    }

    protected _layoutPointView(view: BarElement, i: number, x: number, y: number, wPoint: number, hPoint: number): void {
        const p = view.point as WaterfallSeriesPoint;

        view.wPoint = wPoint;
        view.hPoint = hPoint;
        y += hPoint;
        view.layout(x, y);
        
        if (i > 0) {
            const line = this._lines.get(i - 1);
            const y2 = p._isSum ? y - hPoint : p.y >= 0 ? y : y - hPoint;

            line.setHLine(y2, this._xPrev + this._wPrev / 2, x - wPoint / 2);
        }

        this._xPrev = x;
        this._wPrev = wPoint;
    }

    protected _layoutPointViews(width: number, height: number): void {
        if (this._inverted) {
            this._lineContainer.dom.style.transform = `translate(0px, ${height}px) rotate(90deg) scale(-1, 1)`;
        } else {
            this._lineContainer.dom.style.transform = '';
        }

        super._layoutPointViews(width, height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareBars(doc: Document, points: WaterfallSeriesPoint[]): void {
        this._bars.prepare(points.length, (v, i) => {
            const p = points[i];

            v.point = p;
            v.setStyleOrClass(p._isSum ? 'rct-waterfall-point-sum' : p.y < 0 ? 'rct-waterfall-point-negative' : '');
        });

        this._lines.prepare(points.length - 1, (v, i) => {
            v.visible = !points[i].isNull && !points[i + 1].isNull;
        });
    }
}