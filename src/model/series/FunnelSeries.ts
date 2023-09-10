////////////////////////////////////////////////////////////////////////////////
// FunnelSeries.ts
// 2023. 07. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ISize } from "../../common/Size";
import { IPercentSize, SizeValue, calcPercent, fixnum, parsePercentSize2 } from "../../common/Types";
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
    static readonly DEF_NECK_HEIGHT = '25%';

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
    width: SizeValue = FunnelSeries.DEF_WIDTH;
    height: SizeValue = FunnelSeries.DEF_HEIGHT;
    neckWidth: SizeValue = FunnelSeries.DEF_NECK_WIDTH;
    neckHeight: SizeValue = FunnelSeries.DEF_NECK_WIDTH;
    reversed = false;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getSize(plotWidth: number, plotHeight: number): ISize {
        return {
            width: calcPercent(this._widthDim, plotWidth),
            height: calcPercent(this._heightDim, plotHeight)
        };
    }

    getNeckSize(plotWidth: number, plotHeight: number): ISize{
        return {
            width: calcPercent(this._neckWidthDim, plotWidth),
            height: calcPercent(this._neckHeightDim, plotHeight)
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
        this._runPoints.forEach(p => {
            list.push(p as FunnelSeriesPoint);
        })        
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
