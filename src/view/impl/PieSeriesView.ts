////////////////////////////////////////////////////////////////////////////////
// PieSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PieSeries } from "../../model/series/PieSeries";
import { SeriesView } from "../SeriesView";

export class PieSeriesView extends SeriesView<PieSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-pie-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: PieSeries): void {
    }

    protected _renderSeries(width: number, height: number): void {
    }
}