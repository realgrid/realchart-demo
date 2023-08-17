////////////////////////////////////////////////////////////////////////////////
// BarRangeSeriesView.ts
// 2023. 07. 25. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { RcElement } from "../../common/RcControl";
import { IRect } from "../../common/Rectangle";
import { DataPoint } from "../../model/DataPoint";
import { CategoryAxis } from "../../model/axis/CategoryAxis";
import { BarRangeSeries, BarRangeSeriesPoint, ColumnRangeSeries } from "../../model/series/BarRangeSeries";
import { BarElement, PointLabelView, RangedSeriesView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

export class BarRangeSeriesView extends RangedSeriesView<BarRangeSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars = new ElementPool(this._pointContainer, BarElement);

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-barrange-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._bars;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _preparePointViews(points: DataPoint[]): void {
        this._bars.prepare(points.length, (v, i) => {
            v.point = points[i];
            v.setStyle('fill', points[i].color);
        });
    }

    protected _getLowValue(p: BarRangeSeriesPoint): number {
        return p.lowValue;
    }

    protected _layoutPointView(bar: BarElement, x: number, y: number, wPoint: number, hPoint: number): void {
        bar.wPoint = wPoint;
        bar.hPoint = hPoint;
        bar.layout(x, y + hPoint);
    }
}