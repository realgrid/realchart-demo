////////////////////////////////////////////////////////////////////////////////
// AxisView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { cos, pickNum, sin } from "../common/Common";
import { ElementPool } from "../common/ElementPool";
import { PathBuilder } from "../common/PathBuilder";
import { PathElement, RcElement } from "../common/RcControl";
import { toSize } from "../common/Rectangle";
import { SvgRichText } from "../common/RichText";
import { ISize, Size } from "../common/Size";
import { Align, DEG_RAD } from "../common/Types";
import { LabelElement } from "../common/impl/LabelElement";
import { LineElement } from "../common/impl/PathElement";
import { RectElement } from "../common/impl/RectElement";
import { TextElement } from "../common/impl/TextElement";
import { Axis, AxisGuide, AxisLabel, AxisLabelArrange, AxisPosition, AxisScrollBar, AxisTick, AxisTitle, AxisTitleAlign, AxisZoom, IAxisTick } from "../model/Axis";
import { ChartItem } from "../model/ChartItem";
import { Crosshair } from "../model/Crosshair";
import { AxisGuideContainer, AxisGuideView } from "./BodyView";
import { BoundableElement, ChartElement } from "./ChartElement";

/**
 * @internal
 */
export class AxisTitleView extends BoundableElement<AxisTitle> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    static readonly TITLE_CLASS = 'rct-axis-title';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _textView: TextElement;
    private _richText: SvgRichText;
    _angle: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, AxisTitleView.TITLE_CLASS, 'rct-axis-title-background');

        this.add(this._textView = new TextElement(doc));
        this._richText = new SvgRichText();
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
        this._angle = model.getRotation(model.axis);

        // this._textView.text = model.text;
        this._richText.setFormat(model.text);
        this._richText.build(this._textView, hintWidth, hintHeight, null, null);

        const sz = toSize(this._textView.getBBounds());

        if (!model.axis._isHorz && this._angle !== 0) {
            const w = sz.width;
            sz.width = sz.height;
            sz.height = w;
        }
        return sz;
    }

    protected _doLayout(isHorz: boolean): void {
        // text
        this._textView.translateY(this._margins.top + this._paddings.top);
        // this._textView.translate(this._paddings.left, this._paddings.top);

        // rotation
        if (!isHorz) {
            this.setRotation(0, this.height / 2, this._angle);
        } else {
            this.rotation = 0;
        }
    }

    resizeByMeasured(): ChartElement<ChartItem> {
        if (this._angle === 0) {
            this.resize(this.mw, this.mh);
        } else {
            this.resize(this.mh, this.mw);
        }
        return this;
    }

    layout(param?: any): ChartElement<ChartItem> {
        super.layout(param);

        if (this._debugRect) {
            this._debugRect.setBounds(-this.width / 2, 0, this.width, this.height)
        }
        return this;
    }
}

class AxisTickMarkView extends ChartElement<AxisTick> {

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

export class AxisLabelView extends LabelElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    index = -1;
    value: number;
    col = 0;
    row = 0;
    tickWidth = 0;
    private _richText: SvgRichText;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    setLabel(model: AxisLabel, label: string, maxWidth: number, maxHeight: number): void {
        if (label) {
            if (!this._richText) {
                this._richText = new SvgRichText(label);
                
            } else if (this._richText._format !== label) {
                this._richText.setFormat(label);
            }
            this.setModel(this.doc, model, null);
            this._richText.build(this._text, maxWidth, maxHeight, model, model._getParam);
            this._outline && this._richText.build(this._outline, maxWidth, maxHeight, model, model._getParam);
        } else if (this._richText) {
            this._richText = null;
            this._text.text = '';
        }
    }

    // rotatedWidth(): number {
    //     const d = this.rotation * DEG_RAD;
    //     const r = this.getBBounds();

    //     return Math.abs(sin(d) * r.height) + Math.abs(cos(d) * r.width);
    // }

    rotatedHeight(): number {
        const d = this.rotation * DEG_RAD;
        const r = this.getBBounds();

        return Math.abs(cos(d) * r.height) + Math.abs(sin(d) * r.width);
    }
}

