////////////////////////////////////////////////////////////////////////////////
// ChartView.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ButtonElement } from "../common/ButtonElement";
import { maxv, pickNum } from "../common/Common";
import { IPoint, Point } from "../common/Point";
import { ClipRectElement, LayerElement, RcElement } from "../common/RcControl";
import { IRect } from "../common/Rectangle";
import { ISize, Size } from "../common/Size";
import { Align, AlignBase, SectionDir, VerticalAlign, _undef } from "../common/Types";
import { TextAnchor, TextElement } from "../common/impl/TextElement";
import { Annotation, AnnotationScope } from "../model/Annotation";
import { Axis } from "../model/Axis";
import { Chart, Credits } from "../model/Chart";
import { ChartItem } from "../model/ChartItem";
import { DataPoint } from "../model/DataPoint";
import { LegendItem, LegendLocation } from "../model/Legend";
import { Series } from "../model/Series";
import { Split } from "../model/Split";
import { Subtitle, SubtitlePosition, Title } from "../model/Title";
import { AnnotationView } from "./AnnotationView";
import { AxisScrollView, AxisView } from "./AxisView";
import { AxisGridRowContainer, AxisGuideContainer, BodyView, createAnnotationView } from "./BodyView";
import { ChartElement, SectionView } from "./ChartElement";
import { HistoryView } from "./HistoryView";
import { LegendView } from "./LegendView";
import { NavigatorView } from "./NavigatorView";
import { PaneContainer } from "./PaneContainer";
import { PolarBodyView } from "./PolarBodyView";
import { SeriesView } from "./SeriesView";
import { TitleView } from "./TitleView";
import { TooltipView } from "./TooltipView";

/**
 * @internal
 */
