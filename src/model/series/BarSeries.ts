////////////////////////////////////////////////////////////////////////////////
// BarSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { DataPoint } from "../DataPoint";
import { IClusterable, PointItemPosition, PolarableSeries, Series, SeriesGroup, SeriesGroupLayout } from "../Series";

export abstract class BoxSeries extends PolarableSeries implements IClusterable {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _clusterWidth = 1;
    _clusterPos = 0;
    _childWidth = 1;    // group내에서 이 시리즈의 상대적 너비
    _childPos = 0;      // group내에서 이 시리즈의 상대적 위치

    _pointPad = 0;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 시리즈가 group에 포함되지 않은 경우, 축 단위 너비에서 이 시리즈가 차지하는 상대적 너비.
     * <br>
     * 그룹에 포함되면 이 속성은 무시된다.
     */
    groupWidth = 1; // _clusterWidth 계산에 사용된다. TODO: clusterWidth로 변경해야 하나?
    // /**
    //  * 시리즈가 group에 포함되지 않은 경우 자동 생성되는 기본 group에 포함되는 데,
    //  * 그 그룹의 너비에서 포인트들이 표시되기 전후의 상대적 여백 크기.
    //  * <br>
    //  * 명시적으로 설정된 그룹에 포함되면 이 속성은 무시된다.
    //  */
    // groupPadding = 0.2;
    /**
     * 시리즈가 포함된 그룹의 layout이 {@link SeriesGroupLayout.DEFAULT}이거나 특별히 설정되지 않아서,
     * 그룹에 포함된 시리즈들의 data point가 옆으로 나열되어 표시될 때,
     * 포인트 표시 영역 내에서 이 시리즈의 포인트가 차지하는 영역의 상대 크기.
     * <br>
     * 예를 들어 이 시리즈의 속성값이 1이고 다른 시리즈의 값이 2이면 다른 시리즈의 data point가 두 배 두껍게 표시된다.
     */
    pointWidth = 1;
    /**
     * 이 시리즈의 point가 차지하는 영역 중에서 point bar 양쪽 끝에 채워지는 빈 영역의 크기.
     * <br>
     * point가 차지할 원래 크기에 대한 상대 값으로서,
     * 0 ~ 1 사이의 비율 값으로 지정한다.
     * 
     * @default 한 카테고리에 시리즈 하나만 표시되면 0.25, group에 포함된 경우 0.1, 여러 시리즈와 같이 표시되면 0.2.
     */
    pointPadding: number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getPointWidth(length: number): number {
        const g = this.group as BarSeriesGroup;
        let w = length;
        
        if (g) {
            w *= g._clusterWidth;
            w *= 1 - g.groupPadding * 2;  
            w *= this._childWidth;      // 그룹 내 시리즈 영역
        } else {
            w *= this._clusterWidth;           
        }
        w *= 1 - this._pointPad * 2;    // 시리즈 padding
        return w;
    }

    getPointPos(length: number): number {
        const g = this.group as BarSeriesGroup;
        let w = length;
        let p = 0;

        if (g) {
            p = w * g._clusterPos;
            w *= g._clusterWidth;

            p += w * g.groupPadding;
            w -= w * g.groupPadding * 2;

            p += w * this._childPos;
            w *= this._childWidth;
        } else {
            p = w * this._clusterPos;
            w *= this._clusterWidth;
        }
        p += w * this._pointPad;
        return p;
    }

    getLabelPosition(): PointItemPosition {
        const p = this.pointLabel.position;
        return p === PointItemPosition.AUTO ? PointItemPosition.OUTSIDE_FIRST : p;
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

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        this._pointPad = isNaN(this.pointPadding) ? (this._single ? 0.25 : this.group ? 0.1 : 0.2) : this.pointPadding;
 }
}

export class BarSeriesPoint extends DataPoint {
    
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    // borderRaidus: number;
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

export class ColumnSeriesGroup extends SeriesGroup<ColumnSeries> implements IClusterable {

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
    groupPadding = 0.1;

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
