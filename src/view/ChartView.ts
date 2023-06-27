////////////////////////////////////////////////////////////////////////////////
// ChartView.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from "../common/RcControl";
import { ISize } from "../common/Size";
import { GroupElement } from "../common/impl/GroupElement";
import { Chart } from "../main";
import { Title } from "../model/Title";
import { PieSeries } from "../model/series/PieSeries";
import { BodyView } from "./BodyView";
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

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    abstract _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize;
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

    _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize {
        // const title = chart.
        let width = hintWidth;
        let height = 0;
        let sz: ISize;

        if (this.titleView.visible = chart.title.visible()) {
            sz = this.titleView.measure(chart.title, hintWidth, hintHeight, phase);
            height += sz.height;
        }
        if (this.subtitleView.visible = chart.subtitle.visible()) {
            sz = this.subtitleView.measure(chart.subtitle, hintWidth, hintHeight, phase);
            height += sz.height;
        }

        return { width, height };
    }
}

class AxisSectionView extends SectionView {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize {
        return;
    }
}

class LegendSectionView extends SectionView {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize {
        return;
    }
}

class EmptyView extends GroupElement {
}

enum Dirs {
    LEFT,
    TOP,
    BOTTOM,
    RIGHT
}

export class ChartView extends RcElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _model: Chart;

    _emptyView: EmptyView;
    private _titleSectionView: TitleSectionView;
    private _axisSectionViews = new Map<Dirs, AxisSectionView>();
    private _legendSectionViews = new Map<Dirs, LegendSectionView>();
    private _bodyView: BodyView;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc);

        this.add(this._titleSectionView = new TitleSectionView(doc));
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
    measure(doc: Document, model: Chart, hintWidth: number, hintHeight: number, phase: number): void {
        const m = this._model = model;

        if (m) {
            if (this._emptyView) {
                this._emptyView.visible = false;
            }
        } else {
            if (!this._emptyView) {
                this._emptyView = new EmptyView(doc);
            }
            this._emptyView.resize(hintWidth, hintHeight);
            return;
        }

        let w = hintWidth;
        let h = hintHeight;
        let sz = this._titleSectionView.measure(doc, m, w, h, phase);

        if (this._emptyView) {
            this._emptyView.visible = false;
        }
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
}``