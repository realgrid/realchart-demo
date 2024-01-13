////////////////////////////////////////////////////////////////////////////////
// ShapeAnnotationView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IPoint } from "../../common/Point";
import { PathElement } from "../../common/RcControl";
import { ISize } from "../../common/Size";
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
    protected _doMeasure(doc: Document, model: ShapeAnnotation, hintWidth: number, hintHeight: number, phase: number): ISize {
        const sz = model.getSize(hintWidth, hintHeight);

        this._deflatePaddings(sz);
        SvgShapes.setShape(this._shapeView, model.shape, sz.width / 2, sz.height / 2);
        return sz;
    }

    protected _doLayout(p: IPoint): void {
        this._shapeView.trans(this._paddings.left + p.x, this._paddings.top + p.y);

        super._doLayout(p);
    }

    protected _setRotation(originX: number, originY: number, rotation: number): void {
        this._shapeView.setRotation(originX, originY, rotation);
    }
}