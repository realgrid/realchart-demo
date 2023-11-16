////////////////////////////////////////////////////////////////////////////////
// ShapeAnnotationView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathElement } from "../../common/RcControl";
import { ISize } from "../../common/Size";
import { RectElement } from "../../common/impl/RectElement";
import { SvgShapes } from "../../common/impl/SvgShape";
import { ShapeAnnotation } from "../../model/annotation/ShapeAnnotation";
import { AnnotationView } from "../AnnotationView";

export class ShapeAnnotationView extends AnnotationView<ShapeAnnotation> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly CLASS_NAME: string = 'rct-shape-annotation';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _shapeView: PathElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, ShapeAnnotationView.CLASS_NAME);

        this.add(this._shapeView = new PathElement(doc));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _setBackgroundStyle(back: RectElement): void {
        back.setStyle('display', 'none');
    }

    protected _doMeasure(doc: Document, model: ShapeAnnotation, hintWidth: number, hintHeight: number, phase: number): ISize {
        const sz = model.getSize(hintWidth, hintHeight);

        SvgShapes.setShape(this._shapeView, model.shape, sz.width / 2, sz.height / 2);

        return sz;
    }

    protected _doLayout(param: any): void {
        this._shapeView.translate(this._paddings.left, this._paddings.top);

        super._doLayout(param);
    }
}