////////////////////////////////////////////////////////////////////////////////
// LinearGauge.ts
// 2023. 10. 05. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isObject } from "../../common/Common";
import { IMinMax, IPercentSize, RtPercentSize, SVGStyleOrClass, calcPercent, parsePercentSize } from "../../common/Types";
import { IChart } from "../Chart";
import { ChartItem } from "../ChartItem";
import { GaugeGroup, GaugeLabel, GaugeRangeBand, LinearGaugeScale, ValueGauge } from "../Gauge";

export class LinearGaugeLabel extends GaugeLabel {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _width: RtPercentSize;
    private _height: RtPercentSize;
    private _maxWidth: RtPercentSize;
    private _maxHeight: RtPercentSize;
    private _gap: RtPercentSize;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _widthDim: IPercentSize;
    private _heightDim: IPercentSize;
    private _maxWidthDim: IPercentSize;
    private _maxHeightDim: IPercentSize;
    private _gapDim: IPercentSize;
    _runPos: 'left' | 'right' | 'top' | 'bottom';
    _runGap: number;
    _runVert: boolean;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart);

        this.maxWidth = '30%';
        this.maxHeight = '30%';
        this.gap = 10;// '5%';
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 값을 지정하지 않으면 게이지 표시 방향에 따라 자동으로 위치를 결정한다.
     * 
     * @config
     */
    position: undefined | 'left' | 'right' | 'top' | 'bottom';
    /**
     * position이 'left', 'right'일 때, label 표시 영역 너비.
     * 픽셀값이나 게이지 전체 너비에 대한 상대값으로 지정할 수 있다.
     * 
     * @config
     */
    get width(): RtPercentSize {
        return this._width;
    }
    set width(value: RtPercentSize) {
        if (value !== this._width) {
            this._width = value;
            this._widthDim = parsePercentSize(value, true);
        }
    }
    /**
     * position이 'top', 'bottom'일 때, label 표시 영역 높이.
     * 픽셀값이나 게이지 전체 높이에 대한 상대값으로 지정할 수 있다.
     * 
     * @config
     */
    get height(): RtPercentSize {
        return this._height;
    }
    set height(value: RtPercentSize) {
        if (value !== this._height) {
            this._height = value;
            this._heightDim = parsePercentSize(value, true);
        }
    }
    /**
     * position이 'left', 'right'일 때, label 표시 영역 최대 너비.
     * 픽셀값이나 게이지 전체 너비에 대한 상대값으로 지정할 수 있다.
     * {@link width}가 지정되면 이 속성은 무시된다.
     * 
     * @config
     */
    get maxWidth(): RtPercentSize {
        return this._maxWidth;
    }
    set maxWidth(value: RtPercentSize) {
        if (value !== this._maxWidth) {
            this._maxWidth = value;
            this._maxWidthDim = parsePercentSize(value, true);
        }
    }
    /**
     * position이 'top', 'bottom'일 때, label 표시 영역 최대 높이.
     * 픽셀값이나 게이지 전체 높이에 대한 상대값으로 지정할 수 있다.
     * {@link height}가 지정되면 이 속성은 무시된다.
     * 
     * @config
     */
    get maxHeight(): RtPercentSize {
        return this._maxHeight;
    }
    set maxHeight(value: RtPercentSize) {
        if (value !== this._maxHeight) {
            this._maxHeight = value;
            this._maxHeightDim = parsePercentSize(value, true);
        }
    }
    /**
     * label과 본체 사이의 간격.
     * 픽셀값이나 게이지 전체 크기(position에 따라 높이나 너비)에 대한 상대값으로 지정할 수 있다.
     * 
     * @config
     */
    get gap(): RtPercentSize {
        return this._gap;
    }
    set gap(value: RtPercentSize) {
        if (value !== this._gap) {
            this._gap = value;
            this._gapDim = parsePercentSize(value, true);
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getWidth(domain: number): number {
        return calcPercent(this._widthDim, domain);
    }

    getHeight(domain: number): number {
        return calcPercent(this._heightDim, domain);
    }

    getMaxWidth(domain: number): number {
        return calcPercent(this._maxWidthDim, domain);
    }

    getMaxHeight(domain: number): number {
        return calcPercent(this._maxHeightDim, domain);
    }

    getGap(domain: number): number {
        return calcPercent(this._gapDim, domain, 0);
    }
}

/**
 * 선형 게이지 base 모델.
 */
export abstract class LinearGaugeBase extends ValueGauge {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart);

        this.label = new LinearGaugeLabel(this.chart);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * true면 수직으로 표시한다.
     * 
     * @config
     */
    vertical: boolean;
    /**
     * true면 반대 방향으로 표시한다.
     * 
     * @config
     */
    reversed = false;
    /**
     * label 설정 모델.
     * 
     * @config
     */
    label: LinearGaugeLabel;
    /**
     * scale.
     * 
     * @config
     */
    scale = new LinearGaugeScale(this);

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isVertical(): boolean {
        return this.group ? !(this.group as LinearGaugeGroupBase<any>).vertical : this.vertical;
    }

    scaleVisible(): boolean {
        return !this.group && this.scale.visible;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    calcedMinMax(): IMinMax {
        return this.scale.range();
    }

    protected _doPrepareRender(chart: IChart): void {
        super._doPrepareRender(chart);

        this.label.prepareRender();
    }
}

export enum LinearGaugeMarkerType {
    BAR = 'bar',
    NEEDLE = 'needle'
}

/**
 * linear 게이지의 값을 표시하는 영역에 대한 설정 모델.
 */
export class LinearValueBar extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _args = {
        gauge: null,
        value: NaN
    };

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public gauge: LinearGaugeBase) {
        super(gauge.chart, true);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * {@link value 현재 값} 등을 기준으로 추가 적용되는 스타일을 리턴한다.
     * 기본 설정을 따르게 하고 싶으면 undefined나 null을 리턴한다.
     * 
     * @config
     */
    styleCallback: (args: any) => SVGStyleOrClass;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getStyle(value: number): SVGStyleOrClass {
        if (this.styleCallback) {
            this._args.gauge = this.chart._proxy.getChartObject(this.gauge);
            this._args.value = value;
            const st = this.styleCallback(this._args)
            return st;
        }
    }}

