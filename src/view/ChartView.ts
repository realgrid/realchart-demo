////////////////////////////////////////////////////////////////////////////////
// ChartView.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isNumber } from "../common/Common";
import { IPoint, Point } from "../common/Point";
import { LayerElement, RcElement } from "../common/RcControl";
import { ISize, Size } from "../common/Size";
import { Align, SectionDir, VerticalAlign } from "../common/Types";
import { GroupElement } from "../common/impl/GroupElement";
import { Chart } from "../main";
import { Axis } from "../model/Axis";
import { LegendPosition } from "../model/Legend";
import { AxisView } from "./AxisView";
import { BodyView } from "./BodyView";
import { LegendView } from "./LegendView";
import { PolarBodyView } from "./PolarBodyView";
import { TitleView } from "./TitleView";

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

    layout(): void {
        this._doLayout();
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize;
    protected abstract _doLayout(): void;
}

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
        let width = hintWidth;
        let height = 0;
        let sz: ISize;

        if (this.titleView.visible = chart.title.visible) {
            sz = this.titleView.measure(doc, chart.title, hintWidth, hintHeight, phase);
            height += sz.height;
            hintHeight -= sz.height;
        }
        if (this.subtitleView.visible = chart.subtitle.visible) {
            sz = this.subtitleView.measure(doc, chart.subtitle, hintWidth, hintHeight, phase);
            height += sz.height;
            hintHeight -= sz.height;
        }
        return { width, height };
    }

    protected _doLayout(): void {
        this.titleView.resizeByMeasured().layout().translate((this.width - this.titleView.width) / 2, 0);
    }
}

class LegendSectionView extends SectionView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _legendView: LegendView;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doInitChildren(doc: Document): void {
        this.add(this._legendView = new LegendView(doc));
    }

    _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize {
        const sz = this._legendView.measure(doc, chart.legend, hintWidth, hintHeight, phase);
        return sz;
    }

    protected _doLayout(): void {
        this._legendView.resize(this.width, this.height);
        this._legendView.layout();
    }
}

class AxisSectionView extends SectionView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    axes: Axis[]; 
    views: AxisView[] = [];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, public dir: SectionDir) {
        super(doc);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepare(doc: Document, axes: Axis[], isHorz: boolean, guideContainer: LayerElement, frontGuideContainer: LayerElement): void {
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
            v._isHorz = isHorz;
            v.prepareGuides(doc, guideContainer, frontGuideContainer);
        });

        this.axes = axes;
        this.visible = views.length > 0;
    }

    /**
     * 수평 축들의 높이를 기본 설정에 따라 추측한다.
     */
    checkHeights(doc: Document, width: number, height: number): number {
        let h = 0;

        this.views.forEach(view => {
            h += view.checkHeight(doc, width, height);
        });
        return h;
    }

    /**
     * 수직 축들의 너비를 기본 설정에 따라 추측한다.
     */
    checkWidths(doc: Document, width: number, height: number): number {
        let w = 0;

        this.views.forEach(view => {
            w += view.checkWidth(doc, width, height);
        });
        return w;
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

            w += sz.width;
            h += sz.height;
        })
        return Size.create(w, h);
    }

    protected _doLayout(): void {
        this.views.forEach(v => {
            v.resize(this.width, this.height);
            v.layout();
        });
    }
}

