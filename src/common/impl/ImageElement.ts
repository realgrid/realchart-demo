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
    constructor(doc: Document, styleName?: string) {
        super(doc, styleName, 'image');

        // this.setAttr('preserveAspectRatio', 'none');
        this.dom.onload = () => {
            this._dirty = true;
            this.control.invalidateLayout();
        }
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /** image url */
    get url(): string {
        return this.getAttr('href');
    }
    set url(value: string) {
        if (value !== this.url) {
            this._dirty = true;
            value ? this.setAttr('href', value) : this.unsetAttr('href');
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setImage(url: string, width: number, height: number): boolean {
        if (url) {
            this.setAttr('href', url);
            this.resize(width, height);
            return true;
        }
        return false;
    }

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