class CrosshairFlagView extends RcElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _back: PathElement;
    private _text: TextElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, void 0)

        this.add(this._back = new PathElement(doc, 'rct-crosshair-flag'));
        this.add(this._text = new TextElement(doc, 'rct-crosshair-flag-text'));
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setText(model: Crosshair, text: string): void {
        if (text !== this._text.text) {
            this._text.text = text;

            const r = this._text.getBBounds();
            const pb = new PathBuilder();
            const w = Math.max(model.flag.minWidth || 0, r.width + 8);

            pb.rect(0, 0, w, r.height + 4);
            this._back.setPath(pb.end());
            this._text.translate(w / 2, 2);
        }
    }
}

export class AxisScrollView extends ChartElement<AxisScrollBar> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly TRACK_CLASS = 'rct-axis-scrollbar-track';
    static readonly THUMB_CLASS = 'rct-axis-scrollbar-thumb';

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static isThumb(dom: Element): boolean {
        return dom.classList.contains(AxisScrollView.THUMB_CLASS);
    }

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _trackView: RectElement;
    _thumbView: RectElement;

    _vertical: boolean;
    _reversed: boolean;
    _szThumb: number;

    private _max = 0;
    private _page = 0;
    private _pos = 0;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-axis-scrollbar');

        this.add(this._trackView = new RectElement(doc, AxisScrollView.TRACK_CLASS));
        this.add(this._thumbView = new RectElement(doc, AxisScrollView.THUMB_CLASS));
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    setScroll(zoom: AxisZoom, reversed: boolean): void {
        this._reversed = reversed;

        if (zoom) {
            const max = zoom.max - zoom.min;
            const page = zoom.end - zoom.start;
    
            this._max = Math.max(0, max);
            this._page = Math.min(page, max);
            this._pos = Math.min(max - page, Math.max(0, zoom.start));
        } else {
            this._max = 0;
        }
    }

    getZoomPos(pt: number): number {
        const zoom = this.model.axis._zoom;
        const len = (this._vertical ? this.height : this.width) - (this._vertical ? this._thumbView.height : this._thumbView.width);

        if (this.model.axis.reversed) {
            // TODO
            pt = Math.max(0, Math.min(pt, len));
            return pt * (zoom.max - zoom.min - (zoom.end - zoom.start)) / len;
        } else {
            pt = Math.max(0, Math.min(pt, len));
            return pt * (zoom.max - zoom.min - (zoom.end - zoom.start)) / len;
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: AxisScrollBar, hintWidth: number, hintHeight: number, phase: number): ISize {
        this.setStyleOrClass(model.style);

        return (this._vertical = !model.axis._isHorz) ? {
            width: model.thickness + model.gap + model.gapFar, height: hintHeight
        } : {
            width: hintWidth, height: model.thickness + model.gap + model.gapFar
        };
    }

    protected _doLayout(param: any): void {
        const model = this.model;
        const szThumb = this._szThumb = pickNum(model.minThumbSize, 32);
        const max = this._max;
        const page = this._page;
        const pos = this._pos;
        const fill = this._max === 0;
        let w = this.width;
        let h = this.height;

        if (this._vertical) {
            w -= model.gap + model.gapFar;
            this._trackView.setBounds(model.gap, 0, w, h);
            
            h -= szThumb;
            const hPage = (fill || page === max ? h : h * page / max) + szThumb;

            if (this._reversed) {
                // TODO
                this._thumbView.setBounds(model.gap + 1, fill ? 0 : (this.height - h * pos / max) - hPage, w - 2, hPage); 
            } else {
                this._thumbView.setBounds(model.gap + 1, fill ? 0 : (this.height - h * pos / max) - hPage, w - 2, hPage); 
            }
        } else {
            h -= model.gap + model.gapFar;
            this._trackView.setBounds(0, model.gap, w, h);
            
            w -= szThumb;
            const wPage = (fill || page === max ? w : w * page / max) + szThumb;

            if (this._reversed) {
                // TODO
                this._thumbView.setBounds(fill ? 0 : w * pos / max, model.gap + 1, wPage, h - 2); 
            } else {
                this._thumbView.setBounds(fill ? 0 : w * pos / max, model.gap + 1, wPage, h - 2); 
            }
        }
    }
}

export const axis_label_reg = /\${label}.*?/g;

/**
 * @internal
 */
