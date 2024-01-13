////////////////////////////////////////////////////////////////////////////////
// TextAnnotationView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../../common/Common";
import { IPoint } from "../../common/Point";
import { rectToSize } from "../../common/Rectangle";
import { SvgRichText } from "../../common/RichText";
import { ISize } from "../../common/Size";
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
    protected _doMeasure(doc: Document, model: TextAnnotation, hintWidth: number, hintHeight: number, phase: number): ISize {
        const sz = model.getSize(hintWidth, hintHeight);
        const tv = this._textView;

        this._deflatePaddings(sz);
        this._richText.setFormat(model.text);
        this._richText.build(tv, hintWidth, hintHeight, null, model._domain);
        // this._richText.build(tv, pickNum(sz.width, hintWidth), pickNum(sz.height, hintHeight), null, model._domain);

        const sz2 = rectToSize(this._textView.getBBox());
        return { width: pickNum(sz.width, sz2.width), height: pickNum(sz.height, sz2.height) };
    }

    // protected _doMeasure(doc: Document, model: TextAnnotation, hintWidth: number, hintHeight: number, phase: number): ISize {
    //     const tv = this._textView;

    //     this._richText.setFormat(model.text);
    //     this._richText.build(tv, hintWidth, hintHeight, null, model._domain);

    //     return rectToSize(this._textView.getBBox());
    // }

    protected _doLayout(p: IPoint): void {
        // this._paddings.left += p.x;
        // this._paddings.top += p.y;
        this._richText.layout(this._textView, this.textAlign(), this.width, this.height, this._paddings);
        this._textView.trans(p.x + this._textView.tx, p.y + this._textView.ty);

        super._doLayout(p);
    }

    protected _setRotation(originX: number, originY: number, rotation: number): void {
        this._textView.setRotation(originX, originY, rotation);
    }
}