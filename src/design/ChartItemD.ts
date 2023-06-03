////////////////////////////////////////////////////////////////////////////////
// ChartItemD.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcObject } from "../common/RcObject";
import { ChartItem } from "../model/ChartItem";

export class ChartItemD<T extends ChartItem>  extends RcObject {

    protected _source: T;

    constructor(source: T) {
        super();
        
        this._source = source;
    }
}