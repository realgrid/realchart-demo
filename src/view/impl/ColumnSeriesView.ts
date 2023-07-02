////////////////////////////////////////////////////////////////////////////////
// ColumnSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathElement } from "../../common/RcControl";
import { DataPoint, DataPointCollection } from "../../model/DataPoint";
import { ColumnSeries } from "../../model/series/BarSeries";
import { PointLabelView, SeriesView } from "../SeriesView";

class BarElement extends PathElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: DataPoint;
    labelViews: PointLabelView[] = [];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
}

export class ColumnSeriesView extends SeriesView<ColumnSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars: ElementPool<BarElement>;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: ColumnSeries): void {
        const pts = model.getPoints().getVisibles();

        this.$_parepareBars(doc, pts);
    }

    protected _renderSeries(width: number, height: number): void {
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareBars(doc: Document, points: DataPoint[]): void {
        if (!this._bars) {
            this._bars = new ElementPool(this, BarElement);
        }
        this._bars.prepare(points.length, (v: BarElement) => {
        }, (v: BarElement) => {
        });
    }
}