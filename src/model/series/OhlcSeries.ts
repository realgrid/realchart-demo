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
 * Ohlc 시리즈.<br/>
 * 시가-고가-저가-종가 차트.
 * 시간 경과에 따른 가격의 움직임을 설명하는 데 사용된다.<br/><br/>
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