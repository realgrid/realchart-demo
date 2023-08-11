////////////////////////////////////////////////////////////////////////////////
// AxisView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { LayerElement, RcElement } from "../common/RcControl";
import { toSize } from "../common/Rectangle";
import { ISize, Size } from "../common/Size";
import { LineElement } from "../common/impl/PathElement";
import { RectElement } from "../common/impl/RectElement";
import { TextAnchor, TextElement } from "../common/impl/TextElement";
import { Axis, AxisGuide, AxisGuideRange, AxisTickMark, AxisTitle } from "../model/Axis";
import { ChartItem } from "../model/ChartItem";
import { AxisGuideContainer, AxisGuideLineView, AxisGuideRangeView, AxisGuideView } from "./BodyView";
import { BoundableElement, ChartElement } from "./ChartElement";

export class AxisTitleView extends BoundableElement<AxisTitle> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _textView: TextElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-axis-title', 'rct-axis-title-background');

        this.add(this._textView = new TextElement(doc));
        // this._textView.anchor = TextAnchor.START;
    }

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _setBackgroundStyle(back: RectElement): void {
        back.setStyleOrClass(this.model.backgroundStyle);
    }

    protected _getBackOffset(): number {
        return -this.width / 2; // text anchor가 MIDDLE이라서...
    }

    protected _doMeasure(doc: Document, model: AxisTitle, hintWidth: number, hintHeight: number, phase: number): ISize {
        this.rotation = 0;
        this._textView.text = model.text;

        return toSize(this._textView.getBBounds());
    }

    protected _doLayout(isHorz: boolean): void {
        const padding = this._paddings;
        const margin = this._margins;

        // rotation
        if (!isHorz) {
            this.setRotaion(0, this.height / 2, 270);
        }

        // text
        this._textView.translateY(margin.top + padding.top);
    }

    layout(param?: any): ChartElement<ChartItem> {
        super.layout(param);

        if (this._debugRect) {
            this._debugRect.setBounds(-this.width / 2, 0, this.width, this.height)
        }
        return this;
    }
}

class AxisTickMarkView extends ChartElement<AxisTickMark> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lineView: LineElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-axis-tick-mark');

        this.add(this._lineView = new LineElement(doc));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: AxisTickMark, hintWidth: number, hintHeight: number, phase: number): ISize {
        return Size.create(hintWidth, hintHeight);
    }

    protected _doLayout(param: any): void {
        if (this.model.axis._isHorz) {
            this._lineView.setVLineC(0, 0, this.height);
        } else {
            this._lineView.setHLineC(0, 0, this.width);
        }
    }
}

export class AxisView extends ChartElement<Axis> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lineView: LineElement;
    private _titleView: AxisTitleView;
    private _markContainer: RcElement;
    private _markViews: AxisTickMarkView[] = [];
    private _labelContainer: RcElement;
    private _labelViews: TextElement[] = []; 
    private _markLen: number;
    private _labelSize: number;

    _guideViews: AxisGuideView<AxisGuide>[];
    _frontGuideViews: AxisGuideView<AxisGuide>[];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-axis');

        this.add(this._lineView = new LineElement(doc, 'rct-axis-line'));
        this.add(this._titleView = new AxisTitleView(doc));
        this.add(this._markContainer = new RcElement(doc, 'rct-axis-tick-marks'));
        this.add(this._labelContainer = new RcElement(doc, 'rct-axis-tick-labels'));
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
        if (this._titleView.visible = m.title.visible) {
            h += this._titleView.measure(doc, m.title, width, height, 1).height;
        }
        return h;
    }

    checkWidth(doc: Document, width: number, height: number): number {
        const m = this.model;
        const t = this.$_prepareChecker(doc);
        let w = m.tick.mark.length;; 

        w += t ? t.getBBounds().width : 0;
        if (this._titleView.visible = m.title.visible) {
            w += this._titleView.measure(doc, m.title, width, height, 1).height;
        }
        return w;
    }

    prepareGuides(doc: Document, container: AxisGuideContainer, frontContainer: AxisGuideContainer): void {
        let guides = this.model.guides.filter(g => !g.front);
        container.addAll(doc, guides);

        guides = this.model.guides.filter(g => g.front);
        frontContainer.addAll(doc, guides);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: Axis, hintWidth: number, hintHeight: number, phase: number): ISize {
        const horz = model._isHorz;
        const titleView = this._titleView;
        const labelViews = this._labelViews;
        let sz = 0;

        // line
        this._lineView.visible = model.line.visible;

        // tick marks 
        sz += this._markLen = model.tick.mark.length;;
        this.$_prepareTickMarks(doc, model);
        this._markViews.forEach(v => v.measure(doc, model.tick.mark, hintWidth, hintHeight, phase));

        // labels
        this.$_prepareLabels(doc, model);

        if (labelViews.length > 0) {
            if (horz) {
                this._labelSize = labelViews[0].getBBounds().height;
                for (let i = 1; i < labelViews.length; i++) {
                    this._labelSize = Math.max(this._labelSize, labelViews[i].getBBounds().height);
                }
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
        const model = this.model;
        const horz = model._isHorz;
        const opp = model._isOpposite;
        const ticks = model._ticks;
        const titleView = this._titleView;
        const labelViews = this._labelViews;
        const markLen = this._markLen;
        const w = this.width;
        const h = this.height;

        // line
        if (this._lineView.visible) {
            if (horz) {
                this._lineView.setHLineC(opp ? h : 0, 0, w);
            } else {
                this._lineView.setVLineC(opp ? 0 : w, 0, h);
            }
        }

        // tick marks
        if (horz) {
            this._markViews.forEach((v, i) => {
                v.resize(1, markLen);
                v.layout().translate(ticks[i].pos, opp ? h - markLen : 0);
            })
        } else {
            this._markViews.forEach((v, i) => {
                v.resize(markLen, 1);
                v.layout().translate(opp ? 0 : w - markLen, h - ticks[i].pos);
            })
        }

        // tick labels
        if (horz) {
            labelViews.forEach((v, i) => {
                const y = opp ? h - markLen - v.getBBounds().height : markLen;

                // v.translate(ticks[i].pos - v.getBBounds().width / 2, y);
                v.anchor = TextAnchor.MIDDLE;
                v.translate(ticks[i].pos, y);
            });
        } else {
            const x = opp ? markLen : w - markLen;

            labelViews.forEach((v, i) => {
                const r = v.getBBounds();
                const x2 = opp ? x : x - r.width;

                v.translate(x2, h - ticks[i].pos - r.height / 2);
            });
        }

        // title
        if (titleView.visible) {
            const labelSize = this._labelSize;

            titleView.resizeByMeasured().layout(horz);

            if (horz) {
                const y = opp ? 0 : markLen + labelSize;

                // titleView.translate((w - titleView.width) / 2, this._markLen + labelSize);
                titleView.translate(w / 2, y);
            } else {
                const x = opp ? markLen + labelSize + titleView.height / 2 : w - markLen - labelSize - titleView.height / 2;

                titleView.translate(x, (h - titleView.height) / 2);
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

    private $_prepareTickMarks(doc: Document, m: Axis): void {
        const ticks = m._ticks;
        const nTick = ticks.length;
        const container = this._markContainer;
        const views = this._markViews;

        while (views.length < nTick) {
            const v = new AxisTickMarkView(doc);

            container.add(v);
            views.push(v);
        }
        while (views.length > nTick) {
            views.pop().remove();
        }
    }

    private $_prepareLabels(doc: Document, m: Axis): void {
        const ticks = m._ticks;
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