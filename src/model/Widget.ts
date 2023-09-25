////////////////////////////////////////////////////////////////////////////////
// Widget.ts
// 2023. 09. 25. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../common/Common";
import { IChart } from "./Chart";
import { ChartItem } from "./ChartItem";

/**
 * Widget 모델.
 * Plot 영역에 표시된다.
 * 
 * @config chart.widget
 */
export abstract class Widget extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * {@link position}이 {@link LegendPosition.PLOT plot}일 때, plot 영역의 좌측 모서리와 legend의 간격.
     * 
     * @config
     */
    left = 10;
    /**
     * {@link position}이 {@link LegendPosition.PLOT plot}일 때, plot 영역의 우측 모서리와 legend의 간격.
     * {@link left}가 지정되면 이 속성은 무시된다.
     * 
     * @config
     */
    right: number;
    /**
     * {@link position}이 {@link LegendPosition.PLOT plot}일 때, plot 영역의 상단 모서리와 legend의 간격.
     * 
     * @config
     */
    top = 10;
    /**
     * {@link position}이 {@link LegendPosition.PLOT plot}일 때, plot 영역의 하단 모서리와 legend의 간격.
     * {@link top}이 지정되면 이 속성은 무시된다.
     * 
     * @config
     */
    bottom: number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    // TODO: to percentSize
    getLeft(doamin: number): number {
        return pickNum(this.left, NaN);
    }

    getRight(doamin: number): number {
        return pickNum(this.right, NaN);
    }

    getTop(doamin: number): number {
        return pickNum(this.top, NaN);
    }

    getBottom(doamin: number): number {
        return pickNum(this.bottom, NaN);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doPrepareRender(chart: IChart): void {
    }
}
