////////////////////////////////////////////////////////////////////////////////
// LineSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { StyleProps } from "../../common/Types";
import { Shape } from "../../common/impl/SvgShape";
import { IChart } from "../Chart";
import { DataPoint } from "../DataPoint";
import { MarerVisibility, Series, SeriesMarker } from "../Series";

export class LineSeriesPoint extends DataPoint {

    radius: number;
    shape: Shape;
    xPos: number;
    yPos: number;
}

export class LineSeriesMarker extends SeriesMarker {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    radius = 4;
    /**
     * baseValue 보다 작은 값을 가진 point를 그릴 때 추가로 적용되는 style.
     */
    // private _negativeStyles: StyleProps;
    /**
     * 첫번째 point의 marker 표시 여부.
     */
    firstVisible = MarerVisibility.DEFAULT;
    /**
     * 첫번째 point의 marker 표시 여부.
     */
    lastVisible = MarerVisibility.DEFAULT;
    /**
     * 최소값 point들의 marker 표시 여부.
     */
    minVisible = MarerVisibility.DEFAULT;
    /**
     * 최대값 point들의 marker 표시 여부.
     */
    maxVisible = MarerVisibility.DEFAULT;
}

export class LineSeries extends Series {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    curved = false;
    baseValue = 0;
    negativeStyle: StyleProps;
    connectNulls = false;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    marker: LineSeriesMarker;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart, name);

        this.marker = new LineSeriesMarker(this);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    createPoint(source: any): DataPoint {
        return new LineSeriesPoint(source);
    }
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