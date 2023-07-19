////////////////////////////////////////////////////////////////////////////////
// ImageElement.ts
// 2023. 06. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from '../RcControl';
import { IRect } from '../Rectangle';
import { _undefined } from '../Types';

export class ImageElement extends RcElement {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _dirty = true;
    private _bounds: IRect;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, imageUrl: string = _undefined, styleName: string = _undefined) {
        super(doc, styleName, 'image');

        if (imageUrl) {
            this.setAttr('href', imageUrl);
        }
        this.setAttr('preserveAspectRatio', 'none');
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /** image url */
    get imageUrl(): string {
        return this.getAttr('href');
    }
    set imageUrl(value: string) {
        if (value !== this.imageUrl) {
            this._dirty = true;
            value ? this.setAttr('href', value) : this.unsetAttr('href');
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    getBBounds(): IRect {
        if (this._dirty) {
            this._bounds = (this.dom as SVGGraphicsElement).getBBox();
            this._dirty = false;
        }
        return this._bounds;
    }

    protected _doSizeChanged(): void {
        this._dirty = true;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}
