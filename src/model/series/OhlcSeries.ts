////////////////////////////////////////////////////////////////////////////////
// OhlcSeries.ts
// 2023. 08. 08. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathBuilder } from "../../common/PathBuilder";
import { PathElement, RcElement } from "../../common/RcControl";
import { DataPoint } from "../DataPoint";
import { Series } from "../Series";
import { CandlestickSeries, CandlestickSeriesPoint } from "./CandlestickSeries";

/**
 * Low/Open/Close/High 네 값을 수직선(low-high)과 
 * 왼쪽(open), 오른쪽(close) 수평 선분으로 표시한다.<br>
 * close가 open보다 큰 경와 작은 경우를 다른 색으로 표시할 수 있다.<br>
 * 일정 기간 동안 한 값의 대체적인 변화를 표시한다.
 *
 * [low, open, close, high]
 * [x, low, open, close, high]
 */
export class OhlcSeriesPoint extends CandlestickSeriesPoint {

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
 * 
 * @config chart.series[type=ohlc]
 */
export class OhlcSeries extends CandlestickSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'ohlc';
    }

    protected _createPoint(source: any): DataPoint {
        return new OhlcSeriesPoint(source);
    }

    protected _createLegendMarker(doc: Document, size: number): RcElement {
        const pb = new PathBuilder();
        pb.vline(size / 2, 0, size);
        pb.hline(size * 0.4, size / 2, size);
        pb.hline(size * 0.7, 0, size / 2);
        const elt = new PathElement(doc, Series.LEGEND_MARKER, pb.end());
        elt.setStyle('strokeWidth', '2px');
        return elt;
    }
}