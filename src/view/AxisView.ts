////////////////////////////////////////////////////////////////////////////////
// AxisView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from "../common/RcControl";
import { IRect, toSize } from "../common/Rectangle";
import { ISize, Size } from "../common/Size";
import { DEG_RAD } from "../common/Types";
import { LineElement } from "../common/impl/PathElement";
import { RectElement } from "../common/impl/RectElement";
import { TextAnchor, TextElement } from "../common/impl/TextElement";
import { Axis, AxisGuide, AxisPosition, AxisTickMark, AxisTitle, IAxisTick } from "../model/Axis";
import { ChartItem } from "../model/ChartItem";
import { AxisGuideContainer, AxisGuideView } from "./BodyView";
import { BoundableElement, ChartElement } from "./ChartElement";

export class AxisTitleView extends BoundableElement<AxisTitle> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    static readonly TITLE_CLASS = 'rct-axis-title';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _textView: TextElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, AxisTitleView.TITLE_CLASS, 'rct-axis-title-background');

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
            this.setRotaion(0, this.height / 2, this.model.axis.position === AxisPosition.OPPOSITE ? 90 : 270);
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
        super(doc, AxisView.TICK_CLASS);

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
            // this._lineView.setVLine(0, 0, this.height);
            this._lineView.setVLineC(0, 0, this.height);
        } else {
            // this._lineView.setHLine(0, 0, this.width);
            this._lineView.setHLineC(0, 0, this.width);
        }
    }
}

class AxisLabelElement extends TextElement {

    col = 0;
    row = 0;
    tickWidth = 0;
    // bbox: IRect;

    get rotatedWidth(): number {
        const d = this.rotation * DEG_RAD;
        const r = this.getBBounds();

        return Math.abs(Math.sin(d) * r.height) + Math.abs(Math.cos(d) * r.width);
    }

    get rotatedHeight(): number {
        const d = this.rotation * DEG_RAD;
        const r = this.getBBounds();

        return Math.abs(Math.cos(d) * r.height) + Math.abs(Math.sin(d) * r.width);
    }
}

