////////////////////////////////////////////////////////////////////////////////
// HitstogramSeries.ts
// 2023. 07. 22. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray } from "../../common/Common";
import { Axis, IAxis } from "../Axis";
import { LineType } from "../ChartTypes";
import { DataPoint } from "../DataPoint";
import { Series } from "../Series";
import { AreaSeries, AreaSeriesPoint } from "./LineSeries";

export class BellCurveSeriesPoint extends AreaSeriesPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

/**
 * @config chart.series[type=bellcurve]
 */
export class BellCurveSeries extends AreaSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 이 시리즈 data point들을 구성할 수 있는 데이터를 포함한 원본 시리즈.
     * 시리즈 이름이나 index로 지정한다.
     * 
     * @config
     */
    source: string | number;
    /**
     * @default 3
     * @config
     */
    sigmas = 3;
    /**
     * @default 3
     * @config
     */
    pointsInSigma = 5;
    /**
     * true면 spline 곡선으로 표시한다.
     * 
     * @default false
     * @config
     */
    curved = false;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'bellcurve';
    }

    getLineType(): LineType {
        return this.curved ? LineType.SPLINE : LineType.DEFAULT;
    }

    protected _createPoint(source: any): DataPoint {
        return new BellCurveSeriesPoint(source);
    }

    // createPoints(source: any[]): DataPoint[] {
    //     const pts = super.createPoints(source);

    //     if (pts && pts.length > 0) {
    //         pts.forEach(p => p.yValue = parseFloat(p.y));
    //         return this.$_loadTable(pts);
    //     }      
    //     return []; 
    // }

    protected _loadData(src: any) {
        const data = super._loadData(src);

        if (isArray(data)) {
            return this.$_loadTable(data);
        }
    }

    _referOtherSeries(series: Series): boolean {
        if (this._points.isEmpty() && (series.name === this.source || series.index === this.source)) {
            series.referBy(this);
            return true;
        }
    }

    reference(other: Series, axis: IAxis): void {
        if (!axis._isX) {
            const vals = other._runPoints.map(p => p.yValue).filter(v => !isNaN(v));
            const pts = this.$_loadTable(vals);

            this._doLoadPoints(pts);
            this._runPoints = this._points.getPoints();

            this.collectValues(this._xAxisObj, (this._xAxisObj as Axis)._values);
            this.collectValues(this._yAxisObj, (this._yAxisObj as Axis)._values);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadTable(vals: number[]): any[] {
        const len = vals.length;

        if (len < 1) {
            return;
        }

        const sum = vals.reduce((a, c) => a + c, 0);
        const mean = sum / len;
        const stdv = Math.sqrt(vals.reduce((a, c) => a + Math.pow(c - mean, 2)) / (len - 1));
        const step = stdv / this.pointsInSigma;
        const min = mean - this.sigmas * stdv;
        const max = mean + this.sigmas * stdv;
        let sigma = mean;

        const pts2 = [];

        pts2.push(this.$_getDenstiy(mean, stdv, sigma));
        while (sigma > min) {
            sigma -= step;
            pts2.unshift(this.$_getDenstiy(mean, stdv, sigma));
        }
        sigma = mean;
        while (sigma < max) {
            sigma += step;
            pts2.push(this.$_getDenstiy(mean, stdv, sigma));
        }

        return pts2;

        // pts2.forEach(p => {
        //     p.xValue = p.x;
        //     p.yGroup = p.yValue = p.y;
        // })

        // pts.forEach((p, i) => {
        //     // p.index = i;
        //     p.x = p.source.x;
        //     p.y = p.source.y;
        //     p.yGroup = p.y;
        // })
        // return pts2;
    }

    private $_getDenstiy(mean: number, stdv: number, sigma: number): any {
        const dist = sigma - mean;
        const y = Math.exp(-(dist * dist) / (2 * stdv * stdv)) / (stdv * Math.sqrt(2 * Math.PI));

        return {
            x: sigma, 
            y: y
        };
    }
}