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
 * Bar를 여러 개의 segment로 나눠 표시하는 시리즈.<br/>
 * 수평 또는 수직 막대로 여러 값들을 **비교**하는 데 사용한다.
 * 막대의 길이가 y값을 나타낸다.<br/>
 * X축 타입이 설정되지 않은 경우, 이 시리즈를 기준으로 생성되는 축은 [category](/config/config/xAxis/category)이다.<br/><br/>
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

    override canCategorized(): boolean {
        return true;
    }

    protected override _createPoint(source: any): DataPoint {
        return new EqualizerSeriesPoint(source);
    }

    protected override _doLoad(src: any): void {
        super._doLoad(src);

        this._segmentDim = parsePercentSize(this.segmentSize, false);
    }

    protected override _createLegendMarker(doc: Document, size: number): RcElement {
        const pb = new PathBuilder();
        pb.rect(0, 0, size, size * 0.4);
        pb.rect(0, size * 0.6, size, size * 0.4);
        return new PathElement(doc, Series.LEGEND_MARKER, pb.end());
    }
}