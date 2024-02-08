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
        this._layoutView(this.chart().isInverted(), 0, 0, hintWidth, hintHeight);
    }

    _layoutView(invertd: boolean, x: number, y: number, w: number, h: number): void {
        this.resizeByMeasured();
        const p = this.model.getPosition(this.chart().isInverted(), x, y, w, h, this.width, this.height);
        this.layout(p);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected override _marginable(): boolean {
        return false;
    }

    protected override _resetBackBounds(): boolean {
        return false;
    }

    protected _setBackgroundStyle(back: RectElement): void {
        back.setStyleOrClass(this.model.backgroundStyle);
    }

    protected override _doLayout(p: IPoint): void {
        const rot = this.model.rotation;

        this._background.setBounds(p.x, p.y, this.width, this.height);

        if (!isNaN(rot) && rot !== 0) {
            this.setRotation(this.width / 2, this.height / 2, rot);
        } else {
            this.rotation = 0;
        }
    }

    override setRotation(originX: number, originY: number, rotation: number): RcElement {
        this._background.setRotation(originX, originY, rotation);
        this._setRotation(originX, originY, rotation);
        return this;
    }

    protected _setRotation(originX: number, originY: number, rotation: number): void {}
}