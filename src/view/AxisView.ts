////////////////////////////////////////////////////////////////////////////////
// AxisView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from "../common/RcControl";
import { ISize } from "../common/Size";
import { TextElement } from "../common/impl/TextElement";
import { Axis, AxisTitle } from "../model/Axis";
import { ChartElement } from "./ChartElement";

export class AxisTitleView extends ChartElement<AxisTitle> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: AxisTitle, intWidth: number, hintHeight: number, phase: number): ISize {
        return;
    }

    protected _doLayout(): void {
    }
}

export class AxisView extends ChartElement<Axis> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _isHorz: boolean;
    private _titleView: AxisTitleView;
    private _labelContainer: RcElement;
    private _labelViews: TextElement[] = []; 

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc);

        this.add(this._titleView = new AxisTitleView(doc));
        this.add(this._labelContainer = new RcElement(doc));
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    checkHeight(doc: Document, width: number): number {
        const m = this.model;
        const t = this.$_prepareChecker(doc);
        let h = m.tick.mark.length;; 

        return h + t.getBBounds().height;
    }

    checkWidth(doc: Document, height: number): number {
        const m = this.model;
        const t = this.$_prepareChecker(doc);
        let w = m.tick.mark.length;; 

        return w + t.getBBounds().width;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: Axis, hintWidth: number, hintHeight: number, phase: number): ISize {
        return;
    }
    
    protected _doLayout(): void {
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareChecker(doc: Document): TextElement {
        const tick = this.model._ticks[0];
        let t = this._labelViews[0];

        if (!t) {
            t = new TextElement(doc);
            this._labelContainer.add(t);
            this._labelViews.push(t);
        }

        t.text = tick.label
        return t;
    }
}