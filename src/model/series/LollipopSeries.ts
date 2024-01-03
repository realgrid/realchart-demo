////////////////////////////////////////////////////////////////////////////////
// LollipopSeries.ts
// 2023. 07. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Shape } from "../../common/impl/SvgShape";
import { DataPoint } from "../DataPoint";
import { BasedSeries, ClusterableSeries, SeriesMarker } from "../Series";

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
 * bar가 겹치더라도 데이터포인트들이 구분된다.
 * 
 * @config chart.series[type=lollipop]
 */
export class LollipopSeries extends BasedSeries {

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
    _type(): string {
        return 'lollipop';
    }

    canCategorized(): boolean {
        return true;
    }

    getLabelOff(off: number): number {
        return super.getLabelOff(off) + this.marker.radius;
    }

    protected _createPoint(source: any): DataPoint {
        return new LollipopSeriesPoint(source);
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        const radius = this.marker.radius;
        const shape = this.marker.shape;

        this._runPoints.forEach((p: LollipopSeriesPoint) => {
            p.radius = radius;
            p.shape = shape;
        })
    }
}