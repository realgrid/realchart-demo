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

export interface IPoint2 {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export class PathBuilder {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _path: (string | number)[] = [];

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    length(): number {
        return this._path.length;
    }

    isEmpty(): boolean {
        return this._path.length === 0;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    clear(): PathBuilder {
        this._path = [];
        return this;
    }

    end(close = false): string {
        close && this._path.push('Z');
        return this._path.join(' ');
    }

    close(clear: boolean): string {
        const s = this.end(true);
        clear && this.clear();
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

    quad(x1: number | IPoint2, y1?: number, x2?: number, y2?: number): PathBuilder {
        if (isNumber(x1)) {
            this._path.push('Q', x1, y1, x2, y2);
        } else {
            this._path.push('Q', x1.x1, x1.y1, x1.x2, x1.y2);
        }
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

    getMove(p = 0, remove = true): IPoint {
        if (p < this._path.length && this._path[p] === 'M') {
            const pt = {x: this._path[p + 1] as number, y: this._path[p + 2] as number};
            remove && this._path.splice(p, 3);
            return pt;
        }
    }

    getLine(p = 0, remove = true): IPoint {
        if (p < this._path.length && this._path[p] === 'L') {
            const pt = {x: this._path[p + 1] as number, y: this._path[p + 2] as number};
            remove && this._path.splice(p, 3);
            return pt;
        }
    }

    getQuad(p = 0, remove = true): IPoint2 {
        if (p < this._path.length && this._path[p] === 'Q') {
            const pt = {
                x1: this._path[p + 1] as number, 
                y1: this._path[p + 2] as number,
                x2: this._path[p + 3] as number, 
                y2: this._path[p + 4] as number,
            };
            remove && this._path.splice(p, 5);
            return pt;
        }
    }

    getPoints(p: number, count: number, remove = true): IPoint[] {
        const pts: IPoint[] = [];

        while (p < this._path.length && pts.length < count) {
            if (p < this._path.length && (this._path[p] === 'M' || this._path[p] === 'L')) {
                pts.push({x: this._path[p + 1] as number, y: this._path[p + 2] as number});
                remove && this._path.splice(p, 3);
            } else {
                break;
            }
        }
        return pts;
    }
}
