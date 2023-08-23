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
import { LollipopSeries, LollipopSeriesPoint } from "../../model/series/LollipopSeries";
import { BoxedSeriesView, IPointView, SeriesView } from "../SeriesView";

class BarElement extends GroupElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: LollipopSeriesPoint;

    private _line: LineElement;
    private _marker: PathElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS + ' rct-lollipop-point');

        this.add(this._line = new LineElement(doc));
        this.add(this._marker = new PathElement(doc, 'rct-lollipop-point-marker'));
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    layout(): void {
        this._line.setVLineC(0, 0, this.height);
        this._marker.renderShape(this.point.shape, 0, 0, this.point.radius);
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

    protected _preparePointViews(doc: Document, model: LollipopSeries, points: LollipopSeriesPoint[]): void {
        this.$_parepareBars(doc, model, points);
    }

    protected _layoutPointView(view: BarElement, i: number, x: number, y: number, wPoint: number, hPoint: number): void {
        view.setBounds(x, y - hPoint, 0, hPoint);
        view.layout();
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareBars(doc: Document, model: LollipopSeries, points: LollipopSeriesPoint[]): void {
        const style = model.style;

        if (!this._bars) {
            this._bars = new ElementPool(this._pointContainer, BarElement);
        }
        this._bars.prepare(points.length, (v, i) => {
            v.point = points[i];
            v.setStyle('fill', points[i].color);
            v.setStyleOrClass(style);
        });
    }
}