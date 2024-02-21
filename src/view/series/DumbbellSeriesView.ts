////////////////////////////////////////////////////////////////////////////////
// DumbbellSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathElement, RcElement } from "../../common/RcControl";
import { LineElement } from "../../common/impl/PathElement";
import { SvgShapes } from "../../common/impl/SvgShape";
import { DumbbellSeries, DumbbellSeriesPoint } from "../../model/series/DumbbellSeries";
import { IPointView, RangeElement, RangedSeriesView, SeriesView } from "../SeriesView";

class BarElement extends RangeElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    override point: DumbbellSeriesPoint;

    private _line: LineElement;
    private _hmarker: PathElement;
    private _lmarker: PathElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS);

        this.add(this._line = new LineElement(doc));
        this.add(this._hmarker = new PathElement(doc, 'rct-dumbbell-point-marker'));
        this.add(this._lmarker = new PathElement(doc, 'rct-dumbbell-point-marker'));
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    layout(w: number, h: number): void {
        const p = this.point;
        const rd = p.radius;
        const x = w / 2;
        let y = 0;

        if (p.color) {
            this._line.setStyle('stroke', p.color);
            this._hmarker.setFill(p.color);
            this._lmarker.setFill(p.color);
        }
        this.x = this.tx + x; // savePrevs()에서 사용한다.

        this._line.setVLineC(x, y, h);
        SvgShapes.setShape(this._hmarker, p.shape, rd, rd);
        SvgShapes.setShape(this._lmarker, p.shape, rd, rd);
        this._hmarker.trans(x - rd, y - rd);
        this._lmarker.trans(x - rd, h - rd);
    }
}

export class DumbbellSeriesView extends RangedSeriesView<DumbbellSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars = new ElementPool(this._pointContainer, BarElement);

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-dumbbell-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._bars;
    }

    protected _getLowValue(p: DumbbellSeriesPoint): number {
        return p.lowValue;
    }

    protected _preparePoints(doc: Document, model: DumbbellSeries, points: DumbbellSeriesPoint[]): void {
        this._bars.prepare(points.length, (bar, i) => {
            const p = bar.point = points[i];

            this._setPointStyle(bar, model, p);
        })
    }

    protected _layoutPoint(bar: BarElement, index: number, x: number, y: number, wPoint: number, hPoint: number): void {
        bar.trans(x - wPoint / 2, y);
        bar.layout(wPoint, hPoint);
    }
}
