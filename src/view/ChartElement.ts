////////////////////////////////////////////////////////////////////////////////
// ChartElement.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from "../common/RcControl";
import { ISize } from "../common/Size";
import { ChartItem } from "../model/ChartItem";

export abstract class ChartElement<T extends ChartItem> extends RcElement {
 
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    model: T;
    mw: number;
    mh: number;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    measure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        const sz = this._doMeasure(doc, this.model = model, hintWidth, hintHeight, phase);

        this.mw = sz.width;
        this.mh = sz.height;
        return sz;
    }

    layout(): void {
        this._doLayout();
    }

    //-------------------------------------------------------------------------
    // internal methods
    //-------------------------------------------------------------------------
    protected abstract _doMeasure(doc: Document, model: T, intWidth: number, hintHeight: number, phase: number): ISize;
    protected abstract _doLayout(): void;
}