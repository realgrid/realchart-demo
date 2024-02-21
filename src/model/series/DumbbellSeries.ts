////////////////////////////////////////////////////////////////////////////////
// DumbbellSeries.ts
// 2023. 08. 01. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp, pickProp3, assign, maxv } from "../../common/Common";
import { Shape } from "../../common/impl/SvgShape";
import { IAxis } from "../Axis";
import { DataPoint, RangedPoint } from "../DataPoint";
import { ClusterableSeries, SeriesMarker } from "../Series";

export class DumbbellSeriesMarker extends SeriesMarker {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    override radius = 4;
    override shape = Shape.CIRCLE;
}

/**
 * [low, y]
 * [x, low, y]
 */
export class DumbbellSeriesPoint extends RangedPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    hPoint: number;
    radius: number;
    shape: Shape;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

/**
 * Dumbbell 시리즈.<br/>
 * Lollipop 시리즈의 변종으로 시간에 따른 두 값의 변화를 표시하는 등,
 * 두 그룹 간의 차이나 관계를 표시하는 데 사용될 수 있다.
 * 예를 들어, 두 기간 동안의 성장률, 두 그룹 간의 판매량 차이 변화 등을 보여 주는데 유용하다.<br/>
 * 양 끝 두 개의 원이나 점 등을 선분으로 연결하여 표시한다.<br/><br/>
 * 
 * {@link data}는 아래 형식들로 전달할 수 있다.<br/>
 * [주의] 데이터포인트 구성에 필요한 모든 값을 제공해야 한다.
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
 * @config chart.series[type=dumbbell]
 */
export class DumbbellSeries extends ClusterableSeries {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    marker = new DumbbellSeriesMarker(this);

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    lowField: string;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'dumbbell';
    }

    override canCategorized(): boolean {
        return true;
    }

    override pointLabelCount(): number {
        return 2;
    }

    override getLabelOff(off: number): number {
        return super.getLabelOff(off) + maxv(0, this.marker.radius);
    }

    protected override _createPoint(source: any): DataPoint {
        return new DumbbellSeriesPoint(source);
    }

    protected override _doPrepareRender(): void {
        super._doPrepareRender();

        const radius = this.marker.radius;
        const shape = this.marker.shape;

        this._runPoints.forEach((p: DumbbellSeriesPoint) => {
            p.radius = radius;
            p.shape = shape;
        })
    }

    override collectValues(axis: IAxis, vals: number[]): void {
        super.collectValues(axis, vals);

        if (vals && axis === this._yAxisObj) {
            this._runPoints.forEach(p => {
                const v = (p as DumbbellSeriesPoint).lowValue
                !isNaN(v) && vals.push(v);
            });
        }
    }
}