////////////////////////////////////////////////////////////////////////////////
// Body.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IPercentSize, ORG_ANGLE, SizeValue, calcPercent, deg2rad, parsePercentSize } from "../common/Types";
import { ChartItem } from "./ChartItem";

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

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    name: string;
    size: SizeValue = '90%';
    centerX: SizeValue = '50%';
    centerY: SizeValue = '50%';
    startAngle = 0;
    circular = true;

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
        return ORG_ANGLE + deg2rad(this.startAngle);
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
}
