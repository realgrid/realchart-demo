////////////////////////////////////////////////////////////////////////////////
// SeriesNavigator.ts
// 2023. 10. 18. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Axis } from "./Axis";
import { IChart } from "./Chart";
import { ChartItem } from "./ChartItem";
import { Series } from "./Series";

export class NavigiatorHandle extends ChartItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

export class NavigatorMask extends ChartItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
}

const SERIES = {
};

const X_AXIS = {
}

const Y_AXIS = {
}

/**
 * 시리즈 내비게이터 모델.\
 * 
 * 1. 기본적으로 'area' 시리즈로 표시한다.
 * 2. 'line', 'area', 'bar' 시리즈나 원본 시리즈 타입으로 표시할 수 있다.
 */
export class SeriesNavigator extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _thickness = 45;
    private _gap = 8;
    private _gapFar = 3;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _source: Series;
    private _series: Series;
    private _xAxis: Axis;
    private _yAxis: Axis;

    _vertical: boolean;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart, false);

        this.handle = new NavigiatorHandle(chart);
        this.mask = new NavigatorMask(chart);
        this.borderLine = new ChartItem(chart);
    }
    
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * Navigator 시리즈의 data나 축 범위를 제공하는 본 시리즈의 이름이나 index.
     */
    source: string;
    handle: NavigiatorHandle;
    mask: NavigatorMask;
    borderLine: ChartItem;
    /**
     * 네비게이터 두께.
     */
    get thickness(): number {
        return this._thickness;
    }
    set thickness(value: number) {
        this._thickness = +value || this._thickness;
    }
    /**
     * 네비게이터와 차트 본체 방향 사이의 간격.
     */
    get gap(): number {
        return this._gap;
    }
    set gap(value: number) {
        this._gap = +value || this._gap;
    }
    /**
     * 네비게이터와 차트 본체 반대 방향 사이의 간격.
     */
    get gapFar(): number {
        return this._gapFar;
    }
    set gapFar(value: number) {
        this._gapFar = +value || this._gapFar;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isVisible(): boolean {
        return this.visible;
    }

    axis(): Axis {
        return this._source._xAxisObj as Axis;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoadProp(prop: string, value: any): boolean {
        return false;
    }

    protected _doPrepareRender(chart: IChart): void {
        this._source = chart._getSeries().getSeries(this.source) || chart.firstSeries;

        this._vertical = false;
    }
}
