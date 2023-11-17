////////////////////////////////////////////////////////////////////////////////
// TextAnnotationView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { toSize } from "../../common/Rectangle";
import { SvgRichText } from "../../common/RichText";
import { ISize } from "../../common/Size";
import { RectElement } from "../../common/impl/RectElement";
import { TextAnchor, TextElement } from "../../common/impl/TextElement";
import { TextAnnotation } from "../../model/annotation/TextAnnotation";
import { AnnotationView } from "../AnnotationView";

export class TextAnnotationView extends AnnotationView<TextAnnotation> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly CLASS_NAME: string = 'rct-text-annotation';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _textView: TextElement;
    private _richText: SvgRichText;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, TextAnnotationView.CLASS_NAME);

        this.add(this._textView = new TextElement(doc));
        this._textView.anchor = TextAnchor.START;

        this._richText = new SvgRichText();
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _setBackgroundStyle(back: RectElement): void {
        super._setBackgroundStyle(back);

        back.internalSetStyleOrClass(this.model.backgroundStyle);
    }

    protected _doMeasure(doc: Document, model: TextAnnotation, hintWidth: number, hintHeight: number, phase: number): ISize {
        const tv = this._textView;

        this._richText.setFormat(model.text);
        this._richText.build(tv, hintHeight, hintWidth, null, null);

        return toSize(this._textView.getBBounds());
    }

    protected _doLayout(param: any): void {
        this._textView.translate(this._paddings.left, this._paddings.top);

        super._doLayout(param);
    }
}