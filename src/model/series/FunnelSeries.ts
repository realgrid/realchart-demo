////////////////////////////////////////////////////////////////////////////////
// FunnelSeries.ts
// 2023. 07. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ISize } from "../../common/Size";
import { IPercentSize, RtPercentSize, calcPercent, parsePercentSize2 } from "../../common/Types";
import { Utils } from "../../common/Utils";
import { IChart } from "../Chart";
import { DataPoint } from "../DataPoint";
import { ILegendSource } from "../Legend";
import { PointItemPosition, WidgetSeries, WidgetSeriesPoint } from "../Series";

export class FunnelSeriesPoint extends WidgetSeriesPoint {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    height: number;
}

/**
 * @config chart.series[type=funnel]
 */
export class FunnelSeries extends WidgetSeries {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly DEF_WIDTH = '85%';
    static readonly DEF_HEIGHT = '90%';
    static readonly DEF_NECK_WIDTH = '30%';
    static readonly DEF_NECK_HEIGHT = '30%';

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _widthDim: IPercentSize;
    private _heightDim: IPercentSize;
    private _neckWidthDim: IPercentSize;
    private _neckHeightDim: IPercentSize;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart, name);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * @config
     */
    width: RtPercentSize = FunnelSeries.DEF_WIDTH;
    /**
     * @config
     */
    height: RtPercentSize = FunnelSeries.DEF_HEIGHT;
    /**
     * @config
     */
    neckWidth: RtPercentSize = FunnelSeries.DEF_NECK_WIDTH;
    /**
     * @config
     */
    neckHeight: RtPercentSize = FunnelSeries.DEF_NECK_HEIGHT;
    /**
     * @config
     */
    reversed = false;
    /**
     * 데이터 포인트별 legend 항목을 표시한다.
     * 
     * @config
     */
    legendByPoint = false;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getSize(plotWidth: number, plotHeight: number): ISize {
        return {
            width: Math.max(plotWidth * 0.1, calcPercent(this._widthDim, plotWidth)),
            height: Math.max(plotHeight * 0.1, calcPercent(this._heightDim, plotHeight))
        };
    }

    getNeckSize(width: number, height: number): ISize{
        return {
            width: Utils.clamp(calcPercent(this._neckWidthDim, width), width * 0.1, width),
            height: Utils.clamp(calcPercent(this._neckHeightDim, height), height * 0.1, height)
        };
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'funnel';
    }

    getPointTooltip(point: FunnelSeriesPoint, param: string): any {
        switch (param) {
            case 'height':
                return point.height;
            default:
                return super.getPointTooltip(point, param);
        }
    }

    protected _createPoint(source: any): DataPoint {
        return new FunnelSeriesPoint(source);
    }

    load(src: any): FunnelSeries {
        super.load(src);

        this._widthDim = parsePercentSize2(this.width, FunnelSeries.DEF_WIDTH);
        this._heightDim = parsePercentSize2(this.height, FunnelSeries.DEF_HEIGHT);
        this._neckWidthDim = parsePercentSize2(this.neckWidth, FunnelSeries.DEF_NECK_WIDTH);
        this._neckHeightDim = parsePercentSize2(this.neckHeight, FunnelSeries.DEF_NECK_HEIGHT);
        return this;
    }
}
