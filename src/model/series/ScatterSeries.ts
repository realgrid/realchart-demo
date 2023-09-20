////////////////////////////////////////////////////////////////////////////////
// ScatterSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Shape } from "../../common/impl/SvgShape";
import { IAxis } from "../Axis";
import { IChart } from "../Chart";
import { DataPoint } from "../DataPoint";
import { Series } from "../Series";

export class ScatterSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
}

/**
 * 
 * @config chart.series[type=scatter]
 */
export class ScatterSeries extends Series {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
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
    // properties
    //-------------------------------------------------------------------------
    /**
     * 명시적으로 지정하지 않으면 typeIndex에 따라 Shapes 중 하나로 돌아가면서 설정된다.
     * 
     * @config
     */
    shape: Shape;
    /**
     * {@link shape}의 반지름.
     * 
     * @config
     */
    radius = 5;
    /**
     * https://thomasleeper.com/Rcourse/Tutorials/jitter.html
     */
    jitterX = 0;
    jitterY = 0;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'scatter';
    }

    ignoreAxisBase(axis: IAxis): boolean {
        return true;
    }

    protected _createPoint(source: any): DataPoint {
        return new ScatterSeriesPoint(source);
    }
}