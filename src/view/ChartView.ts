////////////////////////////////////////////////////////////////////////////////
// ChartView.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from "../common/RcControl";
import { ISize } from "../common/Size";
import { SectionDir } from "../common/Types";
import { GroupElement } from "../common/impl/GroupElement";
import { Chart } from "../main";
import { Axis } from "../model/Axis";
import { Legend, LegendPosition } from "../model/Legend";
import { PieSeries } from "../model/series/PieSeries";
import { AxisView } from "./AxisView";
import { BodyView } from "./BodyView";
import { LegendView } from "./LegendView";
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
        this.add(this.titleView = new TitleView(doc));
        this.add(this.subtitleView = new TitleView(doc));
    }

    protected _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize {
        let width = hintWidth;
        let height = 0;
        let sz: ISize;

        if (this.titleView.visible = chart.title.visible()) {
            sz = this.titleView.measure(doc, chart.title, hintWidth, hintHeight, phase);
            height += sz.height;
            hintHeight -= sz.height;
        }
        if (this.subtitleView.visible = chart.subtitle.visible()) {
            sz = this.subtitleView.measure(doc, chart.subtitle, hintWidth, hintHeight, phase);
            height += sz.height;
            hintHeight -= sz.height;
        }
        return { width, height };
    }

    protected _doLayout(): void {
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
    prepare(doc: Document, axes: Axis[]): void {
        const views = this.views;

        while (views.length < axes.length) {
            const v = new AxisView(doc);

            this.add(v);
            views.push(v);
        }
        while (views.length > axes.length) {
            views.pop().remove();
        }

        this.axes = axes;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize {
        const axes = this.axes;

        this.views.forEach((v, i) => {
            v.measure(doc, axes[i], hintWidth, hintHeight, phase);
        })
        return;
    }

    protected _doLayout(): void {
    }
}

class EmptyView extends GroupElement {
}

export class ChartView extends RcElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _model: Chart;

    _emptyView: EmptyView;
    private _titleSectionView: TitleSectionView;
    private _legendSectionView: LegendSectionView;
    private _axisSectionViews = new Map<SectionDir, AxisSectionView>();
    private _bodyView: BodyView;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc);

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

    //-------------------------------------------------------------------------
    // methods
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

    measure(doc: Document, model: Chart, hintWidth: number, hintHeight: number, phase: number): void {
        if (model && phase == 1) {
            model.prepareRender();
        }
        
        if (this.$_checkEmpty(doc, model, hintWidth, hintHeight)) {
            return;
        }
        
        const m = this._model = model;
        const legend = m.legend;
        let w = hintWidth;
        let h = hintHeight;
        let sz: ISize;
        
        // titles
        sz = this._titleSectionView.measure(doc, m, w, h, phase);
        h -= sz.height;

        // legend
        if (this._legendSectionView.visible = (legend.visible() && !legend.isEmpty())) {
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

        // axes
    }

    layout(): void {
        const m = this._model;
        const w = this.width;
        const h = this.height;

        if (m) {
        } else {
            this._emptyView.resize(w, h);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_createBodyView(doc: Document): BodyView {
        return (this._model && this._model.series instanceof PieSeries) ? null : new BodyView(doc);
    }
}