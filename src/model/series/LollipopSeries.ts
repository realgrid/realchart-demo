////////////////////////////////////////////////////////////////////////////////
// LollipopSeries.ts
// 2023. 07. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Shape } from "../../common/impl/SvgShape";
import { DataPoint } from "../DataPoint";
import { BasedSeries, ClusterableSeries, SeriesMarker } from "../Series";

export class LollipopSeriesMarker extends SeriesMarker {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    override radius = 4;
    override shape = Shape.CIRCLE;
}

export class LollipopSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    radius: number;
    shape: Shape;
}

/**
 * Lollipop(막대 사탕) 시리즈.<br/>
 * 기능적으로는 bar 시리즈와 동일하지만, 대부분의 데이터포인트 값들이 최대값에 가까운 곳에 몰려 있는 경우에 
 * 활용 가능하다. bar 시리즈 표현하면 시각적으로 구분하기 쉽지 않기 때문이다.
 * 특히, bar가 겹치더라도 데이터포인트들이 쉽게 구분된다.<br/><br/>
 * 
 * {@link data}는 아래 형식들로 전달할 수 있다.<br/>
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
 * @config chart.series[type=lollipop]
 */
export class LollipopSeries extends BasedSeries {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    marker = new LollipopSeriesMarker(this);

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'lollipop';
    }

    override canCategorized(): boolean {
        return true;
    }

    override getLabelOff(off: number): number {
        return super.getLabelOff(off) + this.marker.radius;
    }

    protected override _createPoint(source: any): DataPoint {
        return new LollipopSeriesPoint(source);
    }

    protected override _doPrepareRender(): void {
        super._doPrepareRender();

        const radius = this.marker.radius;
        const shape = this.marker.shape;

        this._runPoints.forEach((p: LollipopSeriesPoint) => {
            p.radius = radius;
            p.shape = shape;
        })
    }
}