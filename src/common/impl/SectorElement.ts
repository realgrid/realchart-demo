////////////////////////////////////////////////////////////////////////////////
// SectorElement.ts
// 2023. 06. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathElement } from '../RcControl';
import { Utils } from '../Utils';
import { SvgShapes } from './SvgShape';

export interface ISectorShape {
    cx: number;
    cy: number; 
    rx: number;
    ry: number;
    innerRadius: number;
    start: number;
    angle: number; 
    clockwise?: boolean;
}

export class SectorElement extends PathElement {

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static create(doc: Document, x: number, y: number, rx: number, ry: number, start: number, angle: number, clockwise = true, styleName = ''): SectorElement {
        return new SectorElement(doc, {
            cx: x,
            cy: y,
            rx: rx,
            ry: ry,
            innerRadius: 0,
            start: start,
            angle: angle,
            clockwise: clockwise
        }, styleName)
    }

    static createInner(doc: Document, x: number, y: number, rx: number, ry: number, innerRadius: number, start: number, angle: number, clockwise = true, styleName = ''): SectorElement {
        return new SectorElement(doc, {
            cx: x,
            cy: y,
            rx: rx,
            ry: ry,
            innerRadius: innerRadius,
            start: start,
            angle: angle,
            clockwise: clockwise
        }, styleName)
    }

    
    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _cx = 0;
    private _cy = 0;
    private _rx = 0;
    private _ry = 0;
    private _innerRadius = 0;
    private _start = 0;
    private _angle = 0;
    private _clockwise = true;
    private _rate = 1;


    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document, shape?: ISectorShape, styleName = '') {
        super(doc, null, styleName);

        shape && this._assignShape(shape);
    }


    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /** 
     * 중심 x.
     */
    get cx(): number {
        return this._cx;
    }
    set cx(value: number) {
        value = Utils.getNumber(value);
        if (value !== this._cx) {
            this._cx = value;
            this._updateShape();
        }
    }

    /** 
     * 중심 y.
     */
    get cy(): number {
        return this._cy;
    }
    set cy(value: number) {
        value = Utils.getNumber(value);
        if (value !== this._cy) {
            this._cy = value;
            this._updateShape();
        }
    }

    /** 
     * 수평 반지름.
     */
    get rx(): number {
        return this._rx;
    }
    set rx(value: number) {
        value = Utils.getNumber(value);
        if (value !== this._rx) {
            this._rx = value;
            this._updateShape();
        }
    }

    /** 
     * 수직 반지름.
     */
    get ry(): number {
        return this._ry;
    }
    set ry(value: number) {
        value = Utils.getNumber(value);
        if (value !== this._ry) {
            this._ry = value;
            this._updateShape();
        }
    }

    /** 
     * 내부 반지름.
     * 수평/수직 반지름에 대한 비율. 0 ~ 1 사이 값으로 설정.
     */
    get innerRadius(): number {
        return this._innerRadius;
    }
    set innerRadius(value: number) {
        value = Utils.getNumber(value);
        if (value !== this._innerRadius) {
            this._innerRadius = value;
            this._updateShape();
        }
    }

    /** 
     * 시작 각도. radian으로 지정.
     */
    get start(): number {
        return this._start;
    }
    set start(value: number) {
        value = Utils.getNumber(value);
        if (value !== this._start) {
            this._start = value;
            this._updateShape();
        }
    }

    /** 
     * 각도. radian으로 지정.
     */
    get angle(): number {
        return this._angle;
    }
    set angle(value: number) {
        value = Utils.getNumber(value);
        if (value !== this._angle) {
            this._angle = value;
            this._updateShape();
        }
    }

    /** 
     * 회전 방향.
     */
    get clockwise(): boolean {
        return this._clockwise;
    }
    set clockwise(value: boolean) {
        if (value !== this._clockwise) {
            this._clockwise = value;
            this._updateShape();
        }
    }

    /**
     * 반지름의 원래 크기에 대한 표시 비율.
     * animation에서 사용한다.
     */
    get rate(): number {
        return this._rate;
    }
    set rate(value: number) {
        if (value !== this._rate) {
            this._rate = value;
            this._updateShape();
        }
    }


    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    equals(shape: ISectorShape): boolean {
        return shape.cx === this._cx &&
                shape.cy === this._cy &&
                shape.rx === this._rx &&
                shape.ry === this._ry &&
                shape.innerRadius === this._innerRadius &&
                shape.start === this._start &&
                shape.angle === this._angle &&
                shape.clockwise === this._clockwise;
    }

    setSector(shape: ISectorShape): void {
        this._assignShape(shape);
    }


    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _getShape(): ISectorShape {
        return {
            cx: this._cx,
            cy: this._cy,
            rx: this._rx,
            ry: this._ry,
            innerRadius: this._innerRadius,
            start: this._start,
            angle: this._angle,
            clockwise: this._clockwise
        }
    }

    protected _assignShape(shape: ISectorShape): void {
        this._cx = shape.cx;
        this._cy = shape.cy;
        this._rx = shape.rx;
        this._ry = shape.ry;
        this._innerRadius = shape.innerRadius;
        this._start = shape.start;
        this._angle = shape.angle;
        this._clockwise = shape.clockwise;
        this._updateShape();
    }

    protected _updateShape(): void {
        this.setPath(SvgShapes.sector(
            this._cx, 
            this._cy, 
            this._rx * this._rate, 
            this._ry * this._rate, 
            this._innerRadius || 0, 
            this._start, 
            this._start + this._angle, 
            this._clockwise
        ));
    }
}