class EmptyView extends GroupElement {
}

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
    private _axisSectionViews = new Map<SectionDir, AxisSectionView>();
    private _org: IPoint;
    private _plotWidth: number;
    private _plotHeight: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-chart');

        Object.values(SectionDir).forEach(dir => {
            if (isNumber(dir)) {
                const v = new AxisSectionView(doc, dir);

                this.add(v);
                this._axisSectionViews.set(dir, v);
            }
        });

        // plot 영역이 마지막이어야 line marker 등이 축 상에 표시될 수 있다.
        this.add(this._currBody = this._bodyView = new BodyView(doc));

        this.add(this._titleSectionView = new TitleSectionView(doc));
        this.add(this._legendSectionView = new LegendSectionView(doc));
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
        const polar = m._polar;
        const legend = m.legend;
        let w = hintWidth;
        let h = hintHeight;
        let sz: ISize;

        this._inverted = model.isInverted();
        
        // titles
        sz = this._titleSectionView.measure(doc, m, w, h, phase);
        h -= sz.height;

        // legend
        if (this._legendSectionView.visible = (legend.visible && !legend.isEmpty())) {
            sz = this._legendSectionView.measure(doc, m, w, h, phase);

            switch (legend.position) {
                case LegendPosition.TOP:
                case LegendPosition.BOTTOM:
                    h -= sz.height;
                    break;
                case LegendPosition.RIGHT:
                case LegendPosition.LEFT:
                    w -= sz.width;
                    break;
            }
        }

        this.$_prepareBody(doc, polar);
        if (polar) {
            this.$_measurePolar(doc, m, w, h, 1);
        } else {
            this.$_measurePlot(doc, m, w, h, 1);
        }
    }

    layout(): void {
        const m = this._model;
        let w = this.width;
        let h = this.height;

        if (this._emptyView?.visible) {
            this._emptyView.resize(w, h);
            return;
        }

        const polar = m.options.polar;
        const legend = m.legend;
        let x = 0;
        let y = 0;

        // title
        const vTitle = this._titleSectionView;
        let hTitle = 0;
        const yTitle = y;

        if (vTitle.visible) {
            vTitle.resizeByMeasured().layout();
            h -= hTitle = vTitle.height;
        }

        // body
        y = this.height;

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

            switch (legend.position) {
                case LegendPosition.TOP:
                    yLegend = hTitle;
                    h -= hLegend;
                    break;

                case LegendPosition.BOTTOM:
                    h -= hLegend;
                    yLegend = this.height - hLegend;
                    y -= hLegend;
                    break;
    
                case LegendPosition.RIGHT:
                    w -= wLegend;
                    xLegend = this.width - wLegend;
                    break;

                case LegendPosition.LEFT:
                    w -= wLegend;
                    x += wLegend;
                    break;
            }
        }

        // axes
        let asv: AxisSectionView;
        let axisMap: Map<SectionDir, AxisSectionView>;

        if (!polar) {
            axisMap = new Map(this._axisSectionViews);
    
            if ((asv = axisMap.get(SectionDir.LEFT)) && asv.visible) {
                w -= asv.mw;
            } else {
                axisMap.delete(SectionDir.LEFT);
            }
            if ((asv = axisMap.get(SectionDir.BOTTOM)) && asv.visible) {
                h -= asv.mh;
            } else {
                axisMap.delete(SectionDir.BOTTOM);
            }
    
            if ((asv = axisMap.get(SectionDir.LEFT)) && asv.visible) {
                asv.resize(asv.mw, h);
                asv.layout();
                x += asv.mw;
            }
            if ((asv = axisMap.get(SectionDir.BOTTOM)) && asv.visible) {
                asv.resize(w, asv.mh);
                asv.layout();
                y -= asv.mh;
            }
        }

        const org = this._org = Point.create(x, y);

        this._plotWidth = w;
        this._plotHeight = h;

        if (!polar) {
            if (asv = axisMap.get(SectionDir.LEFT)) {
                asv.translate(org.x - asv.mw, org.y - asv.height);
            }
            if (asv = axisMap.get(SectionDir.BOTTOM)) {
                asv.translate(org.x, org.y);
            }
        }

        // body
        const hPlot = this._plotHeight;
        const wPlot = this._plotWidth;

        x = org.x;
        y = org.y - hPlot;

        this._currBody.resize(wPlot, hPlot);
        this._currBody.layout().translate(x, y);

        // title
        vTitle.visible && vTitle.translate(x + (w - vTitle.width) / 2, yTitle);

        // legend
        if (vLegend.visible) {
            if (legend.position === LegendPosition.INSIDE) {
                switch (legend.valign) {
                    case VerticalAlign.TOP:
                        break;
                    case VerticalAlign.BOTTOM:
                        y += hPlot - hLegend;
                        break;
                    default:
                        y += (hPlot - hLegend) / 2;
                }
                switch (legend.align) {
                    case Align.LEFT:
                        break;
                    case Align.RIGHT:
                        x += wPlot - wLegend;
                        break;
                    default:
                        x += (wPlot - wLegend) / 2;
                }
            } else if (!isNaN(yLegend)) {
                x += (w - wLegend) / 2;
                y = yLegend;
            } else {
                x = xLegend;
                y = y + (h - hLegend) / 2;
            }
            vLegend.translate(x, y);
        }
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
                this._polarView = new PolarBodyView(doc);
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
    }

    private $_prepareAxes(doc: Document, m: Chart): void {
        const guideContainer = this._currBody._guideContainer;
        const frontGuideContainer = this._currBody._frontGuideContainer;
        const need = !m.options.polar && m.needAxes();
        const map = this._axisSectionViews;

        for (const dir of map.keys()) {
            const v = map.get(dir);

            if (need) {
                const axes = m.getAxes(dir);

                v.visible = true;
                v.prepare(doc, axes, dir === SectionDir.BOTTOM || dir === SectionDir.TOP, guideContainer, frontGuideContainer);
            } else {
                v.visible = false;
            }
        }
    }

    private $_measurePlot(doc: Document, m: Chart, w: number, h: number, phase: number): void {
        const map = this._axisSectionViews;
        const wSave = w;
        const hSave = h;

        // axes
        this.$_prepareAxes(doc, m);

        // 아래 checkWidth를 위해 tick을 생성한다.
        m.layoutAxes(w, h, this._inverted, phase);

        // if (this._flipped) {
            w -= map.get(SectionDir.LEFT).checkWidths(doc, w, h);
            w -= map.get(SectionDir.RIGHT).checkWidths(doc, w, h);
        // } else {
            h -= map.get(SectionDir.BOTTOM).checkHeights(doc, w, h);
            h -= map.get(SectionDir.TOP).checkHeights(doc, w, h);
        // }

        // 조정된 크기로 tick을 다시 생성한다.
        m.layoutAxes(w, h, this._inverted, phase);

        // axes
        for (const dir of map.keys()) {
            const asv = map.get(dir);
            
            if (asv.visible) {
                asv.measure(doc, m, w, h, phase);
            }
        }

        // 조정된 크기로 tick을 다시 생성한다 2.
        w = wSave;
        h = hSave;
        for (const dir of map.keys()) {
            const asv = map.get(dir);
            
            if (asv.visible) {
                if (dir === SectionDir.LEFT) {
                    w -= asv.mw;
                } else if (dir === SectionDir.BOTTOM) {
                    h -= asv.mh;
                }
            }
        }
        m.layoutAxes(w, h, this._inverted, phase);

        // body
        this._bodyView.measure(doc, m.body, w, h, phase);
    }

    private $_measurePolar(doc: Document, m: Chart, w: number, h: number, phase: number): void {
        const body = m.body;
        const rd = body.getSize(w, h) / 2;

        // axes
        this.$_prepareAxes(doc, m);
        m.layoutAxes(Math.PI * 2, rd, false, phase);

        // body
        this._polarView.measure(doc, m.body, w, h, phase);
    }
}