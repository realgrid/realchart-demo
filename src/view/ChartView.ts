////////////////////////////////////////////////////////////////////////////////
// ChartView.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ButtonElement } from "../common/ButtonElement";
import { pickNum } from "../common/Common";
import { IPoint, Point } from "../common/Point";
import { ClipElement, RcElement } from "../common/RcControl";
import { ISize, Size } from "../common/Size";
import { Align, AlignBase, HORZ_SECTIONS, SectionDir, VERT_SECTIONS, VerticalAlign } from "../common/Types";
import { GroupElement } from "../common/impl/GroupElement";
import { TextAnchor, TextElement } from "../common/impl/TextElement";
import { Axis } from "../model/Axis";
import { Chart, Credits } from "../model/Chart";
import { DataPoint } from "../model/DataPoint";
import { LegendItem, LegendLocation } from "../model/Legend";
import { Series } from "../model/Series";
import { Subtitle } from "../model/Title";
import { AxisScrollView, AxisView } from "./AxisView";
import { AxisGuideContainer, BodyView } from "./BodyView";
import { ChartElement } from "./ChartElement";
import { HistoryView } from "./HistoryView";
import { LegendView } from "./LegendView";
import { NavigatorView } from "./NavigatorView";
import { PolarBodyView } from "./PolarBodyView";
import { SeriesView } from "./SeriesView";
import { TitleView } from "./TitleView";
import { TooltipView } from "./TooltipView";

/**
 * @internal
 */
abstract class SectionView extends GroupElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    mw: number;
    mh: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    measure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize {
        const sz = this._doMeasure(doc, chart, hintWidth, hintHeight, phase);

        this.mw = sz.width;
        this.mh = sz.height;
        return sz;
    }

    resizeByMeasured(): SectionView {
        this.resize(this.mw, this.mh);
        return this;
    }

    layout(param?: any): SectionView {
        this._doLayout(param);
        return this;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize;
    protected abstract _doLayout(param?: any): void;
}

/**
 * @internal
 */
class TitleSectionView extends SectionView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    titleView: TitleView;
    subtitleView: TitleView;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doInitChildren(doc: Document): void {
        this.add(this.titleView = new TitleView(doc, false));
        this.add(this.subtitleView = new TitleView(doc, true));
    }

    protected _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize {
        const v = this.titleView;
        const sv = this.subtitleView;
        let width = hintWidth;
        let height = 0;
        let sz: ISize;

        if (v.visible = chart.title.isVisible()) {
            sz = v.measure(doc, chart.title, hintWidth, hintHeight, phase);
            height += sz.height;
            hintHeight -= sz.height;
            width = Math.max(sz.width);
        }
        if (sv.visible = chart.subtitle.isVisible()) {
            sz = sv.measure(doc, chart.subtitle, hintWidth, hintHeight, phase);
            height += sz.height;
            hintHeight -= sz.height;
            width = Math.max(sz.width);
        }
        return { width, height };
    }

    protected _doLayout(domain: {xPlot: number, wPlot: number, wChart: number}): void {
        const v = this.titleView;
        const sv = this.subtitleView;
        const m = v.model;
        const sm = sv.model as Subtitle;
        let y = 0;
        let x: number;
        let w: number;

        // title
        if (v.visible) {
            x = (v.width > domain.wPlot || m.alignBase === AlignBase.CHART) ? 0 : domain.xPlot;
            w = (v.width > domain.wPlot || m.alignBase === AlignBase.CHART) ? domain.wChart : domain.wPlot;
            
            v.resizeByMeasured().layout();

            switch (m.align) {
                case Align.LEFT:
                    break;
                case Align.RIGHT:
                    x += w - v.width;
                    break;
                default:
                    x += (w - v.width) / 2;
                    break;
            }
            v.translate(x, y);
            y += v.height;
        }

        // subtitle
        if (sv.visible) {
            x = (sv.width > domain.wPlot || sm.alignBase === AlignBase.CHART) ? 0 : domain.xPlot;
            w = (sv.width > domain.wPlot || sm.alignBase === AlignBase.CHART) ? domain.wChart : domain.wPlot;

            sv.resizeByMeasured().layout();

            switch (sm.position) {
                default:
                    switch (sm.align) {
                        case Align.LEFT:
                            break;
                        case Align.RIGHT:
                            x += w - sv.width;
                            break;
                        default:
                            x += (w - sv.width) / 2;
                            break;
                    }
                    break;
            }
            sv.translate(x, y);
        }
    }
}

