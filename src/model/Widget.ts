////////////////////////////////////////////////////////////////////////////////
// Widget.ts
// 2023. 09. 25. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum3 } from "../common/Common";
import { IPoint } from "../common/Point";
import { IPercentSize, RtPercentSize, calcPercent, parsePercentSize } from "../common/Types";
import { IChart } from "./Chart";
import { ChartItem } from "./ChartItem";

/**
 * Widget 모델.
 * 기본적으로 plot 영역에 표시된다.
 * plot 영역에 표시될 때 {@link left}, {@link top} 등으로 위치를 지정할 수 있다.
 * 
 * @config chart.widget
 */
export abstract class Widget extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _leftDim: IPercentSize;
    private _rightDim: IPercentSize;
    private _topDim: IPercentSize;
    private _bottomDim: IPercentSize;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * {@link position}이 {@link LegendPosition.PLOT plot}일 때, plot 영역의 좌측 모서리와 legend의 간격.
     * 
     * @config
     */
    left: RtPercentSize = 10;
    /**
     * {@link position}이 {@link LegendPosition.PLOT plot}일 때, plot 영역의 우측 모서리와 legend의 간격.
     * {@link left}가 지정되면 이 속성은 무시된다.
     * 
     * @config
     */
    right: RtPercentSize;
    /**
     * {@link position}이 {@link LegendPosition.PLOT plot}일 때, plot 영역의 상단 모서리와 legend의 간격.
     * 
     * @config
     */
    top: RtPercentSize = 10;
    /**
     * {@link position}이 {@link LegendPosition.PLOT plot}일 때, plot 영역의 하단 모서리와 legend의 간격.
     * {@link top}이 지정되면 이 속성은 무시된다.
     * 
     * @config
     */
    bottom: RtPercentSize;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getLeft(doamin: number): number {
        return calcPercent(this._leftDim, doamin);
    }

    getRight(doamin: number): number {
        return calcPercent(this._rightDim, doamin);
    }

    getTop(doamin: number): number {
        return calcPercent(this._topDim, doamin);
    }

    getBottom(doamin: number): number {
        return calcPercent(this._bottomDim, doamin);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoad(source: any): void {
        super._doLoad(source);

        this._leftDim = parsePercentSize(this.left, true);
        this._rightDim = parsePercentSize(this.right, true);
        this._topDim = parsePercentSize(this.top, true);
        this._bottomDim = parsePercentSize(this.bottom, true);
    }

    protected _doPrepareRender(chart: IChart): void {
    }
}
