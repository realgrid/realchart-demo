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
import { ClusterableSeries, SeriesMarker } from "../Series";

export class DumbbellSeriesMarker extends SeriesMarker {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    radius = 4;
    shape = Shape.CIRCLE;
}

/**
 * [low, y]
 * [x, low, y]
 */
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
    hPoint: number;
    radius: number;
    shape: Shape;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    labelCount(): number {
        return 2;
    }

    getLabel(index: number) {
        return index === 0 ? this.lowValue : this.yValue;
    }

    protected _assignTo(proxy: any): any {
        return Object.assign(super._assignTo(proxy), {
            low: this.low,
            lowValue: this.lowValue
        });
    }

    protected _readArray(series: DumbbellSeries, v: any[]): void {
        const d = v.length > 2 ? 1 : 0;

        this.low = v[pickNum(series.lowField, 0 + d)];
        this.y = v[pickNum(series.yField, 1 + d)];
        if (d > 0) {
            this.x = v[pickNum(series.xField, 0)];
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

        this.lowValue = parseFloat(this.low);
    }
}

/**
 * BarRange 시리즈 변종.
 * 
 * @config chart.series[type=dumbbell]
 */
export class DumbbellSeries extends ClusterableSeries {

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
    _type(): string {
        return 'dumbbell';
    }

    canCategorized(): boolean {
        return true;
    }

    pointLabelCount(): number {
        return 2;
    }

    protected _createPoint(source: any): DataPoint {
        return new DumbbellSeriesPoint(source);
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        const radius = this.marker.radius;
        const shape = this.marker.shape;

        this._runPoints.forEach((p: DumbbellSeriesPoint) => {
            p.radius = radius;
            p.shape = shape;
        })
    }

    collectValues(axis: IAxis, vals: number[]): void {
        super.collectValues(axis, vals);

        if (vals && axis === this._yAxisObj) {
            this._runPoints.forEach(p => {
                const v = (p as DumbbellSeriesPoint).lowValue
                !isNaN(v) && vals.push(v);
            });
        }
    }
}