////////////////////////////////////////////////////////////////////////////////
// AxisView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { absv, cos, floor, maxv, minv, pickNum, sin } from "../common/Common";
import { ElementPool } from "../common/ElementPool";
import { PathBuilder } from "../common/PathBuilder";
import { PathElement, RcElement } from "../common/RcControl";
import { rectToSize } from "../common/Rectangle";
import { SvgRichText } from "../common/RichText";
import { ISize } from "../common/Size";
import { Align, DEG_RAD } from "../common/Types";
import { LabelElement } from "./LabelElement";
import { LineElement } from "../common/impl/PathElement";
import { RectElement } from "../common/impl/RectElement";
import { TextElement } from "../common/impl/TextElement";
import { Axis, AxisGuide, AxisLabel, AxisLabelArrange, AxisLabelOverflow, AxisPosition, AxisScrollBar, AxisTick, AxisTitle, AxisTitleAlign, AxisZoom, IAxisTick } from "../model/Axis";
import { ChartItem } from "../model/ChartItem";
import { Crosshair } from "../model/Crosshair";
import { AxisGuideContainer, AxisGuideView } from "./BodyView";
import { BoundableElement, ChartElement } from "./ChartElement";
import { AxisAnimation } from "./animation/AxisAnimation";

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

        const sz = rectToSize(this._textView.getBBox());

        if (!model.axis._isHorz && this._angle !== 0) {
            const w = sz.width;
            sz.width = sz.height;
            sz.height = w;
        }
        return sz;
    }

    protected _doLayout(isHorz: boolean): void {
        // text
        this._textView.transY(this._margins.top + this._paddings.top);
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
            this._lineView.setVLine(0, 0, this.height);
            // this._lineView.setVLineC(0, 0, this.height);
        } else {
            this._lineView.setHLine(0, 0, this.width);
            // this._lineView.setHLineC(0, 0, this.width);
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
    setLabel(model: AxisLabel, tick: IAxisTick, label: string, maxWidth: number, maxHeight: number): void {
        if (label) {
            if (!this._richText) {
                this._richText = new SvgRichText(label);
                
            } else if (this._richText._format !== label) {
                this._richText.setFormat(label);
            }
            const icon = model.getIcon(tick);
            this.setModel(this.doc, model, icon && model.getUrl(icon), null);
            this._richText.build(this._text, maxWidth, maxHeight, model, model._domain);
            this._outline && this._richText.build(this._outline, maxWidth, maxHeight, model, model._domain);
        } else if (this._richText) {
            this._richText = null;
            this._text.text = '';
        }
    }

    rotatedWidth(): number {
        const d = this.rotation * DEG_RAD;
        const r = this.getBBox();

        return absv(sin(d) * r.height) + absv(cos(d) * r.width);
    }

    rotatedHeight(): number {
        const d = this.rotation * DEG_RAD;
        const r = this.getBBox();

        return absv(cos(d) * r.height) + absv(sin(d) * r.width);
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

            const r = this._text.getBBox();
            const pb = new PathBuilder();
            const w = maxv(model.flag.minWidth || 0, r.width + 8);

            pb.rect(0, 0, w, r.height + 4);
            this._back.setPath(pb.end());
            this._text.trans(w / 2, 2);
        }
    }
}

