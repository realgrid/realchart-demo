////////////////////////////////////////////////////////////////////////////////
// Body.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { DEG_RAD, IPercentSize, ORG_ANGLE, SVGStyleOrClass, SizeValue, _undefined, calcPercent, parsePercentSize } from "../common/Types";
import { AxisGuide } from "./Axis";
import { IChart } from "./Chart";
import { BackgroundImage, ChartItem } from "./ChartItem";
import { Series } from "./Series";

/**
 * 시리즈들이 그려지는 plot 영역 모델.
 */
export class Body extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _sizeDim: IPercentSize;
    private _cxDim: IPercentSize;
    private _cyDim: IPercentSize;
    _cx: number;
    _cy: number;
    _rd: number; 

    _guides: AxisGuide[] = [];
    _frontGuides: AxisGuide[] = [];

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    // name: string;
    size: SizeValue = '90%';
    centerX: SizeValue = '50%';
    centerY: SizeValue = '50%';
    startAngle = 0;
    circular = true;
    image = new BackgroundImage(null);

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getSize(width: number, height: number): number {
        return calcPercent(this._sizeDim, Math.min(width, height));
    }

    getCenter(width: number, height: number): {cx: number, cy: number} {
        return {
            cx: calcPercent(this._cxDim, width),
            cy: calcPercent(this._cyDim, height)
        };
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
            deg: Math.PI * 2 / series._runPoints.length
        } : _undefined;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoad(source: any): void {
        super._doLoad(source);

        this._sizeDim = parsePercentSize(this.size, true) || { size: 90, fixed: false };
        this._cxDim = parsePercentSize(this.centerX, true) || { size: 50, fixed: false };
        this._cyDim = parsePercentSize(this.centerY, true) || { size: 50, fixed: false };
    }

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
