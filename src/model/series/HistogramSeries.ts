////////////////////////////////////////////////////////////////////////////////
// HitstogramSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, pickNum, pickProp3 } from "../../common/Common";
import { IAxis } from "../Axis";
import { DataPoint } from "../DataPoint";
import { ISeries, Series } from "../Series";

export class HistogramSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    min: number;
    max: number;
    width: number;
    height: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    prepare(series: ISeries): void {
        super.prepare(series);

        const v = this.source;

        this.min = v.min;
        this.max = v.max;
    }
}

export enum BinsNumber {
    SQURE_ROOT = 'squreRoot',   // Squre-root choice
    STURGES = 'struges',        // Sturges' formula
    RICE = 'rice'               // Rice Rule
}

// https://en.wikipedia.org/wiki/Histogram
const binsNumberFunc = {
    'squreRoot': function (length: number): number { 
        return Math.ceil(Math.sqrt(length)); 
    },
    'struges': function (length: number): number { 
        return Math.ceil(Math.log(length) * Math.LOG2E);
    },
    'rice': function (length: number): number { 
        return Math.ceil(2 * Math.pow(length, 1 / 3));
    },
}

/**
 * 각 bin은 하한값을 포함하고 상한값은 포함하지 않는다. 마지막 bin은 상한값을 포함한다.
 * https://en.wikipedia.org/wiki/Histogram
 */
export class HistogramSeries extends Series {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    minValue: number;
    maxValue: number;
    binsNumber: number | BinsNumber = BinsNumber.SQURE_ROOT;
    binWidth: number;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _binInterval: number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getBinCount(length: number): number {
        const w = pickNum(this.binWidth, 0);
        if (w > 0) {
            return length / w;
        }

        const cnt = pickNum(this.binsNumber, 0);
        if (cnt < 1) {
            return binsNumberFunc[this.binsNumber || BinsNumber.SQURE_ROOT](length);
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    ignoreAxisBase(axis: IAxis): boolean {
        return axis === this._xAxisObj;
    }

    createPoint(source: any): DataPoint {
        return new HistogramSeriesPoint(source);
    }

    protected _doLoadPoints(src: any[]): void {

        function getValue(v: any): number {
            let y: number;

            if (isArray(v)) {
                y = v[pickNum(this.yField, 0)];
            } else if (isObject(v)) {
                y = pickProp3(v[this.yField], v.y, v.value);
            } else {
                y = v;
            }
            return +y;
        }

        let sample: number[ ] = [];

        for (let i = 0; i < src.length; i++) {
            const v = getValue(src[i]);

            if (!isNaN(v)) {
                sample.push(v);
            }
        }

        if (sample.length > 0) {
            sample = sample.sort((v1, v2) => v1 - v2);
            if (this.minValue < sample[0]) {
                sample.unshift(this.minValue);
            }
            if (this.maxValue > sample[sample.length - 1]) {
                sample.push(this.maxValue);
            }

            const len = sample.length;
            const min = sample[0];
            const max = sample[len - 1];
            const count = this.getBinCount(len);//max - min);
            const interval = this._binInterval = (max - min) / count;
            let n = 0;
            let x = min;
            let x2 = x + interval;
            const pts = [];

            for (let i = 0; i < count; i++) {
                let f = 0;

                if (i == count - 1) {
                    f = len - n;
                } else {
                    while (n < len && (sample[n] < x2)) {
                        f++;
                        n++;
                    }
                }

                pts.push({
                    x: x,
                    y: f,
                    min: x,
                    max: (i === count - 1) ? max : x2 
                })

                x = x2;
                x2 = x + interval;
            }

            this._points.load(pts);
        }
    }

    collectValues(axis: IAxis): number[] {
        const vals = super.collectValues(axis);

        // point.x가 point.min과 같은 값이므로 축 범위에 마지막 bin의 max가 포함되어야 한다.
        if (axis === this._xAxisObj) {
            vals.push((this._visPoints[this._visPoints.length - 1] as HistogramSeriesPoint).max);
        }
        return vals;
    }
}