////////////////////////////////////////////////////////////////////////////////
// ButtonElement.ts
// 2023. 10. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from "./RcControl";
import { Sides } from "./Sides";
import { RectElement } from "./impl/RectElement";
import { TextElement } from "./impl/TextElement";

export class ButtonElement extends RcElement {
 
    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly STYLE = 'rct-button';
    static readonly BACK_STYLE = 'rct-button-backtround';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _back: RectElement;
    private _textView: TextElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, text: string, style?: string) {
        super(doc, ButtonElement.STYLE);

        this.add(this._back = new RectElement(doc, ButtonElement.BACK_STYLE));
        this.add(this._textView = new TextElement(doc));

        style && this.dom.classList.add(style);
        text && this.setText(text);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setText(text: string): void {
        this._textView.text = text;
        this.$_layout();
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_layout(): void {
        const cs = getComputedStyle(this._back.dom);
        const paddings = new Sides().applyPadding(cs);
        const r = this._textView.getBBounds();

        this._back.rect = {
            x: 0,
            y: 0,
            width: r.width,
            height: r.height,
            rx: paddings.left + paddings.right,
            ry: paddings.top + paddings.bottom
        };
        this._textView.translate(r.width / 2, r.height / 2);
    }
}