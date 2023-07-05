////////////////////////////////////////////////////////////////////////////////
// BubbleSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { DataPoint } from "../DataPoint";
import { Series } from "../Series";

class BubbleSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    z: any;
    zValue: number;
}

export class BubbleSeries extends Series {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    createPoint(source: any): DataPoint {
        return new BubbleSeriesPoint(source);
    }
}