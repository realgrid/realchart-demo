////////////////////////////////////////////////////////////////////////////////
// RectElement.ts
// 2023. 06. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathElement, RcElement } from '../RcControl';
import { IRect } from '../Rectangle';
import { _undef } from '../Types';
import { SvgShapes } from './SvgShape';

export interface IRectShape extends IRect {
    r?: number;
    rx?: number;
    ry?: number;
    rLeft?: number;
    rTop?: number;
    rRight?: number;
    rBottom?: number;
}

export class RectElement extends RcElement {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static create(doc: Document, styleName: string, x: number, y: number, width: number, height: number, r = 0): RectElement {
        return new RectElement(doc, styleName, {
            x: x,
            y: y,
            width: width,
            height: height,
            r: r
        });
    }

    //-------------------------------------------------------------------------
    // fields   
    //-------------------------------------------------------------------------
    private _rect: IRectShape;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string = _undef, rect: IRectShape = _undef) {
        super(doc, styleName, 'rect');

        this.rect = rect;
        // this.setAttr('shapeRendering', 'cripsEdges');
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /** rect */
    get rect(): IRectShape {
        return this._rect && {...this._rect};
    }
    set rect(value: IRectShape) {
        if (value !== this._rect) {
            this._rect = value && {...value}
            if (value) {
                this.setRect(value);
                let rx = value.rx || value.r;
                let ry = value.ry || value.r;
                rx > 0 && this.dom.setAttribute('rx', String(rx));
                ry > 0 && this.dom.setAttribute('rx', String(ry));
            }
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    resizeRect(width: number, height: number): RcElement {
        const cs = this.getStyle('border-radius');
        
        this.resize(width, height);
        if (cs) {
            this.dom.setAttribute('rx', cs);
        }

        return this;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    setBounds(x: number, y: number, width: number, height: number, r = 0): RectElement {
        this.rect = {x, y, width, height, r};
        return this;
    }

    setBox(x: number, y: number, width: number, height: number): void {
        if (height < 0) {
            this.rect = {x, y: y + height, width, height: -height};
        } else {
            this.rect = {x, y, width, height};
        }
    }

    setRadius(value: number): void {
        if (value > 0) {
            if (this._rect) {
                this._rect.rx = this._rect.ry = value;
            }
            this.dom.setAttribute('rx', String(value));
            this.dom.setAttribute('ry', String(value));
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}

export class BoxElement extends PathElement {

    //-------------------------------------------------------------------------
    // fields   
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string = _undef) {
        super(doc, styleName);
    }

	//-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setBox(x1: number, y1: number, x2: number, y2: number): BoxElement {
        this.setPath(SvgShapes.box(x1, y1, x2, y2));
        return this;
    }
}

export class BackElement extends RectElement {

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document, rect: IRectShape = _undef) {
        super(doc, 'dlchart-point-back', rect);

        // this.setStyle('opacity', '0');
    }
}
