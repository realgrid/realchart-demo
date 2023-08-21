////////////////////////////////////////////////////////////////////////////////
// BarSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../../common/Common";
import { IAxis } from "../Axis";
import { DataPoint } from "../DataPoint";
import { BasedSeries, ClusterableSeries, ClustrableSeriesGroup, IClusterable, Series, SeriesGroup, SeriesGroupLayout } from "../Series";

export class BarSeriesPoint extends DataPoint {
    
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    // borderRaidus: number;
}

export class ColumnSeries extends BasedSeries {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    borderRaidus = 0;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'column';
    }

    canCategorized(): boolean {
        return true;
    }

    protected _createPoint(source: any): DataPoint {
        return new BarSeriesPoint(source);
    }

    protected _getGroupBase(): number {
        return this.group ? (this.group as ColumnSeriesGroup).baseValue: this.baseValue;
    }
}

export class BarSeries extends ColumnSeries {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'bar';
    }

    inverted(): boolean {
        return true;
    }
}

export class ColumnSeriesGroup extends ClustrableSeriesGroup<ColumnSeries> implements IClusterable {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    baseValue = 0;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _seriesType(): string {
        return 'column';
    }

    protected _canContain(ser: Series): boolean {
        return ser instanceof ColumnSeries;
    }

    clusterable(): boolean {
        return true;
    }

    setCluster(width: number, pos: number): void {
        this._clusterWidth = width;
        this._clusterPos = pos;
    }

    getBaseValue(axis: IAxis): number {
        return pickNum(this.baseValue, axis.getBaseValue());
    }

    protected _doPrepareSeries(series: ColumnSeries[]): void {
        if (this.layout === SeriesGroupLayout.DEFAULT) {
            const sum = series.length > 1 ? series.map(ser => ser.pointWidth).reduce((a, c) => a + c) : series[0].pointWidth;
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

export class BarSeriesGroup extends ColumnSeriesGroup {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _seriesType(): string {
        return 'bar';
    }
}
