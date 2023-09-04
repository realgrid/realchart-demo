////////////////////////////////////////////////////////////////////////////////
// EqualizerSeries.ts
// 2023. 08. 01. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IPercentSize, RtPercentSize, SVGStyleOrClass, calcPercent, parsePercentSize } from "../../common/Types";
import { DataPoint } from "../DataPoint";
import { BasedSeries } from "../Series";

export class EqualizerSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

/**
 * Bar 시리즈 변종.
 */
export class EqualizerSeries extends BasedSeries {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _segmentDim: IPercentSize;

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    backStyle: SVGStyleOrClass;
    maxCount: number;
    segmentSize: RtPercentSize = 10;
    segmentGap = 4;
    segmented = false;
    backSegments = false;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getSegmentSize(domain: number): number {
        return calcPercent(this._segmentDim, domain);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'equalizer';
    }

    canCategorized(): boolean {
        return true;
    }

    protected _createPoint(source: any): DataPoint {
        return new EqualizerSeriesPoint(source);
    }

    protected _doLoad(src: any): void {
        super._doLoad(src);

        this._segmentDim = parsePercentSize(this.segmentSize, false);
    }
}