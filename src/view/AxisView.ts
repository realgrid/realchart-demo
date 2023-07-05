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
import { Axis, AxisTitle } from "../model/Axis";
import { ChartItem } from "../model/ChartItem";
import { ChartElement } from "./ChartElement";

export class AxisTitleView extends ChartElement<AxisTitle> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _textView: TextElement;
    private _isHorz: boolean;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-axis-title');

        this.add(this._textView = new TextElement(doc));
        // this._textView.anchor = TextAnchor.START;
    }

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: AxisTitle, hintWidth: number, hintHeight: number, phase: number): ISize {
        this._textView.rotation = 0;
        this._textView.text = model.text;

        return toSize(this._textView.getBBounds());
    }

    protected _doLayout(isHorz: boolean): void {
        if (this._isHorz = isHorz) {
        } else {
            this._textView.setRotaion(0, this._textView.getBBounds().height / 2, 270);
        }
    }
    layout(param?: any): ChartElement<ChartItem> {
        super.layout(param);

        this._debugRect.setBounds(-this.width / 2, 0, this.width, this.height)
        if (!this._isHorz) {
            this._debugRect.setRotaion(this.width / 2, this.height / 2, 270);
        }
        return this;
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
    checkHeight(doc: Document, width: number, height: number): number {
        const m = this.model;
        const t = this.$_prepareChecker(doc);
        let h = m.tick.mark.length;; 

        h += t ?  t.getBBounds().height : 0;
        if (this._titleView.visible = m.title.visible()) {
            h += this._titleView.measure(doc, m.title, width, height, 1).height;
        }
        return h;
    }

    checkWidth(doc: Document, width: number, height: number): number {
        const m = this.model;
        const t = this.$_prepareChecker(doc);
        let w = m.tick.mark.length;; 

        w += t ? t.getBBounds().width : 0;
        if (this._titleView.visible = m.title.visible()) {
            w += this._titleView.measure(doc, m.title, width, height, 1).height;
        }
        return w;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: Axis, hintWidth: number, hintHeight: number, phase: number): ISize {
        const horz = this._isHorz;
        const titleView = this._titleView;
        const labelViews = this._labelViews;
        let sz = 0;

        // tick mark 
        sz += this._markLen = model.tick.mark.length;;

        // labels
        this.$_prepareLabels(doc, model);

        if (labelViews.length > 0) {
            if (horz) {
                this._labelSize = labelViews[0].getBBounds().height;
            } else {
                this._labelSize = labelViews[0].getBBounds().width;
                for (let i = 1; i < labelViews.length; i++) {
                    this._labelSize = Math.max(this._labelSize, labelViews[i].getBBounds().width);
                }
            }
            sz += this._labelSize;

        } else {
            this._labelSize = 0;
        }

        // title
        // if (titleView.visible = model.title.visible()) {
        //     sz += titleView.measure(doc, model.title, hintWidth, hintHeight, phase).height;
        // }
        if (titleView.visible) {
            sz += titleView.mh;
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
                // v.translate(ticks[i].pos - v.getBBounds().width / 2, y);
                v.anchor = TextAnchor.MIDDLE;
                v.translate(ticks[i].pos, y);
            });
        } else {
            const x = w - this._markLen;
            labelViews.forEach((v, i) => {
                v.translate(x - v.getBBounds().width, h - ticks[i].pos - v.getBBounds().height / 2);
            });
        }

        // title
        if (titleView.visible) {
            titleView.resizeByMeasured().layout(horz);

            if (horz) {
                // titleView.translate((w - titleView.width) / 2, this._markLen + this._labelSize);
                titleView.translate(w / 2, this._markLen + this._labelSize);
            } else {
                titleView.translate(w - this._markLen - this._labelSize - titleView.height / 2, (h - titleView.height) / 2);
            }
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareChecker(doc: Document): TextElement {
        const tick = this.model._ticks[0];

        if (tick) {
            let t = this._labelViews[0];

            if (!t) {
                t = new TextElement(doc, 'rct-axis-label');
                t.anchor = TextAnchor.START;
                this._labelContainer.add(t);
                this._labelViews.push(t);
            }
    
            t.text = tick.label
            return t;
        }
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