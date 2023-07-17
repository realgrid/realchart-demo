////////////////////////////////////////////////////////////////////////////////
// ChartElement.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from "../common/RcControl";
import { IRect } from "../common/Rectangle";
import { Sides } from "../common/Sides";
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

        if (RcElement.DEBUGGING) {
            this.add(this._debugRect = new RectElement(doc));
            this._debugRect.setAttr('pointerEvents', 'none');
        }
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    measure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        this.setStyleOrClass(model.style);

        const sz = this._doMeasure(doc, this.model = model, hintWidth, hintHeight, phase);

        this.mw = sz.width;
        this.mh = sz.height;
        return sz;
    }

    layout(param?: any): ChartElement<ChartItem> {
        this._doLayout(param);

        if (this._debugRect && this.width > 1 && this.height > 1) {
            this._debugRect.setRect(this._getDebugRect());
            this._debugRect.setStyles({
                fill: 'transparent',
                stroke: '#00000018'
            })
        }
        return this;
    }

    resizeByMeasured(): ChartElement<ChartItem> {
        this.resize(this.mw, this.mh);
        return this;
    }

    //-------------------------------------------------------------------------
    // internal methods
    //-------------------------------------------------------------------------
    protected _getDebugRect(): IRect {
        return {
            x: 0,
            y: 0,
            width: this.width,
            height: this.height
        }
    }

    protected abstract _doMeasure(doc: Document, model: T, intWidth: number, hintHeight: number, phase: number): ISize;
    protected abstract _doLayout(param: any): void;
}

export abstract class BoundableElement<T extends ChartItem> extends ChartElement<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _margins = new Sides();
    protected _paddings = new Sides();

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getDebugRect(): IRect {
        return this._margins.shrink(super._getDebugRect());
    }

    measure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        this.setStyleOrClass(model.style);

        const cs = getComputedStyle(this.dom);
        const padding = this._paddings;
        const margin = this._margins;

        padding.applyPadding(cs);
        margin.applyMargin(cs);

        const sz = this._doMeasure(doc, this.model = model, hintWidth, hintHeight, phase);

        sz.height += margin.top + margin.bottom + padding.top + padding.bottom;
        sz.width += margin.left + margin.right + padding.left + padding.right;

        this.mw = sz.width;
        this.mh = sz.height;
        return sz;
    }
}