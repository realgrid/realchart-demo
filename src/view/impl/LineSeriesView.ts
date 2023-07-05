////////////////////////////////////////////////////////////////////////////////
// LineSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathElement } from "../../common/RcControl";
import { DataPoint } from "../../model/DataPoint";
import { LineSeries } from "../../model/series/LineSeries";
import { SeriesView } from "../SeriesView";

class MarkerView extends PathElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: DataPoint;
}

export class LineSeriesView extends SeriesView<LineSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-line-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: LineSeries): void {
    }

    protected _renderSeries(width: number, height: number): void {
    }
}