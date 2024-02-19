////////////////////////////////////////////////////////////////////////////////
// ErrorBarSeries.ts
// 2023. 07. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathBuilder } from "../../common/PathBuilder";
import { PathElement, RcElement } from "../../common/RcControl";
import { IAxis } from "../Axis";
import { DataPoint, RangedPoint } from "../DataPoint";
import { LowRangedSeries, Series } from "../Series";

/**
 * ErrorBar 시리즈.<br/>
 * 오류(차) 표시 막대를 표시한다.<br/><br/>
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
 * @config chart.series[type=errorbar]
 */
export class ErrorBarSeries extends LowRangedSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    override lowField: string;

    override pointPadding = 0.3;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'errorbar';
    }

    override isClusterable(): boolean {
        return false;
    }

    override pointLabelCount(): number {
        return 2;
    }

    override tooltipText = '<b>${name}</b><br>${series}: <b>${lowValue}</b> ~ <b>${highValue}</b>';

    protected override _createPoint(source: any): DataPoint {
        return new RangedPoint(source);
    }

    protected _getBottomValue(p: RangedPoint): number {
        return p.lowValue;
    }

    override getBaseValue(axis: IAxis): number {
        // TODO: 연결된 시리즈(bar)의 설정을 따른다.
        return axis === this._yAxisObj ? 0 : NaN;
    }

    protected override _createLegendMarker(doc: Document, size: number): RcElement {
        const pb = new PathBuilder();
        pb.vline(size / 2, 0.1, size * 0.8);
        pb.hline(0.1, 0, size);
        pb.hline(size * 0.9, 0, size);
        const elt = new PathElement(doc, Series.LEGEND_MARKER, pb.end());
        elt.setStyle('strokeWidth', '2px');
        return elt;
    }
}