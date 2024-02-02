////////////////////////////////////////////////////////////////////////////////
// BarRangeSeries.ts
// 2023. 07. 25. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from "../../common/RcControl";
import { RectElement } from "../../common/impl/RectElement";
import { DataPoint, RangedPoint } from "../DataPoint";
import { LowRangedSeries, Series } from "../Series";

/**
 * BarRange 시리즌.<br/>
 * 수평 또는 수직 막대로 여러 값들의 범위들을 **비교**하는 데 사용한다.
 * 막대의 길이가 값의 범위를 표시한다.<br/>
 * 이 시리즈를 기준으로 생성되는 x축은 [category](/config/config/xAxis/category)이다.<br/><br/>
 * 
 * {@link data}는 아래 형식들로 전달할 수 있다.<br/>
 * [주의] 데이터포인트 구성에 필요한 모든 값을 제공해야 한다.<br/>
 * 
 * ###### 단일 값 및 값 배열
 * |형식|설명|
 * |---|---|
 * |y|단일 숫자면 low, y값. x 값은 순서에 따라 자동 결정.|
 * |[]|빈 배열이면 null. x 값은 데이터포인트 순서에 따라 자동 결정.|
 * |[z]|단일 값 배열이면 low, y값. x 값은 데이터포인트 순서에 따라 자동 결정.|
 * |[low, y]|두 값 배열이면 low값과 y값. x 값은 데이터포인트 순서에 따라 자동 결정.|
 * |[x, low, y,]|세 값 이상이면 순서대로 x, low, y값.<br/> 또는 {@link xField} 속성이 숫자이면 x값의 index. {@link lowField}는 low값의 index. {@link yField}는 y값의 index.|
 *
 * ###### json 배열
 * |Series 속성|설명|
 * |---|---|
 * |{@link xField}|속성 값, 또는 'x', 'name', 'label' 속성들 중 순서대로 값이 설정된 것이 x 값이 된다.|
 * |{@link yField}|속성 값, 또는 'y', 'value' 속성들 중 순서대로 값이 설정된 것이 y 값이 된다.|
 * |{@link lowField}|속성 값, 또는 'low' 속성 값이 low 값이 된다.|
 * |{@link colorField}|속성 값, 또는 'color' 속성 값으로 데이터포인트의 개별 색상으로 지정된다.|
 * 
 * @config chart.series[type=barrange]
 */
export class BarRangeSeries extends LowRangedSeries {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _lowFielder: (src: any) => any;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * json 객체나 배열로 전달되는 데이터포인트 정보에서 low 값을 지정하는 속성명이나 인덱스.<br/>
     * undefined이면, data point의 값이 array일 때는 1, 객체이면 'low'.
     * 
     * @config
     */
    lowField: string;

    /**
     * 지정한 반지름 크기로 데이터포인트 bar의 모서리를 둥글게 표시한다.\
     * 최대값이 bar 폭으로 절반으로 제한되므로 아주 큰 값을 지정하면 반원으로 표시된다.
     * 
     * @config
     */
    cornerRadius: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'barrange';
    }

    pointLabelCount(): number {
        return 2;
    }

    tooltipText = '<b>${name}</b><br>${series}: <b>${lowValue}</b> ~ <b>${highValue}</b>';

    protected _createLegendMarker(doc: Document, size: number): RcElement {
        return RectElement.create(doc, Series.LEGEND_MARKER, 0, 0, size, size, 2);
    }

    protected _createFielders(): void {
        super._createFielders();

        this._lowFielder = this._createFielder(this.lowField);
    }

    protected _createPoint(source: any): DataPoint {
        return new RangedPoint(source);
    }

    protected _getBottomValue(p: RangedPoint): number {
        return p.lowValue;
    }
}
