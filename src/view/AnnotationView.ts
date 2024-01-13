////////////////////////////////////////////////////////////////////////////////
// AnnotationView.ts
// 2023. 11. 11. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IPoint } from "../common/Point";
import { RcElement } from "../common/RcControl";
import { _undef } from "../common/Types";
import { RectElement } from "../common/impl/RectElement";
import { Annotation } from "../model/Annotation";
import { BoundableElement } from "./ChartElement";

/**
 * [주의] clipping하기 위해 translate를 background와 내부 view에 설정한다.
 */
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
        super(doc, AnnotationView.CLASS_NAME + ' ' + styleName, 'rct-annotation-background');
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
    protected _marginable(): boolean {
        return false;
    }

    protected _resetBackBounds(): boolean {
        return false;
    }

    protected _setBackgroundStyle(back: RectElement): void {
        back.internalSetStyleOrClass(this.model.backgroundStyle);
    }

    protected _doLayout(p: IPoint): void {
        const rot = this.model.rotation;

        this._background.setBounds(p.x, p.y, this.width, this.height);

        if (!isNaN(rot) && rot !== 0) {
            this.setRotation(this.width / 2, this.height / 2, rot);
        } else {
            this.rotation = 0;
        }
    }

    setRotation(originX: number, originY: number, rotation: number): RcElement {
        this._background.setRotation(originX, originY, rotation);
        this._setRotation(originX, originY, rotation);
        return this;
    }

    protected _setRotation(originX: number, originY: number, rotation: number): void {}
}