////////////////////////////////////////////////////////////////////////////////
// BubbleSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp } from "../../common/Common";
import { IPercentSize, RtPercentSize, calcPercent, parsePercentSize } from "../../common/Types";
import { Shape } from "../../common/impl/SvgShape";
import { IAxis } from "../Axis";
import { IChart } from "../Chart";
import { DataPoint } from "../DataPoint";
import { Series, SeriesMarker } from "../Series";

/**
 * [y, z]
 * [x, y, z]
 */
export class BubbleSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    z: any;
    radius: number;
    shape: Shape;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    zValue: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    getLabel(index: number) {
        return this.z;
    }

    parse(series: BubbleSeries): void {
        super.parse(series);

        this.zValue = parseFloat(this.z);
    }

    protected _assignTo(proxy: any): any {
        return Object.assign(super._assignTo(proxy), {
            z: this.z,
            zValue: this.zValue
        });
    }

    protected _readArray(series: BubbleSeries, v: any[]): void {
        if (v === null) {
            this.isNull = true;
        } else {
            const d = v.length > 2 ? 1 : 0;

            this.y = v[pickNum(series.yField, 0 + d)];
            this.z = v[pickNum(series.zProp, 1 + d)];
            if (d > 0) {
                this.x = v[pickNum(series.xField, 0)];
            }
        }
    }

    protected _readObject(series: BubbleSeries, v: any): void {
        super._readObject(series, v);

        if (!this.isNull) {
            this.z = pickProp(v[series.zProp], v.z);
        }
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);

        this.z = this.y;
    }
}

export enum BubbleSizeMode {

    WIDTH = 'width',
    AREA = 'area'
}

/**
 * @config chart.series[type=bubble]
 */
export class BubbleSeries extends Series {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    zProp: string;
    sizeMode = BubbleSizeMode.AREA;
    minSize: RtPercentSize = 8;
    maxSize: RtPercentSize = '20%';
    colorByPoint = false;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _minDim: IPercentSize;
    private _maxDim: IPercentSize;

    _zMin: number;
    _zMax: number;
    _noSize: boolean;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart, name);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 명시적으로 지정하지 않으면 typeIndex에 따라 Shapes 중 하나로 돌아가면서 설정된다.
     * 
     * @config
     */
    shape: Shape;
    /**
     * {@link shape}의 반지름.
     * 
     * @config
     */
    radius = 3;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getPixelMinMax(len: number): {min: number, max: number} {
        return {
            min: calcPercent(this._minDim, len),
            max: calcPercent(this._maxDim, len)
        };
    }

    getRadius(value: number, pxMin: number, pxMax: number): number {
        let r = this._noSize ? 1 : (value - this._zMin) / (this._zMax - this._zMin);

        if (this.sizeMode == BubbleSizeMode.AREA) {
            r = Math.sqrt(r);
        }
        r = Math.ceil(pxMin + r * (pxMax - pxMin)) / 2;

        return r;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'bubble';
    }

    ignoreAxisBase(axis: IAxis): boolean {
        return true;
    }

    protected _createPoint(source: any): DataPoint {
        return new BubbleSeriesPoint(source);
    }

    _colorByPoint(): boolean {
        return this.colorByPoint;
    }

    load(src: any): BubbleSeries {
        super.load(src);

        this._minDim = parsePercentSize(this.minSize, true);
        this._maxDim = parsePercentSize(this.maxSize, true);
        return this;
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        this._zMin = Number.MAX_VALUE;
        this._zMax = Number.MIN_VALUE;

        this._runPoints.forEach((p: BubbleSeriesPoint) => {
            if (!p.isNull && !isNaN(p.zValue)) {
                this._zMin = Math.min(this._zMin, p.zValue);
                this._zMax = Math.max(this._zMax, p.zValue);
            }
        })
        this._noSize = this._zMin === this._zMax;
    }
}