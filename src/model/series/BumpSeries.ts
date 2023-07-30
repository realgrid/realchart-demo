////////////////////////////////////////////////////////////////////////////////
// BumpSeries.ts
// 2023. 07. 30. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IChart } from "../Chart";
import { DataPoint } from "../DataPoint";
import { IPlottingItem } from "../Series";
import { LineSeriesBase, LineSeriesPoint, LineType } from "./LineSeries";

export class BumpSeriesPoint extends LineSeriesPoint {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
}

/**
 * 실제 값 대신 각 시리즈 간의 상대적 비교를 표현한다.
 * 차트의 모든 시리즈가 bump 여야 한다.
 */
export class BumpSeries extends LineSeriesBase {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    curved = false;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart, name);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'bump';
    }

    getLineType(): LineType {
        return this.curved ? LineType.SPLINE : LineType.DEFAULT;
    }

    canMixWith(other: IPlottingItem): boolean {
        return other instanceof BumpSeries;
    }

    protected _createPoint(source: any): DataPoint {
        return new BumpSeriesPoint(source);
    }
}