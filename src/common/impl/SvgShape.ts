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
    LINE = 'line',
    LINES = 'lines',
    CIRCLE = 'circle',
    DIAMOND = 'diamond',
    RECTANGLE = 'rectangle',
    SQUARE = 'square',
    TRIANGLE = 'triangle',
    ITRIANGLE = 'itriangle',
}

export const Shapes = Utils.getEnumValues(Shape);

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
        return this.arc(cx, cy, rd, rd, 0, Math.PI * 2, false);
    }

    static arc(x: number, y: number, rx: number, ry: number, start: number, end: number, open?: boolean): SizeValue[] {
        const proximity = 0.001;
        const fullCircle = Math.abs(end - start - 2 * Math.PI) < proximity;
        end = end - proximity;
        open = Utils.pick(open, fullCircle);
        const cosStart = Math.cos(start);
        const sinStart = Math.sin(start);
        const cosEnd = Math.cos(end);
        const sinEnd = Math.sin(end);
        const longArc = end - start - Math.PI < proximity ? 0 : 1;
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
            y + ry * sinEnd
        );
        if (!open) {
            path.push('Z');
        }
        return path;
    }

    // FROM HI
    static sector(x: number, y: number, rx: number, ry: number, innerRadius: number, start: number, end: number, clockwise: boolean): SizeValue[] {
        const proximity = 0.001;
        const fullCircle = Math.abs(end - start - 2 * Math.PI) < proximity;
        end = end - proximity;
        const cosStart = Math.cos(start);
        const sinStart = Math.sin(start);
        const cosEnd = Math.cos(end);
        const sinEnd = Math.sin(end);
        const cw = clockwise ? 1 : 0;
        const longArc = end - start - Math.PI < proximity ? 0 : 1;
        const innerX = rx * innerRadius;
        const innerY = ry * innerRadius;
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
            cw,
            x + rx * cosEnd,
            y + ry * sinEnd
        );

        if (fullCircle) {
            path.push(
                'M',
                x + innerX * cosEnd,
                y + innerY * sinEnd
            )
        } else {
            path.push(
                'L',
                x + innerX * cosEnd,
                y + innerY * sinEnd
            )
        }
        path.push(
            'A',
            innerX,
            innerY,
            0,
            longArc,
            // 바깥쪽 원호와 반대 방향으로...
            1 - cw,
            x + innerX * cosStart,
            y + innerY * sinStart
        );

        if (!fullCircle) {
            path.push('Z');
        }
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
}
