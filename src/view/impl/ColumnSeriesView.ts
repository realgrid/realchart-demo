////////////////////////////////////////////////////////////////////////////////
// ColumnSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ColumnSeries } from "../../model/series/BarSeries";
import { SeriesView } from "../SeriesView";

export class ColumnSeriesView extends SeriesView<ColumnSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _renderSeries(width: number, height: number): void {
    }
}