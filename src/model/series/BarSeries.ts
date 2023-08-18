////////////////////////////////////////////////////////////////////////////////
// BarSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { DataPoint } from "../DataPoint";
import { ClusterableSeries, ClustrableSeriesGroup, IClusterable, Series, SeriesGroup, SeriesGroupLayout } from "../Series";

export class BarSeriesPoint extends DataPoint {
    
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    // borderRaidus: number;
}

export class ColumnSeries extends ClusterableSeries {

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
