////////////////////////////////////////////////////////////////////////////////
// TreemapSeries.ts
// 2023. 08. 01. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp, pickProp3 } from "../../common/Common";
import { Shape } from "../../common/impl/SvgShape";
import { IAxis } from "../Axis";
import { DataPoint } from "../DataPoint";
import { SeriesMarker } from "../Series";
import { BoxSeries } from "./BarSeries";

export class TreemapSeriesMarker extends SeriesMarker {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

export class TreemapSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    low: any;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    lowValue: number;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    radius: number;
    shape: Shape;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _readArray(series: TreemapSeries, v: any[]): void {
        const d = v.length > 2 ? 1 : 0;

        this.low = v[pickNum(series.lowField, 0 + d)];
        this.y = v[pickNum(series.yProp, 1 + d)];

        if (d > 0) {
            this.x = v[pickNum(series.xProp, 0)];
        } else {
            this.x = this.index;
        }
    }

    protected _readObject(series: TreemapSeries, v: any): void {
        super._readObject(series, v);

        this.low = pickProp(v[series.lowField], v.low);
        this.y = pickProp3(v[series.yProp], v.y, v.value);
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);

        this.low = this.y;
    }

    parse(series: TreemapSeries): void {
        super.parse(series);

        this.lowValue = +this.low;
    }
}

/**
 * BarRange 시리즈 변종.
 */
export class TreemapSeries extends BoxSeries {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    marker = new TreemapSeriesMarker(this);

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    lowField: string;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'treemap';
    }

    canCategorized(): boolean {
        return true;
    }

    protected _createPoint(source: any): DataPoint {
        return new TreemapSeriesPoint(source);
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        const radius = this.marker.radius;
        const shape = this.marker.shape;

        this._visPoints.forEach((p: TreemapSeriesPoint) => {
            p.radius = radius;
            p.shape = shape;
        })
    }

    collectValues(axis: IAxis): number[] {
        const vals = super.collectValues(axis);

        if (axis === this._yAxisObj) {
            this._visPoints.forEach(p => vals.push((p as TreemapSeriesPoint).lowValue))
        }
        return vals;
    }
}