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
    _groupWidth = 1;    // group내에서 이 시리즈의 상대적 너비
    _groupPos = 0;      // group내에서 이 시리즈의 상대적 위치

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    clusterWidth = 1;
    clusterPadding = 0.2;

    /**
     * CategoryAxis가 weight 값 목록을 가져올 data point 속성 이름.
     */
    weightProp: string;

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
        
        w *= this._group._groupWidth;           // 그룹 영역
        w *= 1 - this._group.groupPadding * 2;  // 그룹 padding
        w *= this._groupWidth;                  // 그룹 내 시리즈 영역
        w *= 1 - this.pointPadding * 2;         // 시리즈 padding
        return w;
    }

    getPointPos(length: number): number {
        let p = length * this._group._groupPos;

        length *= this._group._groupWidth;
        p += length * this._group.groupPadding;
        length *= 1 - this._group.groupPadding * 2;

        p += length * this._groupPos;
        length *= this._groupWidth;
        p += length * this.pointPadding;
        return p;
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
    isCategorized(): boolean {
        return true;
    }

    protected _createPoint(source: any): DataPoint {
        return new BarSeriesPoint(source);
    }
}

export class BarSeriesGroup extends SeriesGroup implements IClusterable {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _clusterWidth = 1;
    _clusterPos = 0;
    
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    clusterWidth = 1;
    clusterPadding = 0.2;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _seriesType(): string {
        return 'bar';
    }

    protected _canContain(ser: Series): boolean {
        return ser instanceof BarSeries;
    }

    protected _doPrepareSeries(series: Series[]): void {
        if (this.layout === SeriesGroupLayout.DEFAULT) {
            const series2 = series.filter(ser => ser instanceof BoxSeries) as BoxSeries[];
            
            const cnt = series2.length;

            if (cnt > 1) {
                const sum = series2.map(ser => ser.pointWidth).reduce((a, c) => a + c);
                let x = 0;
                
                series2.forEach(ser => {
                    ser._groupWidth = ser.pointWidth / sum;
                    ser._groupPos = x;
                    x += ser._groupWidth;
                });
            } else if (cnt === 1) {
                series2[0]._groupWidth = 1;
            }
        } else if (this.layout === SeriesGroupLayout.STACK) {
        }
    }
}