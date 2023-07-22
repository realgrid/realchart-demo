////////////////////////////////////////////////////////////////////////////////
// ScatterSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IChart } from "../Chart";
import { DataPoint } from "../DataPoint";
import { Series, SeriesMarker } from "../Series";

export class ScatterSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
}

export class ScatterSeriesMarker extends SeriesMarker {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    radius = 5;
}

export class ScatterSeries extends Series {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    marker: ScatterSeriesMarker;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart, name);

        this.marker = new ScatterSeriesMarker(this);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createPoint(source: any): DataPoint {
        return new ScatterSeriesPoint(source);
    }
}