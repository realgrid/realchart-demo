////////////////////////////////////////////////////////////////////////////////
// SectorElement.ts
// 2023. 06. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathElement } from '../RcControl';
import { PathValue, _undef } from '../Types';
import { SvgShapes } from './SvgShape';

export interface ISectorShape {
    cx: number;
    cy: number; 
    rx: number;
    ry: number;
    innerRadius?: number;
    start: number;
    angle: number; 
    borderRadius?: number;
    clockwise?: boolean;
}

export class SectorElement extends PathElement {

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static create(doc: Document, styleName: string, x: number, y: number, rx: number, ry: number, start: number, angle: number, clockwise = true): SectorElement {
        return new SectorElement(doc, styleName, {
            cx: x,
            cy: y,
            rx: rx,
            ry: ry,
            innerRadius: 0,
            start: start,
            angle: angle,
            clockwise: clockwise
        })
    }

    static createInner(doc: Document, styleName = '', x: number, y: number, rx: number, ry: number, innerRadius: number, start: number, angle: number, clockwise = true): SectorElement {
        return new SectorElement(doc, styleName, {
            cx: x,
            cy: y,
            rx: rx,
            ry: ry,
            innerRadius: innerRadius,
            start: start,
            angle: angle,
            clockwise: clockwise
        })
    }
    
    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string = _undef, shape: ISectorShape = _undef) {
        super(doc, styleName);

        shape && this._assignShape(shape, false);

        this.setAttr('role', 'img');
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /** 
     * 중심 x.
     */
    cx = 0;
    /** 
     * 중심 y.
     */
    cy = 0;
    /** 
     * 수평 반지름.
     */
    rx = 0;
    /** 
     * 수직 반지름.
     */
    ry = 0;
    /** 
     * 내부 반지름.
     * 수평/수직 반지름에 대한 비율. 0 ~ 1 사이 값으로 설정.
     */
    innerRadius = 0;
    /** 
     * 시작 각도. 
     * 0 이상 2pi 미만.
     */
    start = 0;
    /** 
     * 각도. 
     * 0 이상 2pi 미만.
     */
    angle = 0;
    /** 
     * 회전 방향.
     * true면 반시계 방향.
     */
    clockwise = true;
    /**
     * 반지름의 원래 크기에 대한 표시 비율.
     */
    rate = 1;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    equals(shape: ISectorShape): boolean {
        return shape.cx === this.cx &&
                shape.cy === this.cy &&
                shape.rx === this.rx &&
                shape.ry === this.ry &&
                shape.innerRadius === this.innerRadius &&
                shape.start === this.start &&
                shape.angle === this.angle &&
                shape.clockwise === this.clockwise;
    }

    setSector(shape: ISectorShape): void {
        this._assignShape(shape, false);
    }

    setSectorEx(shape: ISectorShape, stroked: boolean): void {
        this._assignShape(shape, stroked);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _getShape(): ISectorShape {
        return {
            cx: this.cx,
            cy: this.cy,
            rx: this.rx,
            ry: this.ry,
            innerRadius: this.innerRadius,
            start: this.start,
            angle: this.angle,
            clockwise: this.clockwise
        }
    }

    protected _assignShape(shape: ISectorShape, stroked: boolean): void {
        this.cx = shape.cx;
        this.cy = shape.cy;
        this.rx = shape.rx;
        this.ry = shape.ry;
        this.innerRadius = shape.innerRadius;
        this.start = shape.start;
        this.angle = shape.angle;
        this.clockwise = shape.clockwise;
        this.setPath(stroked ? this.$_renderArc() : this.$_renderSector());
    }

    private $_renderSector(): PathValue[] {
        return SvgShapes.sector(
            this.cx, 
            this.cy, 
            this.rx * this.rate, 
            this.ry * this.rate, 
            this.innerRadius || 0, 
            this.start, 
            this.clockwise ? this.start + this.angle : this.start - this.angle, 
            this.clockwise
        );
    }

    private $_renderArc(): PathValue[] {
        return SvgShapes.arc(
            this.cx, 
            this.cy, 
            this.rx * this.rate, 
            this.ry * this.rate, 
            this.start, 
            this.clockwise ? this.start + this.angle : this.start - this.angle, 
            this.clockwise
        );
    }
}