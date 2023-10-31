////////////////////////////////////////////////////////////////////////////////
// Body.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../common/Common";
import { DEG_RAD, IPercentSize, ORG_ANGLE, RtPercentSize, _undefined, calcPercent, parsePercentSize } from "../common/Types";
import { AxisGuide } from "./Axis";
import { IChart } from "./Chart";
import { BackgroundImage, ChartItem } from "./ChartItem";
import { Series } from "./Series";

export enum ZoomType {
    NONE = 'none',
    X = 'x',
    Y = 'y',
    BOTH = 'both'
}

export class ZoomButton extends ChartItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public body: Body) {
        super(body.chart, _undefined);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isVisible(): boolean {
        return this.visible !== false && this.body.isZoomed() && this.body.canZoom();
    }
}

/**
 * 시리즈 및 게이지들이 plotting되는 body 영역의 분할 방식 및 분할 영역에 대한 설정 모델.
 * 
 * 1. x축은 양쪽에서 공유될 수 있다.
 * 2. y축은 공유될 수 없다.
 */
export class BodySplit extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public body: Body) {
        super(body.chart, false);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 분할 영역이 차지할 크기를 전체 body 영역에 대한 비율로 지정한다.
     * 
     * @config
     */
    size = 0.5;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
}

/**
 * 시리즈 및 게이지들이 plotting되는 영역 모델.\
 * 설정 모델 등에서 'body'로 접근한다.
 */
export class Body extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _radius: RtPercentSize;
    private _centerX: RtPercentSize;
    private _centerY: RtPercentSize;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _radiusDim: IPercentSize;
    private _cxDim: IPercentSize;
    private _cyDim: IPercentSize;

    _guides: AxisGuide[] = [];
    _frontGuides: AxisGuide[] = [];
    private _rd: number;
    private _cx: number;
    private _cy: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart);

        this.radius = '45%';
        this.centerX = '50%';
        this.centerY = '50%';
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    split = new BodySplit(this);

    /**
     * 차트가 극좌표(polar)일 때 반지름.
     * 
     * @config
     */
    get radius(): RtPercentSize {
        return this._radius;
    }
    set radius(value: RtPercentSize) {
        if (value !== this._radius) {
            this._radius = value;
            this._radiusDim = parsePercentSize(value, true);
        }
    }

    /**
     * 차트가 극좌표(polar)일 때 중심 x 좌표.
     * 
     * @config
     */
    get centerX(): RtPercentSize {
        return this._centerX;
    }
    set centerX(value: RtPercentSize) {
        if (value !== this._centerX) {
            this._centerX = value;
            this._cxDim = parsePercentSize(value, true);
        }
    }

    /**
     * 차트가 극좌표(polar)일 때 중심 y 좌표.
     * 
     * @config
     */
    get centerY(): RtPercentSize {
        return this._centerY;
    }
    set centerY(value: RtPercentSize) {
        if (value !== this._centerY) {
            this._centerY = value;
            this._cyDim = parsePercentSize(value, true);
        }
    }
    /**
     * 시작 각도.
     * 
     * @CONFIG
     */
    startAngle = 0;
    circular = true; // TODO: 뭐지?
    /**
     * 배경 이미지 설정 모델
     * 
     * @config
     */
    image = new BackgroundImage(null);
    /**
     * plot 영역 마우스 드래깅을 통한 zooming 방식.
     * 
     * @config
     */
    zoomType = ZoomType.NONE;
    /**
     * Zoom 리셋 버튼 설정 모델.
     * 
     * @config
     */
    zoomButton = new ZoomButton(this);

    canZoom(): boolean {
        return this.zoomType === ZoomType.X || this.zoomType === ZoomType.Y || this.zoomType === ZoomType.BOTH;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getSplits(): number[] {
        const sz = Math.max(0, Math.min(1, pickNum(this.split.size, 0.5)));
        return [1 - sz, sz];
    }

    calcRadius(width: number, height: number): number {
        return calcPercent(this._radiusDim, Math.min(width, height));
    }

    setPolar(width: number, height: number): Body {
        this._cx = calcPercent(this._cxDim, width);
        this._cy = calcPercent(this._cyDim, height);
        this._rd = calcPercent(this._radiusDim, Math.min(width, height));
        return this;
    }

    getStartAngle(): number {
        return ORG_ANGLE + DEG_RAD * this.startAngle;
    }

    getPolar(series: Series): {start: number, cx: number, cy: number, rd: number, deg: number} {
        return this.chart.isPolar() ? {
            start: this.getStartAngle(),
            cx: this._cx,
            cy: this._cy,
            rd: this._rd,
            deg: series ? Math.PI * 2 / series._runPoints.length : 0
        } : _undefined;
    }

    isZoomed(): boolean {
        return this.chart._getXAxes().isZoomed() || this.chart._getYAxes().isZoomed();
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doPrepareRender(chart: IChart): void {
        super._doPrepareRender(chart);

        const guides = this._guides = [];
        const frontGuides = this._frontGuides = [];

        chart._getXAxes().forEach(axis => {
            axis.guides.forEach(g => {
                g.front ? frontGuides.push(g) : guides.push(g);
            })
        });
    }
}
