////////////////////////////////////////////////////////////////////////////////
// VectorSeries.ts
// 2023. 08. 01. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp, pickProp3, assign, maxv } from "../../common/Common";
import { PathElement, RcElement } from "../../common/RcControl";
import { DataPoint } from "../DataPoint";
import { Series } from "../Series";

/**
 * [y, length, angle]
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
    protected _assignTo(proxy: any): any {
        return assign(super._assignTo(proxy), {
            length: this.length,
            angle: this.angle,
            lengthValue: this.lengthValue,
            angleValue: this.angleValue
        });
    }

    protected _readArray(series: VectorSeries, v: any[]): void {
        const d = v.length > 3 ? 1 : 0;

        this.y = v[pickNum(series.yField, 0 + d)];
        this.length = v[pickNum(series.lengthField, 1 + d)];
        this.angle = v[pickNum(series.angleField, 2 + d)];
        if (d > 0) {
            this.x = v[pickNum(series.xField, 0)];
        }
    }

    protected _readObject(series: VectorSeries, v: any): void {
        super._readObject(series, v);

        this.length = pickProp(v[series.lengthField], v.length);
        this.angle = pickProp(v[series.angleField], v.angle);
        this.y = pickProp3(series._yFielder(v), v.y, v.value);
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);

        this.length = this.angle = this.y;
    }

    parse(series: VectorSeries): void {
        super.parse(series);

        this.lengthValue = parseFloat(this.length);
        this.angleValue = parseFloat(this.angle);

        this.isNull ||= isNaN(this.lengthValue) || isNaN(this.angleValue);
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
 * 
 * @config chart.series[type=vector]
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
    _type(): string {
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

        const pts = this._runPoints as VectorSeriesPoint[];

        if (pts.length > 0) {
            const len = this.maxLength;
            const org = this.origin;
            const max = pts.map(p => p.length).reduce((r, c) => maxv(r, c));
    
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

    protected _createLegendMarker(doc: Document, size: number): RcElement {
        const w = 2 / 10;
        const h = 3 / 10;
        const body = 0.6;//1 / 2;
        const off = size * 0.7;
        const pts = [
            0, -h * size,
            -w * size, -h * size,
            0, -body * size,
            w * size, -h * size,
            0, -h * size,
            0, body * size
        ];
        const path = ['M', pts[0], pts[1] + off];
        for (let i = 2; i < pts.length; i += 2) {
            path.push('L', pts[i], pts[i + 1] + off);
        }
        const elt = new PathElement(doc, Series.LEGEND_MARKER, path);
        elt.setStyle('strokeWidth', '2px');
        elt.rotation = 30;
        return elt;
    }
}