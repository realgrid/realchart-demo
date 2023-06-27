////////////////////////////////////////////////////////////////////////////////
// PathBuilder.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isNumber } from "./Common";
import { IPoint } from "./Point";

const _num = function (v: number): number {
    return isNaN(v) ? 0 : v;
}

export class PathBuilder {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _path: (string | number)[] = [];

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    clear(): PathBuilder {
        this._path = [];
        return this;
    }

    end(close = false): string {
        if (close) {
            this._path.push('Z');
        }
        
        const s = this._path.join(' ');

        this._path = [];
        return s;
    }

    move(x: number | IPoint, y?: number): PathBuilder {
        if (isNumber(x)) {
            this._path.push('M', _num(x), _num(y));
        } else {
            this._path.push('M', _num(x.x), _num(x.y));
        }
        return this;
    }

    moveBy(x: number | IPoint, y?: number): PathBuilder {
        if (isNumber(x)) {
            this._path.push('m', _num(x), _num(y));
        } else {
            this._path.push('m', _num(x.x), _num(x.y));
        }
        return this;
    }

    line(x: number | IPoint, y?: number): PathBuilder {
        if (isNumber(x)) {
            this._path.push('L', _num(x), _num(y));
        } else {
            this._path.push('L', _num(x.x), _num(x.y));
        }
        return this;
    }

    curve(cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number): PathBuilder {
        this._path.push('C', cx1, cy1, cx2, cy2, x, y);
        return this;
    }

    q(x1: number, y1: number, x2: number, y2: number): PathBuilder {
        this._path.push('Q', x1, y1, x2, y2);
        return this;
    }

    rect(x: number, y: number, width: number, height: number): PathBuilder {
        this._path.push('M', x, y, 'l', width, 0, 'l', 0, height, 'l', -width, 0);
        return this;
    }

    lines(...pts: (number | IPoint)[]): PathBuilder {
        if (isNumber(pts[0])) {
            for (let i = 0; i < pts.length; i += 2) {
                this._path.push('L', _num(pts[i] as any), _num(pts[i + 1] as any));
            }
        } else {
            for (let i = 0; i < pts.length; i++) {
                this._path.push('L', _num((pts[i] as any).x), _num((pts[i] as any).y));
            }
        }
        return this;
    }

    polygon(...pts: (number | IPoint)[]): PathBuilder {
        this.lines(...pts);
        this._path.push('Z');
        return this;
    }
}
