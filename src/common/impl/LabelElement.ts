////////////////////////////////////////////////////////////////////////////////
// LabelElement.ts
// 2023. 07. 12. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Color } from "../Color";
import { _undefined } from "../Types";
import { GroupElement } from "./GroupElement";
import { RectElement } from "./RectElement";
import { TextAnchor, TextElement, TextLayout } from "./TextElement";

/**
 * ChartText를 표시하는 텍스트 view.
 */
export class LabelElement extends GroupElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _back: RectElement;
    private _outline: TextElement;
    private _text: TextElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string = _undefined) {
        super(doc, styleName);

        // this.add(this._back = new RectElement(doc));

        // this.add(this._outline = new TextElement(doc));
        // this._outline.anchor = TextAnchor.START;

        this.add(this._text = new TextElement(doc, styleName));
        this._text.anchor = TextAnchor.START;
    }

	//-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /** text */
    get text(): string {
        return this._text.text;
    }

    /** anchor */
    get anchor(): TextAnchor {
        return this._text.anchor;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setText(s: string): LabelElement {
        this._outline.text = s;
        this._text.text = s;
        return this;
    }

    setSvg(s: string): LabelElement {
        this._text.svg = s;
        return this;
    }

    setOutline(value: boolean): LabelElement {
        this._outline.visible = value;
        return this;
    }

    setContrast(target: Element, darkColor: string, brightColor: string): LabelElement {
        this._outline.visible = false;
        this._text.setContrast(target, darkColor, brightColor);
        return this;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    // setStyles(styles: any): boolean {
    //     return this._back.setBackStyles(styles) || this._text.setStyles(styles);
    // }

    // setStyle(prop: string, value: string): boolean {
    //     return this._back.setBackStyle(prop, value) || this._text.setStyle(prop, value);
    // }

    setStyles(styles: any): boolean {
        let changed = this._text.setStyles(styles);

        if (this._outline) {
            if (this._outline.setStyles(styles)) {
                changed = true;
            }
            this.$_setOutline(Color.getContrast(getComputedStyle(this._text.dom).fill));
        }
        return changed;
    }

    setStyle(prop: string, value: string): boolean {
        let changed = this._text.setStyle(prop, value);

        if (this._outline) {
            if (this._outline.setStyle(prop, value)) {
                changed = true;
            }
            this.$_setOutline(Color.getContrast(getComputedStyle(this._text.dom).fill));
        }
        return changed;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_setOutline(color: string): void {
        this._outline.setStyles({
            fill: color,
            stroke: color,
            strokeWidth: '2px'
        });
    }
}