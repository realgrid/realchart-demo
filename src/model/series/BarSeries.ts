////////////////////////////////////////////////////////////////////////////////
// BarSeries.ts
// 2023. 06. 20. created by woori
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
export class BarSeriesPoint extends DataPoint {
    
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    // borderRaidus: number;
}

export abstract class BarSeriesBase extends BasedSeries {

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
     * true로 지정하면 포인트 bar 별로 색을 다르게 표시한다.
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
    canCategorized(): boolean {
        return true;
    }

    _colorByPoint(): boolean {
        return this.colorByPoint;
    }

    protected _createPoint(source: any): DataPoint {
        return new BarSeriesPoint(source);
    }

    protected _getGroupBase(): number {
        return this.group ? (this.group as BarSeriesGroupBase<any>).baseValue: this.baseValue;
    }
}

/**
 * @config chart.series[type=bar]
 */
export class BarSeries extends BarSeriesBase {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 지정한 반지름 크기로 데이터포인트 bar의 위쪽 모서리를 둥글게 표시한다.\
     * 최대값이 bar 폭으로 절반으로 제한되므로 아주 큰 값을 지정하면 반원으로 표시된다.
     * 
     * @config
     */
    topRadius: number;
    /**
     * 지정한 반지름 크기로 데이터포인트 bar의 아래쪽 모서리를 둥글게 표시한다.
     * 최대값이 bar 폭으로 절반으로 제한되므로 아주 큰 값을 지정하면 반원으로 표시된다.
     * 
     * @config
     */
    bottomRadius: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'bar';
    }

    protected _createLegendMarker(doc: Document, size: number): RcElement {
        return RectElement.create(doc, Series.LEGEND_MARKER, 0, 0, size, size, 2);
    }
}

export abstract class BarSeriesGroupBase<T extends BarSeriesBase> extends ClusterableSeriesGroup<T> implements IClusterable {

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
    canCategorized(): boolean {
        return true;
    }

    getBaseValue(axis: IAxis): number {
        return axis._isX ? NaN : pickNum(this.baseValue, axis.getBaseValue());
    }

    protected _doPrepareSeries(series: T[]): void {
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

/**
 * @config chart.series[type=bargroup]
 */
export class BarSeriesGroup extends BarSeriesGroupBase<BarSeries> {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'bargroup';
    }

    _seriesType(): string {
        return 'bar';
    }

    protected _canContain(ser: Series): boolean {
        return ser instanceof BarSeries;
    }
}