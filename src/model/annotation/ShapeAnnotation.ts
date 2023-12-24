////////////////////////////////////////////////////////////////////////////////
// ShapeAnnotation.ts
// 2023. 11. 16. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isArrayEx, isString } from "../../common/Common";
import { IPoint } from "../../common/Point";
import { ISize } from "../../common/Size";
import { Shape } from "../../common/impl/SvgShape";
import { SizableAnnotation } from "../Annotation";
import { Axis } from "../Axis";
import { IChart } from "../Chart";
import { ISeries, Series } from "../Series";

/**
 * Shape Annotation 모델.
 * 
 * @config chart.annotation[type=shape]
 */
export class ShapeAnnotation extends SizableAnnotation {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _series: ISeries;
    private _xRange: number[];
    private _yRange: number[];
    private _x: number;
    private _y: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart);

        this.width = this.height = 64;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    '@config width' = 64;
    '@config height' = 64;

    /**
     * Shape 종류.
     * 
     * @config 
     */
    shape: Shape = Shape.SQUARE;
    /**
     * Shape path.
     * 이 속성이 지정되면 {@link shape}는 무시된다.
     */
    path: string;
    series: string;
    xRange: number[];
    yRange: number[];

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getSeries(): { series: ISeries, xRange: number[], yRange: number[] } {
        if (this._xRange && this._yRange) {
            const series = this.chart.seriesByName(this.series);
            if (series && series.visible) {
                return { series, xRange: this._xRange, yRange: this._yRange }
            }
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'shape';
    }

    protected _doLoadSimple(source: any): boolean {
        if (isString(source)) {
            this.shape = source as any;
            return true;
        }
        return super._doLoadSimple(source);
    }

    protected _doLoad(source: any): void {
        super._doLoad(source);

        if (isArrayEx(source.xRange, 2) && !isNaN(+source.xRange[0]) && !isNaN(+source.xRange[1]) &&
            isArrayEx(source.yRange, 2) && !isNaN(+source.yRange[0]) && !isNaN(+source.yRange[1])) {
                this._xRange = [+source.xRange[0], +source.xRange[1]];
                this._yRange = [+source.yRange[0], +source.yRange[1]];
        }
    }

    getSize(wDomain: number, hDomain: number): ISize {
        const ser = this.getSeries();

        if (ser) {
            const series = this._series = ser.series as Series;
            const xAxis = series._xAxisObj;
            const yAxis = series._yAxisObj;
            const x1 = xAxis.getPos(wDomain, this._xRange[0]);
            const x2 = xAxis.getPos(wDomain, this._xRange[1]);
            const y1 = yAxis.getPos(hDomain, this._yRange[0]);
            const y2 = yAxis.getPos(hDomain, this._yRange[1]);

            this._x = Math.min(x1, x2);
            this._y = Math.max(y1, y2);
            return { width: Math.abs(x1 - x2), height: Math.abs(y1 - y2)};
        }
        return super.getSize(wDomain, hDomain);
    }

    getPosition(inverted: boolean, left: number, top: number, wDomain: number, hDomain: number, width: number, height: number): IPoint {
        const ser = this.getSeries();

        if (ser) {
            if (inverted) {
                return { x: wDomain - this._y, y: this._x };
            } else {
                return { x: this._x, y: hDomain - this._y };
            }
        } else {
            return super.getPosition(inverted, left, top, wDomain, hDomain, width, height);
        }
    }
}
