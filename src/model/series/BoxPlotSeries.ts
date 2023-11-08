////////////////////////////////////////////////////////////////////////////////
// BoxPlotSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp, pickProp3 } from "../../common/Common";
import { DataPoint } from "../DataPoint";
import { RangedSeries } from "../Series";

/**
 * [min, rlow, mid, high, y]
 * [x, min, rlow, mid, high, y]
 */
export class BoxPlotSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    min: any;
    low: any;    // first quartile(q1, 25th percentile)
    mid: any;    // median (q2, 50th percentile)
    high: any;   // third quartile (q3 75th percentile)

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    minValue: number;
    lowValue: number;
    midValue: number;
    highValue: number;

    lowPos: number;
    midPos: number;
    highPos: number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    // getInside(): IRect {
    //     return { x: 0, y: 0, width: this.width, height: this.height };
    // }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    labelCount(): number {
        return 2;
    }

    getLabel(index: number) {
        return index === 0 ? this.yValue : this.minValue;
    }

    protected _assignTo(proxy: any): any {
        return Object.assign(super._assignTo(proxy), {
            min: this.min,
            low: this.low,
            mid: this.mid,
            high: this.high,
            minValue: this.minValue,
            lowValue: this.lowValue,
            midValue: this.midValue,
            highValue: this.highValue,
        });
    }

    protected _readArray(series: BoxPlotSeries, v: any[]): void {
        const d = v.length > 5 ? 1 : 0;

        this.min = v[pickNum(series.minField, 0 + d)];
        this.low = v[pickNum(series.lowField, 1 + d)];
        this.mid = v[pickNum(series.midField, 2 + d)];
        this.high = v[pickNum(series.highField, 3 + d)];
        this.y = v[pickNum(series.yField, 4 + d)];
        if (d > 0) {
            this.x = v[pickNum(series.xField, 0)];
        }
    }

    protected _readObject(series: BoxPlotSeries, v: any): void {
        super._readObject(series, v);

        this.min = pickProp(v[series.minField], v.min);
        this.low = pickProp(v[series.lowField], v.low);
        this.mid = pickProp(v[series.midField], v.mid);
        this.high = pickProp(v[series.highField], v.high);
        this.y = pickProp3(v[series.yField], v.y, v.value);
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);

        this.min = this.low = this.mid = this.high = this.y;
    }

    parse(series: BoxPlotSeries): void {
        super.parse(series);

        this.minValue = parseFloat(this.min);
        this.lowValue = parseFloat(this.low);
        this.midValue = parseFloat(this.mid);
        this.highValue = parseFloat(this.high);

        this.isNull ||= isNaN(this.minValue) || isNaN(this.lowValue) || isNaN(this.midValue) || isNaN(this.highValue);
    }
}

/**
 * https://en.wikipedia.org/wiki/Box_plot
 * https://danbi-ncsoft.github.io/study/2018/07/23/study_eda2.html
 * 
 * @config chart.series[type=boxplot]
 */
export class BoxPlotSeries extends RangedSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * @config
     */
    minField: string;
    /**
     * @config
     */
    lowField: string;
    /**
     * @config
     */
    midField: string;
    /**
     * @config
     */
    highField: string;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'boxplot';
    }

    getPointTooltip(point: BoxPlotSeriesPoint, param: string): any {
        switch (param) {
            case 'min':
                return point.min;
            case 'minValue':
                return point.minValue;
            case 'low':
                return point.low;
            case 'lowValue':
                return point.lowValue;
            case 'mid':
                return point.mid;
            case 'midValue':
                return point.midValue;
            case 'high':
                return point.high;
            case 'highValue':
                return point.highValue;
            default:
                return super.getPointTooltip(point, param);
        }
    }

    pointLabelCount(): number {
        return 2;
    }

    protected _createPoint(source: any): DataPoint {
        return new BoxPlotSeriesPoint(source);
    }

    protected _getBottomValue(p: BoxPlotSeriesPoint): number {
        return p.minValue;
    }
}