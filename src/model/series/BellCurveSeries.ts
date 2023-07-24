////////////////////////////////////////////////////////////////////////////////
// HitstogramSeries.ts
// 2023. 07. 22. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { DataPoint } from "../DataPoint";
import { ISeries, Series } from "../Series";
import { LineSeriesBase, LineSeriesPoint } from "./LineSeries";

export class BellCurveSeriesPoint extends LineSeriesPoint {

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
 */
export class BellCurveSeries extends LineSeriesBase {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    refSeries: string;
    sigmas = 3;
    pointsInSigma = 5;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    // ignoreAxisBase(axis: IAxis): boolean {
    //     return axis === this._xAxisObj;
    // }

    createPoints(source: any[]): DataPoint[] {
        const pts = super.createPoints(source);

        if (pts && pts.length > 0) {
            return this.$_loadTable(pts);
        }      
        return []; 
    }

    _referOtherSeries(series: Series): boolean {
        if (!this._points.isEmpty()) return true;
        if (series.name === this.refSeries) {
            this.$_loadTable(series.getPoints().getVisibles());
            return true;
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadTable(pts: DataPoint[]): BellCurveSeriesPoint[] {
        const vals = pts.map(p => p.yValue).filter(v => !isNaN(v));
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

        pts = [];

        pts.push(this.$_getDenstiy(mean, stdv, sigma));
        while (sigma > min) {
            sigma -= step;
            pts.unshift(this.$_getDenstiy(mean, stdv, sigma));
        }
        sigma = mean;
        while (sigma < max) {
            sigma += step;
            pts.push(this.$_getDenstiy(mean, stdv, sigma));
        }

        pts.forEach((p, i) => {
            p.index = i;
            p.x = p.source.x;
            p.y = p.source.y;
            p.yGroup = p.y;
        })
        return pts as BellCurveSeriesPoint[];
    }

    private $_getDenstiy(mean: number, stdv: number, sigma: number): BellCurveSeriesPoint {
        const dist = sigma - mean;
        const y = Math.exp(-(dist * dist) / (2 * stdv * stdv)) / (stdv * Math.sqrt(2 * Math.PI));

        return new BellCurveSeriesPoint({
            x: sigma, 
            y: y
        });
    }
}