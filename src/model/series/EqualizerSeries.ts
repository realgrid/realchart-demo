////////////////////////////////////////////////////////////////////////////////
// EqualizerSeries.ts
// 2023. 08. 01. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathBuilder } from "../../common/PathBuilder";
import { PathElement, RcElement } from "../../common/RcControl";
import { IPercentSize, RtPercentSize, SVGStyleOrClass, calcPercent, parsePercentSize } from "../../common/Types";
import { DataPoint } from "../DataPoint";
import { BasedSeries, Series } from "../Series";

export class EqualizerSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

/**
 * Bar 시리즈 변종.
 * 
 * @config chart.series[type=equalizer]
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

    protected _createLegendMarker(doc: Document, size: number): RcElement {
        const pb = new PathBuilder();
        pb.rect(0, 0, size, size * 0.4);
        pb.rect(0, size * 0.6, size, size * 0.4);
        return new PathElement(doc, Series.LEGEND_MARKER, pb.end());
    }
}