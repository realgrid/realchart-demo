////////////////////////////////////////////////////////////////////////////////
// TitleView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { rectToSize } from "../common/Rectangle";
import { SvgRichText } from "../common/RichText";
import { ISize } from "../common/Size";
import { RectElement } from "../common/impl/RectElement";
import { TextElement } from "../common/impl/TextElement";
import { Title } from "../model/Title";
import { BoundableElement } from "./ChartElement";

export class TitleView extends BoundableElement<Title> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly TITLE_CLASS = 'rct-title';
    static readonly SUBTITLE_CLASS = 'rct-subtitle';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _textView: TextElement;
    private _richText: SvgRichText;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, public isSub: boolean) {
        super(doc, isSub ? TitleView.SUBTITLE_CLASS : TitleView.TITLE_CLASS, isSub ? 'rct-subtitle-background' : 'rct-title-background');

        this.add(this._textView = new TextElement(doc));
        this._richText = new SvgRichText();
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected override _marginable(): boolean {
        return false;
    }

    protected _setBackgroundStyle(back: RectElement): void {
        back.setStyleOrClass(this.model.backgroundStyle);
    }

    protected override _doMeasure(doc: Document, model: Title, hintWidth: number, hintHeight: number, phase: number): ISize {
        this._richText.setFormat(model.text);
        this._richText.build(this._textView, hintWidth, hintHeight, null, null);

        return rectToSize(this._textView.getBBox());
    }

    protected override _doLayout(): void {
        this._richText.layout(this._textView, this.textAlign(), this.width, this.height, this._paddings);
    }
}