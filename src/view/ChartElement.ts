////////////////////////////////////////////////////////////////////////////////
// ChartElement.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ClipElement, ClipPathElement, RcElement } from "../common/RcControl";
import { IRect } from "../common/Rectangle";
import { Sides } from "../common/Sides";
import { ISize } from "../common/Size";
import { _undefined } from "../common/Types";
import { RectElement } from "../common/impl/RectElement";
import { IChart } from "../model/Chart";
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
    constructor(doc: Document, styleName = _undefined) {
        super(doc, styleName, 'g');

        if (RcElement.DEBUGGING) {
            this.add(this._debugRect = new RectElement(doc, 'rct-debug'));
            this._debugRect.setAttr('pointerEvents', 'none');
        }
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    chart(): IChart {
        return this.model.chart;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    measure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        this.setStyleOrClass(model.style);
        if (model !== this.model) {
            this.model = model;
            this._doModelChanged();
        }

        const sz = this._doMeasure(doc, this.model, hintWidth, hintHeight, phase);

        this.mw = sz.width;
        this.mh = sz.height;
        return sz;
    }

    layout(param?: any): ChartElement<ChartItem> {
        this._doLayout(param);

        if (RcElement.DEBUGGING) {
            if (!this._debugRect) {
                this.insertFirst(this._debugRect = new RectElement(this.doc, 'rct-debug'));
                //this._debugRect.setAttr('pointerEvents', 'none');
            }
            if (this.width > 1 && this.height > 1) {
                this._debugRect.setRect(this._getDebugRect());
            }
        } else if (this._debugRect) {
            this._debugRect.remove();
            this._debugRect = null;
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

    protected _invalidate(): void {
        this.control?.invalidateLayout();
    }

    protected _doModelChanged(): void {
    }
}

export abstract class BoundableElement<T extends ChartItem> extends ChartElement<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _background: RectElement;
    protected _margins = new Sides();
    protected _paddings = new Sides();
    private _borderRadius: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string, backStyle: string) {
        super(doc, styleName);

        this.add(this._background = new RectElement(doc, backStyle));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getDebugRect(): IRect {
        return this._margins.shrink(super._getDebugRect());
    }

    measure(doc: Document, model: T, hintWidth: number, hintHeight: number, phase: number): ISize {
        this.setStyleOrClass(model.style);
        if (model !== this.model) {
            this.model = model;
            this._doModelChanged();
        }
        this._setBackgroundStyle(this._background);

        // TODO: 캐쉬!
        const cs = getComputedStyle(this.dom);
        const csBack = getComputedStyle(this._background.dom);
        const padding = this._paddings;
        const margin = this._margins;

        padding.applyPadding(csBack);
        this._borderRadius = parseFloat(csBack.borderRadius) || 0;
        margin.applyMargin(cs);

        const sz = this._doMeasure(doc, model, hintWidth, hintHeight, phase);

        sz.height += margin.top + margin.bottom + padding.top + padding.bottom;
        sz.width += margin.left + margin.right + padding.left + padding.right;

        this.mw = sz.width;
        this.mh = sz.height;
        return sz;
    }

    layout(param?: any): ChartElement<ChartItem> {
        super.layout(param);

        // background
        const margin = this._margins;

        this._background.setBounds(
            margin.left + this._getBackOffset(), 
            margin.top, 
            this.width - margin.left - margin.right,
            this.height - margin.top - margin.bottom,
            this._borderRadius
        );

        return this;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _setBackgroundStyle(back: RectElement): void;
    
    protected _getBackOffset(): number {
        return 0;
    }
}