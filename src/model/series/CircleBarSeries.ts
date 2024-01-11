////////////////////////////////////////////////////////////////////////////////
// CircleBarSeries.ts
// 2023. 11. 23. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IClusterable, PointItemPosition, Series } from "../Series";
import { BarSeriesBase, BarSeriesGroupBase } from "./BarSeries";

/**
 * CirleBar 시리즈.<br/>
 * 직사각형 대신 원형 막대로 여러 값들을 **비교**하는 데 사용한다.
 * 원 지름이 y값을 나타낸다.<br/>
 * 이 시리즈를 기준으로 생성되는 x축은 [category](/config/config/xAxis/category)이다.<br/><br/>
 * 
 *{@link data}는 아래 형식들로 전달할 수 있다.<br/>
 * 
 * ###### 단일 값 및 값 배열
 * |형식|설명|
 * |---|---|
 * |y|단일 숫자면 y값. x 값은 순서에 따라 자동 결정.|
 * |[]|빈 배열이면 null. x 값은 순서에 따라 자동 결정.|
 * |[y]|값 하나인 배열이면 y값. x 값은 순서에 따라 자동 결정.|
 * |[x, y,]|두 값 이상이면 순서대로 x, y값.<br/> 또는 {@link xField} 속성이 숫자이면 x값의 index. {@link yField}는 y값의 index.<br>{@link colorField}는 color값의 index.|
 *
 * ###### json 배열
 * |Series 속성|설명 |
 * |---|---|
 * |{@link xField}|속성 값, 또는 'x', 'name', 'label' 속성들 중 순서대로 값이 설정된 것이 x 값이 된다.|
 * |{@link yField}|속성 값, 또는 'y', 'value' 속성들 중 순서대로 값이 설정된 것이 y 값이 된다.|
 * |{@link colorField}|속성 값, 또는 'color' 속성 값으로 데이터포인트의 개별 색상으로 지정된다.|
 * 
 * @config chart.series[type=circlebar]
 */
export class CircleBarSeries extends BarSeriesBase {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'circlebar';
    }

    protected _initProps(): void {
        super._initProps();

        this.pointLabel.position = PointItemPosition.INSIDE;
    }
}

/**
 * @config chart.series[type=circlebargroup]
 */
export class CircleBarSeriesGroup extends BarSeriesGroupBase<CircleBarSeries> implements IClusterable {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'circlebargroup';
    }

    _seriesType(): string {
        return 'circlebar';
    }

    protected _canContain(ser: Series): boolean {
        return ser instanceof CircleBarSeries;
    }
}
