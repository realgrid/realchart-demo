////////////////////////////////////////////////////////////////////////////////
// AxisView.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../common/Common";
import { PathBuilder } from "../common/PathBuilder";
import { PathElement, RcElement } from "../common/RcControl";
import { toSize } from "../common/Rectangle";
import { Sides } from "../common/Sides";
import { ISize, Size } from "../common/Size";
import { DEG_RAD, calcPercent, parsePercentSize } from "../common/Types";
import { LineElement } from "../common/impl/PathElement";
import { RectElement } from "../common/impl/RectElement";
import { TextAnchor, TextElement } from "../common/impl/TextElement";
import { Axis, AxisGuide, AxisLabelArrange, AxisPosition, AxisScrollBar, AxisTickMark, AxisTitle, AxisZoom, IAxisTick } from "../model/Axis";
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

    index = -1;
    value: number;
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
    setText(model: Crosshair, text: string): boolean {
        if (text !== this._text.text) {
            this._text.text = text;
            return true;
        }
        if (text) {
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
    setScroll(zoom: AxisZoom): void {
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
        const len = (this._vertical ? this.height : this.width) - this._thumbView.width;

        pt = Math.max(0, Math.min(pt, len));
        return pt * (zoom.max - zoom.min - (zoom.end - zoom.start)) / len;
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
            this._thumbView.setBounds(model.gap + 1, fill ? 0 : h * pos / max, model.gap + 1, w - 2, hPage); 
        } else {
            h -= model.gap + model.gapFar;
            this._trackView.setBounds(0, model.gap, w, h);
            
            w -= szThumb;
            const wPage = (fill || page === max ? w : w * page / max) + szThumb;
            this._thumbView.setBounds(fill ? 0 : w * pos / max, model.gap + 1, wPage, h - 2); 
        }
    }
}

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
    private _titleView: AxisTitleView;
    private _markContainer: RcElement;
    private _markViews: AxisTickMarkView[] = [];
    private _labelContainer: RcElement;
    private _labelViews: AxisLabelElement[] = []; 
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
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    private $_checkScrollView(doc: Document, m: AxisScrollBar, prop: string, width: number, height: number): number {
        if (m.visible) {
            if (!this._scrollView) {
                this.add(this._scrollView = new AxisScrollView(doc));
            }
            return this._scrollView.measure(doc, m, width, height, 1)[prop];
        } else if (this._scrollView) {
            this._scrollView.setVisible(false);
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

        if (this.$_prepareLabels(doc, m)) {
            h += this.$_measureLabelsHorz(m, this._labelViews, width);
        }

        // title
        if (this._titleView.setVisible(m.title.isVisible())) {
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

        if (this.$_prepareLabels(doc, m)) {
            w += this.$_measureLabelsVert(m, this._labelViews, width);
        }

        // title
        if (this._titleView.visible = m.title.isVisible()) {
            w += this._titleView.measure(doc, m.title, width, height, 1).height; // [NOTE] width가 아니다.
            w += m.title.gap;
        }
        
        // scrollbar
        w += this.$_checkScrollView(doc, m.scrollBar, 'width', width, height);

        return w;
    }

    prepareGuides(doc: Document, container: AxisGuideContainer, frontContainer: AxisGuideContainer): void {
        let guides = this.model.guides.filter(g => !g.front);
        container.addAll(doc, guides);

        guides = this.model.guides.filter(g => g.front);
        frontContainer.addAll(doc, guides);
    }

    showCrosshair(pos: number, text: string): void {
        let cv = this._crosshairView;

        if (!cv) {
            this.add(this._crosshairView = cv = new CrosshairFlagView(this.doc));
        }
        cv.setVisible(true);

        cv.setText(this.model.crosshair, text);
        const r = cv.getBBounds();

        if (this.model._isHorz) {
            cv.translate(pos - r.width / 2, this.model.tick.length);
        } else {
            cv.translate(this.width - this.model.tick.length - r.width, pos - r.height / 2);
        }
    }

    hideCrosshiar(): void {
        if (this._crosshairView && this._crosshairView.visible) {
            this._crosshairView.setVisible(false);
        }
    }

    scroll(pos: number): void {
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
        if (this._lineView.visible = model.line.visible) {
            this._lineView.setStyleOrClass(model.line.style);
        }

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
        if (this.$_prepareLabels(doc, model)) {
            if (horz) {
                sz += this._labelSize = this.$_measureLabelsHorz(model, labelViews, hintWidth);
            } else {
                sz += this._labelSize = this.$_measureLabelsVert(model, labelViews, hintHeight);
            }
        } else {
            this._labelSize = 0;
        }

        if (!this._simpleMode) {
            // title
            if (titleView.visible) { // checkHeight/checkWidth 에서 visible 설정.
                sz += titleView.mh;
                sz += model.title.gap || 0;
            }

            // scrollbar
            if (this._scrollView?.visible) {
                sz += this._scrollView.mh;
            }
            titleView.setVisible(false);
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
        const scrollView = this._scrollView;
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

        if (!this._simpleMode) {
            let y = 0;

            // title
            if (titleView.visible) {
                const labelSize = this._labelSize;
                const gap = model.title.gap || 0;
    
                titleView.resizeByMeasured().layout(horz);
    
                if (horz) {
                    y += opp ? 0 : len + labelSize + gap;
                    // titleView.translate((w - titleView.width) / 2, this._markLen + labelSize);
                    titleView.translate(w / 2, y);
                    y += titleView.height;
                } else {
                    const x = opp ? len + labelSize + gap + titleView.height / 2 : w - len - labelSize - gap - titleView.height / 2;
    
                    titleView.translate(x, (h - titleView.height) / 2);
                }
            }
    
            // scrollbar
            if (scrollView?.visible) {
                if (horz) {
                    scrollView.translate(0, y).resize(this.width, scrollView.mh);
                    scrollView.setScroll(model._zoom);
                } else {
                }
                scrollView.layout();
            }
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    // private $_prepareChecker(doc: Document, m: Axis): AxisLabelElement {
    //     if (this._labelContainer.visible = m.label.visible) {
    //         const ticks = m._ticks;
    //         let tick = ticks[0];
    //         let t: AxisLabelElement;

    //         if (tick) {
    //             if (m.label.getRotation() !== 0) {
    //                 let len = tick.label.length;
    //                 let j = 0;

    //                 for (let i = 1; i < ticks.length; i++) {
    //                     if (ticks[i].label.length > len) {
    //                         len = ticks[i].label.length;
    //                         tick = ticks[i];
    //                         j = i;
    //                     }
    //                 }
    //                 t = this._labelViews[j];

    //             } else {
    //                 t = this._labelViews[0];
    //             }
    
    //             if (!t) {
    //                 t = new AxisLabelElement(doc, 'rct-axis-label');
    //                 t.anchor = TextAnchor.START;
    //                 this._labelContainer.add(t);
    //                 this._labelViews.push(t);
    //             }
        
    //             t.text = tick.label
    //             return t;
    //         }
    //     }
    // }

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

    private $_prepareLabels(doc: Document, m: Axis): number {
        const container = this._labelContainer;

        if (container.visible = m.label.visible) {
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
                v.setVisible(true); // visible false이면 getBBox()가 계산되지 않는다.
                v.value = ticks[i].value;
                v.text = ticks[i].label;
            });
            return views.length;
        }
        return 0;
    }

    private $_getRows(views: AxisLabelElement[]): number {
        return 2;
    }

    private $_getStep(view: AxisLabelElement[]): number {
        return 2;
    }

    private $_checkOverlappedHorz(axis: Axis, views: AxisLabelElement[], width: number, step: number, rows: number, rotation: number): boolean {
        const nView = views.length;
        const inc = Math.max(1, step) * Math.max(1, rows);
        const a = rotation || 0;
        const arad = Math.abs(a) * Math.PI / 180;
        let overalpped = false;

        views.forEach(v => v.rotation = a);

        for (let i = 0; i < nView - 1; i += inc) {
            let w = 0;
            for (let j = i; j < i + inc && j < nView - 1; j++) {
                w += axis.getLabelLength(width, views[i].value);
            }

            if (a === 0 && views[i].getBBounds().width >= w) {
                overalpped = true;
                break;
            } else if  (a !== 0 && (views[i].getBBounds().width + views[i].getBBounds().height) * Math.cos(arad) >= w) {
                overalpped = true;
                break;
            }
        }
        return overalpped;
    }

    private $_applyStep(axis: Axis, views: AxisLabelElement[], step: number): AxisLabelElement[] {
        const m = axis.label;
        const start = Math.max(0, m.startStep || 0);
            
        views.forEach(v => v.index = -1);
        for (let i = start; i < views.length; i += step) {
            views[i].index = i;
        }
        views.forEach(v => v.setVisible(v.index >= 0));
        return views.filter(v => v.visible);
    }

    private $_measureLabelsHorz(axis: Axis, views: AxisLabelElement[], width: number): number {
        const m = axis.label;
        let step = +m.step >> 0;
        let rows = +m.rows >> 0;
        let rotation = +m.rotation % 360;
        let overlapped = this.$_checkOverlappedHorz(axis, views, width, step, rows, rotation);
        let sz: number;

        views.forEach(v => v.row = 0);
        this._labelRowPts = [0];

        if (!overlapped) {
            views = this.$_applyStep(axis, views, step || 1);
        } else {
            step = rows = rotation = 0;

            switch (m.autoArrange) {
                case AxisLabelArrange.ROTATE:
                    rotation = -45;
                    break;
                case AxisLabelArrange.ROWS:
                    rows = this.$_getRows(views);
                    break;
                case AxisLabelArrange.STEP:
                    step = this.$_getStep(views);
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
                pts[v.row] = Math.max(pts[v.row], rotated ? v.rotatedHeight : v.getBBounds().height);
            })

            pts.unshift(0);
            for (let i = 2; i < pts.length; i++) {
                pts[i] += pts[i - 1];
            }
            return pts[pts.length - 1];

        } else {
            if (!isNaN(rotation) && rotation != 0) {
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
        }
        return sz;
    }

    private $_checkOverlappedVert(axis: Axis, views: AxisLabelElement[], height: number, step: number): boolean {
        const nView = views.length;
        const inc = Math.max(1, step);

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

    private $_measureLabelsVert(axis: Axis, views: AxisLabelElement[], height: number): number {
        const m = axis.label;
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

    private $_layoutLabelsHorz(views: AxisLabelElement[], ticks: IAxisTick[], opp: boolean, w: number, h: number, len: number): void {
        const pts = this._labelRowPts;

        views.forEach(v => {
            if (v.visible) {
                const rot = v.rotation;
                const a = rot * DEG_RAD;
                const r = v.getBBounds();
                const ascent = Math.floor(v.getAscent(r.height));
                let x = ticks[v.index].pos;
                let y = opp ? (h - len - r.height - pts[v.row]) : (len + pts[v.row]);
    
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
            }
        });
    }

    private $_layoutLabelsVert(views: AxisLabelElement[], ticks: IAxisTick[], opp: boolean, w: number, h: number, len: number): void {
        const x = opp ? len : w - len;
    
        views.forEach((v, i) => {
            if (v.visible) {
                const r = v.getBBounds();
                const x2 = opp ? x : x - r.width;
    
                v.translate(x2, h - ticks[i].pos - r.height / 2);
            }
        });
    }
}
