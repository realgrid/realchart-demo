////////////////////////////////////////////////////////////////////////////////
// HistogramSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { HistogramSeries } from "../../model/series/HistogramSeries";
import { SeriesView } from "../SeriesView";

export class HistogramSeriesView extends SeriesView<HistogramSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-histogram-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: HistogramSeries): void {
    }

    protected _renderSeries(width: number, height: number): void {
    }
}