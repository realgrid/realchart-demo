////////////////////////////////////////////////////////////////////////////////
// AxisView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from "../common/RcControl";
import { toSize } from "../common/Rectangle";
import { ISize, Size } from "../common/Size";
import { TextAnchor, TextElement } from "../common/impl/TextElement";
import { Chart } from "../main";
import { Axis, AxisTitle } from "../model/Axis";
import { ChartElement } from "./ChartElement";

export class AxisTitleView extends ChartElement<AxisTitle> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _textView: TextElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-axis-title');

        this.add(this._textView = new TextElement(doc));
        this._textView.anchor = TextAnchor.START;
    }

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: AxisTitle, hintWidth: number, hintHeight: number, phase: number): ISize {
        this._textView.text = model.text;

        return toSize(this._textView.getBBounds());
    }

    protected _doLayout(isHorz: boolean): void {
        if (isHorz) {
        } else {
            this._textView.translate(this.mh / 2, this.mw / 2);
            this._textView.rotation = 270;

            // this._textView.translate(0, -this.mw / 2);
            // this._textView.rotation = 90;
        }
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
    private _markLen: number;
    private _labelSize: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-axis');

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
        const horz = this._isHorz;
        const titleView = this._titleView;
        let sz = 0;

        // tick mark 
        sz += this._markLen = model.tick.mark.length;;

        // labels
        this.$_prepareLabels(doc, model);

        if (horz) {
            this._labelSize = this._labelViews[0].getBBounds().height;
        } else {
            this._labelSize = this._labelViews[0].getBBounds().width;
        }
        sz += this._labelSize;

        // title
        if (titleView.visible = model.title.visible()) {
            sz += titleView.measure(doc, model.title, hintWidth, hintHeight, phase).height;
        }

        return Size.create(horz ? hintWidth : sz, horz ? sz : hintHeight);
    }
    
    protected _doLayout(): void {
        const horz = this._isHorz;
        const ticks = this.model._ticks;
        const titleView = this._titleView;
        const labelViews = this._labelViews;
        const w = this.width;
        const h = this.height;

        // tick marks

        // tick labels
        if (horz) {
            const y = this._markLen;
            labelViews.forEach((v, i) => {
                v.translate(ticks[i].pos - v.getBBounds().width / 2, y);
            });
        } else {
            const x = w - this._markLen;
            labelViews.forEach((v, i) => {
                v.translate(x - v.getBBounds().width, ticks[i].pos - v.getBBounds().height / 2);
            });
        }

        // title
        if (titleView.visible) {
            titleView.resizeByMeasured().layout(horz);

            if (horz) {
                titleView.translate((w - titleView.width) / 2, this._markLen + this._labelSize);
            } else {
                titleView.translate(w - this._markLen - this._labelSize - titleView.height, h / 2);// (h - titleView.height) / 2);
            }
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareChecker(doc: Document): TextElement {
        const tick = this.model._ticks[0];
        let t = this._labelViews[0];

        if (!t) {
            t = new TextElement(doc, 'rct-axis-label');
            this._labelContainer.add(t);
            this._labelViews.push(t);
        }

        t.text = tick.label
        return t;
    }

    private $_prepareLabels(doc: Document, m: Axis): void {
        const ticks = this.model._ticks;
        const nTick = ticks.length;
        const container = this._labelContainer;
        const views = this._labelViews;

        while (views.length < nTick) {
            const t = new TextElement(doc, 'rct-axis-label');

            t.anchor = TextAnchor.START;
            container.add(t);
            views.push(t);
        }
        while (views.length > nTick) {
            views.pop().remove();
        }

        views.forEach((v, i) => v.text = ticks[i].label);
    }
}