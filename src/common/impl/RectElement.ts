////////////////////////////////////////////////////////////////////////////////
// RectElement.ts
// 2023. 06. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from '../RcControl';
import { IRect } from '../Rectangle';

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
    static create(doc: Document, x: number, y: number, width: number, height: number, r = 0, styleName = ''): RectElement {
        return new RectElement(doc, {
            x: x,
            y: y,
            width: width,
            height: height,
            r: r
        }, styleName);
    }

    //-------------------------------------------------------------------------
    // fields   
    //-------------------------------------------------------------------------
    private _rect: IRectShape;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, rect: IRectShape = null, styleName = '') {
        super(doc, 'rect', styleName);

        this.rect = rect;
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
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    setBounds(x: number, y: number, width: number, height: number, r = 0): RectElement {
        this.rect = {x, y, width, height, r};
        return this;
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

    protected _setBackgroundBorderRadius(value: number): void {
        this.setRadius(value);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}


export class BackElement extends RectElement {

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document, rect: IRectShape = null) {
        super(doc, rect, 'dlchart-point-back');

        // this.setStyle('opacity', '0');
    }
}