class TitleSectionView extends SectionView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    titleView: TitleView;
    subtitleView: TitleView;

    private _hTitle = 0;
    private _wTitle = 0;
    private _hSub = 0;
    private _wSub = 0;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doInitChildren(doc: Document): void {
        this.add(this.titleView = new TitleView(doc, false));
        this.add(this.subtitleView = new TitleView(doc, true));
    }

    protected _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize {
        const title = chart.title;
        const sub = chart.subtitle;
        let wTitle = 0;
        let hTitle = 0;
        let wSub = 0;
        let hSub = 0;
        let v = this.titleView;
        let width = hintWidth;
        let height = 0;
        let titleGap = 0;
        let sz: ISize;

        // title
        if (v.setVis(title.isVisible())) {
            sz = v.measure(doc, title, hintWidth, hintHeight, phase);
            hTitle = this._hTitle = sz.height;
            wTitle = this._wTitle = sz.width;
        } else {
            v.setModel(title);
        }
        // subtitle
        if ((v = this.subtitleView).setVis(sub.isVisible())) {
            sz = v.measure(doc, sub, hintWidth, hintHeight, phase);
            hSub = this._hSub = sz.height;
            wSub = this._wSub = sz.width;
            titleGap = +chart.subtitle.titleGap || 0;
        } else {
            v.setModel(sub);
        }

        switch (sub.position) {
            case SubtitlePosition.LEFT:
            case SubtitlePosition.RIGHT:
                height = maxv(hTitle, hSub);
                width = wTitle + titleGap + wSub;
                break;
            default:
                height = hTitle + titleGap + hSub;
                width = maxv(width, wTitle + wSub);
                break;
        }

        if (height > 0) {
            height += this.titleView.visible ? pickNum(title.gap, 0) : pickNum(sub.gap, 0);
        }
        return { width, height };
    }


    protected _doLayout(domain: {xPlot: number, wPlot: number, wChart: number}): void {
        const vTitle = this.titleView;
        const vSub = this.subtitleView;
        const title = vTitle.model;
        const sub = vSub.model as Subtitle;
        const dTitle = (title && title.visible) ? (this._wTitle > domain.wPlot || title.alignBase === AlignBase.CHART) ? domain.wChart : domain.wPlot : 0; 
        const dSub = (sub && sub.visible) ? (this._wSub > domain.wPlot || title.alignBase === AlignBase.CHART) ? domain.wChart : domain.wPlot : 0; 
        let pTitle = (this._wTitle > domain.wPlot || (title && title.alignBase === AlignBase.CHART)) ? 0 : domain.xPlot;
        let pSub = (this._wSub > domain.wPlot || (sub && sub.alignBase === AlignBase.CHART)) ? 0 : domain.xPlot;

        if (dTitle > 0 && dSub > 0) {
            const getY = (model: Title, h: number, hTitle: number): number => {
                switch (model.verticalAlign) {
                    case VerticalAlign.MIDDLE:
                        return (h - hTitle) / 2;
                    case VerticalAlign.BOTTOM:
                        return h - hTitle;
                    default:
                        return 0;
                }
            };
            const calcYs = () => {
                const h = maxv(this._hTitle, this._hSub);
                yTitle = maxv(yTitle, yTitle + getY(title, h, this._hTitle));
                ySub = maxv(ySub, ySub + getY(sub, h, this._hSub));
            };
            const getX = (model: Title, w: number, wTitle: number): number => {
                switch (model.align) {
                    case Align.CENTER:
                        return (w - wTitle) / 2;
                    case Align.RIGHT:
                        return w - wTitle;
                    default:
                        return 0;
                }
            };
            const calcXs = () => {
                xTitle = maxv(xTitle, xTitle + getX(title, dTitle, this._wTitle));
                xSub = maxv(xSub, xSub + getX(sub, dSub, this._wSub));
            };
            const gap = pickNum(sub.titleGap, 0);
            let yTitle = 0;
            let xTitle = pTitle;
            let ySub = 0;
            let xSub = pSub;
            let h = 0;

            switch (title.align) {
                case Align.LEFT:
                    switch (sub.position) {
                        case SubtitlePosition.LEFT:
                            xTitle = xSub + this._wSub + gap;
                            calcYs();
                            break;
                        case SubtitlePosition.RIGHT:
                            xSub = xTitle + this._wTitle + gap;
                            switch (sub.align) {
                                case Align.CENTER:
                                    xSub = maxv(xSub, xSub + (dSub - this._wTitle - this._wSub) / 2);
                                    break;
                                case Align.RIGHT:
                                    xSub = maxv(xSub, pSub + dSub - this._wSub);
                                    break;
                            }
                            calcYs();
                            break;
                        case SubtitlePosition.TOP:
                            yTitle = ySub + this._hSub + gap;
                            calcXs();
                            break;
                        default:
                            ySub = yTitle + this._hTitle + gap;
                            calcXs();
                            break;
                    }
                    break;

                case Align.RIGHT:
                    switch (sub.position) {
                        case SubtitlePosition.LEFT:
                            xTitle += dTitle - this._wTitle;
                            switch (sub.align) {
                                case Align.CENTER:
                                    xSub += (dTitle - this._wTitle - this._wSub) / 2;
                                    break;
                                case Align.RIGHT:
                                    xSub = xTitle - gap - this._wSub;
                                    break;
                            }
                            calcYs();
                            break;
                        case SubtitlePosition.RIGHT:
                            xSub += dSub - this._wSub;
                            xTitle = xSub - gap - this._wTitle;
                            calcYs();
                            break;
                        case SubtitlePosition.TOP:
                            calcXs();
                            yTitle = ySub + this._hSub + gap;
                            break;
                        default:
                            calcXs();
                            ySub = yTitle + this._hTitle + gap;
                            break;
                    }
                    break;

                default: // Align.CENTER
                    switch (sub.position) {
                        case SubtitlePosition.LEFT:
                            xTitle += (dTitle - this._wTitle) / 2;
                            switch (sub.align) {
                                case Align.LEFT:
                                    break;
                                case Align.CENTER:
                                    xSub = xSub + ((xTitle - xSub) - this._wSub) / 2;
                                    break;
                                case Align.RIGHT:
                                    xSub = xTitle - gap - this._wSub;
                                    break;
                            }
                            calcYs();
                            break;
                        case SubtitlePosition.RIGHT:
                            xTitle += (dTitle - this._wTitle) / 2;
                            switch (sub.align) {
                                case Align.LEFT:
                                    xSub = xTitle + this._wTitle + gap;
                                    break;
                                case Align.CENTER:
                                    xSub = xTitle + this._wTitle + gap;
                                    xSub += (dSub - xSub - this._wSub) / 2;
                                    break;
                                case Align.RIGHT:
                                    xSub += dSub - gap - this._wSub;
                                    break;
                            }
                            calcYs();
                            break;
                        case SubtitlePosition.TOP:
                            calcXs();
                            yTitle = ySub + this._hSub + gap;
                            break;
                        default:
                            calcXs();
                            ySub = yTitle + this._hTitle + gap;
                            break;
                    }
                    break;
            }
            vTitle.resizeByMeasured().layout().trans(xTitle, yTitle);
            vSub.resizeByMeasured().layout().trans(xSub, ySub);

        } else if (dTitle > 0 || dSub > 0) {
            const m = dTitle ? title : sub;
            const v = dTitle ? vTitle : vSub;
            const d = dTitle || dSub;
            const w = dTitle ? this._wTitle : this._wSub;
            let x = dTitle ? pTitle : pSub;

            v.resizeByMeasured().layout();

            switch (m.align) {
                case Align.LEFT:
                    break;
                case Align.RIGHT:
                    x += d - w;
                    break;
                default:
                    x += (d - w) / 2;
                    break;
            }
            v.trans(x, 0);
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

        view.resize(w, h).trans(x, y);
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
    views: AxisView[] = [];
    visibles: AxisView[] = [];
    isX: boolean;
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
        let i = views.length;
        let v: AxisView;

        while (views.length < axes.length) {
            v = new AxisView(doc);
            if (axes[i++].visible) {
                this.add(v);
            }
            views.push(v);
        }
        while (views.length > axes.length) {
            v = views.pop();
            v.parent && v.remove();
        }

        // 추측 계산을 위해 모델을 미리 설정할 필요가 있다.
        views.forEach((v, i) => {
            v.model = axes[i];
            v.prepareGuides(doc, NaN, NaN, guideContainer, frontGuideContainer);
        });

        if (this.setVis(views.filter(v => v.model.visible).length > 0)) {
            const m = views[0].model;

            this.isX = m._isX;
            this.isHorz = m._isHorz;
            this._gap = m.chart.getAxesGap();  
        }
    }

    /**
     * 수평 축들의 높이를 기본 설정에 따라 추측한다.
     */
    checkHeights(doc: Document, width: number, height: number): number {
        if (this.views.length > 0) {
            return this.$_checkHeights(this.views, doc, width, height);
        }
        return 0;
    }
    private $_checkHeights(views: AxisView[], doc: Document, width: number, height: number): number {
        let h = 0;

        if (views) {
            views.forEach(view => {
                h += view.checkHeight(doc, width, height);
            });
            h += (this.views.length - 1) * this._gap;
        }
        return h;
    }

    /**
     * 수직 축들의 너비를 기본 설정에 따라 추측한다.
     */
    checkWidths(doc: Document, width: number, height: number): number {
        if (this.views.length > 0) {
            return this.$_checkWidths(this.views, doc, width, height);
        }
        return 0;
    }
    private $_checkWidths(views: AxisView[], doc: Document, width: number, height: number): number {
        let w = 0;

        if (views) {
            views.forEach(view => {
                w += view.checkWidth(doc, width, height);
            });
            w += (this.views.length - 1) * this._gap;
        }
        return w;
    }

    getScrollView(dom: Element): AxisScrollView {
        for (const v of this.views) {
            if (v._scrollView?.contains(dom)) {
                return v._scrollView;
            }
        }
    }

    prepareGridRows(doc: Document, container: AxisGridRowContainer): void {
        container.addAll(doc, this.views.map(v => v.model));
    }

    clean(): void {
        this.views.forEach(v => v.clean());
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    /**
     * split일 때 hintWidth/hintHeight는 반쪽 크기이다.
     */
    protected _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize {
        const inverted = this._inverted;
        let w = 0;
        let h = 0;

        [this.views].forEach(views => {
            if (views) {
                const width = !this.isX && inverted ? hintWidth : hintWidth;
                const height = !this.isX ? hintHeight : hintHeight;
                let w2 = 0;
                let h2 = 0;

                views.forEach(v => {
                    if (v.visible) {
                        const sz = v.measure(doc, v.model, width, height, phase);
        
                        v.setAttr('xy', v.model._isX ? 'x' : 'y');
                        w2 += sz.width;
                        h2 += sz.height;
                    }
                })
                if (this.isHorz) {
                    h2 += (views.length - 1) * this._gap;
                } else {
                    w2 += (views.length - 1) * this._gap;
                }

                w = maxv(w, w2);
                h = maxv(h, h2);
            }
        })

        return Size.create(w, h);
    }

    /**
     * split일 때에도 width, heigh는 양쪽을 포함한 크기이다.
     */
    protected _doLayout(wCenter: number): void {
        let w = this.width;
        let h = this.height;
        let x = 0;
        let y = 0;

        wCenter = +wCenter || 0;

        [this.views].forEach(views => {
            if (views) {
                let p = 0;

                views.forEach(v => {
                    if (v.visible) {
                        v.checkExtents();

                        if (this.isHorz) {
                            v.resize(w, v.mh);
                        } else {
                            v.resize(v.mw, h);
                        }
                        v.layout();
            
                        if (this.isHorz) {
                            v.trans(x, this.dir === SectionDir.TOP ? h - p - v.mh : p);
                            p += v.mh + this._gap;
                        } else {
                            v.trans(this.dir === SectionDir.RIGHT ? p : w - p - v.mw, y);
                            p += v.mw + this._gap;
                        }
                    }
                });
    
                if (this.isHorz) {
                    x += w + wCenter;
                } else {
                    y += h + wCenter;
                }
            }
        })
    }
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
        return this._textView.getBBox();
    }
}

