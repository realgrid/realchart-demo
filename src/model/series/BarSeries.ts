////////////////////////////////////////////////////////////////////////////////
// BarSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { DataPoint } from "../DataPoint";
import { PolarableSeries, Series } from "../Series";

export abstract class BoxSeries extends PolarableSeries {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _groupWidth = 1;    // group내에서 이 시리즈의 상대적 너비
    _groupPos = 0;      // group내에서 이 시리즈의 상대적 위치

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
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

export class ColumnSeries extends BoxSeries {

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

export class BarSeries extends ColumnSeries {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    isInverted(): boolean {
        return true;
    }
}