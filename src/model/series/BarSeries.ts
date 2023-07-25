////////////////////////////////////////////////////////////////////////////////
// BarSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { DataPoint } from "../DataPoint";
import { IClusterable, PolarableSeries, Series, SeriesGroup, SeriesGroupLayout } from "../Series";

export abstract class BoxSeries extends PolarableSeries implements IClusterable {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _clusterWidth = 1;
    _clusterPos = 0;
    _childWidth = 1;    // group내에서 이 시리즈의 상대적 너비
    _childPos = 0;      // group내에서 이 시리즈의 상대적 위치

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 시리즈가 group에 포함되지 않은 경우 기본 group에 포함되는 데,
     * 그 그룹이 축 단위 너비에서 차지하는 상대적 너비.
     */
    groupWidth = 1;
    /**
     * 시리즈가 group에 포함되지 않은 경우 기본 group에 포함되는 데,
     * 그 그룹의 너비에서 포인트들이 표시되기 전후의 상대적 여백 크기.
     */
    groupPadding = 0.2;
    /**
     * point bar가 시리즈가 속한 group 내에서 차지하는 영역의 상대 크기.
     * <br>
     * group내에 속한 모든 시리즈의 값을 합한 것에 대한 상대 크기로,
     * 이 시리즈 포인트가 차지할 영역의 크기가 정해진다.
     * group의 layout이 {@link SeriesGroupLayout.DEFAULT}인 경우에만 의미가 있다.
     */
    pointWidth = 1;
    /**
     * point bar 양쪽 끝에 채워지는 빈 영역의 크기.
     * <br>
     * point가 차지할 원래 크기에 대한 상대 값으로서,
     * 0 ~ 1 사이의 비율 값으로 지정한다.
     */
    pointPadding = 0.1;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getPointWidth(length: number): number {
        let w = length;
        
        w *= this._clusterWidth;           
        w *= 1 - this.groupPadding * 2;  
        w *= this._childWidth;                  // 그룹 내 시리즈 영역
        w *= 1 - this.pointPadding * 2;         // 시리즈 padding
        return w;
    }

    getPointPos(length: number): number {
        let p = 0;

        p = length * this._clusterPos;
        length *= this._clusterWidth;
        p += length * this.groupPadding;
        length *= 1 - this.groupPadding * 2;

        p += length * this._childPos;
        length *= this._childWidth;
        p += length * this.pointPadding;
        return p;
    }

    //-------------------------------------------------------------------------
    // overriden mebers
    //-------------------------------------------------------------------------
    clusterable(): boolean {
        return true;
    }

    setCluster(width: number, pos: number): void {
        this._clusterWidth = width;
        this._clusterPos = pos;
    }
}

export class BarSeriesPoint extends DataPoint {
    
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    borderRaidus: number;
}

export class BarSeries extends BoxSeries {

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
    canCategorized(): boolean {
        return true;
    }

    protected _createPoint(source: any): DataPoint {
        return new BarSeriesPoint(source);
    }
}

export class BarSeriesGroup extends SeriesGroup<BarSeries> implements IClusterable {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _clusterWidth = 1;
    _clusterPos = 0;
    
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 축 단위 너비에서 이 그룹이 차지하는 상대적 너비.
     */
    groupWidth = 1;
    /**
     * 이 그룹의 너비에서 포인트들이 표시되기 전후의 상대적 여백 크기.
     */
    groupPadding = 0.2;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _seriesType(): string {
        return 'bar';
    }

    protected _canContain(ser: Series): boolean {
        return ser instanceof BarSeries;
    }

    clusterable(): boolean {
        return true;
    }

    setCluster(width: number, pos: number): void {
        this._clusterWidth = width;
        this._clusterPos = pos;
    }

    protected _doPrepareSeries(series: BarSeries[]): void {
        if (this.layout === SeriesGroupLayout.DEFAULT) {
            const cnt = series.length;

            if (cnt > 1) {
                const sum = series.map(ser => ser.pointWidth).reduce((a, c) => a + c);
                let x = 0;
                
                series.forEach(ser => {
                    ser._childWidth = ser.pointWidth / sum;
                    ser._childPos = x;
                    x += ser._childWidth;
                });
            } else if (cnt === 1) {
                series[0]._childWidth = 1;
            }
        } else if (this.layout === SeriesGroupLayout.STACK) {
        }
    }
}