/**
 * @internal
 */
export class ChartView extends LayerElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _model: Chart;
    _inverted = false;   // bar 시리즈 계열이 포함되면 true, x축이 수직, y축이 수평으로 그려진다.

    private _titleSectionView: TitleSectionView;
    private _legendSectionView: LegendSectionView;
    private _plotContainer: LayerElement;
    private _bodyView: BodyView;
    private _polarView: PolarBodyView;
    private _currBody: BodyView;
    private _axisSectionMap: {[key: string]: AxisSectionView} = {};
    private _paneContainer: PaneContainer;
    private _annotationContainer: LayerElement;
    private _frontAnnotationContainer: LayerElement;
    private _annotationViews: AnnotationView<Annotation>[] = [];
    private _annotationMap = new Map<Annotation, AnnotationView<Annotation>>();
    private _annotations: Annotation[];
    _navigatorView: NavigatorView;
    private _creditView: CreditView;
    private _historyView: HistoryView;
    private _tooltipView: TooltipView;
    private _seriesClip: ClipRectElement;
    // private _lineSeriesClip: ClipRectElement;

    _org: IPoint;
    private _plotWidth: number;
    private _plotHeight: number;
    private _hoverItem: ChartItem;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-chart');

        this.add(this._annotationContainer = new LayerElement(doc, 'rct-annotations'));

        // plot 영역이 마지막이어야 line marker 등이 축 상에 표시될 수 있다.
        this.add(this._plotContainer = new LayerElement(doc, 'rct-plot-container'));
        this._plotContainer.add(this._currBody = this._bodyView = new BodyView(doc, this));

        for (const dir in SectionDir) {
            const v = new AxisSectionView(doc, SectionDir[dir]);

            this._plotContainer.add(v);
            this._axisSectionMap[SectionDir[dir]] = v;
        };

        this.add(this._paneContainer = new PaneContainer(doc, this))
        this.add(this._titleSectionView = new TitleSectionView(doc));
        this.add(this._legendSectionView = new LegendSectionView(doc));
        this.add(this._frontAnnotationContainer = new LayerElement(doc, 'rct-front-annotations'));
        this.add(this._creditView = new CreditView(doc));
        this.add(this._navigatorView = new NavigatorView(doc));
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
    // chart가 새로 load된 후 호출된다.
    clean(): void {
        for (const asv in this._axisSectionMap) {
            this._axisSectionMap[asv].clean();
        }
    }

    measure(doc: Document, model: Chart, hintWidth: number, hintHeight: number, phase: number): void {
        const m = this._model = model;
        const polar = m.isPolar();
        const credit = m.options.credits;
        const legend = m.legend;
        const navigator = m.seriesNavigator;
        let w = hintWidth;
        let h = hintHeight;
        let sz: ISize;

        this._inverted = m.isInverted();

        // body
        if (m.isSplitted()) {
            this._plotContainer.setVis(false);
            this._paneContainer.setVis(true);
            this.$_preparePanes(doc, m.split);
        } else {
            this._plotContainer.setVis(true);
            this._paneContainer.setVis(false);
            this.$_prepareBody(doc, polar);
        }

        // credits
        if (this._creditView.setVis(credit.visible)) {
            sz = this._creditView.measure(doc, credit, w, h, phase);
            if (!credit.isFloating()) {
                h -= sz.height + (+credit.offsetY || 0) + (+credit.gap || 0);
            }
        }
        
        // titles
        sz = this._titleSectionView.measure(doc, m, w, h, phase);
        h -= sz.height;

        // legend
        if (this._legendSectionView.setVis((legend.isVisible()))) {
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
        this._navigatorView.setVis(navigator.isVisible());

        // body & axes
        if (this._paneContainer.visible) {
            this._paneContainer.measure(doc, m.split, m.xPaneAxes, m.yPaneAxes, w, h, 1);
        } else {
            if (polar) {
                this.$_measurePolar(doc, m, w, h, 1);
            } else {
                this.$_measurePlot(doc, m, w, h, 1);
            }
        }

        // navigator
        if (this._navigatorView.visible) {
            if (m.seriesNavigator._vertical) {
                h = this._bodyView.mh;
            } else {
                w = this._bodyView.mw;
            }
            this._navigatorView.measure(doc, navigator, w, h, phase);
        }

        // annotations
        this.$_prepareAnnotations(doc, model.getAnnotations());
        this._annotationViews.forEach((v, i) => {
            v.measure(doc, this._annotations[i], hintWidth, hintHeight, phase);
        });
    }

    layout(): void {
        const width = this.width;
        const height = this.height;
        let w = width;
        let h = height;

        const m = this._model;
        const polar = m.isPolar();
        // const splitted = this._splitted;
        const legend = m.legend;
        const credit = m.options.credits;
        const vCredit = this._creditView;
        const offCredit = +credit.offsetY || 0;
        const gapCredit = +credit.gap || 0;
        let h1Credit = 0;
        let h2Credit = 0;
        let x = 0;
        let y = 0;

        // credits
        if (vCredit.visible) {
            vCredit.resizeByMeasured();

            if (!credit.isFloating()) {
                if (credit.verticalAlign === VerticalAlign.TOP) {
                    h -= h1Credit = vCredit.height + offCredit + gapCredit;
                } else {
                    h -= h2Credit = vCredit.height + offCredit + gapCredit;
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
            // vNavi.layout().translateY(yLegend - hNavi + vNavi.model.gap);
            vNavi.layout().transY(y + vNavi.model.gap);
        }

        let wCenter = 0;
        let hMiddle = 0;
        let hPlot = 0;
        let wPlot = 0;
        let rPlot: IRect;

        if (this._paneContainer.visible) {
            this._paneContainer.resize(w, h).trans(x, yTitle + hTitle);
            this._paneContainer.layout();
            hPlot = h;
            wPlot = w;
            rPlot = this._paneContainer.getRect();
        } else {
            // axes
            const axisMap = this._axisSectionMap;
            const asvCenter = axisMap[SectionDir.CENTER];
            const asvMiddle = axisMap[SectionDir.MIDDLE]
            let asv: AxisSectionView;

            if (!polar) {
                if (asvCenter && asvCenter.visible) {
                    wCenter = asvCenter.mw;
                }
                if (asvMiddle && asvMiddle.visible) {
                    hMiddle = asvMiddle.mh;
                }

                [SectionDir.LEFT, SectionDir.RIGHT].forEach(dir => {
                    if ((asv = axisMap[dir]) && asv.visible) {
                        w -= asv.mw;
                    }
                });
                [SectionDir.TOP, SectionDir.BOTTOM].forEach(dir => {
                    if ((asv = axisMap[dir]) && asv.visible) {
                        h -= asv.mh;
                    }
                });
        
                if ((asv = axisMap[SectionDir.LEFT]) && asv.visible) {
                    // if (splitted && !asv.isX) {
                    //     asv.resize(asv.mw, (h - hMiddle) / 2);
                    // } else {
                    //     asv.resize(asv.mw, h);
                    // }
                    asv.resize(asv.mw, h);
                    asv.layout(hMiddle);
                    x += asv.mw;
                }
                if ((asv = axisMap[SectionDir.RIGHT]) && asv.visible) {
                    // if (splitted && !asv.isX) {
                    //     asv.resize(asv.mw, (h - hMiddle) / 2);
                    // } else {
                    //     asv.resize(asv.mw, h);
                    // }
                    asv.resize(asv.mw, h);
                    asv.layout(hMiddle);
                }
                if (wCenter > 0) {
                    asvCenter.resize(asv.mw, h);
                    asvCenter.layout();
                }
                if ((asv = axisMap[SectionDir.BOTTOM]) && asv.visible) {
                    // if (splitted && !asv.isX) {
                    //     asv.resize((w - wCenter) / 2, asv.mh);
                    // } else {
                    //     asv.resize(w, asv.mh);
                    // }
                    asv.resize(w, asv.mh);
                    asv.layout(wCenter);
                    y -= asv.mh;
                }
                if ((asv = axisMap[SectionDir.TOP]) && asv.visible) {
                    // if (splitted && !asv.isX) {
                    //     asv.resize((w - wCenter) / 2, asv.mh);
                    // } else {
                    //     asv.resize(w, asv.mh);
                    // }
                    asv.resize(w, asv.mh);
                    asv.layout(wCenter);
                }
                if (hMiddle > 0) {
                    asvMiddle.resize(w, asv.mh);
                    asvMiddle.layout();
                }
            }

            if (vNavi.visible) {
                vNavi.layout().transX(x);
            }

            const org = this._org = Point.create(x, y);

            this._plotWidth = w;
            this._plotHeight = h;

            if (!polar) {
                if ((asv = axisMap[SectionDir.LEFT]) && asv.visible) {
                    asv.trans(org.x - asv.mw, org.y - asv.height);
                }
                if ((asv = axisMap[SectionDir.RIGHT]) && asv.visible) {
                    asv.trans(org.x + w, org.y - asv.height);
                }
                if (wCenter > 0) {
                    asvCenter.trans(org.x + (w - wCenter) / 2, org.y - asvCenter.height);
                }
                if ((asv = axisMap[SectionDir.BOTTOM]) && asv.visible) {
                    asv.trans(org.x, org.y);
                }
                if ((asv = axisMap[SectionDir.TOP]) && asv.visible) {
                    asv.trans(org.x, org.y - h - asv.height);
                }
                if (hMiddle > 0) {
                    asvMiddle.trans(org.x, org.y - (h - hMiddle) / 2 - hMiddle);
                }
            }

            // body
            hPlot = this._plotHeight - hMiddle;
            wPlot = this._plotWidth - wCenter;

            x = org.x;
            y = org.y - this._plotHeight;

            this._currBody.resize(wPlot, hPlot);
            this._currBody.layout().trans(x, y);
            rPlot = this._currBody.getRect();
            this._currBody._seriesViews.forEach(v => {
                if (v.needDecoreateLegend()) {
                    const lv = this._legendSectionView._legendView.legendOfSeries(v.model);
                    if (lv) {
                        v.decoreateLegend(lv);
                    }
                }
            })
        }

        // credits
        if (vCredit.visible) {
            const xOff = +credit.offsetX || 0;
            const yOff = offCredit;
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
                    cy = height - h2Credit + gapCredit;
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
            vCredit.trans(cx, cy);
        }

        wPlot += wCenter;

        // title
        if (vTitle.visible) {
            vTitle.layout({xPlot: x, wPlot, wChart: width}).trans(0, yTitle);
        }

        // legend
        if (vLegend.visible) {
            let v: number;

            if (legend.location === LegendLocation.BODY || legend.location === LegendLocation.PLOT) {
                let off = +legend.offsetX || 0;

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

                off = +legend.offsetY || 0;

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
                const off = +legend.offsetX || 0;
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
                const off = +legend.offsetY || 0;
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
            vLegend.trans(x, y);
        }

        this.$_layoutAnnotations(this._inverted, width, height, rPlot);

        this._tooltipView.close(true, false);
    }

    showTooltip(series: Series, point: DataPoint, body: RcElement, p: IPoint): void {
        const {x, y} = point.getTooltipPos();
        const isFollowPointer =  this._model.chart.tooltip.followPointer;
        const tx = isFollowPointer ? p.x + body.tx : x + body.tx;
        const ty = isFollowPointer ? p.y + body.ty : y + body.ty;

        this._tooltipView.show(series, point, tx, ty, true);
    }

    hideTooltip(): void {
        this._tooltipView.close(false, true);
    }

    legendByDom(dom: Element): LegendItem {
        return this._legendSectionView._legendView.legendByDom(dom);
    }

    seriesByDom(dom: Element): SeriesView<Series> {
        if (this._paneContainer.visible) {
            return this._paneContainer.seriesByDom(dom);
        } else {
            return this._currBody.seriesByDom(dom);
        }
    }

    findSeriesView(series: Series): SeriesView<Series> {
        return this._currBody.findSeries(series);
    }

    creditByDom(dom: Element): CreditView {
        return this._creditView.dom.contains(dom) ? this._creditView : null;
    }

    clipSeries(view: RcElement, view2: RcElement, x: number, y: number, w: number, h: number, invertable: boolean): void {

        function clip(v: RcElement): void {
            if (inverted) {
                sc.setBounds(0, -w, h, w);
            } else {
                sc.setBounds(0, 0, w, h);
            }
            v.setClip(sc);
        }

        const inverted = this._model.inverted && invertable;
        const sc = this._seriesClip;

        // TODO: pane 단위로 -> body로 가야하나?
        view && clip(view);
        view2 && clip(view2);
    }

    bodyOf(elt: Element): BodyView {
        if (this._model.isSplitted()) {
            return this._paneContainer.bodyViewOf(elt);
        }
        return this._currBody;
    }

    pointerMoved(x: number, y: number, target: EventTarget): void {
        const elt = target as Element;
        const body = this._model && this.bodyOf(target as any);// this._currBody;
        const cl = elt?.classList;
        const isContextMenu = cl?.value && (cl.contains('rct-contextmenu-item') || cl.contains('rct-contextmenu-list'));
        let prevItem = this._hoverItem;

        this._hoverItem = null;

        if (body) {
            const p = body.controlToElement(x, y);
            const inBody = body.pointerMoved(p, target);
            
            for (const dir in this._axisSectionMap) {
                this._axisSectionMap[dir].views.forEach(av => {
                    const m = av.model.crosshair;
                    const len = av.model._isHorz ? body.width : body.height;
                    const pos = av.model._isHorz ? p.x : p.y;
                    const flag = inBody && m.visible && !isContextMenu && m.flag.visible && !m.isBar() && m.getFlag(len, pos);
    
                    if (flag) {
                        av.showCrosshair(pos, flag);
                        av.model.crosshair.moved(pos, flag);
                    } else {
                        av.hideCrosshiar();
                    }
                })
            }

            if (!this._hoverItem) {
                if (this._legendSectionView._legendView.contains(elt)) {
                    const item = this._hoverItem = this._legendSectionView._legendView.legendByDom(elt);
                    if (item && item.legend.seriesHovering && item.source as Series) {
                        body.hoverSeries(item.source as Series);
                    } 
                }
            }

            if (prevItem instanceof LegendItem && !(this._hoverItem instanceof LegendItem)) {
                body.hoverSeries(null);
            }
        }
    }

    getAxis(axis: Axis): AxisView {
        for (const dir in this._axisSectionMap) {
            const v = this._axisSectionMap[dir].views.find(v => v.model === axis);
            if (v) return v;
        }
    }

    getButton(dom: Element): ButtonElement {
        return this._currBody.getButton(dom);
    }

    buttonClicked(button: ButtonElement): void {
        this._currBody.buttonClicked(button);
    }

    getScrollView(dom: Element): AxisScrollView {
        for (const dir in SectionDir) {
            const v = this._axisSectionMap[SectionDir[dir]].getScrollView(dom)
            if (v) return v;
        };
    }

    updateAnnotation(anno: Annotation): void {
        let v = this._annotationViews.find(v => v.model === anno);
        
        if (v) {
            v.update(this.width, this.height);
        } else {
            if (this._model.isSplitted()) {
                // TODO:
            } else {
                v = this._currBody._annotationViews.find(v => v.model === anno);
                if (v) {
                    v.update(this._currBody.width, this._currBody.height);
                }
            }
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doAttached(parent: RcElement): void {
        this._seriesClip = this.control.clipBounds();
        // this._lineSeriesClip = this.control.clipBounds();
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_preparePanes(doc: Document, split: Split): void {
        this._paneContainer.prepare(doc, split);
    }

    private $_prepareBody(doc: Document, polar: boolean): void {
        if (polar) {
            if (!this._polarView) {
                this._polarView = new PolarBodyView(doc, this);
                this._plotContainer.insertChild(this._polarView, this._bodyView);
            }
            this._currBody = this._polarView;
            this._bodyView?.setVis(false);
            this._polarView.setVis(true);
        } else {
            this._polarView?.setVis(false);
            this._bodyView.setVis(true);
            this._currBody = this._bodyView;
        }
        this._currBody.prepareRender(doc, this._model);
    }

    private $_prepareAxes(doc: Document, m: Chart): void {
        const rowContainer = this._currBody._gridRowContainer;
        const guideContainer = this._currBody._guideContainer;
        const frontContainer = this._currBody._frontGuideContainer;
        const need = !m.isPolar() && m.needAxes();
        const map = this._axisSectionMap;

        for (const dir in map) {
            const v = map[dir];

            if (need) {
                v.prepare(doc, m.getAxes(dir as any, false), guideContainer, frontContainer);
            } else {
                v.visible = false;
            }
        }
        rowContainer.prepare();
    }

    private $_measurePlot(doc: Document, m: Chart, w: number, h: number, phase: number): void {
        const map = this._axisSectionMap;

        // navigator
        if (this._navigatorView.visible) {
            const navi = m.seriesNavigator;
            if (navi._vertical) {
                w -= navi.thickness + navi.gap + navi.gapFar;
            } else {
                h -= navi.thickness + navi.gap + navi.gapFar;
            }
        }

        const wSave = w;
        const hSave = h;
        let wCenter = 0;
        let hMiddle = 0;

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
        if (this._inverted) {
            w -= wCenter = map[SectionDir.CENTER].checkWidths(doc, w, h);
        } else {
            h -= hMiddle = map[SectionDir.MIDDLE].checkHeights(doc, w, h);
        }

        // 조정된 크기로 tick을 다시 생성한다.
        w -= wCenter;
        h -= hMiddle;
        m.layoutAxes(w, h, this._inverted, phase);

        for (const dir in map) {
            const asv = map[dir];
            
            if (asv.visible) {
                asv.measure(doc, m, w, h, phase);
            }
        }

        w = wSave;
        h = hSave;
        wCenter = 0;
        hMiddle = 0;

        for (const dir in map) {
            const asv = map[dir];
            
            if (asv.visible) {
                if ((dir as any) === SectionDir.LEFT || (dir as any) === SectionDir.RIGHT) {
                    w -= asv.mw;
                } else if ((dir as any) === SectionDir.BOTTOM || (dir as any) === SectionDir.TOP) {
                    h -= asv.mh;
                }

                if (this._inverted) {
                    if ((dir as any) === SectionDir.CENTER) {
                        w -= wCenter = asv.mw;
                    }
                } else {
                    if ((dir as any) === SectionDir.MIDDLE) {
                        h -= hMiddle = asv.mh;
                    }
                }
            }
        }

        // 조정된 크기로 tick을 다시 생성한다 2.
        m.layoutAxes(w, h, this._inverted, phase);

        for (const dir in map) {
            const asv = map[dir];
            
            if (asv.visible) {
                asv.measure(doc, m, w, h, phase);
                asv.prepareGridRows(doc, this._bodyView._gridRowContainer);
            }
        }

        w = wSave;
        h = hSave;
        wCenter = 0;
        hMiddle = 0;

        for (const dir in map) {
            const asv = map[dir];
            
            if (asv.visible) {
                if ((dir as any) === SectionDir.LEFT || (dir as any) === SectionDir.RIGHT) {
                    w -= asv.mw;
                } else if ((dir as any) === SectionDir.BOTTOM || (dir as any) === SectionDir.TOP) {
                    h -= asv.mh;
                }

                if (this._inverted) {
                    if ((dir as any) === SectionDir.CENTER) {
                        w -= wCenter = asv.mw;
                    }
                } else {
                    if ((dir as any) === SectionDir.MIDDLE) {
                        h -= hMiddle = asv.mh;
                    }
                }
            }
        }

        // 계산된 axis view에 맞춰 tick 위치를 조정한다.
        m.axesLayouted(w, h, this._inverted);

        // body
        this._bodyView.measure(doc, m.body, w, h, phase);
    }

    private $_measurePolar(doc: Document, m: Chart, w: number, h: number, phase: number): void {
        const body = m.body;
        const rd = body.calcRadius(w, h);
        const wPolar = Math.PI * 2 * rd;
        const hPolar = rd;

        // guides - axis view에서 guide view들을 추가할 수 있도록 초기화한다.
        this._polarView.prepareGuideContainers();

        // axes
        this.$_prepareAxes(doc, m);
        // m.layoutAxes(Math.PI * 2, rd, false, phase);
        m.layoutAxes(wPolar, hPolar, false, phase);
        // m.layoutAxes(rd, rd, false, phase);

        m.axesLayouted(wPolar, hPolar, false);

        // body
        this._polarView.measure(doc, m.body, w, h, phase);
    }

    private $_prepareAnnotations(doc: Document, annotations: Annotation[]): void {
        const container = this._annotationContainer;
        const frontContainer = this._frontAnnotationContainer;
        const map = this._annotationMap;
        const views = this._annotationViews;

        for (const a of map.keys()) {
            if (annotations.indexOf(a) < 0) {
                map.delete(a);
            }
        }

        views.forEach(v => v.remove());
        views.length = 0;

        (this._annotations = annotations).forEach(a => {
            const v = map.get(a) || createAnnotationView(doc, a);

            (a.front ? frontContainer : container).add(v);
            map.set(a, v);
            views.push(v);
            // v.prepare(doc, a);
        });
    }

    private $_layoutAnnotations(inverted: boolean, width: number, height: number, rPlot: IRect): void {
        const pad = this.control._padding;
        let x: number;
        let y: number;
        let w: number;
        let h: number;

        this._annotationViews.forEach(v => {
            switch (v.model.scope) {
                // case AnnotationScope.BODY:
                //     // TODO:
                //     x = y = 0;
                //     w = width;
                //     h = height;
                //     break;
                case AnnotationScope.CONTAINER:
                    x = -pad.left;
                    y = -pad.top;
                    w = width + pad.left + pad.right;
                    h = height + pad.top + pad.bottom;
                    break;
                default:
                    x = y = 0;
                    w = width;
                    h = height;
                    break;
            }

            v.resizeByMeasured();
            v.layout().transp(v.model.getPosition(inverted, x, y, w, h, v.width, v.height));
        });
    }
}