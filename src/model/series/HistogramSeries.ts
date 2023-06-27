////////////////////////////////////////////////////////////////////////////////
// HitstogramSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../../common/Common";
import { Series } from "../Series";

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
}