////////////////////////////////////////////////////////////////////////////////
// CircleBarSeries.ts
// 2023. 11. 23. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../../common/Common";
import { RcElement } from "../../common/RcControl";
import { RectElement } from "../../common/impl/RectElement";
import { IAxis } from "../Axis";
import { DataPoint } from "../DataPoint";
import { BasedSeries, ClusterableSeriesGroup, IClusterable, Series, SeriesGroupLayout } from "../Series";

/**
 * [y]
 * [x, y]
 */
export class CircleBarSeriesPoint extends DataPoint {
    
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

/**
 * @config chart.series[type=CircleBar]
 */
export class CircleBarSeries extends BasedSeries {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * true로 지정하면 포인트 CircleBar 별로 색을 다르게 표시한다.
     * 
     * @config
     */
    colorByPoint = false;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'circlebar';
    }

    canCategorized(): boolean {
        return true;
    }

    _colorByPoint(): boolean {
        return this.colorByPoint;
    }

    protected _createPoint(source: any): DataPoint {
        return new CircleBarSeriesPoint(source);
    }

    protected _getGroupBase(): number {
        return this.group ? (this.group as CircleBarSeriesGroup).baseValue: this.baseValue;
    }
}

/**
 * @config chart.series[type=circlebargroup]
 */
export class CircleBarSeriesGroup extends ClusterableSeriesGroup<CircleBarSeries> implements IClusterable {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * @config
     */
    baseValue = 0;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'circlebargroup';
    }

    _seriesType(): string {
        return 'circlebar';
    }

    protected _canContain(ser: Series): boolean {
        return ser instanceof CircleBarSeries;
    }

    canCategorized(): boolean {
        return true;
    }

    getBaseValue(axis: IAxis): number {
        return axis._isX ? NaN : pickNum(this.baseValue, axis.getBaseValue());
    }

    protected _doPrepareSeries(series: CircleBarSeries[]): void {
        if (this.layout === SeriesGroupLayout.DEFAULT) {
            const sum = series.length > 1 ? series.map(ser => ser.pointWidth).reduce((a, c) => a + c, 0) : series[0].pointWidth;
            let x = 0;
            
            series.forEach(ser => {
                ser._childWidth = ser.pointWidth / sum;
                ser._childPos = x;
                x += ser._childWidth;
            });
        } else if (this.layout === SeriesGroupLayout.STACK) {
        }
    }
}