/**
 * @internal
 */
class LegendSectionView extends SectionView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _legendView: LegendView;
    private _pos: LegendLocation;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doInitChildren(doc: Document): void {
        this.add(this._legendView = new LegendView(doc));
    }

    _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize {
        const m = chart.legend;
        const sz = this._legendView.measure(doc, m, hintWidth, hintHeight, phase);
        const pos = this._pos = m.getLocatiion();
        
        if (pos === LegendLocation.LEFT || pos === LegendLocation.RIGHT) {
            sz.width += this._legendView._gap;
        } else {
            sz.height += this._legendView._gap;
        }
        return sz;
    }

    protected _doLayout(): void {
        const view = this._legendView;
        const gap = view._gap;
        let w = this.width;
        let h = this.height;
        let x = 0;
        let y = 0;
     
        switch (this._pos) {
            case LegendLocation.LEFT:
                w -= gap;
                break;

            case LegendLocation.RIGHT:
                w -= gap;
                x += gap;
                break;

            case LegendLocation.TOP:
                h -= gap;
                break;

            default:
                y += gap;
                h -= gap;
                break;
        }

        view.resize(w, h).translate(x, y);
        view.layout();
    }
}

/**
 * @internal
 */
class AxisSectionView extends SectionView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    axes: Axis[]; 
    views: AxisView[] = [];
    isHorz: boolean;
    isOpposite: boolean;
    private _gap = 0;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, public dir: SectionDir) {
        super(doc);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepare(doc: Document, axes: Axis[], guideContainer: AxisGuideContainer, frontGuideContainer: AxisGuideContainer): void {
        const views = this.views;

        while (views.length < axes.length) {
            const v = new AxisView(doc);

            this.add(v);
            views.push(v);
        }
        while (views.length > axes.length) {
            views.pop().remove();
        }

        // 추측 계산을 위해 모델을 미리 설정할 필요가 있다.
        views.forEach((v, i) => {
            v.model = axes[i];
            v.prepareGuides(doc, guideContainer, frontGuideContainer);
        });

        this.axes = axes;
        if (this.visible = views.length > 0) {
            this.isHorz = views[0].model._isHorz;
            this._gap = views[0].model.chart.getAxesGap();  
        }
    }

    /**
     * 수평 축들의 높이를 기본 설정에 따라 추측한다.
     */
    checkHeights(doc: Document, width: number, height: number): number {
        let h = 0;

        this.views.forEach(view => {
            h += view.checkHeight(doc, width, height);
        });
        return h + (this.views.length - 1) * this._gap;
    }

    /**
     * 수직 축들의 너비를 기본 설정에 따라 추측한다.
     */
    checkWidths(doc: Document, width: number, height: number): number {
        let w = 0;

        this.views.forEach(view => {
            w += view.checkWidth(doc, width, height);
        });
        return w + (this.views.length - 1) * this._gap;
    }

    getScrollView(dom: Element): AxisScrollView {
        for (const v of this.views) {
            if (v._scrollView?.contains(dom)) {
                return v._scrollView;
            }
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize {
        const axes = this.axes;
        let w = 0;
        let h = 0;

        this.views.forEach((v, i) => {
            const sz = v.measure(doc, axes[i], hintWidth, hintHeight, phase);

            v.setAttr('xy', axes[i]._isX ? 'x' : 'y');
            w += sz.width;
            h += sz.height;
        })
        if (this.isHorz) {
            h += (this.views.length - 1) * this._gap;
        } else {
            w += (this.views.length - 1) * this._gap;
        }
        return Size.create(w, h);
    }

    protected _doLayout(): void {
        const w = this.width;
        const h = this.height;
        let p = 0;
        let x: number;
        let y: number;

        this.views.forEach(v => {
            if (this.isHorz) {
                v.resize(w, v.mh);
            } else {
                v.resize(v.mw, h);
            }
            v.layout();

            if (this.isHorz) {
                v.translateY(this.dir === SectionDir.TOP ? h - p - v.mh : p);
                p += v.mh + this._gap;
            } else {
                v.translateX(this.dir === SectionDir.RIGHT ? p : w - p - v.mw);
                p += v.mw + this._gap;
            }

            v.move(x, y);
        });
    }
}

/**
 * @internal
 */
class EmptyView extends GroupElement {
}

/**
 * @internal
 */
export class CreditView extends ChartElement<Credits> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _textView: TextElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-credits');

        this.add(this._textView = new TextElement(doc));
        this._textView.anchor = TextAnchor.START;
    }

    //-------------------------------------------------------------------------
    // methdos
    //-------------------------------------------------------------------------
    clicked(dom: Element): void {
        if (this.model.url) {
            window.open(this.model.url, 'new');
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: Credits, intWidth: number, hintHeight: number, phase: number): ISize {
        this._textView.text = model.text;

        this.setCursor(model.url ? 'pointer' : '');
        return this._textView.getBBounds();
    }
}

/**
 * @internal
 */
export class ChartView extends RcElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _model: Chart;
    _inverted = false;   // bar 시리즈 계열이 포함되면 true, x축이 수직, y축이 수평으로 그려진다.

    _emptyView: EmptyView;
    private _titleSectionView: TitleSectionView;
    private _legendSectionView: LegendSectionView;
    private _bodyView: BodyView;
    private _polarView: PolarBodyView;
    private _currBody: BodyView;
    private _axisSectionViews: {[key: string]: AxisSectionView} = {};
    _navigatorView: NavigatorView;
    private _creditView: CreditView;
    private _historyView: HistoryView;
    private _tooltipView: TooltipView;
    private _seriesClip: ClipElement;

    _org: IPoint;
    private _plotWidth: number;
    private _plotHeight: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-chart');

        // plot 영역이 마지막이어야 line marker 등이 축 상에 표시될 수 있다.
        this.add(this._currBody = this._bodyView = new BodyView(doc, this));

        for (const dir in SectionDir) {
            const v = new AxisSectionView(doc, SectionDir[dir]);
            this.add(v);
            this._axisSectionViews[SectionDir[dir]] = v;
        };

        this.add(this._titleSectionView = new TitleSectionView(doc));
        this.add(this._legendSectionView = new LegendSectionView(doc));
        this.add(this._navigatorView = new NavigatorView(doc));
        this.add(this._creditView = new CreditView(doc));
        this.add(this._historyView = new HistoryView(doc));
        this.add(this._tooltipView = new TooltipView(doc));
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    titleView(): TitleView {
        return this._titleSectionView.titleView;
    }

    subtitleView(): TitleView {
        return this._titleSectionView.subtitleView;
    }

    bodyView(): BodyView {
        return this._bodyView;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    measure(doc: Document, model: Chart, hintWidth: number, hintHeight: number, phase: number): void {
        if (model && phase == 1) {
            model.prepareRender();
        }
        
        if (this.$_checkEmpty(doc, model, hintWidth, hintHeight)) {
            return;
        }

        const m = this._model = model;
        const polar = m.isPolar();
        const credit = m.options.credits;
        const legend = m.legend;
        const navigator = m.navigator;
        let w = hintWidth;
        let h = hintHeight;
        let sz: ISize;

        this._inverted = model.isInverted();

        // body
        this.$_prepareBody(doc, polar);

        // credits
        if (this._creditView.setVisible(credit.visible)) {
            sz = this._creditView.measure(doc, credit, w, h, phase);
            if (!credit.floating) {
                h -= sz.height + credit.offsetY;
            }
        }
        
        // titles
        sz = this._titleSectionView.measure(doc, m, w, h, phase);
        h -= sz.height;

        // legend
        if (this._legendSectionView.setVisible((legend.isVisible()))) {
            sz = this._legendSectionView.measure(doc, m, w, h, phase);

            switch (legend.getLocatiion()) {
                case LegendLocation.TOP:
                case LegendLocation.BOTTOM:
                    h -= sz.height;
                    break;
                case LegendLocation.RIGHT:
                case LegendLocation.LEFT:
                    w -= sz.width;
                    break;
            }
        }

        // navigator
        this._navigatorView.setVisible(navigator.isVisible());

        // body
        if (polar) {
            this.$_measurePolar(doc, m, w, h, 1);
        } else {
            this.$_measurePlot(doc, m, w, h, 1);
        }

        // navigator
        if (this._navigatorView.visible) {
            if (m.navigator._vertical) {
                h = this._bodyView.mh;
            } else {
                w = this._bodyView.mw;
            }
            this._navigatorView.measure(doc, navigator, w, h, phase);
        }
    }

    layout(): void {
        const width = this.width;
        const height = this.height;
        let w = width;
        let h = height;

        if (this._emptyView?.visible) {
            this._emptyView.resize(w, h);
            return;
        }

        const m = this._model;
        const polar = m.isPolar();
        const legend = m.legend;
        const credit = m.options.credits;
        const vCredit = this._creditView;
        let h1Credit = 0;
        let h2Credit = 0;
        let x = 0;
        let y = 0;

        // credits
        if (vCredit.visible) {
            vCredit.resizeByMeasured();

            if (!credit.floating) {
                if (credit.verticalAlign === VerticalAlign.TOP) {
                    h -= h1Credit = vCredit.height + credit.offsetY;
                } else {
                    h -= h2Credit = vCredit.height + credit.offsetY;
                }
            }
        }

        // title
        const vTitle = this._titleSectionView;
        let hTitle = 0;
        const yTitle = y + h1Credit;

        if (vTitle.visible) {
            vTitle.resizeByMeasured();
            h -= hTitle = vTitle.height;
        }

        // body
        y = height - h2Credit;

        // navigator
        const vNavi = this._navigatorView;
        let hNavi = 0;
        let wNavi = 0;
        if (vNavi.visible) {
            if (vNavi.model._vertical) {
            } else {
                vNavi.resize(vNavi.mw, vNavi.mh - vNavi.model.gap - vNavi.model.gapFar)
                h -= hNavi = vNavi.mh;
            }
        }

        // legend
        const vLegend = this._legendSectionView;
        let hLegend = 0;
        let wLegend = 0;
        let yLegend: number;
        let xLegend: number;

        if (vLegend.visible) {
            vLegend.resizeByMeasured().layout();
            hLegend = vLegend.height;
            wLegend = vLegend.width;

            switch (legend.getLocatiion()) {
                case LegendLocation.TOP:
                    yLegend = hTitle + h1Credit;
                    h -= hLegend;
                    break;

                case LegendLocation.BOTTOM:
                    h -= hLegend;
                    yLegend = y - hLegend;
                    y -= hLegend;
                    break;
    
                case LegendLocation.RIGHT:
                    w -= wLegend;
                    xLegend = width - wLegend;
                    break;

                case LegendLocation.LEFT:
                    w -= wLegend;
                    x += wLegend;
                    xLegend = 0;
                    break;
            }
        }

        // navi
        if (vNavi.visible) {
            y -= hNavi;
            vNavi.layout().translateY(yLegend - hNavi + vNavi.model.gap);
        }

        // axes
        const axisMap = this._axisSectionViews;
        let asv: AxisSectionView;
        if (!polar) {
            HORZ_SECTIONS.forEach(dir => {
                if ((asv = axisMap[dir]) && asv.visible) {
                    w -= asv.mw;
                }
            });
            VERT_SECTIONS.forEach(dir => {
                if ((asv = axisMap[dir]) && asv.visible) {
                    h -= asv.mh;
                }
            });
    
            if ((asv = axisMap[SectionDir.LEFT]) && asv.visible) {
                asv.resize(asv.mw, h);
                asv.layout();
                x += asv.mw;
            }
            if ((asv = axisMap[SectionDir.RIGHT]) && asv.visible) {
                asv.resize(asv.mw, h);
                asv.layout();
            }
            if ((asv = axisMap[SectionDir.BOTTOM]) && asv.visible) {
                asv.resize(w, asv.mh);
                asv.layout();
                y -= asv.mh;
            }
            if ((asv = axisMap[SectionDir.TOP]) && asv.visible) {
                asv.resize(w, asv.mh);
                asv.layout();
            }
        }

        if (vNavi.visible) {
            vNavi.layout().translateX(x);
        }

        const org = this._org = Point.create(x, y);

        this._plotWidth = w;
        this._plotHeight = h;

        if (!polar) {
            if (asv = axisMap[SectionDir.LEFT]) {
                asv.translate(org.x - asv.mw, org.y - asv.height);
            }
            if (asv = axisMap[SectionDir.RIGHT]) {
                asv.translate(org.x + w, org.y - asv.height);
            }
            if (asv = axisMap[SectionDir.BOTTOM]) {
                asv.translate(org.x, org.y);
            }
            if (asv = axisMap[SectionDir.TOP]) {
                asv.translate(org.x, org.y - h - asv.height);
            }
        }

        // body
        const hPlot = this._plotHeight;
        const wPlot = this._plotWidth;

        x = org.x;
        y = org.y - hPlot;

        this._currBody.resize(wPlot, hPlot);
        this._currBody.layout().translate(x, y);

        // credits
        if (vCredit.visible) {
            const xOff = credit.offsetX || 0;
            const yOff = credit.offsetY || 0;
            let cx: number;
            let cy: number;

            vCredit.layout();
            
            switch (credit.verticalAlign) {
                case VerticalAlign.TOP:
                    // cy = yOff;
                    break;
                case VerticalAlign.MIDDLE:
                    cy = (height - vCredit.height) / 2 + yOff;
                    break;
                default:
                    cy = height - h2Credit;
                    break;
            }
            switch (credit.align) {
                case Align.LEFT:
                    cx = xOff;
                    break;
                case Align.CENTER:
                    cx = (width - vCredit.width) / 2 + xOff;
                    break;
                default:
                    cx = width - vCredit.width - xOff;
                    break;
            }
            vCredit.translate(cx, cy);
        }

        // title
        if (vTitle.visible) {
            vTitle.layout({xPlot: x, wPlot, wChart: width}).translate(0, yTitle);
        }

        // legend
        if (vLegend.visible) {
            let v: number;

            if (legend.location === LegendLocation.PLOT) {
                let off = pickNum(legend.offsetX, 0);

                // x = y = 0;

                switch (legend.align) {
                    case Align.RIGHT:
                        x += wPlot - wLegend - off;
                        break;
                    case Align.CENTER:
                        x += (wPlot - wLegend) / 2 + off;
                        break;
                    default: // plot일 때 기본은 LEFT
                        x += off;
                        break;
                }

                off = pickNum(legend.offsetY, 0);

                switch (legend.verticalAlign) {
                    case VerticalAlign.BOTTOM:
                        y += hPlot - hLegend - off;
                        break;
                    case VerticalAlign.MIDDLE:
                        y += (hPlot - hLegend) / 2 + off;
                        break;
                    default: // plot일 때 기본은 TOP
                        y += off;
                        break;
                }
            } else if (!isNaN(yLegend)) { // 수평
                const off = pickNum(legend.offsetX, 0);
                y = yLegend;

                if (legend.alignBase === AlignBase.CHART) {
                    switch (legend.align) {
                        case Align.LEFT:
                            x = off;
                            break;
                        case Align.RIGHT:
                            x = width - wLegend - off;
                            break;
                        default: // left/right일 때 기본은 CENTER
                            x = (width - wLegend) / 2 + off;
                        break;
                    }
                } else {
                    switch (legend.align) {
                        case Align.LEFT:
                            x += off;
                            break;
                        case Align.RIGHT:
                            x = x + w - wLegend - off;
                            break;
                        default:
                            x += (w - wLegend) / 2 + off;
                            break;
                    }
                }
                if (x + wLegend > width) { // plot 범위를 벗어나면 chart에 맞춘다.
                    x = (width - wLegend) / 2;
                }
                if (x < 0) {
                    x = 0;
                }
            } else { // 수직
                const off = pickNum(legend.offsetY, 0);
                x = xLegend;

                if (legend.alignBase === AlignBase.CHART) {
                    switch (legend.verticalAlign) {
                        case VerticalAlign.TOP:
                            y = off;
                            break;
                        case VerticalAlign.BOTTOM:
                            y = height - hLegend - off;
                            break;
                        default: // left/right일 때 기본은 MIDDLE
                            y = (height - hLegend) / 2 + off;
                            break;
                    }
                    if (y + hLegend > height) {
                        y = (height - hLegend) / 2;
                    }
                } else {
                    switch (legend.verticalAlign) {
                        case VerticalAlign.TOP:
                            y += off;
                            break;
                        case VerticalAlign.BOTTOM:
                            y = y + h - hLegend - off;
                            break;
                        default: // left/right일 때 기본은 MIDDLE
                            y = y + (h - hLegend) / 2 + off;
                            break;
                    }
                }
                if (y + hLegend > height) {
                    y = (height - hLegend) / 2;
                }
                if (y < 0) {
                    y = 0;
                }
            }
            vLegend.translate(x, y);
        }

        this._tooltipView.close(true, false);
    }

    showTooltip(series: Series, point: DataPoint): void {
        const x = point.xPos + this._bodyView.tx;
        const y = point.yPos + this._bodyView.ty;

        this._tooltipView.show(series, point, x, y, true);
    }

    hideTooltip(): void {
        this._tooltipView.close(false, true);
    }

    legendByDom(dom: Element): LegendItem {
        return this._legendSectionView._legendView.legendByDom(dom);
    }

    seriesByDom(dom: Element): SeriesView<Series> {
        return this._bodyView.seriesByDom(dom);
    }

    findSeriesView(series: Series): SeriesView<Series> {
        return this._bodyView.findSeries(series);
    }

    creditByDom(dom: Element): CreditView {
        return this._creditView.dom.contains(dom) ? this._creditView : null;
    }

    clipSeries(view: RcElement, x: number, y: number, w: number, h: number, invertable: boolean): void {
        if (view) {
            if (this._model.inverted && invertable) {
                this._seriesClip.setBounds(0, -w, h, w);
            } else {
                this._seriesClip.setBounds(0, 0, w, h);
            }
            view.setClip(this._seriesClip);
        }
    }

    pointerMoved(x: number, y: number, target: EventTarget): void {
        const p = this._bodyView.controlToElement(x, y);
        const inBody = this._bodyView.pointerMoved(p, target);

        for (const dir in this._axisSectionViews) {
            this._axisSectionViews[dir].views.forEach(av => {
                const m = av.model.crosshair;
                const len = av.model._isHorz ? this._bodyView.width : this._bodyView.height;
                const pos = av.model._isHorz ? p.x : p.y;
                const flag = inBody && m.visible && m.flag.visible && !m.isBar() && m.getFlag(len, pos);

                if (flag) {
                    av.showCrosshair(pos, flag);
                } else {
                    av.hideCrosshiar();
                }
            })
        }
    }

    getAxis(axis: Axis): AxisView {
        for (const dir in this._axisSectionViews) {
            const v = this._axisSectionViews[dir].views.find(v => v.model === axis);
            if (v) return v;
        }
    }

    getButton(dom: Element): ButtonElement {
        return this._bodyView.getButton(dom);
    }

    buttonClicked(button: ButtonElement): void {
        this._bodyView.buttonClicked(button);
    }

    getScrollView(dom: Element): AxisScrollView {
        for (const dir in SectionDir) {
            const v = this._axisSectionViews[SectionDir[dir]].getScrollView(dom)
            if (v) return v;
        };
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doAttached(parent: RcElement): void {
        this._seriesClip = this.control.clipBounds();
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_checkEmpty(doc: Document, m: Chart, hintWidth: number, hintHeight: number): boolean {
        if (m && !m.isEmpty()) {
            if (this._emptyView) {
                this._emptyView.visible = false;
            }
        } else {
            if (!this._emptyView) {
                this._emptyView = new EmptyView(doc);
            }
            this._emptyView.resize(hintWidth, hintHeight);
            return true;
        }
    }

    private $_prepareBody(doc: Document, polar: boolean): void {
        if (polar) {
            if (!this._polarView) {
                this._polarView = new PolarBodyView(doc, this);
                this.insertChild(this._polarView, this._bodyView);
            }
            this._currBody = this._polarView;
            this._bodyView?.setVisible(false);
            this._polarView.setVisible(true);
        } else {
            this._polarView?.setVisible(false);
            this._bodyView.setVisible(true);
            this._currBody = this._bodyView;
        }
        this._currBody.prepareSeries(doc, this._model);
    }

    private $_prepareAxes(doc: Document, m: Chart): void {
        const guideContainer = this._currBody._guideContainer;
        const frontGuideContainer = this._currBody._frontGuideContainer;
        const need = !m.isPolar() && m.needAxes();
        const map = this._axisSectionViews;

        for (const dir in map) {
            const v = map[dir];

            if (need) {
                v.prepare(doc, m.getAxes(dir as any), guideContainer, frontGuideContainer);
            } else {
                v.visible = false;
            }
        }
    }

    private $_measurePlot(doc: Document, m: Chart, w: number, h: number, phase: number): void {
        const map = this._axisSectionViews;
        const wSave = w;
        const hSave = h;

        // navigator
        if (this._navigatorView.visible) {
            if (m.navigator._vertical) {
                w -= m.navigator.thickness + m.navigator.gap + m.navigator.gapFar;
            } else {
                h -= m.navigator.thickness + m.navigator.gap + m.navigator.gapFar;
            }
        }

        // guides - axis view에서 guide view들을 추가할 수 있도록 초기화한다.
        this._bodyView.prepareGuideContainers();

        // axes
        this.$_prepareAxes(doc, m);

        // 아래 checkWidth를 위해 tick을 생성한다.
        m.layoutAxes(w, h, this._inverted, phase);

        w -= map[SectionDir.LEFT].checkWidths(doc, w, h);
        w -= map[SectionDir.RIGHT].checkWidths(doc, w, h);
        h -= map[SectionDir.BOTTOM].checkHeights(doc, w, h);
        h -= map[SectionDir.TOP].checkHeights(doc, w, h);

        // 조정된 크기로 tick을 다시 생성한다.
        m.layoutAxes(w, h, this._inverted, phase);

        // axes
        for (const dir in map) {
            const asv = map[dir];
            
            if (asv.visible) {
                asv.measure(doc, m, w, h, phase);
            }
        }

        w = wSave;
        h = hSave;

        for (const dir in map) {
            const asv = map[dir];
            
            if (asv.visible) {
                if ((dir as any) === SectionDir.LEFT || (dir as any) === SectionDir.RIGHT) {
                    w -= asv.mw;
                } else if ((dir as any) === SectionDir.BOTTOM || (dir as any) === SectionDir.TOP) {
                    h -= asv.mh;
                }
            }
        }

        // 조정된 크기로 tick을 다시 생성한다 2.
        m.layoutAxes(w, h, this._inverted, phase);

        for (const dir in map) {
            const asv = map[dir];
            
            if (asv.visible) {
                asv.measure(doc, m, w, h, phase);
            }
        }

        w = wSave;
        h = hSave;
        for (const dir in map) {
            const asv = map[dir];
            
            if (asv.visible) {
                if ((dir as any) === SectionDir.LEFT || (dir as any) === SectionDir.RIGHT) {
                    w -= asv.mw;
                } else if ((dir as any) === SectionDir.BOTTOM || (dir as any) === SectionDir.TOP) {
                    h -= asv.mh;
                }
            }
        }

        // 계산된 axis view에 맞춰 tick 위치를 조정한다.
        m.calcAxesPoints(w, h, this._inverted);

        // body
        this._bodyView.measure(doc, m.body, w, h, phase);
    }

    private $_measurePolar(doc: Document, m: Chart, w: number, h: number, phase: number): void {
        const body = m.body;
        const rd = body.calcRadius(w, h);

        // axes
        this.$_prepareAxes(doc, m);
        m.layoutAxes(Math.PI * 2, rd, false, phase);

        // body
        this._polarView.measure(doc, m.body, w, h, phase);
    }
}