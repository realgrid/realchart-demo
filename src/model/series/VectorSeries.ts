////////////////////////////////////////////////////////////////////////////////
// VectorSeries.ts
// 2023. 08. 01. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp, pickProp3 } from "../../common/Common";
import { IAxis } from "../Axis";
import { DataPoint } from "../DataPoint";
import { Series } from "../Series";

/**
 * [x, y, length, angle]
 */
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

    _len: number;
    _off: number; 

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _readArray(series: VectorSeries, v: any[]): void {
        const d = v.length > 3 ? 1 : 0;

        this.y = v[pickNum(series.yField, 0 + d)];
        this.length = v[pickNum(series.lengthField, 1 + d)];
        this.angle = v[pickNum(series.angleField, 2 + d)];

        if (d > 0) {
            this.x = v[pickNum(series.xField, 0)];
        } else {
            this.x = this.index;
        }
    }

    protected _readObject(series: VectorSeries, v: any): void {
        super._readObject(series, v);

        this.length = pickProp(v[series.lengthField], v.length);
        this.angle = pickProp(v[series.angleField], v.angle);
        this.y = pickProp3(v[series.yField], v.y, v.value);
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

export enum ArrowHead {
    NONE = 'none',
    CLOSE = 'close',
    OPEN = 'open',
}

/**
 */
export class VectorSeries extends Series {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    lengthField: string;
    angleField: string;
    origin = VectorOrigin.CENTER;
    maxLength = 20;
    startAngle = 0;
    arrowHead = ArrowHead.CLOSE;

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

    ignoreAxisBase(axis: IAxis): boolean {
        return true;
    }

    protected _createPoint(source: any): DataPoint {
        return new VectorSeriesPoint(source);
    }

    protected _doLoad(src: any): void {
        super._doLoad(src);
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        const pts = this._visPoints as VectorSeriesPoint[];

        if (pts.length > 0) {
            const len = this.maxLength;
            const org = this.origin;
            const max = pts.map(p => p.length).reduce((r, c) => Math.max(r, c));
    
            pts.forEach(p => {
                const f = p.length / max;
                
                p._len = f * len;
                switch (org) {
                    case VectorOrigin.START:
                        p._off =  p._len / 2;
                        break;
                    case VectorOrigin.END:
                        p._off = p._len / 2;
                        break;
                    default:
                        p._off = 0;
                        break;
                }
            });
        }
    }
}