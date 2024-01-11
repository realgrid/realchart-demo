////////////////////////////////////////////////////////////////////////////////
// HeatmapSeries.ts
// 2023. 08. 01. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { maxv, minv } from "../../common/Common";
import { DataPoint, ZValuePoint } from "../DataPoint";
import { IPlottingItem, Series } from "../Series";

/**
 * [y, z],
 * [x, y, z]
 */
export class HeatmapSeriesPoint extends ZValuePoint {
}

/**
 * Heatmap 시리즈.<br/>
 * 숫자 대신 색상으로 값들을 table에 표시한다.<br/>
 * 차트나 split pane에 하나의 heatmap만 존재할 수 있다.<br/><br/>
 * 
 * //[셀 색상]
 * //1. color-axis가 연결되면 거기에서 색을 가져온다.
 * //2. series의 minColor, maxColor 사이의 색으로 가져온다.
 * //3. series의 기본 색상과 흰색 사이의 색으로 가져온다.
 * 
 * {@link data}는 아래 형식들로 전달할 수 있다.<br/>
 * [주의] 데이터포인트 구성에 필요한 모든 값을 제공하지 않으면 null이 된다.
 * 
 * ###### 단일 값 및 값 배열
 * |형식|설명|
 * |---|---|
 * |y|단일 숫자면 y, z값. x 값은 순서에 따라 자동 결정.|
 * |[]|빈 배열이면 null. x 값은 순서에 따라 자동 결정.|
 * |[z]|단일 값 배열이면 y, z값. x 값은 순서에 따라 자동 결정.|
 * |[y, z]|두 값 배열이면 y값과 z값. x 값은 순서에 따라 자동 결정.|
 * |[x, y, z,]|세 값 이상이면 순서대로 x, y, z값.<br/> 또는 {@link xField} 속성이 숫자이면 x값의 index. {@link yField}는 y값의 index. {@link zField}는 z값의 index.|
 *
 * ###### json 배열
 * |Series 속성|설명|
 * |---|---|
 * |{@link xField}|속성 값, 또는 'x', 'name', 'label' 속성들 중 순서대로 값이 설정된 것이 x 값이 된다.|
 * |{@link yField}|속성 값, 또는 'y', 'value' 속성들 중 순서대로 값이 설정된 것이 y 값이 된다.|
 * |{@link zField}|속성 값, 또는 'z' 속성 값이 z 값이 된다.|
 * |{@link colorField}|속성 값, 또는 'color' 속성 값으로 데이터포인트의 개별 색상으로 지정된다.|
 * 
 * @config chart.series[type=heatmap]
 */
export class HeatmapSeries extends Series {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _heatMin: number;
    _heatMax: number;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getColor(value: number): string {
        return;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'heatmap';
    }

    tooltipText = 'x: <b>${x}</b><br>y: <b>${y}</b><br>heat: <b>${z}</b>';

    canMixWith(other: IPlottingItem): boolean {
        // 차트나 split pane에 하나의 heatmap만 존재할 수 있다.
        return false;
    }

    canCategorized(): boolean {
        return true;
    }

    hasZ(): boolean {
        return true;
    }

    defaultYAxisType(): string {
        return 'category';
    }

    protected _createPoint(source: any): DataPoint {
        return new HeatmapSeriesPoint(source);
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        this._heatMin = Number.MAX_VALUE;
        this._heatMax = Number.MIN_VALUE;

        (this._runPoints as HeatmapSeriesPoint[]).forEach(p => {
            if (!isNaN(p.zValue)) {
                this._heatMin = minv(this._heatMin, p.zValue);
                this._heatMax = maxv(this._heatMax, p.zValue);
            }
        })
    }
}