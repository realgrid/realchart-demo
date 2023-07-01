////////////////////////////////////////////////////////////////////////////////
// ChartElement.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from "../common/RcControl";
import { ISize } from "../common/Size";
import { RectElement } from "../common/impl/RectElement";
import { ChartItem } from "../model/ChartItem";

export abstract class ChartElement<T extends ChartItem> extends RcElement {
 
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    model: T;
    mw: number;
    mh: number;
    _debugRect: RectElement;
    
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName = '') {
        super(doc, 'g', styleName);

        this.add(this._debugRect = new RectElement(doc));
    }

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

    layout(param?: any): ChartElement<ChartItem> {
        this._doLayout(param);

        this._debugRect.setBounds(0, 0, this.width, this.height);
        this._debugRect.setStyles({
            fill: 'transparent',
            stroke: 'lightgray'
        })
        return this;
    }

    resizeByMeasured(): ChartElement<ChartItem> {
        this.resize(this.mw, this.mh);
        return this;
    }

    //-------------------------------------------------------------------------
    // internal methods
    //-------------------------------------------------------------------------
    protected abstract _doMeasure(doc: Document, model: T, intWidth: number, hintHeight: number, phase: number): ISize;
    protected abstract _doLayout(param: any): void;
}