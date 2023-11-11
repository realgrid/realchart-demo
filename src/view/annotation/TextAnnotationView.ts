////////////////////////////////////////////////////////////////////////////////
// TextAnnotationView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { toSize } from "../../common/Rectangle";
import { ISize } from "../../common/Size";
import { RectElement } from "../../common/impl/RectElement";
import { TextAnchor, TextElement, TextLayout } from "../../common/impl/TextElement";
import { TextAnnotation } from "../../model/annotation/TextAnnotation";
import { AnnotationView } from "./AnnotationView";

export class TextAnnotationView extends AnnotationView<TextAnnotation> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly CLASS_NAME: string = 'rct-text-annotation';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _textView: TextElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, TextAnnotationView.CLASS_NAME);

        this.add(this._textView = new TextElement(doc));
        this._textView.anchor = TextAnchor.START;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _setBackgroundStyle(back: RectElement): void {
        back.setStyleOrClass(this.model.backgroundStyle);
    }

    protected _doMeasure(doc: Document, model: TextAnnotation, hintWidth: number, hintHeight: number, phase: number): ISize {
        this._textView.text = this.model.text;

        return toSize(this._textView.getBBounds());
    }

    protected _doLayout(param: any): void {
        const r = this._textView.getBBounds();

        this._textView.translate(this._paddings.left, this._paddings.top);
        this._textView.layoutText();

        super._doLayout(param);
    }
}