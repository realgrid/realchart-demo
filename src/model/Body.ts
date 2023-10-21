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
    X = 'x',
    Y = 'y',
    XY = 'xy'
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

    startAngle = 0;
    circular = true;
    image = new BackgroundImage(null);
    zoomType = ZoomType.X;

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
