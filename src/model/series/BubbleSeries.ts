////////////////////////////////////////////////////////////////////////////////
// BubbleSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, pickNum, pickProp } from "../../common/Common";
import { IPercentSize, RtPercentSize, SizeValue, calcPercent, parsePercentSize } from "../../common/Types";
import { Shape } from "../../common/impl/SvgShape";
import { IChart } from "../Chart";
import { DataPoint } from "../DataPoint";
import { Series, SeriesMarker } from "../Series";

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
    xPos: number;
    yPos: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    prepare(series: BubbleSeries): void {
        super.prepare(series);

        const v = this.value;

        if (isArray(v)) {
            this.z = v[pickNum(series.zField, 2)];
        } else if (isObject(v)) {
            this.z = pickProp(v[series.zField], v.z);
        } else {
            this.z = this.y;
        }

        this.zValue = +this.z;
    }
}

export class BubbleSeriesMarker extends SeriesMarker {
}

export enum BubbleSizeMode {

    WIDTH = 'width',
    AREA = 'area'
}

export class BubbleSeries extends Series {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    zField: string;
    sizeMode = BubbleSizeMode.AREA;
    minSize: RtPercentSize = 8;
    maxSize: RtPercentSize = '20%';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _minDim: IPercentSize;
    private _maxDim: IPercentSize;

    marker: BubbleSeriesMarker;
    _zMin: number;
    _zMax: number;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart, name);

        this.marker = new BubbleSeriesMarker(this);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getPxMinMax(len: number): {min: number, max: number} {
        return {
            min: calcPercent(this._minDim, len),
            max: calcPercent(this._maxDim, len)
        };
    }

    getRadius(value: number, pxMin: number, pxMax: number): number {
        let r = (value - this._zMin) / (this._zMax - this._zMin);

        if (this.sizeMode == BubbleSizeMode.AREA) {
            r = Math.sqrt(r);
        }
        r = Math.ceil(pxMin + r * (pxMax - pxMin)) / 2;

        return r;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    createPoint(source: any): DataPoint {
        return new BubbleSeriesPoint(source);
    }

    load(src: any): void {
        super.load(src);

        this._minDim = parsePercentSize(this.minSize, true);
        this._maxDim = parsePercentSize(this.maxSize, true);
    }

    protected _doPrepareRender(): void {
        this._zMin = Number.MAX_VALUE;
        this._zMax = Number.MIN_VALUE;

        this._visPoints.forEach((p: BubbleSeriesPoint) => {
            this._zMin = Math.min(this._zMin, p.zValue);
            this._zMax = Math.max(this._zMax, p.zValue);
        })
    }
}