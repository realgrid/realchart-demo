////////////////////////////////////////////////////////////////////////////////
// LineSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { StyleProps } from "../../common/Types";
import { Series } from "../Series";

export class LineSeries extends Series {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    curved = false;
    baseValue = 0;
    negativeStyle: StyleProps;
    connectNulls = false;
}

export class AreaSeries extends LineSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    areaStyle: StyleProps;
}

export class AreaRangeSeries extends AreaSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
}