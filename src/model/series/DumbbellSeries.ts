////////////////////////////////////////////////////////////////////////////////
// DumbbellSeries.ts
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

export class DumbbellSeriesMarker extends SeriesMarker {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    radius = 4;
    shape = Shape.CIRCLE;
}

export class DumbbellSeriesPoint extends DataPoint {

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
    labelCount(): number {
        return 2;
    }

    getYLabel(index: number) {
        return index === 0 ? this.lowValue : this.yValue;
    }

    protected _readArray(series: DumbbellSeries, v: any[]): void {
        const d = v.length > 2 ? 1 : 0;

        this.low = v[pickNum(series.lowField, 0 + d)];
        this.y = v[pickNum(series.yField, 1 + d)];

        if (d > 0) {
            this.x = v[pickNum(series.xField, 0)];
        } else {
            this.x = this.index;
        }
    }

    protected _readObject(series: DumbbellSeries, v: any): void {
        super._readObject(series, v);

        this.low = pickProp(v[series.lowField], v.low);
        this.y = pickProp3(v[series.yField], v.y, v.value);
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);

        this.low = this.y;
    }

    parse(series: DumbbellSeries): void {
        super.parse(series);

        this.lowValue = +this.low;
    }
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
    lowField: string;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'Dumbbell';
    }

    canCategorized(): boolean {
        return true;
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

    collectValues(axis: IAxis): number[] {
        const vals = super.collectValues(axis);

        if (axis === this._yAxisObj) {
            this._visPoints.forEach(p => vals.push((p as DumbbellSeriesPoint).lowValue))
        }
        return vals;
    }
}