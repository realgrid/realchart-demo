////////////////////////////////////////////////////////////////////////////////
// FunnelSeries.ts
// 2023. 07. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ISize } from "../../common/Size";
import { IPercentSize, SizeValue, calcPercent, fixnum, parsePercentSize2 } from "../../common/Types";
import { Utils } from "../../common/Utils";
import { IChart } from "../Chart";
import { DataPoint } from "../DataPoint";
import { ILegendSource } from "../Legend";
import { PointItemPosition, WidgetSeries } from "../Series";

export class FunnelSeriesPoint extends DataPoint implements ILegendSource {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    height: number;
    _calcedColor: string;

    //-------------------------------------------------------------------------
    // ILegendSource
    //-------------------------------------------------------------------------
    legendColor(): string {
        return this._calcedColor;
    }

    legendLabel(): string {
        return this.x;
    }
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
    width: SizeValue = FunnelSeries.DEF_WIDTH;
    /**
     * @config
     */
    height: SizeValue = FunnelSeries.DEF_HEIGHT;
    /**
     * @config
     */
    neckWidth: SizeValue = FunnelSeries.DEF_NECK_WIDTH;
    /**
     * @config
     */
    neckHeight: SizeValue = FunnelSeries.DEF_NECK_HEIGHT;
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

    getLabelPosition(): PointItemPosition {
        const p = this.pointLabel.position;
        return p === PointItemPosition.AUTO ? PointItemPosition.INSIDE : p;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'funnel';
    }

    _colorByPoint(): boolean {
        return true;
    }

    getLegendSources(list: ILegendSource[]): void {
        if (this.legendByPoint) {
            !this.hideInLegend && this._runPoints.forEach(p => {
                list.push(p as FunnelSeriesPoint);
            })        
        } else {
            super.getLegendSources(list);
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

    // protected _doPrepareRender(): void {
    //     super._doPrepareRender();

    //     const pts = this._visPoints as FunnelSeriesPoint[];
    //     let sum = 0;
    //     let y = 0;

    //     pts.forEach(p => {
    //         sum += p.yValue;
    //     });

    //     const cnt = pts.length;
    //     let i = 0;

    //     for (; i < cnt - 1; i++) {
    //         const p = pts[i];
    //         const h = fixnum(p.yValue / sum);

    //         p.yRate = h * 100;
    //         p.yPos = y;
    //         p.height = h;
    //         y += h;
    //     }
    //     pts[i].yPos = y;
    //     pts[i].height = 1 - y;
    // }
}
