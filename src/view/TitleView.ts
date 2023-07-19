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
    private _background: RectElement;
    private _textView: TextElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, isSub: boolean) {
        super(doc, isSub ? 'rct-subtitle' : 'rct-title');

        this.add(this._background = new RectElement(doc, isSub ? 'rct-subtitle-background' : 'rct-title-background'));
        this.add(this._textView = new TextElement(doc));
        this._textView.anchor = TextAnchor.START;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: Title, hintWidth: number, hintHeight: number, phase: number): ISize {
        let w = 0;
        let h = 0;

        this._textView.text = this.model.text;

        const sz = toSize(this._textView.getBBounds());
        return sz;
    }

    protected _doLayout(): void {
        this._textView.layoutText();
    }
}