////////////////////////////////////////////////////////////////////////////////
// LollipopSeries.ts
// 2023. 07. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Shape } from "../../common/impl/SvgShape";
import { DataPoint } from "../DataPoint";
import { ClusterableSeries, SeriesMarker } from "../Series";

export class LollipopSeriesMarker extends SeriesMarker {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    radius = 4;
    shape = Shape.CIRCLE;
}

export class LollipopSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    radius: number;
    shape: Shape;
}

/**
 * Bar 시리즈 변종.
 */
export class LollipopSeries extends ClusterableSeries {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    marker = new LollipopSeriesMarker(this);

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'lollipop';
    }

    canCategorized(): boolean {
        return true;
    }

    protected _createPoint(source: any): DataPoint {
        return new LollipopSeriesPoint(source);
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        const radius = this.marker.radius;
        const shape = this.marker.shape;

        this._visPoints.forEach((p: LollipopSeriesPoint) => {
            p.radius = radius;
            p.shape = shape;
        })
    }
}