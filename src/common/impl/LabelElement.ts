////////////////////////////////////////////////////////////////////////////////
// LabelElement.ts
// 2023. 07. 12. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { _undefined } from "../Types";
import { GroupElement } from "./GroupElement";
import { RectElement } from "./RectElement";
import { TextAnchor, TextElement, TextLayout } from "./TextElement";

/**
 * 배경을 갖는 text element.
 */
export class LabelElement extends GroupElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _back: RectElement;
    private _text: TextElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string = _undefined) {
        super(doc);

        this.add(this._back = new RectElement(doc));
        this.add(this._text = new TextElement(doc, styleName));
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /** text */
    get text(): string {
        return this._text.text;
    }
    set text(value: string) {
        this._text.text = value;
    }    

    /** anchor */
    get anchor(): TextAnchor {
        return this._text.anchor;
    }
    set anchor(value: TextAnchor) {
        this._text.anchor = value;
    }

    /** layout */
    get layout(): TextLayout {
        return this._text.layout;
    }
    set layout(value: TextLayout) {
        this._text.layout = value;
    }

    /** svg */
    get svg(): string {
        return this._text.svg;
    }
    set svg(value: string) {
        this._text.svg = value;
    }
    
    get opacity(): number {
        return this.getAttr('fill-opacity');
    }
    set opacity(value: number) {
        this.setAttr('fill-opacity', value);
    }

    get textView(): TextElement {
        return this._text;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    setStyles(styles: any): boolean {
        return this._back.setBackStyles(styles) || this._text.setStyles(styles);
    }

    setStyle(prop: string, value: string): boolean {
        return this._back.setBackStyle(prop, value) || this._text.setStyle(prop, value);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}