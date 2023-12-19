////////////////////////////////////////////////////////////////////////////////
// SvgShape.ts
// 2023. 06. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { cos, sin } from '../Common';
import { PathElement } from '../RcControl';
import { IRect } from '../Rectangle';
import { PathValue, fixAngle } from '../Types';
import { Utils } from '../Utils';

export enum Shape {
    CIRCLE = 'circle',
    DIAMOND = 'diamond',
    SQUARE = 'square',
    TRIANGLE = 'triangle',
    STAR = 'star',
    ITRIANGLE = 'itriangle',
    RECTANGLE = 'rectangle'
}

export const Shapes = Utils.getEnumValues(Shape);

const SECTOR_ERROR = 0.001;
const PI = Math.PI;

export class SvgShapes {

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static line(x1: number, y1: number, x2: number, y2: number): PathValue[] {
        return ['M', x1, y1, 'L', x2, y2];
    }

    static lines(...pts: number[]): PathValue[] {
        let i = 0;
        const vals = ['M', pts[i], pts[i + 1]];

        for (; i < pts.length; i += 2) {
            vals.push('L', pts[i], pts[i + 1]);
        } 
        vals.push('Z');
        return vals;
    }

    static box(x1: number, y1: number, x2: number, y2: number): PathValue[] {
        return [
            'M', x1, y1,
            'L', x2, y1,
            'L', x2, y2,
            'L', x1, y2,
            'Z'
        ];
    }

    static rect(r: IRect): PathValue[] {
        return this.rectangle(r.x, r.y ,r.width, r.height);
    }

    // 직사각형
    static rectangle(x: number, y: number, width: number, height: number): PathValue[] {
        return [
            'M', x, y,
            'h', width,
            'v', height,
            'h', -width,
            'Z'
        ];
    }

    // rounded bar - height가 0보다 작다. 즉, 아래서 위로 그린다.
    static bar(x: number, y: number, width: number, height: number, rTop: number, rBottom: number): PathValue[] {
        if (rTop > 0) {
            if (rBottom > 0) {
                rTop = Math.min(-height / 2, width / 2, rTop);
                rBottom = Math.min(-height / 2, width / 2, rBottom);
                return [
                    'M', x, y - rBottom,
                    'v', height + rBottom + rTop,
                    'a', rTop, rTop, 0, 0, 1, rTop, -rTop,
                    'h', width - rTop * 2,
                    'a', rTop, rTop, 0, 0, 1, rTop, rTop,
                    'v', -height - rTop - rBottom,
                    'a', rBottom, rBottom, 0, 0, 1, -rBottom, rBottom,
                    'h', -width + rBottom * 2,
                    'a', rBottom, rBottom, 0, 0, 1, -rBottom, -rBottom,
                    'Z'
                ];
            } else {
                rTop = Math.min(-height / 2, width / 2, rTop);
                return [
                    'M', x, y,
                    'v', height + rTop,
                    'a', rTop, rTop, 0, 0, 1, rTop, -rTop,
                    'h', width - rTop * 2,
                    'a', rTop, rTop, 0, 0, 1, rTop, rTop,
                    'v', -height - rTop,
                    'Z'
                ];
            }
        } else if (rBottom > 0) {
            rBottom = Math.min(-height / 2, width / 2, rBottom);
            return [
                'M', x, y - rBottom,
                'v', height + rBottom,
                'h', width,
                'v', -height - rBottom,
                'a', rBottom, rBottom, 0, 0, 1, -rBottom, rBottom,
                'h', -width + rBottom * 2,
                'a', rBottom, rBottom, 0, 0, 1, -rBottom, -rBottom,
                'Z'
            ];
        } else {
            return [
                'M', x, y,
                'h', width,
                'v', height,
                'h', -width,
                'v', -height,
                'Z'
            ];
        }
    }

    // 정사각형
    static square(x: number, y: number, width: number, height: number): PathValue[] {
        const sz = Math.min(width, height);

        x += (width - sz) / 2;
        y += (height - sz) / 2;
        
        return [
            'M', x, y,
            'h', sz,
            'v', sz,
            'h', -sz,
            'Z'
        ];
    }

    static circle(cx: number, cy: number, rd: number): PathValue[] {
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
    static arc(cx: number, cy: number, rx: number, ry: number, start: number, end: number, clockwise: boolean, close = false): PathValue[] {
        const len = fixAngle(Math.abs(end - start));
        const circled = 2 * PI - len < SECTOR_ERROR * 10;
        const long = len - PI < SECTOR_ERROR * 10 ? 0 : 1;
        const cw = clockwise ? 1 : 0;
        const x1 = cos(start);
        const y1 = sin(start);
        const x2 = cos(end -= circled ? (cw ? SECTOR_ERROR : -SECTOR_ERROR) : 0);
        const y2 = sin(end);
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
            cy + ry * y2,
        );
        if (circled) {
            path.push(
                'M',
                cx,
                cy
            )
        }
        close && path.push('Z');
        return path;
    }

    // TODO: 개선할 것!
    static sector(cx: number, cy: number, rx: number, ry: number, rInner: number, start: number, end: number, clockwise: boolean): PathValue[] {
        const len = fixAngle(Math.abs(end - start));
        const circled = 2 * PI - len < SECTOR_ERROR;
        let long = len - PI < SECTOR_ERROR ? 0 : 1;
        const cw = clockwise ? 1 : 0;
        const x1 = cos(start);
        const y1 = sin(start);
        const x2 = cos(end -= circled ? (cw ? SECTOR_ERROR : -SECTOR_ERROR) : 0);
        const y2 = sin(end);
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

        if (!isNaN(innerX)) {
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
        }

        path.push('Z');
        return path;
    }

    static diamond(x: number, y: number, w: number, h: number): PathValue[] {
        return [
            'M', x + w / 2, y,
            'L', x + w, y + h / 2,
            'L', x + w / 2, y + h,
            'L', x, y + h / 2,
            'Z'
        ];
    }

    static triangle(x: number, y: number, w: number, h: number): PathValue[] {
        return [
            'M', x + w / 2, y,
            'L', x + w, y + h,
            'L', x, y + h,
            'Z'
        ];
    }

    static itriangle(x: number, y: number, w: number, h: number): PathValue[] {
        return [
            'M', x, y,
            'L', x + w, y,
            'L', x + w / 2, y + h,
            'Z'
        ];
    }

    static star(x: number, y: number, w: number, h: number): PathValue[] {
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

        path.push('M', cx + rx * cos(start), cy + ry * sin(start));
        for (let i = 0; i < 5; i++) {
            path.push(
                'L', cx + rx * cos(start), cy + ry * sin(start),
                'L', cx + rx2 * cos(start + a2), cy + ry2 * sin(start + a2)
            );
            start += a;
        }
        path.push('Z');
        return path;
    }

    static setShape(target: PathElement, shape: Shape, rx: number, ry: number): void {
        let path: (string | number)[];

        switch (shape) {
            case Shape.SQUARE:
            case Shape.DIAMOND:
            case Shape.TRIANGLE:
            case Shape.ITRIANGLE:
            case Shape.STAR:
            case Shape.RECTANGLE:
                path = SvgShapes[shape](0, 0, rx * 2, ry * 2);
                break;

            default:
                path = SvgShapes.circle(rx, ry, Math.min(rx, ry));
                break;
        }
        target.setPath(path);
    }
}
