////////////////////////////////////////////////////////////////////////////////
// ImageElement.ts
// 2023. 06. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from '../RcControl';
import { RECT_Z, IRect } from '../Rectangle';
import { _undef } from '../Types';

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
    private _bounds: IRect = RECT_Z;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, full: boolean, styleName?: string) {
        super(doc, styleName, 'image');

        full && this.setAttr("preserveAspectRatio", "xMidYMid slice");
        // this.setAttr('preserveAspectRatio', 'none');
        this.dom.onload = () => {
            this._dirty = true;
            this.invalidate();
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
            // 이렇게 기존 'href'와 다른 지 check하지 않고 직접 setAttr()하면 계속 onload 이벤트가 발생한다. #332
            this.url = url;
            if (this.resize(width, height)) this._dirty = true;
            return true;
        }
        return false;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    override getBBox(): IRect {
        if (this._dirty) {
            this._bounds = (this.dom as SVGGraphicsElement).getBBox();
            this._dirty = false;
        }
        return this._bounds;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}