/**
 * 선형 게이지 모델.
 * 현재 값을 목표 값과 비교해서 표시한다.
 * 또, 여러 값 범위 중 어디에 속한 상태인 지를 나타낸다.
 * 
 * @config chart.gauge[type=linear]
 */
export class LinearGauge extends LinearGaugeBase {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 게이지 값을 표시하는 bar 모델.
     * 
     * @config
     */
    valueBar = new LinearValueBar(this);
    /**
     * 게이지 본체 주변이나 내부에 값 영역들을 구분해서 표시하는 band의 모델.
     * 
     * @config
     */
    band = new GaugeRangeBand(this);

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'linear';
    }
}

export class LinearGaugeChildLabel extends ChartItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 고정 너비.
     * 
     * @config
     */
    width: RtPercentSize;
    /**
     * 최소 너비
     * 
     * @config
     */
    minWidth: RtPercentSize;
    /**
     * 최대 너비
     * 
     * @config
     */
    maxWidth: RtPercentSize;
    /**
     * true면 자식 게이지의 label을 기본 위치의 반대쪽에 표시한다.
     * 
     * @config
     */
    opposite = false;
    /**
     * 자식 계이지의 label과 본체 사이의 간격을 픽셀 단위로 지정한다.
     * 
     * @config
     */
    gap = 10;
}

export abstract class LinearGaugeGroupBase<T extends LinearGaugeBase> extends GaugeGroup<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _labelWidth: number;
    _labelHeight: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart);

        this.label = new LinearGaugeLabel(chart);
        this.label.gap = 10;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * true면 자식 게이지들을 수평으로 지정하고(자식 게이지의 vertical 속성과 관계없이), 수직으로 차례대로 배치한다.
     * false면 자식 게이지들을 수직으로 지정하고, 수평으로 배치한다.\
     * 이런 배치가 의도와 맞지 않다면 그룹없이 개별적으로 배치해야 한다.
     * 
     * @config
     */
    vertical = true;
    /**
     * 자식 게이지들의 {@link LinearGaugeBase.vertical}을 지정한다.
     */
    itemVertical: boolean;
    /**
     * label 설정 모델.
     * 
     * @config
     */
    label: LinearGaugeLabel;
    /**
     * 자식 게이지들의 label 표시 관련 속성 모델.
     * 
     * @config
     */
    itemLabel = new LinearGaugeChildLabel(this.chart, true);
    /**
     * scale.
     * 
     * @config
     */
    scale = new LinearGaugeScale(this);
    /**
     * 자식 게이지들 사이의 표시 간격을 픽셀 단위로 지정한다.
     */
    itemGap = 10;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    calcedMinMax(): IMinMax {
        return this.scale.range();
    }
}

export class LinearGaugeGroup extends LinearGaugeGroupBase<LinearGauge> {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 게이지 본체 주변이나 내부에 값 영역들을 구분해서 표시하는 band의 모델.
     * 
     * @config
     */
    band = new GaugeRangeBand(this, false);

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'lineargroup';
    }

    _gaugesType(): string {
        return 'linear';
    }
}