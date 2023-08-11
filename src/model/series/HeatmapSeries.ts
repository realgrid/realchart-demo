////////////////////////////////////////////////////////////////////////////////
// HeatmapSeries.ts
// 2023. 08. 01. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp, pickProp3 } from "../../common/Common";
import { DataPoint } from "../DataPoint";
import { Series } from "../Series";
import { BoxSeries } from "./BarSeries";

export class HeatmapSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    color: any;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    colorValue: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    parse(series: HeatmapSeries): void {
        super.parse(series);

        this.colorValue = +this.color;
    }

    protected _readArray(series: HeatmapSeries, v: any[]): void {
        const d = v.length > 2 ? 1 : 0;

        this.y = v[pickNum(series.yField, 0 + d)];
        this.color = v[pickNum(series.colorField, 1 + d)];

        if (d > 0) {
            this.x = v[pickNum(series.xField, 0)];
        } else {
            this.x = this.index;
        }
    }

    protected _readObject(series: HeatmapSeries, v: any): void {
        super._readObject(series, v);

        this.color = pickProp(v[series.colorField], v.color);
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);
    }

    getYLabel(index: number) {
        return this.color;
    }
}

/**
 * [셀 색상]
 * 1. color-axis가 연결되면 거기에서 색을 가져온다.
 * 2. series의 minColor, maxColor 사이의 색으로 가져온다.
 * 3. series의 기본 색상과 흰색 사이의 색으로 가져온다.
 */
export class HeatmapSeries extends Series {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    colorField: string;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _colorMin: number;
    _colorMax: number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getColor(value: number): string {
        return;
    }

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

        this._colorMin = Number.MAX_VALUE;
        this._colorMax = Number.MIN_VALUE;

        (this._visPoints as HeatmapSeriesPoint[]).forEach(p => {
            this._colorMin = Math.min(this._colorMin, p.colorValue);
            this._colorMax = Math.max(this._colorMax, p.colorValue);
        })
    }
}