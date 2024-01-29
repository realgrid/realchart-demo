////////////////////////////////////////////////////////////////////////////////
// BubbleSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { maxv, minv } from "../../common/Common";
import { IPercentSize, RtPercentSize, calcPercent, parsePercentSize } from "../../common/Types";
import { Shape } from "../../common/impl/SvgShape";
import { DataPoint, ZValuePoint } from "../DataPoint";
import { MarkerSeries } from "../Series";

/**
 * [y, z]
 * [x, y, z]
 */
export class BubbleSeriesPoint extends ZValuePoint {
}

export enum BubbleSizeMode {
    WIDTH = 'width',
    AREA = 'area'
}

/**
 * 버블 시리즈.<br/>
 * x, y로 지정되는 위치와 z로 지정되는 크기 사이의 관계를 표시한다.
 * 주로 원의 크기가 데이터포인트의 중요도를 나타낸다.<br/>
 * 이 시리즈를 기준으로 생성되는 x축은 [linear](/config/config/xAxis/linear)이다.<br/><br/>
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
 * @config chart.series[type=bubble]
 */
export class BubbleSeries extends MarkerSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _minDim: IPercentSize;
    private _maxDim: IPercentSize;

    _zMin: number;
    _zMax: number;
    _noSize: boolean;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 버블 크기를 결정하는 방식.
     * 
     * @config
     */
    sizeMode = BubbleSizeMode.AREA;
    /**
     * 버블 최소 크기.
     * 
     * @config
     */
    minSize: RtPercentSize = 8;
    /**
     * 버블 최대 크기.
     * 
     * @config
     */
    maxSize: RtPercentSize = '20%';

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getPixelMinMax(len: number): {min: number, max: number} {
        return {
            min: calcPercent(this._minDim, len),
            max: calcPercent(this._maxDim, len)
        };
    }

    getRadius(value: number, pxMin: number, pxMax: number): number {
        let r = this._noSize ? 1 : (value - this._zMin) / (this._zMax - this._zMin);

        if (this.sizeMode == BubbleSizeMode.AREA) {
            r = Math.sqrt(r);
        }
        r = Math.ceil(pxMin + r * (pxMax - pxMin)) / 2;

        return r;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'bubble';
    }

    tooltipText = 'x: <b>${x}</b><br>y: <b>${y}</b><br>volume: <b>${z}</b>';

    protected _createPoint(source: any): DataPoint {
        return new BubbleSeriesPoint(source);
    }

    hasZ(): boolean {
        return true;
    }

    _colorByPoint(): boolean {
        return this.colorByPoint;
    }

    load(src: any): BubbleSeries {
        super.load(src);

        this._minDim = parsePercentSize(this.minSize, true);
        this._maxDim = parsePercentSize(this.maxSize, true);
        return this;
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        this._zMin = Number.MAX_VALUE;
        this._zMax = Number.MIN_VALUE;

        this._runPoints.forEach((p: BubbleSeriesPoint) => {
            if (!p.isNull && !isNaN(p.zValue)) {
                this._zMin = minv(this._zMin, p.zValue);
                this._zMax = maxv(this._zMax, p.zValue);
            }
        })
        this._noSize = this._zMin === this._zMax;
    }

    protected _getRangeMinMax(axis: "x" | "y" | "z"): { min: number; max: number; } {
        if (axis === 'z') {
            return { min: this._zMin, max: this._zMax };
        }
        return super._getRangeMinMax(axis);
    }
}