////////////////////////////////////////////////////////////////////////////////
// LollipopSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathElement, RcElement } from "../../common/RcControl";
import { GroupElement } from "../../common/impl/GroupElement";
import { LineElement } from "../../common/impl/PathElement";
import { SvgShapes } from "../../common/impl/SvgShape";
import { LollipopSeries, LollipopSeriesPoint } from "../../model/series/LollipopSeries";
import { BoxedSeriesView, IPointView, SeriesView } from "../SeriesView";

class BarElement extends GroupElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: LollipopSeriesPoint;
    // saveVal: number;

    private _line: LineElement;
    _marker: PathElement;
    xSave: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS);

        this.add(this._line = new LineElement(doc));
        this.add(this._marker = new PathElement(doc, 'rct-lollipop-point-marker'));
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    layout(h: number): void {
        const rd = this.point.radius;

        this._line.setVLineC(0, 0, h);
        SvgShapes.setShape(this._marker, this.point.shape, rd, rd);
        this._marker.trans(-rd, -rd);
    }
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    savePrevs(): void {
        this.xSave = this.tx;
    }
}

export class LollipopSeriesView extends BoxedSeriesView<LollipopSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars: ElementPool<BarElement>;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-lollipop-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._bars;
    }

    protected _preparePoints(doc: Document, model: LollipopSeries, points: LollipopSeriesPoint[]): void {
        this.$_parepareBars(doc, model, points);
    }

    protected _layoutPoint(view: BarElement, i: number, x: number, y: number, wPoint: number, hPoint: number): void {
        view.trans(x, y - hPoint);
        view.layout(hPoint);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareBars(doc: Document, model: LollipopSeries, points: LollipopSeriesPoint[]): void {
        const sts = model.marker.style;

        if (!this._bars) {
            this._bars = new ElementPool(this._pointContainer, BarElement);
        }
        this._bars.prepare(points.length, (v, i) => {
            const p = v.point = points[i];

            this._setPointStyle(v, model, p);
            sts && v._marker.setStyleOrClass(sts);
        });
    }
}