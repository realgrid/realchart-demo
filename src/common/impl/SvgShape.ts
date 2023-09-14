////////////////////////////////////////////////////////////////////////////////
// SvgShape.ts
// 2023. 06. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IRect } from '../Rectangle';
import { SizeValue } from '../Types';
import { Utils } from '../Utils';

export enum Shape {
    // LINE = 'line',
    // LINES = 'lines',
    CIRCLE = 'circle',
    DIAMOND = 'diamond',
    RECTANGLE = 'rectangle',
    SQUARE = 'square',
    TRIANGLE = 'triangle',
    ITRIANGLE = 'itriangle',
    STAR = 'star',
}

export const Shapes = Utils.getEnumValues(Shape);

const SECTOR_ERROR = 0.001;

export class SvgShapes {

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static line(x1: number, y1: number, x2: number, y2: number): SizeValue[] {
        return ['M', x1, y1, 'L', x2, y2];
    }

    static lines(pts: number[]): SizeValue[] {
        let i = 0;
        const vals = ['M', pts[i], pts[i + 1]];

        for (; i < pts.length; i++) {
            vals.push('L', pts[i++], pts[i]);
        } 
        vals.push('Z');
        return vals;
    }

    static box(x1: number, y1: number, x2: number, y2: number): SizeValue[] {
        return [
            'M', x1, y1,
            'L', x2, y1,
            'L', x2, y2,
            'L', x1, y2,
            'Z'
        ];
    }

    static rect(r: IRect): SizeValue[] {
        return this.rectangle(r.x, r.y ,r.width, r.height);
    }

    // 직사각형
    static rectangle(x: number, y: number, width: number, height: number): SizeValue[] {
        return [
            'M', x, y,
            'L', x + width, y,
            'L', x + width, y + height,
            'L', x, y + height,
            'Z'
        ];
    }

    // 정사각형
    static square(x: number, y: number, width: number, height: number): SizeValue[] {
        const sz = Math.min(width, height);

        x += (width - sz) / 2;
        y += (height - sz) / 2;
        
        return [
            'M', x, y,
            'L', x + sz, y,
            'L', x + sz, y + sz,
            'L', x, y + sz,
            'Z'
        ];
    }

    static circle(cx: number, cy: number, rd: number): SizeValue[] {
        return [
            'M',
            cx, cy,
            'm',
            rd, 0,
            'a',
            rd, rd, 0, 1, 1, -rd * 2, 0,
            'a',
            rd, rd, 0, 1, 1, rd * 2, 0
        ];
    }

    // TODO: 개선할 것!
    static arc(x: number, y: number, rx: number, ry: number, start: number, end: number): SizeValue[] {
        const cosStart = Math.cos(start);
        const sinStart = Math.sin(start);
        const cosEnd = Math.cos(end -= SECTOR_ERROR);
        const sinEnd = Math.sin(end);
        const longArc = end - start - Math.PI < SECTOR_ERROR ? 0 : 1;
        const clockwise = 1;
        const path = [];

        path.push(
            'M',
            x + rx * cosStart,
            y + ry * sinStart,

            'A',
            rx,
            ry,
            0,
            longArc,
            clockwise,
            x + rx * cosEnd,
            y + ry * sinEnd,
            'Z'
        );
        return path;
    }

    // TODO: 개선할 것!
    static sector(cx: number, cy: number, rx: number, ry: number, rInner: number, start: number, end: number, clockwise: boolean): SizeValue[] {
        const circled = Math.abs(end - start - 2 * Math.PI) < SECTOR_ERROR;
        const long = end - start - Math.PI < SECTOR_ERROR ? 0 : 1;
        const x1 = Math.cos(start);
        const y1 = Math.sin(start);
        const x2 = Math.cos(end -= circled ? SECTOR_ERROR : 0);
        const y2 = Math.sin(end);
        const cw = clockwise ? 1 : 0;
        const innerX = rx * rInner;
        const innerY = ry * rInner;
        const path = [];

        path.push(
            'M',
            cx + rx * x1,
            cy + ry * y1,
            'A',
            rx,
            ry,
            0,
            long,
            cw,
            cx + rx * x2,
            cy + ry * y2
        );

        if (circled) {
            path.push(
                'M',
                cx + innerX * x2,
                cy + innerY * y2
            )
        } else {
            path.push(
                'L',
                cx + innerX * x2,
                cy + innerY * y2
            )
        }
        path.push(
            'A',
            innerX,
            innerY,
            0,
            long,
            // 바깥쪽 원호와 반대 방향으로...
            1 - cw,
            cx + innerX * x1,
            cy + innerY * y1
        );

        path.push('Z');
        return path;
    }

    static diamond(x: number, y: number, w: number, h: number): SizeValue[] {
        return [
            'M', x + w / 2, y,
            'L', x + w, y + h / 2,
            'L', x + w / 2, y + h,
            'L', x, y + h / 2,
            'Z'
        ];
    }

    static triangle(x: number, y: number, w: number, h: number): SizeValue[] {
        return [
            'M', x + w / 2, y,
            'L', x + w, y + h,
            'L', x, y + h,
            'Z'
        ];
    }

    static itriangle(x: number, y: number, w: number, h: number): SizeValue[] {
        return [
            'M', x, y,
            'L', x + w, y,
            'L', x + w / 2, y + h,
            'Z'
        ];
    }

    static star(x: number, y: number, w: number, h: number): SizeValue[] {
        const cx = x + w / 2;
        const cy = y + h / 2;
        const rx = w / 2;
        const ry = h / 2;
        const rx2 = w / 4;
        const ry2 = h / 4;
        const a = Math.PI * 2 / 5;
        const a2 = a / 2;
        const path = [];
        let start = -Math.PI / 2

        path.push('M', cx + rx * Math.cos(start), cy + ry * Math.sin(start));
        for (let i = 0; i < 5; i++) {
            path.push('L', cx + rx * Math.cos(start), cy + ry * Math.sin(start));
            path.push('L', cx + rx2 * Math.cos(start + a2), cy + ry2 * Math.sin(start + a2));
            start += a;
        }
        path.push('Z');
        return path;
    }
}
