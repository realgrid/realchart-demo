////////////////////////////////////////////////////////////////////////////////
// ScatterSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { minv } from "../../common/Common";
import { RcElement } from "../../common/RcControl";
import { Shape } from "../../common/impl/SvgShape";
import { DataPoint } from "../DataPoint";
import { LegendItem } from "../Legend";
import { MarkerSeries } from "../Series";
import { ShapeLegendMarkerView } from "./legend/ShapeLegendMarkerView";

export class ScatterSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
}

/**
 * Scatter 시리즈.<br/>
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
 * @config chart.series[type=scatter]
 */
export class ScatterSeries extends MarkerSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _defShape: Shape;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * https://thomasleeper.com/Rcourse/Tutorials/jitter.html
     */
    jitterX = 0;
    jitterY = 0;
    /**
     * {@link shape}의 반지름.
     * 
     * @config
     */
    radius = 5;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'scatter';
    }

    protected _createPoint(source: any): DataPoint {
        return new ScatterSeriesPoint(source);
    }

    protected _createLegendMarker(doc: Document, size: number): RcElement {
        return new ShapeLegendMarkerView(doc, size);
    }

    /**
     * rendering 시점에 chart가 series별로 기본 shape를 지정한다.
     */
    setShape(shape: Shape): void {
        this._defShape = shape;
    }

    getShape(p: ScatterSeriesPoint): Shape {
        return this.shape || this._defShape;
    }

    hasMarker(): boolean {
        return true;
    }

    legendMarker(doc: Document, size: number): RcElement {
        const m = super.legendMarker(doc, size);

        (m as ShapeLegendMarkerView).setShape(this.getShape(null), minv(+size || LegendItem.MARKER_SIZE, this.radius * 2));
        return m;
    }
}