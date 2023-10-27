////////////////////////////////////////////////////////////////////////////////
// Body.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

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
 * 시리즈들이 그려지는 plot 영역 모델.
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
    get radius(): RtPercentSize {
        return this._radius;
    }
    set radius(value: RtPercentSize) {
        if (value !== this._radius) {
            this._radius = value;
            this._radiusDim = parsePercentSize(value, true);
        }
    }

    get centerX(): RtPercentSize {
        return this._centerX;
    }
    set centerX(value: RtPercentSize) {
        if (value !== this._centerX) {
            this._centerX = value;
            this._cxDim = parsePercentSize(value, true);
        }
    }

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
