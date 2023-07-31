////////////////////////////////////////////////////////////////////////////////
// DumbbellSeries.ts
// 2023. 08. 01. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Shape } from "../../common/impl/SvgShape";
import { DataPoint } from "../DataPoint";
import { SeriesMarker } from "../Series";
import { BoxSeries } from "./BarSeries";

export class DumbbellSeriesMarker extends SeriesMarker {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    radius = 4;
    shape = Shape.CIRCLE;
}

export class DumbbellSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    radius: number;
    shape: Shape;
}

/**
 * BarRange 시리즈 변종.
 */
export class DumbbellSeries extends BoxSeries {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    marker = new DumbbellSeriesMarker(this);

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'Dumbbell';
    }

    protected _createPoint(source: any): DataPoint {
        return new DumbbellSeriesPoint(source);
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        const radius = this.marker.radius;
        const shape = this.marker.shape;

        this._visPoints.forEach((p: DumbbellSeriesPoint) => {
            p.radius = radius;
            p.shape = shape;
        })
    }
}