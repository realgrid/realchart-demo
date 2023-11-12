////////////////////////////////////////////////////////////////////////////////
// DumbbellSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathElement, RcElement } from "../../common/RcControl";
import { GroupElement } from "../../common/impl/GroupElement";
import { LineElement } from "../../common/impl/PathElement";
import { DumbbellSeries, DumbbellSeriesPoint } from "../../model/series/DumbbellSeries";
import { IPointView, RangedSeriesView, SeriesView } from "../SeriesView";

class BarView extends GroupElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: DumbbellSeriesPoint;

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
    layout(): void {
        const p = this.point;
        const w = this.width;
        const h = this.height;
        const x = w / 2;
        let y = 0;

        if (p.color) {
            this._line.setStyle('stroke', p.color);
            this._hmarker.setStyle('fill', p.color);
            this._lmarker.setStyle('fill', p.color);
        }

        this._line.setVLineC(x, y, h);
        this._hmarker.renderShape(p.shape, x, y, p.radius);
        this._lmarker.renderShape(p.shape, x, h, p.radius);
    }
}

export class DumbbellSeriesView extends RangedSeriesView<DumbbellSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars = new ElementPool(this._pointContainer, BarView);

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

    protected _preparePointViews(doc: Document, model: DumbbellSeries, points: DumbbellSeriesPoint[]): void {
        this._bars.prepare(points.length, (bar, i) => {
            const p = bar.point = points[i];

            this._setPointStyle(bar, model, p);
        })
    }

    protected _layoutPointView(bar: BarView, index: number, x: number, y: number, wPoint: number, hPoint: number): void {
        bar.setBounds(x - wPoint / 2, y, wPoint, hPoint);
        bar.layout();
    }
}
