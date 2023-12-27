////////////////////////////////////////////////////////////////////////////////
// AnnotationView.ts
// 2023. 11. 11. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { _undef } from "../common/Types";
import { RectElement } from "../common/impl/RectElement";
import { Annotation } from "../model/Annotation";
import { BoundableElement } from "./ChartElement";

export abstract class AnnotationView<T extends Annotation> extends BoundableElement<T> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly CLASS_NAME: string = 'rct-annotation';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, AnnotationView.CLASS_NAME + ' ' + styleName, _undef);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    update(hintWidth: number, hintHeight: number): void {
        this.measure(this.doc, this.model, hintWidth, hintHeight, 0);
        this.layout();
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _setBackgroundStyle(back: RectElement): void {
        back.setFill('none');
    }

    protected _doLayout(param: any): void {
        const rot = this.model.rotation;

        if (!isNaN(rot) && rot !== 0) {
            this.setRotation(this.width / 2, this.height / 2, rot);
        } else {
            this.rotation = 0;
        }
    }
}