////////////////////////////////////////////////////////////////////////////////
// HeatmapSeries.ts
// 2023. 08. 01. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp } from "../../common/Common";
import { DataPoint } from "../DataPoint";
import { IPlottingItem, Series } from "../Series";

/**
 * [y, heat],
 * [x, y, heat]
 */
export class HeatmapSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    heat: any;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    heatValue: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    parse(series: HeatmapSeries): void {
        super.parse(series);

        this.heatValue = parseFloat(this.heat);

        this.isNull ||= isNaN(this.heatValue);
    }

    protected _readArray(series: HeatmapSeries, v: any[]): void {
        const d = v.length > 2 ? 1 : 0;

        this.y = v[pickNum(series.yField, 0 + d)];
        this.heat = v[pickNum(series.heatField, 1 + d)];
        if (d > 0) {
            this.x = v[pickNum(series.xField, 0)];
        }
    }

    protected _readObject(series: HeatmapSeries, v: any): void {
        super._readObject(series, v);

        this.heat = pickProp(v[series.heatField], v.color);
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);
    }

    getLabel(index: number) {
        return this.heat;
    }
}

/**
 * [셀 색상]
 * 1. color-axis가 연결되면 거기에서 색을 가져온다.
 * 2. series의 minColor, maxColor 사이의 색으로 가져온다.
 * 3. series의 기본 색상과 흰색 사이의 색으로 가져온다.
 * 
 * @config chart.series[type=heatmap]
 */
export class HeatmapSeries extends Series {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    heatField: string;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _heatMin: number;
    _heatMax: number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getColor(value: number): string {
        return;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'heatmap';
    }

    canMixWith(other: IPlottingItem): boolean {
        return false;
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

        this._heatMin = Number.MAX_VALUE;
        this._heatMax = Number.MIN_VALUE;

        (this._runPoints as HeatmapSeriesPoint[]).forEach(p => {
            if (!isNaN(p.heatValue)) {
                this._heatMin = Math.min(this._heatMin, p.heatValue);
                this._heatMax = Math.max(this._heatMax, p.heatValue);
            }
        })
    }
}