export class AxisView extends ChartElement<Axis> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly AXIS_CLASS = 'rct-axis';
    static readonly LINE_CLASS = 'rct-axis-line';
    static readonly TICK_CLASS = 'rct-axis-tick-mark';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lineView: LineElement;
    private _titleView: AxisTitleView;
    private _markContainer: RcElement;
    private _markViews: AxisTickMarkView[] = [];
    private _labelContainer: RcElement;
    private _labelViews: AxisLabelElement[] = []; 
    private _markLen: number;
    private _labelSize: number;

    _guideViews: AxisGuideView<AxisGuide>[];
    _frontGuideViews: AxisGuideView<AxisGuide>[];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, AxisView.AXIS_CLASS);

        this.add(this._lineView = new LineElement(doc, AxisView.LINE_CLASS));
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
        const t = this.$_prepareChecker(doc, m);
        let h = m.tick.visible ? m.tick.length : 0; 

        h += t ? (t.rotation != 0 ? t.rotatedHeight : t.getBBounds().height) : 0;

        if (this._titleView.visible = m.title.visible) {
            h += this._titleView.measure(doc, m.title, width, height, 1).height;
        }
        return h;
    }

    checkWidth(doc: Document, width: number, height: number): number {
        const m = this.model;
        const t = this.$_prepareChecker(doc, m);
        let w = m.tick.visible ? m.tick.length : 0; 

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
        const rotation = horz ? (model.label.rotation || 0) % 360 : 0;
        let sz = 0;

        // line
        this._lineView.visible = model.line.visible;

        // tick marks 
        this._markLen = model.tick.length || 0; // tick.mark.visible이 false이어도 자리는 차지한다.
        if (this._markLen > 0) {
            sz += model.tick.margin || 0;
        }
        sz += this._markLen;
        if (this.$_prepareTickMarks(doc, model)) {
            this._markViews.forEach(v => v.measure(doc, model.tick, hintWidth, hintHeight, phase));
        }

        // labels
        this.$_prepareLabels(doc, model, rotation);

        if (labelViews.length > 0) {
            if (horz) {
                sz += this._labelSize = this.$_measureLabelsHorz(labelViews, rotation);
            } else {
                sz += this._labelSize = this.$_measureLabelsVert(labelViews);
            }
        } else {
            this._labelSize = 0;
        }

        // title
        if (titleView.visible) { // checkHeight/checkWidth 에서 visible 설정.
            sz += titleView.mh;
            sz += model.title.gap || 0;
        }

        return Size.create(horz ? hintWidth : sz, horz ? sz : hintHeight);
    }
    
    protected _doLayout(): void {
        const model = this.model;
        const horz = model._isHorz;
        const opp = model._isOpposite;
        const ticks = model._ticks;
        const markPts = model._markPoints;
        const titleView = this._titleView;
        const labelViews = this._labelViews;
        const markLen = this._markLen;
        const w = this.width;
        const h = this.height;

        // line
        if (this._lineView.visible) {
            if (horz) {
                this._lineView.setHLine(opp ? h : 0, 0, w);
                // this._lineView.setHLineC(opp ? h : 0, 0, w);
            } else {
                this._lineView.setVLine(opp ? 0 : w, 0, h);
                // this._lineView.setVLineC(opp ? 0 : w, 0, h);
            }
        }

        // tick marks
        if (this._markContainer.visible) {
            if (horz) {
                this._markViews.forEach((v, i) => {
                    v.resize(1, markLen);
                    v.layout().translate(markPts[i], opp ? h - markLen : 0);
                })
            } else {
                this._markViews.forEach((v, i) => {
                    v.resize(markLen, 1);
                    v.layout().translate(opp ? 0 : w - markLen, h - markPts[i]);
                })
            }
        }

        // labels
        const len = markLen + (model.tick.margin || 0);

        if (this._labelContainer.visible) {
            if (horz) {
                this.$_layoutLabelsHorz(labelViews, ticks, opp, w, h, len);
            } else {
                this.$_layoutLabelsVert(labelViews, ticks, opp, w, h, len);
            }
        }

        // title
        if (titleView.visible) {
            const labelSize = this._labelSize;
            const gap = model.title.gap || 0;

            titleView.resizeByMeasured().layout(horz);

            if (horz) {
                const y = opp ? 0 : len + labelSize + gap;

                // titleView.translate((w - titleView.width) / 2, this._markLen + labelSize);
                titleView.translate(w / 2, y);
            } else {
                const x = opp ? len + labelSize + gap + titleView.height / 2 : w - len - labelSize - gap - titleView.height / 2;

                titleView.translate(x, (h - titleView.height) / 2);
            }
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareChecker(doc: Document, m: Axis): AxisLabelElement {
        if (this._labelContainer.visible = m.label.visible) {
            const ticks = m._ticks;
            let tick = ticks[0];
            let t: AxisLabelElement;

            if (tick) {
                if (m.label.getRotation() !== 0) {
                    let len = tick.label.length;
                    let j = 0;

                    for (let i = 1; i < ticks.length; i++) {
                        if (ticks[i].label.length > len) {
                            len = ticks[i].label.length;
                            tick = ticks[i];
                            j = i;
                        }
                    }
                    t = this._labelViews[j];

                } else {
                    t = this._labelViews[0];
                }
    
                if (!t) {
                    t = new AxisLabelElement(doc, 'rct-axis-label');
                    t.anchor = TextAnchor.START;
                    this._labelContainer.add(t);
                    this._labelViews.push(t);
                }
        
                t.text = tick.label
                return t;
            }
        }
    }

    private $_prepareTickMarks(doc: Document, m: Axis): boolean {
        const container = this._markContainer;

        if (container.visible = m.tick.visible) {
            const pts = m._markPoints;
            const nMark = pts.length;
            const views = this._markViews;
    
            while (views.length < nMark) {
                const v = new AxisTickMarkView(doc);
    
                container.add(v);
                views.push(v);
            }
            while (views.length > nMark) {
                views.pop().remove();
            }
            return true;
        }
    }

    private $_prepareLabels(doc: Document, m: Axis, rotation: number): boolean {
        const container = this._labelContainer;

        if (container.visible) {
            const ticks = m._ticks;
            const nTick = ticks.length;
            const views = this._labelViews;
    
            while (views.length < nTick) {
                const t = new AxisLabelElement(doc, 'rct-axis-label');
    
                t.anchor = TextAnchor.START;
                container.add(t);
                views.push(t);
            }
            while (views.length > nTick) {
                views.pop().remove();
            }
    
            views.forEach((v, i) => {
                v.text = ticks[i].label;
                v.rotation = rotation;
            });
            return true;
        }
    }

    private $_measureLabelsHorz(views: AxisLabelElement[], rotation: number): number {
        let sz: number;

        if (rotation != 0) {
            sz = views[0].rotatedHeight;
            for (let i = 1; i < views.length; i++) {
                sz = Math.max(sz, views[i].rotatedHeight);
            }
        } else {
            sz = views[0].getBBounds().height;
            for (let i = 1; i < views.length; i++) {
                sz = Math.max(sz, views[i].getBBounds().height);
            }
        }
        return sz;
    }

    private $_measureLabelsVert(views: AxisLabelElement[]): number {
        let sz = views[0].getBBounds().width;

        for (let i = 1; i < views.length; i++) {
            sz = Math.max(sz, views[i].getBBounds().width);
        }
        return sz;
    }

    private $_layoutLabelsHorz(views: AxisLabelElement[], ticks: IAxisTick[], opp: boolean, w: number, h: number, len: number): void {
        views.forEach((v, i) => {
            const rot = v.rotation;
            const a = rot * DEG_RAD;
            const r = v.getBBounds();
            const ascent = Math.floor(v.getAscent(r.height));
            let x = ticks[i].pos;
            let y = opp ? h - len - r.height : len;

            if (rot < -15 && rot >= -90) {
                v.anchor = TextAnchor.END;
                x += -Math.sin(a) * ascent / 2 - 1;
                y += Math.cos(a) * ascent - ascent;
            } else if (rot > 15 && rot <= 90) {
                v.anchor = TextAnchor.START;
                x -= Math.sin(a) * ascent / 2 - 1;
                y += Math.cos(a) * ascent - ascent;
            } else {
                v.anchor = TextAnchor.MIDDLE;
            }
            v.translate(x, y);
        });
    }

    private $_layoutLabelsVert(views: AxisLabelElement[], ticks: IAxisTick[], opp: boolean, w: number, h: number, len: number): void {
        const x = opp ? len : w - len;
    
        views.forEach((v, i) => {
            const r = v.getBBounds();
            const x2 = opp ? x : x - r.width;

            v.translate(x2, h - ticks[i].pos - r.height / 2);
        });
}
}