export class AxisScrollView extends ChartElement<AxisScrollBar> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly CLASS_NAME = 'rct-axis-scrollbar';
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

    private _len = 0;
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
            const len = zoom.max - zoom.min;
            const page = zoom.end - zoom.start;
    
            this._len = maxv(0, len);
            this._page = minv(page, len);
            this._pos = minv(zoom.min + len - page, maxv(0, zoom.start));
        } else {
            this._len = 0;
        }
    }

    // ScrollTracker에서 호출한다.
    getZoomPos(pt: number): number {
        const zoom = this.model.axis._zoom;
        const len = (this._vertical ? this.height : this.width) - (this._vertical ? this._thumbView.height : this._thumbView.width);

        if (this.model.axis.reversed) {
            // TODO
            pt = maxv(0, minv(pt, len));
            return pt * (zoom.max - zoom.min - (zoom.end - zoom.start)) / len + zoom.min;
        } else {
            pt = maxv(0, minv(pt, len));
            return pt * (zoom.max - zoom.min - (zoom.end - zoom.start)) / len + zoom.min;
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
        const zoom = model.axis._zoom;
        const szThumb = this._szThumb = pickNum(model.minThumbSize, 32);
        const len = this._len;
        const fill = this._len === 0;
        const page = this._page;
        const pos = fill ? 0 : this._pos - zoom.min;
        const gaps = model.gap + model.gapFar;
        let w = this.width;
        let h = this.height;

        if (this._vertical) {
            w -= model.gap + model.gapFar;
            this._trackView.setBounds(model.gap, 0, w, h);
            
            h -= szThumb;
            const hPage = (fill || page === len ? h : h * page / len) + szThumb;

            if (this._reversed) {
                // TODO
                this._thumbView.setBounds(model.gap + 1, fill ? 0 : (this.height - h * pos / len) - hPage, w - 2, hPage); 
            } else {
                this._thumbView.setBounds(model.gap + 1, fill ? 0 : (this.height - h * pos / len) - hPage, w - 2, hPage); 
            }
        } else {
            h -= model.gap + model.gapFar;
            this._trackView.setBounds(0, model.gap, w, h);
            
            w -= szThumb;
            const wPage = (fill || page === len ? w : w * page / len) + szThumb;

            if (this._reversed) {
                // TODO
                this._thumbView.setBounds(fill ? 0 : w * pos / len, model.gap + 1, wPage, h - 2); 
            } else {
                this._thumbView.setBounds(fill ? 0 : w * pos / len, model.gap + 1, wPage, h - 2); 
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

    _prevModel: Axis;
    _prevMin: number;
    _prevMax: number;

    private _edgeStart = 0;
    private _marginStart = 0;
    private _marginEnd = 0;
    private _edgeEnd = 0;

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

        if (this.$_prepareLabels(m, width)) {
            h += this.$_measureLabelsHorz(m, width, true);
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

        if (this.$_prepareLabels(m, width)) {
            w += this.$_measureLabelsVert(m, height, true);
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
        container.addAll(doc, guides, false);

        guides = this.model.guides.filter(g => g.front && g.canConstainedTo(row, col));
        frontContainer.addAll(doc, guides, false);
    }

    showCrosshair(pos: number, text: string): void {
        const m = this.model;
        let cv = this._crosshairView;
        let x: number;

        if (!cv) {
            this.add(cv = this._crosshairView = new CrosshairFlagView(this.doc));
        }
        cv.setVis(true);
        cv.setText(m.crosshair, text);

        const r = cv.getBBox();

        if (m._isHorz) {
            cv.trans(pos - r.width / 2, m.tick.length);
        } else {
            if (m._runPos === AxisPosition.OPPOSITE) {
                x = minv(0, this.width - r.width);
            } else {
                x = maxv(0, this.width - m.tick.length - r.width);
            }
            cv.trans(x, pos - r.height / 2);
        }
    }

    setMargins(edgeStart: number, start: number, end: number, edgeEnd: number): void {
        this._edgeStart = edgeStart;
        this._marginStart = start;
        this._marginEnd = end;
        this._edgeEnd = edgeEnd;         
    }

    hideCrosshiar(): void {
        this._crosshairView && this._crosshairView.setVis(false);
    }

    scroll(pos: number): void {
    }

    checkExtents(loaded: boolean): void {
        const prev = this._prevModel;
        const m = this._prevModel = this.model;

        // chart를 새로 로드할 때는 실행하지 않는다.
        if ((!prev || prev === m) && loaded) {
            const min = this._prevMin;
            const max = this._prevMax;
    
            this._prevMin = m.axisMin();
            this._prevMax = m.axisMax();
    
            if (!isNaN(max) && this._prevMax !== max || !isNaN(min) && this._prevMin !== min) {
                if (!m._zooming && m.animatable) {
                // if (m.chart.isDataChanged() && m.animatable) {
                    new AxisAnimation(this, min, max, () => {
                        this.invalidate();
                    });
                }
            }
        }
    }

    clean(): void {
        this._prevMax = this._prevMin = NaN;
        this._prevModel = null;
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
        if (between) sz *= 2; // 양쪽에 간격을 둔다.

        // labels
        if (this.$_prepareLabels(model, horz ? hintWidth : hintHeight)) {
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

        return { width: horz ? hintWidth : sz, height: horz ? sz : hintHeight };
    }
    
    protected _doLayout(): void {
        const m = this.model;
        const horz = m._isHorz;
        const opp = m._isOpposite;
        const between = m._isBetween;
        const ticks = m._ticks;
        const markPts = m._markPoints;
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

            if (this._lineView2) { // when between
                if (horz) {
                    this._lineView2.setHLine(h, 0, w);
                    // this._lineView2.setHLineC(h, 0, w);
                } else {
                    this._lineView2.setVLine(0, 0, h);
                    // this._lineView2.setVLineC(0, 0, h);
                }
            }
        }

        // tick marks
        if (this._markContainer.visible) {
            if (horz) {
                this._markViews.forEach((v, i) => {
                    v.resize(1, markLen);
                    v.layout().trans(m.prev(markPts[i]), opp ? h - markLen : 0);
                })
            } else {
                this._markViews.forEach((v, i) => {
                    v.resize(markLen, 1);
                    v.layout().trans(opp ? 0 : w - markLen, h - m.prev(markPts[i]));
                })
            }
        }

        // labels
        const len = markLen + (m.tick.gap || 0);

        if (this._labelContainer.visible && labelViews.count > 0) { /// #527
            if (horz) {
                this.$_layoutLabelsHorz(labelViews, ticks, between, opp, w, h, len);
            } else {
                this.$_layoutLabelsVert(labelViews, ticks, between, opp, w, h, len);
            }
        }

        if (!this._simpleMode) {
            const titleView = this._titleView;
            const scrollView = this._scrollView;
            const labelSize = this._labelSize;
            let x = 0;
            let y = 0;

            // title
            if (titleView.visible) {
                const off = +m.title.offset || 0;
                const gap = +m.title.gap || 0;
    
                titleView.resizeByMeasured().layout(horz);
    
                if (horz) {
                    y += opp ? 0 : len + labelSize + gap;

                    if (m.reversed) {
                        switch (m.title.align) {
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
                        switch (m.title.align) {
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
                    
                    titleView.trans(x, y);
                    y += titleView.height;

                } else {
                    const sz = titleView._angle === 0 ? titleView.width : titleView.height;
                    x = opp ? len + labelSize + gap + sz / 2 : w - len - labelSize - gap - sz / 2;
    
                    if (m.reversed) {
                        if (titleView._angle === 0) {
                            switch (m.title.align) {
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
                            switch (m.title.align) {
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
                            switch (m.title.align) {
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
                            switch (m.title.align) {
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
                    titleView.trans(x, y);
                }
            } else {
                y += opp ? 0 : len + labelSize;
            }
    
            // scrollbar
            if (scrollView?.visible) {
                if (horz) {
                    scrollView.trans(0, y).resize(this.width, scrollView.mh);
                    scrollView.setScroll(m._zoom, m.reversed);
                } else {
                    scrollView.trans(0, 0).resize(scrollView.mw, this.height);
                    scrollView.setScroll(m._zoom, m.reversed);
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

    private _prepareLabel(view: AxisLabelView, tick: IAxisTick, model: AxisLabel, count: number, init: boolean): void {
        // value 체크만으로는 부족하다. #498
        // charter.render() 시 처음 measure()에만 실행되도록 한다.
        if (!init && view.value === tick.value) return;

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
                view.setLabel(model, tick, text.replace(axis_label_reg, label), 1000, 1000);
            } else {
                model.prepareRich(text);
                model._paramTick = tick;
                view.setModel(this.doc, model, null, null);
                model.buildSvg(view._text, view._outline, NaN, NaN, model, model._domain);
            }
        } else {
            // view.setText(tick.label);
            view.setLabel(model, tick, label, 1000, 1000);
        }
    }

    private $_prepareLabels(m: Axis, width: number): number {
        const labels = m.label;

        if (this._labelContainer.setVis(labels.visible)) {
            const ticks = m._ticks;
            let n = ticks.length;

            this._labelContainer.setStyleOrClass(labels.style);

            // return this._labelViews.prepare(n, (v, i, count) => {
            //     v.setVis(true);
            //     this._prepareLabel(v, ticks[i], labels, count);
            // }).count;
            return n;
        }
        return 0;
    }

    private $_getRows(views: AxisLabelView[]): number {
        return 2;
    }

    private $_getStep(view: AxisLabelView[]): number {
        return 2;
    }

    // private $_checkOverlappedHorz(axis: Axis, views: AxisLabelView[], width: number, step: number, rows: number, rotation: number): boolean {
    //     const nView = views.length;
    //     const inc = maxv(1, step) * maxv(1, rows);
    //     const a = rotation || 0;
    //     const arad = absv(a) * DEG_RAD;
    //     const acute = arad < 35 * DEG_RAD;
    //     let overalpped = false;

    //     views.forEach(v => v.rotation = a);

    //     for (let i = 0; i < nView; i += inc) {
    //         let w = 0;
    //         let j = i;

    //         for (; j < i + inc && j < nView; j++) {
    //             w += axis.getLabelLength(width, views[j].value);
    //         }

    //         // [주의] 끝 차투리는 무시한다.
    //         if (i + inc < nView) {
    //             if (a === 0 && views[i].getBBox().width >= w) {
    //                 overalpped = true;
    //                 break;
    //             } else if (acute && views[i].getBBox().width * cos(arad) >= w) {
    //                 overalpped = true;
    //                 break;
    //             } 
    //             // 30도 이상의 둔각이면 text 높이를 기준으로 한다.
    //             else if  (a !== 0 && views[i].getBBox().height >= w) {
    //             // } else if  (a !== 0 && views[i].getBBounds().width * cos(arad) >= w) {
    //             // } else if  (a !== 0 && (views[i].getBBounds().width + views[i].getBBounds().height) * cos(arad) >= w) {
    //                 overalpped = true;
    //                 break;
    //             }
    //         }
    //     }
    //     return overalpped;
    // }

    private $_checkOverlappedHorz2(axis: Axis, views: ElementPool<AxisLabelView>, width: number, step: number, rows: number, rotation: number, checkOnly: boolean, init: boolean): boolean {
        const labels = axis.label;
        const start = maxv(0, minv(step - 1, labels.startStep || 0));
        const ticks = axis._ticks;
        const nView = ticks.length;
        const inc = (step = maxv(1, step)) * (rows = maxv(1, rows));
        const a = rotation || 0;
        const arad = absv(a) * DEG_RAD;
        const acute = arad < 35 * DEG_RAD;
        let overalpped = false;
        let n = 0;
        let v: AxisLabelView;

        for (let r = 0; r < rows; r++) {
            let i = r * step + start; // #535

            for (; i < nView; i += inc) {
                let w = 0;
    
                for (let j = i; j < i + inc && j < nView; j++) {
                    w += axis.getLabelLength(width, ticks[j].value);
                }
    
                // [주의] 끝 차투리는 무시한다.
                if (i + inc < nView) {
                    v = views.pull(n++);
                    v.rotation = a;
                    v.row = r;
                    v.index = i;
                    this._prepareLabel(v, ticks[i], labels, nView, init)
                    v.setVis(true);

                    // 첫번째 label은 반절은 축 밖에 계산되므로...
                    const w2 = w;// i === 0 ? w * 2 : w;

                    if (a === 0 && v.getBBox().width >= w2) {
                        overalpped = true;
                        break;
                    } else if (acute && v.getBBox().width * cos(arad) >= w2) {
                        overalpped = true;
                        break;
                    } 
                    // 30도 이상의 둔각이면 text 높이를 기준으로 한다.
                    else if  (a !== 0 && v.getBBox().height >= w2) {
                    // } else if  (a !== 0 && views[i].getBBounds().width * cos(arad) >= w) {
                    // } else if  (a !== 0 && (views[i].getBBounds().width + views[i].getBBounds().height) * cos(arad) >= w) {
                        overalpped = true;
                        break;
                    }
                }
            }
    
            if (!overalpped) {
                if (i - inc < nView) {
                    v = views.pull(n++);
                    v.row = r;
                    v.rotation = a;
                    v.index = i - inc;
                    this._prepareLabel(v, ticks[i - inc], labels, nView, init);
                    v.setVis(true);
                }
            } else {
                return true;
            }
        }
        !checkOnly && views.freeFrom(n);
    }

    private $_applyStep(axis: Axis, views: AxisLabelView[], step: number): AxisLabelView[] {
        const m = axis.label;
        const start = maxv(0, minv(step - 1, m.startStep || 0)); // 535
            
        views.forEach(v => v.index = -1);
        for (let i = start; i < views.length; i += step) {
            views[i].index = i;
        }
        views.forEach(v => v.setVis(v.index >= 0));
        return views.filter(v => v.visible);
    }

    private $_measureLabelsHorz(axis: Axis, width: number, init = false): number {
        const m = axis.label;
        let step = +m.step >> 0;
        let rows = +m.rows >> 0;
        let rotation = +m.rotation % 360;
        //let overlapped = this.$_checkOverlappedHorz(axis, views, width, step, rows, rotation);
        let overlapped = this.$_checkOverlappedHorz2(axis, this._labelViews, width, step, rows, rotation, false, init);
        let views = this._labelViews._internalItems();
        let sz: number;

        // views.forEach(v => v.row = 0);
        this._labelRowPts = [0];

        if (!overlapped) {
            // views = this.$_applyStep(axis, views, step || 1);
        } else if (m.autoArrange === AxisLabelArrange.NONE) {
            // TODO: clip | ellipsis | wrap
            this._labelViews.prepare(axis._ticks.length, (v, i, count) => {
                v.rotation = rotation;
                v.row = 0;
                v.index = i;
                this._prepareLabel(v, axis._ticks[i], axis.label, count, init);
                v.setVis(true);
            });
            views = this.$_applyStep(axis, views, step || 1);
        } else {
            // step = rows = rotation = 0;
            step = rows = 0;

            switch (m.autoArrange) {
                case AxisLabelArrange.ROWS:
                    rows = this.$_getRows(views);
                    break;
                case AxisLabelArrange.STEP:
                    step = this.$_getStep(views);
                    break;
                // case AxisLabelArrange.ROTATE:
                default:
                    // rotation = -45;
                    break;
            }

            if (step > 1) {
                // const save = views.slice(0);
                while (true) {
                //while (save.length > 1) {
                    // views = this.$_applyStep(axis, save, step);
                    if (!this.$_checkOverlappedHorz2(axis, this._labelViews, width, step, 1, 0, false, init)) {
                    // if (!this.$_checkOverlappedHorz(axis, save, width, step, 1, 0)) {
                        break;
                    }
                    step++;
                }
                // this._labelViews = views;
            } else if (rows > 1) {
                while (axis._ticks.length > rows) {
                // while (views.length > rows) {
                //while (views.length > rows) {
                    views.forEach((v, i) => {
                        v.row = i % rows;
                        v.index = i;
                    });
                    if (!this.$_checkOverlappedHorz2(axis, this._labelViews, width, 1, rows, 0, false, init)) {
                    //if (!this.$_checkOverlappedHorz(axis, views, width, 1, rows, 0)) {
                        break;
                    }
                    rows++;
                }
                this._labelRowPts = [];

            } else {
                if (isNaN(rotation) || Math.abs(Math.tan(rotation * DEG_RAD)) < 1) {
                    rotation = -45;
                }
                // views.forEach((v, i) => {
                //     v.index = i;
                // });

                if (this.$_checkOverlappedHorz2(axis, this._labelViews, width, step, rows, rotation, false, init)) {
                //if (this.$_checkOverlappedHorz(axis, views, width, step, rows, rotation)) {
                    step = 2;
                    while (true) {
                        // const views2 = this.$_applyStep(axis, views, step);

                        if (!this.$_checkOverlappedHorz2(axis, this._labelViews, width, step, rows, rotation, false, init)) {
                        //if (!this.$_checkOverlappedHorz(axis, views2, width, step, rows, rotation)) {
                            // rotation을 제거해도 문제없으면 제거한다.
                            if (this.$_checkOverlappedHorz2(axis, this._labelViews, width, step, rows, 0, true, init)) {
                            //if (this.$_checkOverlappedHorz(axis, views2, width, step, rows, 0)) {
                                // 0으로 설정된 rotation을 원복 시킨다.
                                views.forEach((v, i) => {
                                    v.rotation = rotation;
                                });
                            }
                            break;
                        }
                        step++;
                    }
                }   
            }
        }

        if (views.length > 0) {
            if (rows > 1) {
                const rotated = !isNaN(rotation) && rotation != 0;
                const pts = this._labelRowPts;
    
                // if (rows > 1) {
                //     views.forEach((v, i) => v.row = i % rows);
                // }
    
                for (let i = 0; i < rows; i++) {
                    pts.push(0);
                }
    
                views.forEach(v => {
                    pts[v.row] = maxv(pts[v.row], rotated ? v.rotatedHeight() : v.getBBox().height);
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
                        sz = maxv(sz, views[i].rotatedHeight());
                    }
                } else {
                    sz = views[0].getBBox().height;
                    for (let i = 1; i < views.length; i++) {
                        sz = maxv(sz, views[i].getBBox().height);
                    }
                }
            }
            return sz;
        }
        return 0;
    }

    private $_checkOverlappedVert(axis: Axis, views: AxisLabelView[], height: number, step: number): boolean {
        const nView = views.length;
        const inc = maxv(1, step);

        views.forEach(v => v.rotation = 0);

        for (let i = 0; i < nView - 1; i += inc) {
            let h = 0;

            for (let j = i; j < i + inc && j < nView - 1; j++) {
                h += axis.getLabelLength(height, views[i].value);
            }

            if (views[i].getBBox().height >= h) {
                return true;
            }
        }
    }

    private $_checkOverlappedVert2(axis: Axis, views: ElementPool<AxisLabelView>, height: number, step: number, init: boolean): boolean {
        const labels = axis.label;
        const ticks = axis._ticks;
        const nView = ticks.length;
        const inc = maxv(1, step);
        let i = 0;
        let n = 0;
        let v: AxisLabelView;

        // views.forEach(v => v.rotation = 0);

        for (; i < nView; i += inc) {
            let h = 0;

            for (let j = i; j < i + inc && j < nView; j++) {
                h += axis.getLabelLength(height, ticks[j].value);
            }

            if (i + inc < nView) {
                v = views.pull(n++);
                v.rotation = 0;
                v.index = i;
                this._prepareLabel(v, ticks[i], labels, nView, init)
                v.setVis(true);
    
                if (v.getBBox().height >= h) {
                    return true;
                }   
            }
        }

        if (i - inc < nView) {
            v = views.pull(n++);
            v.rotation = 0;
            v.index = i - inc;
            this._prepareLabel(v, ticks[i - inc], labels, nView, init)
            v.setVis(true);
        }
        views.freeFrom(n);
    }

    private $_measureLabelsVert(axis: Axis, height: number, init = false): number {
        const m = axis.label;
        // let views = this._labelViews._internalItems();
        let step = maxv(1, +m.step >> 0);
        //const overalpped = this.$_checkOverlappedVert(axis, views, height, step);
        const overalpped = this.$_checkOverlappedVert2(axis, this._labelViews, height, step, init);
        let views = this._labelViews._internalItems();

        if (!overalpped) {
            views = this.$_applyStep(axis, views, step);
        } else if (m.autoArrange === AxisLabelArrange.NONE) {
            // TODO: clip | ellipsis | wrap
            this._labelViews.prepare(axis._ticks.length, (v, i, count) => {
                v.rotation = 0;
                v.index = i;
                this._prepareLabel(v, axis._ticks[i], axis.label, count, init);
                v.setVis(true);
            });
            views = this.$_applyStep(axis, views, step || 1);
        } else {
            // const save = views.slice(0);
            const save = views;

            while (true) {
            // while (save.length > 1 && step < save.length / 2) {
                if (!this.$_checkOverlappedVert2(axis, this._labelViews, height, ++step, init)) {
                //if (!this.$_checkOverlappedHorz(axis, save, height, step, 1, 0)) {
                    break;
                }
            }
            //views = this.$_applyStep(axis, this._labelViews._internalItems(), step);
        }

        if (views.length > 0) {
            let sz = views[0].getBBox().width;

            for (let i = 1; i < views.length; i++) {
                sz = maxv(sz, views[i].getBBox().width);
            }
            return sz;
        }
        return 0;
    }

    private $_layoutLabelsHorz(views: ElementPool<AxisLabelView>, ticks: IAxisTick[], between: boolean, opp: boolean, w: number, h: number, gap: number): void {

        function pullFirst(self: AxisView, v: AxisLabelView, next: AxisLabelView): boolean {
            let vis = true;
            const w2 = v.rotatedWidth();
            let x = v.tx;
    
            if (x < -self._marginStart - self._edgeStart) {
                if ((reversed ? m.label.lastOverflow : m.label.firstOverflow) === AxisLabelOverflow.PULL) {
                    x = -self._marginStart - self._edgeStart + 2;
    
                    if (views.count > 0) {
                        const x2 = next.tx;
                        if (x + w2 + (+m.label.overflowGap || 12) > x2) {
                            vis = false;
                        }
                    } else {
                        vis = false;
                    }
                } else {
                    vis = false;
                }
            }
            if (vis) {
                v.transX(x);
            } else {
                v.setVis(false);
            }
            return vis;
        }

        function pullLast(self: AxisView, v: AxisLabelView, prev: AxisLabelView): boolean {
            let vis = true;
            let x = v.tx;
            const w2 = v.rotatedWidth();
            
            w += self._marginEnd + self._edgeEnd;

            if (x + w2 > w) {
                if ((reversed ? m.label.firstOverflow : m.label.lastOverflow) === AxisLabelOverflow.PULL) {
                    x = w - w2;

                    if (prev) {
                        const x2 = prev.tx + prev.rotatedWidth();
                        if (x < x2 + (+m.label.overflowGap || 12)) {
                            vis = false;
                        }
                    } else {
                        vis = false;
                    }
                } else {
                    vis = false;
                }
            }
            if (vis) {
                v.transX(x);
            } else {
                v.setVis(false);
            }
            return vis;
        }

        const m = this.model;
        const reversed = m.reversed;
        const align = Align.CENTER;
        const pts = this._labelRowPts;
        const rot = views.get(0).rotation;
        const a = rot * DEG_RAD;
        const rotated = rot < -15 && rot >= -90 || rot > 15 && rot <= 90;
        const count = views.count;
        let prev: AxisLabelView;
        let vis: boolean;
        let w2: number;
        let x: number;
        let y: number;

        views.freeHiddens();

        views.forEach((v, i) => {
            const r = v.getBBox();
            
            vis = true;
            x = m.prev(ticks[v.index].pos);
            y = opp ? (h - gap - r.height - pts[v.row]) : (gap + pts[v.row]);

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

            v.setContrast(null).layout(align).trans(x, y);
        });

        // TODO: rotation이 0이 아닌 경우에도 필요(?)
        if (!rotated && count > 1) {
            pullFirst(this, views.get(reversed ? count - 1 : 0), views.get(reversed ? count - 2 : 1));
            pullLast(this, views.get(reversed ? 0 : count - 1), views.get(reversed ? 1 : count - 2))
        }
    }

    private $_layoutLabelsVert(views: ElementPool<AxisLabelView>, ticks: IAxisTick[], between: boolean, opp: boolean, w: number, h: number, len: number): void {
        const m = this.model;
        const align = opp ? Align.LEFT : between ? Align.CENTER : Align.RIGHT;
        const x = opp ? len : w - len;
    
        views.freeHiddens();
        views.forEach((v, i) => {
            const r = v.getBBox();
            const x2 = opp ? x : between ? (w - r.width) / 2 : x - r.width;

            v.setContrast(null).layout(align).trans(x2, h - m.prev(ticks[v.index].pos) - r.height / 2);
        });
    }
}
