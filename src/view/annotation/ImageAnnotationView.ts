////////////////////////////////////////////////////////////////////////////////
// ImageAnnotationView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { rectToSize } from "../../common/Rectangle";
import { ISize } from "../../common/Size";
import { ImageElement } from "../../common/impl/ImageElement";
import { RectElement } from "../../common/impl/RectElement";
import { ImageAnnotation } from "../../model/annotation/ImageAnnotation";
import { AnnotationView } from "../AnnotationView";

export class ImageAnnotationView extends AnnotationView<ImageAnnotation> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly CLASS_NAME: string = 'rct-image-annotation';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _imageView: ImageElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, ImageAnnotationView.CLASS_NAME);

        this.add(this._imageView = new ImageElement(doc, false));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: ImageAnnotation, hintWidth: number, hintHeight: number, phase: number): ISize {
        const sz = model.getSize(hintWidth, hintHeight);

        this._imageView.url = this.model.imageUrl;
        this._imageView.resize(sz.width, sz.height);

        return rectToSize(this._imageView.getBBox());
    }

    protected _doLayout(param: any): void {
        this._imageView.trans(this._paddings.left, this._paddings.top);

        super._doLayout(param);
    }
}