////////////////////////////////////////////////////////////////////////////////
// HeatmapSeries.ts
// 2023. 08. 01. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp, pickProp3 } from "../../common/Common";
import { DataPoint } from "../DataPoint";
import { BoxSeries } from "./BarSeries";

export class HeatmapSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    z: any;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    zValue: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    parse(series: HeatmapSeries): void {
        super.parse(series);

        this.zValue = +this.z;
    }

    protected _readArray(series: HeatmapSeries, v: any[]): void {
        const d = v.length > 2 ? 1 : 0;

        this.y = v[pickNum(series.yProp, 0 + d)];
        this.z = v[pickNum(series.zProp, 1 + d)];

        if (d > 0) {
            this.x = v[pickNum(series.xProp, 0)];
        } else {
            this.x = this.index;
        }
    }

    protected _readObject(series: HeatmapSeries, v: any): void {
        super._readObject(series, v);

        this.z = pickProp(v[series.zProp], v.z);
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);

        this.z = this.y;
    }
}

/**
 * BarRange 시리즈 변종.
 */
export class HeatmapSeries extends BoxSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    zProp: string;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _zMin: number;
    _zMax: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'heatmap';
    }

    canCategorized(): boolean {
        return true;
    }

    defaultYAxisType(): string {
        return 'category';
    }

    protected _createPoint(source: any): DataPoint {
        return new HeatmapSeriesPoint(source);
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        this._zMin = Number.MAX_VALUE;
        this._zMax = Number.MIN_VALUE;

        (this._visPoints as HeatmapSeriesPoint[]).forEach(p => {
            this._zMin = Math.min(this._zMin, p.zValue);
            this._zMax = Math.max(this._zMax, p.zValue);
        })
    }
}