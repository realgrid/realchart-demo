////////////////////////////////////////////////////////////////////////////////
// ColumnSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathElement } from "../../common/RcControl";
import { ColumnSeries } from "../../model/series/BarSeries";
import { SeriesView } from "../SeriesView";

class BarElement extends PathElement {
}

export class ColumnSeriesView extends SeriesView<ColumnSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars: ElementPool<BarElement>;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _renderSeries(width: number, height: number): void {
    }
}