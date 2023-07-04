////////////////////////////////////////////////////////////////////////////////
// BoxPlotSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { BoxPlotSeries } from "../../model/series/BoxPlotSeries";
import { SeriesView } from "../SeriesView";

export class BoxPlotSeriesView extends SeriesView<BoxPlotSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-boxplot-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: BoxPlotSeries): void {
    }

    protected _renderSeries(width: number, height: number): void {
    }
}