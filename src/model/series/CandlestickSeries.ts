////////////////////////////////////////////////////////////////////////////////
// CandlestickSeries.ts
// 2023. 07. 29. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp, assign } from "../../common/Common";
import { PathBuilder } from "../../common/PathBuilder";
import { PathElement, RcElement } from "../../common/RcControl";
import { DataPoint } from "../DataPoint";
import { RangedSeries, Series } from "../Series";

/**
 * [low, open, close, high]
 * [x, low, open, close, high]
 */
export class CandlestickSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    low: any;
    close: any;
    open: any;
    high: any;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    lowValue: number;
    closeValue: number;
    openValue: number;
    highValue: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    parse(series: CandlestickSeries): void {
        super.parse(series);

        this.lowValue = parseFloat(this.low);
        this.openValue = parseFloat(this.open);
        this.closeValue = parseFloat(this.close);
        this.highValue = parseFloat(this.high);

        this.isNull ||= isNaN(this.lowValue) || isNaN(this.openValue) || isNaN(this.closeValue);
    }

    protected _assignTo(proxy: any): any {
        return assign(super._assignTo(proxy), {
            low: this.low,
            close: this.close,
            open: this.open,
            high: this.high
        });
    }

    protected _readArray(series: CandlestickSeries, v: any[]): void {
        const d = v.length > 4 ? 1 : 0;

        this.low = v[pickNum(series.lowField, 0 + d)];
        this.open = v[pickNum(series.openField, 1 + d)];
        this.close = v[pickNum(series.closeField, 2 + d)];
        this.y = this.high = v[pickNum(series.highField, 3 + d)];
        if (d > 0) {
            this.x = v[pickNum(series.xField, 0)];
        }
    }

    protected _readObject(series: CandlestickSeries, v: any): void {
        super._readObject(series, v);

        this.low = pickProp(v[series.lowField], v.row);
        this.open = pickProp(v[series.openField], v.open);
        this.close = pickProp(v[series.closeField], v.close);
        this.high = pickProp(v[series.highField], v.high);
        if (!isNaN(this.high)) this.y = this.high;
        else if (!isNaN(this.y)) this.high = this.y;
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);

        this.low = this.close = this.open = this.high = this.y;
    }
}

/**
 * @config chart.series[type=candlestick]
 */
export class CandlestickSeries extends RangedSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    lowField: string;
    openField: string;
    closeField: string;
    highField: string;

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
        return 'candlestick';
    }

    canCategorized(): boolean {
        return true;
    }

    protected _createPoint(source: any): DataPoint {
        return new CandlestickSeriesPoint(source);
    }

    protected _getBottomValue(p: CandlestickSeriesPoint): number {
        return p.lowValue;
    }

    protected _createLegendMarker(doc: Document, size: number): RcElement {
        const pb = new PathBuilder();
        pb.rect(0, size * 0.2, size, size * 0.6);
        pb.vline(size / 2, 0, size);
        return new PathElement(doc, Series.LEGEND_MARKER, pb.end());
    }
}