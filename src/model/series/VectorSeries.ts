////////////////////////////////////////////////////////////////////////////////
// VectorSeries.ts
// 2023. 08. 01. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp, pickProp3 } from "../../common/Common";
import { IPercentSize, RtPercentSize, SVGStyleOrClass, calcPercent, parsePercentSize } from "../../common/Types";
import { Utils } from "../../common/Utils";
import { DataPoint } from "../DataPoint";
import { BoxSeries } from "./BarSeries";

export class VectorSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    length: any;
    angle: any;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    lengthValue: number;
    angleValue: number;

    _u: number;
    _o: number; 

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _readArray(series: VectorSeries, v: any[]): void {
        const d = v.length > 3 ? 1 : 0;

        this.length = v[pickNum(series.lengthField, 0 + d)];
        this.angle = v[pickNum(series.angleField, 1 + d)];
        this.y = v[pickNum(series.yProp, 4 + d)];

        if (d > 0) {
            this.x = v[pickNum(series.xProp, 0)];
        } else {
            this.x = this.index;
        }
    }

    protected _readObject(series: VectorSeries, v: any): void {
        super._readObject(series, v);

        this.length = pickProp(v[series.lengthField], v.length);
        this.angle = pickProp(v[series.angleField], v.angle);
        this.y = pickProp3(v[series.yProp], v.y, v.value);
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);

        this.length = this.angle = this.y;
    }

    parse(series: VectorSeries): void {
        super.parse(series);

        this.lengthValue = +this.length;
        this.angleValue = +this.angle;
    }
}

export enum VectorOrigin {
    CENTER = 'center',
    START = 'start',
    END = 'end'
}

/**
 */
export class VectorSeries extends BoxSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    lengthField: string;
    angleField: string;
    origin = VectorOrigin.CENTER;
    maxLength = 20;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'vector';
    }

    protected _createPoint(source: any): DataPoint {
        return new VectorSeriesPoint(source);
    }

    protected _doLoad(src: any): void {
        super._doLoad(src);
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();
    }
}