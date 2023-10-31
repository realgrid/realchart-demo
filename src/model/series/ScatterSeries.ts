////////////////////////////////////////////////////////////////////////////////
// ScatterSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from "../../common/RcControl";
import { Shape } from "../../common/impl/SvgShape";
import { IAxis } from "../Axis";
import { IChart } from "../Chart";
import { DataPoint } from "../DataPoint";
import { LegendItem } from "../Legend";
import { Series } from "../Series";
import { ShapeLegendMarkerView } from "./legend/ShapeLegendMarkerView";

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

    protected _createLegendMarker(doc: Document, size: number): RcElement {
        return new ShapeLegendMarkerView(doc, size);
    }

    legendMarker(doc: Document): RcElement {
        const m = super.legendMarker(doc);

        (m as ShapeLegendMarkerView).setShape(this.shape, Math.min(LegendItem.MARKER_SIZE, this.radius * 2));
        return m;
    }
}