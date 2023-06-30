////////////////////////////////////////////////////////////////////////////////
// TitleView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { toSize } from "../common/Rectangle";
import { ISize } from "../common/Size";
import { TextAnchor, TextElement } from "../common/impl/TextElement";
import { Title } from "../model/Title";
import { ChartElement } from "./ChartElement";

export class TitleView extends ChartElement<Title> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _textView: TextElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, isSub: boolean) {
        super(doc, isSub ? 'rct-subtitle' : 'rct-title');

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

        return toSize(this._textView.getBBounds());
    }

    protected _doLayout(): void {
        this._textView.layoutText();
    }
}