export class AxisView extends ChartElement<Axis> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly AXIS_CLASS = 'rct-axis';
    static readonly LINE_CLASS = 'rct-axis-line';
    static readonly TICK_CLASS = 'rct-axis-tick';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _simpleMode = false;
    private _lineView: LineElement;
    private _lineView2: LineElement; // between일 때
    private _titleView: AxisTitleView;
    private _markContainer: RcElement;
    private _markViews: AxisTickMarkView[] = [];
    private _labelContainer: RcElement;
    private _labelViews: ElementPool<AxisLabelView>;
    _scrollView: AxisScrollView;

    private _markLen: number;
    private _labelSize: number;
    private _labelRowPts: number[];

    _guideViews: AxisGuideView<AxisGuide>[];
    _frontGuideViews: AxisGuideView<AxisGuide>[];
    _crosshairView: CrosshairFlagView;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, AxisView.AXIS_CLASS);

        this.add(this._lineView = new LineElement(doc, AxisView.LINE_CLASS));
        this.add(this._titleView = new AxisTitleView(doc));
        this.add(this._markContainer = new RcElement(doc, 'rct-axis-ticks'));
        this.add(this._labelContainer = new RcElement(doc, 'rct-axis-labels'));
        this._labelViews = new ElementPool(this._labelContainer, AxisLabelView, 'rct-axis-label');
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    private $_checkScrollView(doc: Document, bar: AxisScrollBar, prop: string, width: number, height: number): number {
        if (bar.visible && !this.model._isBetween) {
            if (!this._scrollView) {
                this.add(this._scrollView = new AxisScrollView(doc));
            }
            this._scrollView.setVis(true);
            return this._scrollView.measure(doc, bar, width, height, 1)[prop];
        } else if (this._scrollView) {
            this._scrollView.setVis(false);
        }
        return 0;
    }
    
    checkHeight(doc: Document, width: number, height: number): number {
        const m = this.model;
        let h = m.tick.visible ? m.tick.length : 0; 

        // labels
        // const t = this.$_prepareChecker(doc, m);
        // let h = m.tick.visible ? m.tick.length : 0; 

        // h += t ? (t.rotation != 0 ? t.rotatedHeight : t.getBBounds().height) : 0;

        if (this.$_prepareLabels(m)) {
            h += this.$_measureLabelsHorz(m, width);
        }

        // title
        if (this._titleView.setVis(m.title.isVisible())) {
            h += this._titleView.measure(doc, m.title, width, height, 1).height;
            h += m.title.gap;
        }
        
        // scrollbar
        h += this.$_checkScrollView(doc, m.scrollBar, 'height', width, height);
        
        return h;
    }

    checkWidth(doc: Document, width: number, height: number): number {
        const m = this.model;
        let w = m.tick.visible ? m.tick.length : 0; 
        
        // labels
        // const t = this.$_prepareChecker(doc, m);
        // let w = m.tick.visible ? m.tick.length : 0; 

        // w += t ? t.getBBounds().width : 0;

        if (this.$_prepareLabels(m)) {
            w += this.$_measureLabelsVert(m, width);
        }

        // title
        if (this._titleView.visible = m.title.isVisible()) {
            w += this._titleView.measure(doc, m.title, width, height, 1).width; // [NOTE] width가 아니다.
            w += m.title.gap;
        }
        
        // scrollbar
        w += this.$_checkScrollView(doc, m.scrollBar, 'width', width, height);

        return w;
    }

    prepareGuides(doc: Document, row: number, col: number, container: AxisGuideContainer, frontContainer: AxisGuideContainer): void {
        let guides = this.model.guides.filter(g => !g.front && g.canConstainedTo(row, col));
        container.addAll(doc, guides);

        guides = this.model.guides.filter(g => g.front && g.canConstainedTo(row, col));
        frontContainer.addAll(doc, guides);
    }

    showCrosshair(pos: number, text: string): void {
        let cv = this._crosshairView;
        let x: number;

        if (!cv) {
            this.add(cv = this._crosshairView = new CrosshairFlagView(this.doc));
        }
        cv.setVis(true);

        cv.setText(this.model.crosshair, text);
        const r = cv.getBBounds();

        if (this.model._isHorz) {
            cv.translate(pos - r.width / 2, this.model.tick.length);
        } else {
            if (this.model._runPos === AxisPosition.OPPOSITE) {
                x = Math.min(0, this.width - r.width);
            } else {
                x = Math.max(0, this.width - this.model.tick.length - r.width);
            }
            cv.translate(x, pos - r.height / 2);
        }
    }

    hideCrosshiar(): void {
        if (this._crosshairView && this._crosshairView.visible) {
            this._crosshairView.setVis(false);
        }
    }

    scroll(pos: number): void {
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: Axis, hintWidth: number, hintHeight: number, phase: number): ISize {
        const horz = model._isHorz;
        const between = model._isBetween;
        const titleView = this._titleView;
        let sz = 0;

        // line
        if (this._lineView.visible = model.line.visible) {
            this._lineView.setStyleOrClass(model.line.style);
            if (between) {
                if (!this._lineView2) {
                    this.insertChild(this._lineView2 = new LineElement(doc, AxisView.LINE_CLASS), this._lineView);
                } else {
                    this._lineView2.setVis(true);
                }
                this._lineView.setStyleOrClass(model.line.style);
            }
        } else if (this._lineView2) {
            this._lineView2.setVis(false);
        }

        // tick marks 
        this._markLen = model.tick.length || 0; // tick.mark.visible이 false이어도 자리는 차지한다.
        if (this._markLen > 0) {
            sz += model.tick.gap || 0;
        }
        sz += this._markLen;
        if (this.$_prepareTickMarks(doc, model)) {
            this._markViews.forEach(v => v.measure(doc, model.tick, hintWidth, hintHeight, phase));
        }
        if (between) sz *= 2; // 양쪽에 간격은 둔다.

        // labels
        if (this.$_prepareLabels(model)) {
            if (horz) {
                sz += this._labelSize = this.$_measureLabelsHorz(model, hintWidth);
            } else {
                sz += this._labelSize = this.$_measureLabelsVert(model, hintHeight);
            }
        } else {
            this._labelSize = 0;
        }

        if (this._simpleMode) {
            titleView.setVis(false);
        } else {
            // title
            if (titleView.visible) { // checkHeight/checkWidth 에서 visible 설정.
                sz += horz ? titleView.mh : titleView.mw;
                sz += +model.title.gap || 0;
            }

            // scrollbar
            if (this._scrollView?.visible) {
                sz += horz ? this._scrollView.mh : this._scrollView.mw;
            }
        }

        return Size.create(horz ? hintWidth : sz, horz ? sz : hintHeight);
    }
    
    protected _doLayout(): void {
        const model = this.model;
        const horz = model._isHorz;
        const opp = model._isOpposite;
        const between = model._isBetween;
        const ticks = model._ticks;
        const markPts = model._markPoints;
        const labelViews = this._labelViews;
        const markLen = this._markLen;
        const w = this.width;
        const h = this.height;

        // line
        if (this._lineView.visible) {
            if (horz) {
                // this._lineView.setHLine(opp ? h : 0, 0, w);
                this._lineView.setHLineC(opp ? h : 0, 0, w);
            } else {
                // this._lineView.setVLine(opp ? 0 : w, 0, h);
                this._lineView.setVLineC(opp ? 0 : w, 0, h);
            }

            if (this._lineView2) { // when between
                if (horz) {
                    this._lineView2.setHLineC(h, 0, w);
                } else {
                    this._lineView2.setVLineC(0, 0, h);
                }
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
        const len = markLen + (model.tick.gap || 0);

        if (this._labelContainer.visible) {
            if (horz) {
                this.$_layoutLabelsHorz(labelViews, ticks, between, opp, w, h, len);
            } else {
                this.$_layoutLabelsVert(labelViews, ticks, between, opp, w, h, len);
            }
        }

        if (!this._simpleMode) {
            const titleView = this._titleView;
            const scrollView = this._scrollView;
            let x = 0;
            let y = 0;

            // title
            if (titleView.visible) {
                const labelSize = this._labelSize;
                const off = +model.title.offset || 0;
                const gap = +model.title.gap || 0;
    
                titleView.resizeByMeasured().layout(horz);
    
                if (horz) {
                    y += opp ? 0 : len + labelSize + gap;

                    if (model.reversed) {
                        switch (model.title.align) {
                            case AxisTitleAlign.START:
                                x = w - titleView.width / 2 - off;
                                break;
                            case AxisTitleAlign.END:
                                x = titleView.width / 2 + off;
                                break;
                            case AxisTitleAlign.MIDDLE:
                            default:
                                x = w / 2 - off;
                                break;
                        }
                    } else {
                        switch (model.title.align) {
                            case AxisTitleAlign.START:
                                x = titleView.width / 2 + off;
                                break;
                            case AxisTitleAlign.END:
                                x = w - titleView.width / 2 - off;
                                break;
                            case AxisTitleAlign.MIDDLE:
                            default:
                                x = w / 2 + off;
                                break;
                        }
                    }
                    
                    titleView.translate(x, y);
                    y += titleView.height;

                } else {
                    const sz = titleView._angle === 0 ? titleView.width : titleView.height;
                    x = opp ? len + labelSize + gap + sz / 2 : w - len - labelSize - gap - sz / 2;
    
                    if (model.reversed) {
                        if (titleView._angle === 0) {
                            switch (model.title.align) {
                                case AxisTitleAlign.START:
                                    y = 0 + off;
                                    break;
                                case AxisTitleAlign.END:
                                    y = h - titleView.height - off;
                                    break;
                                case AxisTitleAlign.MIDDLE:
                                default:
                                    y = (h - titleView.height) / 2 + off;
                                    break;
                            }
                        } else {
                            switch (model.title.align) {
                                case AxisTitleAlign.START:
                                    y = titleView.width / 2 - titleView.height / 2 + off;
                                    break;
                                case AxisTitleAlign.END:
                                    y = h - titleView.width / 2 - titleView.height / 2 - off;
                                    break;
                                case AxisTitleAlign.MIDDLE:
                                default:
                                    y = (h - titleView.height) / 2 + off;
                                    break;
                            }
                        }
                    } else {
                        if (titleView._angle === 0) {
                            switch (model.title.align) {
                                case AxisTitleAlign.START:
                                    y = h - titleView.height - off;
                                    break;
                                case AxisTitleAlign.END:
                                    y = 0 + off;
                                    break;
                                case AxisTitleAlign.MIDDLE:
                                default:
                                    y = (h - titleView.height) / 2 - off;
                                    break;
                            }
                        } else {
                            switch (model.title.align) {
                                case AxisTitleAlign.START:
                                    y = h - titleView.width / 2 - titleView.height / 2 - off;
                                    break;
                                case AxisTitleAlign.END:
                                    y = titleView.width / 2 - titleView.height / 2 + off;
                                    break;
                                case AxisTitleAlign.MIDDLE:
                                default:
                                    y = (h - titleView.height) / 2 - off;
                                    break;
                            }
                        }
                    }
                    titleView.translate(x, y);
                }
            }
    
            // scrollbar
            if (scrollView?.visible) {
                if (horz) {
                    scrollView.translate(0, y).resize(this.width, scrollView.mh);
                    scrollView.setScroll(model._zoom, model.reversed);
                } else {
                    scrollView.translate(0, 0).resize(scrollView.mw, this.height);
                    scrollView.setScroll(model._zoom, model.reversed);
                }
                scrollView.layout();
            }
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
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

    private _prepareLabel(view: AxisLabelView, tick: IAxisTick, model: AxisLabel, count: number): void {
        const text = model.getLabelText(tick, count);
        const label = tick.label;

        view.value = tick.value;

        view.internalClearStyleAndClass();
        view.internalSetStyleOrClass(model.style);
        view.internalSetStyleOrClass(model.getLabelStyle(tick, count));

        // model.getLabelText()에서 빈 문자열를 리턴할 수 있다.
        if (text != null) {
            const m = label && text.match(axis_label_reg);
            
            if (m) {
                view.setLabel(model, text.replace(axis_label_reg, label), 1000, 1000);
            } else {
                model.prepareRich(text);
                model._paramTick = tick;
                view.setModel(this.doc, model, null);
                model.buildSvg(view._text, view._outline, NaN, NaN, model, model._getParam);
            }
        } else {
            // view.setText(tick.label);
            view.setLabel(model, label, 1000, 1000);
        }
    }

    private $_prepareLabels(m: Axis): number {
        const labels = m.label;

        if (this._labelContainer.setVis(labels.visible)) {
            const ticks = m._ticks;

            this._labelContainer.setStyleOrClass(labels.style);

            return this._labelViews.prepare(ticks.length, (v, i, count) => {
                v.setVis(true);
                this._prepareLabel(v, ticks[i], labels, count);
            }).count;
        }
        return 0;
    }

    private $_getRows(views: AxisLabelView[]): number {
        return 2;
    }

    private $_getStep(view: AxisLabelView[]): number {
        return 2;
    }

    private $_checkOverlappedHorz(axis: Axis, views: AxisLabelView[], width: number, step: number, rows: number, rotation: number): boolean {
        const nView = views.length;
        const inc = Math.max(1, step) * Math.max(1, rows);
        const a = rotation || 0;
        const arad = Math.abs(a) * Math.PI / 180;
        let overalpped = false;

        views.forEach(v => v.rotation = a);

        for (let i = 0; i < nView - 1; i += inc) {
            let w = 0;
            let j = i;

            for (; j < i + inc && j < nView - 1; j++) {
                w += axis.getLabelLength(width, views[i].value);
            }

            // [주의] 끝 차투리는 무시한다.
            if (j === i + inc) {
                if (a === 0 && views[i].getBBounds().width >= w) {
                    overalpped = true;
                    break;
                } else if  (a !== 0 && (views[i].getBBounds().width + views[i].getBBounds().height) * cos(arad) >= w) {
                    overalpped = true;
                    break;
                }
            }
        }
        return overalpped;
    }

    private $_applyStep(axis: Axis, views: AxisLabelView[], step: number): AxisLabelView[] {
        const m = axis.label;
        const start = Math.max(0, m.startStep || 0);
            
        views.forEach(v => v.index = -1);
        for (let i = start; i < views.length; i += step) {
            views[i].index = i;
        }
        views.forEach(v => v.setVis(v.index >= 0));
        return views.filter(v => v.visible);
    }

    private $_measureLabelsHorz(axis: Axis, width: number): number {
        const m = axis.label;
        let views = this._labelViews._internalItems();
        let step = +m.step >> 0;
        let rows = +m.rows >> 0;
        let rotation = +m.rotation % 360;
        let overlapped = this.$_checkOverlappedHorz(axis, views, width, step, rows, rotation);
        let sz: number;

        views.forEach(v => v.row = 0);
        this._labelRowPts = [0];

        if (!overlapped) {
            views = this.$_applyStep(axis, views, step || 1);
        } else if (m.autoArrange === AxisLabelArrange.NONE) {
            // TODO: clip | ellipsis | wrap
            views = this.$_applyStep(axis, views, 1);
        } else {
            step = rows = rotation = 0;

            switch (m.autoArrange) {
                case AxisLabelArrange.ROWS:
                    rows = this.$_getRows(views);
                    break;
                case AxisLabelArrange.STEP:
                    step = this.$_getStep(views);
                    break;
                // case AxisLabelArrange.ROTATE:
                default:
                    rotation = -45;
                    break;
            }

            if (step > 1) {
                const save = views.slice(0);
                while (save.length > 1) {
                    views = this.$_applyStep(axis, save, step);
                    if (!this.$_checkOverlappedHorz(axis, save, width, step, 1, 0)) {
                        break;
                    }
                    step++;
                }
                // this._labelViews = views;
            } else if (rows > 1) {
                while (views.length > rows) {
                    views.forEach((v, i) => {
                        v.row = i % rows;
                        v.index = i;
                    });
                    if (!this.$_checkOverlappedHorz(axis, views, width, 1, rows, 0)) {
                        break;
                    }
                    rows++;
                }
                this._labelRowPts = [];

            } else {
                rotation = -45;
                views.forEach((v, i) => {
                    v.rotation = rotation;
                    v.index = i;
                });
                // TODO: rotation이 적용됐는데도 overlapped이면 stepping을 한다.
                if (this.$_checkOverlappedHorz(axis, views, width, step, rows, rotation)) {
                    step = Math.max(2, step++);
                    views = this.$_applyStep(axis, views, step);
                    // rotation을 제거해도 문제없으면 제거한다.
                    if (this.$_checkOverlappedHorz(axis, views, width, step, rows, 0)) {
                        views.forEach((v, i) => {
                            v.rotation = rotation;
                        });
                    }
                }   
            }
        }

        if (rows > 1) {
            const rotated = !isNaN(rotation) && rotation != 0;
            const pts = this._labelRowPts;

            if (rows > 1) {
                views.forEach((v, i) => v.row = i % rows);
            }

            for (let i = 0; i < rows; i++) {
                pts.push(0);
            }

            views.forEach(v => {
                pts[v.row] = Math.max(pts[v.row], rotated ? v.rotatedHeight() : v.getBBounds().height);
            })

            pts.unshift(0);
            for (let i = 2; i < pts.length; i++) {
                pts[i] += pts[i - 1];
            }
            return pts[pts.length - 1];

        } else {
            if (!isNaN(rotation) && rotation != 0) {
                sz = views[0].rotatedHeight();
                for (let i = 1; i < views.length; i++) {
                    sz = Math.max(sz, views[i].rotatedHeight());
                }
            } else {
                sz = views[0].getBBounds().height;
                for (let i = 1; i < views.length; i++) {
                    sz = Math.max(sz, views[i].getBBounds().height);
                }
            }
        }
        return sz;
    }

    private $_checkOverlappedVert(axis: Axis, views: AxisLabelView[], height: number, step: number): boolean {
        const nView = views.length;
        const inc = Math.max(1, step);

        views.forEach(v => v.rotation = 0);

        for (let i = 0; i < nView - 1; i += inc) {
            let h = 0;
            for (let j = i; j < i + inc && j < nView - 1; j++) {
                h += axis.getLabelLength(height, views[i].value);
            }

            if (views[i].getBBounds().height >= h) {
                return true;
            }
        }
    }

    private $_measureLabelsVert(axis: Axis, height: number): number {
        const m = axis.label;
        let views = this._labelViews._internalItems();
        let step = Math.max(1, +m.step >> 0);
        const overalpped = this.$_checkOverlappedVert(axis, views, height, step);

        if (!overalpped) {
            views = this.$_applyStep(axis, views, step);
        } else {
            const save = views.slice(0);

            while (save.length > 1 && step < save.length / 2) {
                views = this.$_applyStep(axis, save, ++step);
                if (!this.$_checkOverlappedHorz(axis, save, height, step, 1, 0)) {
                    break;
                }
            }
        }

        let sz = views[0].getBBounds().width;

        for (let i = 1; i < views.length; i++) {
            sz = Math.max(sz, views[i].getBBounds().width);
        }
        return sz;
    }

    private $_layoutLabelsHorz(views: ElementPool<AxisLabelView>, ticks: IAxisTick[], between: boolean, opp: boolean, w: number, h: number, gap: number): void {
        const align = Align.CENTER;
        const pts = this._labelRowPts;

        views.forEach(v => {
            if (v.visible) {
                const rot = v.rotation;
                const a = rot * DEG_RAD;
                const r = v.getBBounds();
                let x = ticks[v.index].pos;
                let y = opp ? (h - gap - r.height - pts[v.row]) : (gap + pts[v.row]);
    
                if (rot < -15 && rot >= -90) {
                    if (opp) {
                        x -= r.width;
                        y -= sin(a) * r.height / 2;
                        v.setRotation(r.width, r.height / 2, -rot);
                    } else {
                        x -= r.width;
                        y += sin(a) * r.height / 2;
                        v.setRotation(r.width, r.height / 2, rot);
                    }
                } else if (rot > 15 && rot <= 90) {
                    if (opp) {
                        y += sin(a) * r.height / 2;
                        v.setRotation(0, r.height / 2, -rot);
                    } else {
                        y -= sin(a) * r.height / 2;
                        v.setRotation(0, r.height / 2, rot);
                    }
                } else {
                    x -= r.width / 2;
                    v.setRotation(r.width / 2, 0, opp ? -rot : rot);
                }   
                v.setContrast(null).layout(align).translate(x, y);
            }
        });
    }

    private $_layoutLabelsVert(views: ElementPool<AxisLabelView>, ticks: IAxisTick[], between: boolean, opp: boolean, w: number, h: number, len: number): void {
        const align = opp ? Align.LEFT : between ? Align.CENTER : Align.RIGHT;
        const x = opp ? len : w - len;
    
        views.forEach((v, i) => {
            if (v.visible) {
                const r = v.getBBounds();
                const x2 = opp ? x : between ? (w - r.width) / 2 : x - r.width;
    
                v.setContrast(null).layout(align).translate(x2, h - ticks[i].pos - r.height / 2);
            }
        });
    }
}
