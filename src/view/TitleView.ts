////////////////////////////////////////////////////////////////////////////////
// TitleView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { toSize } from "../common/Rectangle";
import { SvgRichText } from "../common/RichText";
import { ISize } from "../common/Size";
import { Align } from "../common/Types";
import { RectElement } from "../common/impl/RectElement";
import { TextAnchor, TextElement } from "../common/impl/TextElement";
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
    protected _marginable(): boolean {
        return false;
    }

    protected _setBackgroundStyle(back: RectElement): void {
        back.setStyleOrClass(this.model.backgroundStyle);
    }

    protected _doMeasure(doc: Document, model: Title, hintWidth: number, hintHeight: number, phase: number): ISize {
        this._richText.setFormat(model.text);
        this._richText.build(this._textView, hintWidth, hintHeight, null, null);

        return toSize(this._textView.getBBounds());
    }

    protected _doLayout(): void {
        const view = this._textView;
        let x = 0;

        switch (this.model.textAlign) {
            case Align.CENTER:
                view.anchor = TextAnchor.MIDDLE;
                x += view.getBBounds().width / 2;
                break;
            case Align.RIGHT:
                view.anchor = TextAnchor.END;
                x += view.getBBounds().width;
                break;
            default:
                view.anchor = TextAnchor.START;
                break;
        }

        view.translate(this._paddings.left + x, this._paddings.top);
    }
}