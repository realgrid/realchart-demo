////////////////////////////////////////////////////////////////////////////////
// TitleView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { toSize } from "../common/Rectangle";
import { ISize } from "../common/Size";
import { RectElement } from "../common/impl/RectElement";
import { TextAnchor, TextElement } from "../common/impl/TextElement";
import { Title } from "../model/Title";
import { BoundableElement } from "./ChartElement";

export class TitleView extends BoundableElement<Title> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _textView: TextElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, isSub: boolean) {
        super(doc, isSub ? 'rct-subtitle' : 'rct-title', isSub ? 'rct-subtitle-background' : 'rct-title-background');

        this.add(this._textView = new TextElement(doc));
        this._textView.anchor = TextAnchor.START;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _setBackgroundStyle(back: RectElement): void {
        back.setStyleOrClass(this.model.backgroundStyle);
    }

    protected _doMeasure(doc: Document, model: Title, hintWidth: number, hintHeight: number, phase: number): ISize {
        this._textView.text = this.model.text;

        return toSize(this._textView.getBBounds());
    }

    protected _doLayout(): void {
        this._textView.translate(this._margins.left + this._paddings.left, this._margins.top + this._paddings.top);
        this._textView.layoutText();
    }
}