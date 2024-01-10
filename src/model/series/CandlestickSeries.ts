////////////////////////////////////////////////////////////////////////////////
// CandlestickSeries.ts
// 2023. 07. 29. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp, assign, pickProp3, pickNum3 } from "../../common/Common";
import { PathBuilder } from "../../common/PathBuilder";
import { PathElement, RcElement } from "../../common/RcControl";
import { SVGStyleOrClass } from "../../common/Types";
import { DataPoint } from "../DataPoint";
import { RangedSeries, Series } from "../Series";

/**
 * [low, open, close, high | y]
 * [x, low, open, close, high | y]
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
    get highValue(): number { return this.yValue; }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    parse(series: CandlestickSeries): void {
        super.parse(series);

        this.high = this.y;

        this.lowValue = parseFloat(this.low);
        this.openValue = parseFloat(this.open);
        this.closeValue = parseFloat(this.close);

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
        if (v.length <= 3) {
            this.isNull = true;
        } else {
            const d = v.length > 4 ? 1 : 0;

            if (d > 0) {
                this.x = v[pickNum(series.xField, 0)];
            }
            this.low = v[pickNum(series.lowField, 0 + d)];
            this.close = v[pickNum(series.closeField, 1 + d)];
            this.open = v[pickNum(series.openField, 2 + d)];
            this.y = v[pickNum3(series.highField, series.yField, 3 + d)];
        }
    }

    protected _readObject(series: CandlestickSeries, v: any): void {
        super._readObject(series, v);

        this.low = pickProp(v[series.lowField], v.low);
        this.open = pickProp(v[series.openField], v.open);
        this.close = pickProp(v[series.closeField], v.close);
        this.y = pickProp3(v[series.highField], v.high, this.y);
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);

        this.low = this.close = this.open = this.y;
    }
}

/**
 * Candlestick 시리즈.<br/>
 * 주식을 비롯한 유가증권과 파생상품, 환율 등의 가격 움직임을 보여주는 시리즈.
 * 
 * {@link data}는 아래 형식들로 전달할 수 있다.
 * [주의] 데이터포인트 구성에 필요한 모든 값을 제공하지 않으면 null이 된다.
 * [주의] high와 y값은 동일한 값이다.
 * 
 * ###### 단일 값 및 값 배열
 * |형식|설명|
 * |---|---|
 * |y|단일 숫자면 low, y값. x 값은 순서에 따라 자동 결정.|
 * |[]|빈 배열이면 null. x 값은 순서에 따라 자동 결정.|
 * |[min, low, mid, high | y]|형식 설명 순서대로 값 결정. x 값은 데이터포인트 순서에 따라 자동 결정.|
 * |[x, min, low, mid, high | y]|형깃 설명 순서대로 값 결정.<br/> 또는 {@link xField} 속성이 숫자이면 x값, {@link minField}는 min값,<br/> {@link lowField}는 low값, {@link midField}는 mid값,<br/> {@link highField}는 high값, {@link yField}는 y값의 index.|
 *
 * ###### json 배열
 * |Series 속성|설명|
 * |---|---|
 * |{@link xField}|속성 값, 또는 'x', 'name', 'label' 속성들 중 순서대로 값이 설정된 것이 x 값이 된다.|
 * |{@link lowField}|속성 값, 또는 'low' 속성 값이 low 값이 된다.|
 * |{@link openField}|속성 값, 또는 'open' 속성 값이 open 값이 된다.|
 * |{@link closeField}|속성 값, 또는 'mid' 속성 값이 close 값이 된다.|
 * |{@link highField}|속성 값, 또는 'high' 속성 값이 high 값이 된다. 지정하지 않으면 yField 값이 사용된다.|
 * |{@link yField}|속성 값, 또는 'y', 'value' 속성들 중 순서대로 값이 설정된 것이 y 값이 된다.|
 * |{@link colorField}|속성 값, 또는 'color' 속성 값으로 데이터포인트의 개별 색상으로 지정된다.|
 * 
 * @config chart.series[type=candlestick]
 */
export class CandlestickSeries extends RangedSeries {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * json 객체나 배열로 전달되는 데이터포인트 정보에서 최저(low) 값을 지정하는 속성명이나 인덱스.<br/>
     * undefined이면, data point의 값이 array일 때는 항목 수가 5이상이면 1, 아니면 0, 객체이면 'low'.
     * 
     * @config
     */
    lowField: string;
    /**
     * json 객체나 배열로 전달되는 데이터포인트 정보에서 시작(open) 값을 지정하는 속성명이나 인덱스.<br/>
     * undefined이면, data point의 값이 array일 때는 항목 수가 5이상이면 2, 아니면 1, 객체이면 'open'.
     * 
     * @config
     */
    openField: string;
    /**
     * json 객체나 배열로 전달되는 데이터포인트 정보에서 종료(close) 값을 지정하는 속성명이나 인덱스.<br/>
     * undefined이면, data point의 값이 array일 때는 항목 수가 5이상이면 3, 아니면 2, 객체이면 'close'.
     * 
     * @config
     */
    closeField: string;
    /**
     * json 객체나 배열로 전달되는 데이터포인트 정보에서 최고(high) 값을 지정하는 속성명이나 인덱스.<br/>
     * undefined이면, {@link yField} 값으로 대체된다.
     * 
     * @config
     */
    highField: string;
    /**
     * 값이 하락한 데이터포인트에 적용되는 스타일셋.
     * 
     * @config
     */
    declineStyle: SVGStyleOrClass;

    tooltipText = '<b>${name}</b><br>최저: <b>${lowValue}</b><br>시가: <b>${openValue}</b><br>종가: <b>${closeValue}</b><br>고가: <b>${highValue}</b>';

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