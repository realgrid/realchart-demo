////////////////////////////////////////////////////////////////////////////////
// LineSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp } from "../../common/Common";
import { SVGStyleOrClass, StyleProps } from "../../common/Types";
import { Shape } from "../../common/impl/SvgShape";
import { IAxis } from "../Axis";
import { LineType } from "../ChartTypes";
import { DataPoint } from "../DataPoint";
import { MarkerVisibility, Series, SeriesGroup, SeriesMarker } from "../Series";

export class LineSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    radius: number;
    shape: Shape;
}

/**
 * chart.series[type=line|area|arearange].marker
 */
export class LineSeriesMarker extends SeriesMarker {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * @config
     */
    radius = 4;
    /**
     * 첫번째 point의 marker 표시 여부.
     * 
     * @config
     */
    firstVisible = MarkerVisibility.DEFAULT;
    /**
     * 첫번째 point의 marker 표시 여부.
     * 
     * @config
     */
    lastVisible = MarkerVisibility.DEFAULT;
    /**
     * 최소값 point들의 marker 표시 여부.
     * 
     * @config
     */
    minVisible = MarkerVisibility.DEFAULT;
    /**
     * 최대값 point들의 marker 표시 여부.
     * 
     * @config
     */
    maxVisible = MarkerVisibility.DEFAULT;
}

/**
 */
export abstract class LineSeriesBase extends Series {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    /**
     * @config
     */
    marker = new LineSeriesMarker(this);
    private _shape: Shape;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * null인 y값을 {@link baseValue}로 간주한다.
     * 
     * @config
     */
    nullAsBase = false;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getShape(p: LineSeriesPoint): Shape {
        return p.shape || this.marker.shape || this._shape;
    }

    getRadius(p: LineSeriesPoint): number {
        return pickNum(p.radius, this.marker.radius);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createPoint(source: any): DataPoint {
        return new LineSeriesPoint(source);
    }

    hasMarker(): boolean {
        return true;
    }

    /**
     * rendering 시점에 chart가 series별로 기본 shape를 지정한다.
     */
    setShape(shape: Shape): void {
        this._shape = shape;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    abstract getLineType(): LineType;
}

export enum LineStepDirection {
    FORWARD = 'forward',
    BACKWARD = 'backward'
}

/**
 * @config chart.series[type=line]
 */
export class LineSeries extends LineSeriesBase {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * @config
     */
    lineType = LineType.DEFAULT;
    /**
     * @config
     */
    stepDir = LineStepDirection.FORWARD;
    /**
     * true로 지정하면 y값이 지정되지 않은 null 포인터를 무시하고 다음 포인트에 연결한다.
     * false면 null 포인트에서 연결이 끊어진다.
     * 
     * @config
     */
    connectNullPoints = false; // TODO: 더 좋은 이름을 찾을 것! (HI: connectNulls, ignoreNulls, passthrouchNulls,...)
    /**
     * 위/아래 구분의 기준이 되는 값.
     * 
     * @config
     */
    baseValue = 0;
    /**
     * {@link baseValue} 혹은 y축의 baseValue보다 작은 쪽의 선들에 적용되는 스타일.
     * 
     * @config
     */
    belowStyle: SVGStyleOrClass;
    /**
     * {@link connectNullPoints}이 true일 때 null 포인트의 양끝 포인트를 연결하는 선에 적용되는 스타일.
     */
    nullStyle: SVGStyleOrClass;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'line';
        
    }
    getLineType(): LineType {
        return this.lineType;
    }
}

export class AreaSeriesPoint extends LineSeriesPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    yLow: number;
}

/**
 * @config chart.series[type=area]
 */
export class AreaSeries extends LineSeries {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _base: number;

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    areaStyle: StyleProps;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'area';
    }

    protected _createPoint(source: any): DataPoint {
        return new AreaSeriesPoint(source);
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        this._base = pickNum(this.baseValue, this._yAxisObj.getBaseValue());
    }

    getBaseValue(axis: IAxis): number {
        return axis._isX ? NaN : this._base;
    }
}

/**
 * [low, high(y)]
 * [x, low, high(y)]
 */
export class AreaRangeSeriesPoint extends AreaSeriesPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    low: any;
    high: any;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    lowValue: number;
    highValue: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    parse(series: AreaRangeSeries): void {
        super.parse(series);

        this.y = this.high = pickProp(this.high, this.low);
        this.lowValue = parseFloat(this.low);
        this.highValue = this.yValue = parseFloat(this.high);

        this.isNull ||= isNaN(this.lowValue);
    }

    protected _assignTo(proxy: any): any {
        return Object.assign(super._assignTo(proxy), {
            low: this.low,
            high: this.high,
            lowValue: this.lowValue,
            highValue: this.highValue
        });
    }

    protected _readArray(series: AreaRangeSeries, v: any[]): void {
        const d = v.length > 2 ? 1 : 0;

        this.low = v[pickNum(series.lowField, 0 + d)];
        this.high = v[pickNum(series.highField, 1 + d)];
        if (d > 0) {
            this.x = v[pickNum(series.xField, 0)];
        }
    }

    protected _readObject(series: AreaRangeSeries, v: any): void {
        super._readObject(series, v);

        this.low = pickProp(v[series.lowField], v.low);
        this.high = pickProp(v[series.lowField], v.high);
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);

        this.low = this.y;
    }
}

/**
 * @config chart.series[type=arearange]
 */
export class AreaRangeSeries extends LineSeriesBase {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    lowField: string;
    highField: string;
    areaStyle: StyleProps;
    /**
     * true면 spline 곡선으로 표시한다.
     * <br>
     * 
     * @default false
     */
    curved = false;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'arearange';
    }

    protected _createPoint(source: any): DataPoint {
        return new AreaRangeSeriesPoint(source);
    }

    getLineType(): LineType {
        return this.curved ? LineType.SPLINE : LineType.DEFAULT;
    }

    collectValues(axis: IAxis, vals: number[]): void {
        super.collectValues(axis, vals);

        if (vals && axis === this._yAxisObj) {
            this._runPoints.forEach((p: AreaRangeSeriesPoint) => !p.isNull && vals.push(p.lowValue));
        }
    }
}

/**
 * @config chart.series[type=linegroup]
 */
export class LineSeriesGroup extends SeriesGroup<LineSeries> {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    baseValue = 0;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _seriesType(): string {
        return 'line';
    }

    protected _canContain(ser: Series): boolean {
        return ser instanceof LineSeries;
    }

    getBaseValue(axis: IAxis): number {
        return axis === this._yAxisObj ? pickNum(this.baseValue, axis.getBaseValue()) : NaN;
    }
}

/**
 * @config chart.series[type=areagroup]
 */
export class AreaSeriesGroup extends SeriesGroup<AreaSeries> {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    baseValue = 0;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _seriesType(): string {
        return 'area';
    }

    protected _canContain(ser: Series): boolean {
        return ser instanceof AreaSeries;
    }

    getBaseValue(axis: IAxis): number {
        return axis === this._yAxisObj ? pickNum(this.baseValue, axis.getBaseValue()) : NaN;
    }
}