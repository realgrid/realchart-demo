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
import { DataPoint } from "../DataPoint";
import { LegendItem } from "../Legend";
import { MarkerSeries } from "../Series";
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
export class ScatterSeries extends MarkerSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _defShape: Shape;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * https://thomasleeper.com/Rcourse/Tutorials/jitter.html
     */
    jitterX = 0;
    jitterY = 0;
    /**
     * {@link shape}의 반지름.
     * 
     * @config
     */
    radius = 5;

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

    /**
     * rendering 시점에 chart가 series별로 기본 shape를 지정한다.
     */
    setShape(shape: Shape): void {
        this._defShape = shape;
    }

    getShape(p: ScatterSeriesPoint): Shape {
        return this.shape || this._defShape;
    }

    hasMarker(): boolean {
        return true;
    }

    legendMarker(doc: Document, size: number): RcElement {
        const m = super.legendMarker(doc, size);

        (m as ShapeLegendMarkerView).setShape(this.getShape(null), Math.min(+size || LegendItem.MARKER_SIZE, this.radius * 2));
        return m;
    }
}