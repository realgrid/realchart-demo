////////////////////////////////////////////////////////////////////////////////
// PaneContainer.ts
// 2023. 11. 07. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { LayerElement, RcControl } from "../common/RcControl";
import { ISize } from "../common/Size";
import { _undefined } from "../common/Types";
import { RectElement } from "../common/impl/RectElement";
import { TextElement } from "../common/impl/TextElement";
import { Axis, PaneAxisMatrix } from "../model/Axis";
import { Chart, IChart } from "../model/Chart";
import { Split } from "../model/Split";
import { AxisScrollView, AxisView } from "./AxisView";
import { AxisGuideContainer, BodyView, IPlottingOwner } from "./BodyView";
import { SectionView } from "./ChartElement";

class AxisSectionView extends SectionView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    axes: Axis[]; 
    views: AxisView[] = [];
    isX: boolean;
    isHorz: boolean;
    isOpposite: boolean;
    private _gap = 0;

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

        if (this.setVisible(views.length > 0)) {
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

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize {
        return;
    }

    protected _doLayout(param?: any): void {
    }
}

class AxisContainer extends SectionView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    sections: AxisSectionView[] = [];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, public isX: boolean) {
        super(doc);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepare(doc: Document, bodies: BodyView[], mats: PaneAxisMatrix, index: number): void {
        const axes = this.isX ? mats.getColumn(index) : mats.getRow(index);

        this.sections.forEach((s, i) => s.prepare(doc, axes[i]._axes, bodies[i]._guideContainer, bodies[i]._frontGuideContainer));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize {
        let width = 0;
        let height = 0;

        if (this.isX) {
            if (chart.isInverted()) {
                width = 50;
            } else {
                height = 50;
            }
        } else {
            if (chart.isInverted()) {
                height = 50;
            } else {
                width = 50;
            }
        }

        return { width, height };
    }

    protected _doLayout(param?: any): void {
    }
}

export class PaneBodyView extends BodyView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    row = 0;
    col = 0;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    prepareSeries(doc: Document, chart: IChart): void {
        const r = this.row;
        const c = this.col;
        const series = chart._getSeries().getPaneSeries(r, c);
        const gauges = chart._getGauges().getPaneVisibles(r, c);

        this._animatable = RcControl._animatable && chart.animatable();

        this._prepareSeries(doc, chart, series);
        this._prepareGauges(doc, chart, gauges);
    }
}

export class PaneContainer extends LayerElement {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly STYLE_NAME = 'rct-panes';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _debugger: TextElement;
    private _back: RectElement;
    private _bodyContainer: LayerElement;
    private _axisContainer: LayerElement;

    private _bodies: PaneBodyView[] = [];
    _bodyMap: PaneBodyView[][];
    private _xContainers: AxisContainer[] = [];
    private _yContainers: AxisContainer[] = [];

    private _owner: IPlottingOwner;
    private _model: Split;
    private _inverted: boolean;
    private _rowPoints: number[];
    private _colPoints: number[];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, owner: IPlottingOwner) {
        super(doc, PaneContainer.STYLE_NAME);

        this._owner = owner;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    measure(doc: Document, model: Split, xAxes: PaneAxisMatrix, yAxes: PaneAxisMatrix, width: number, height: number, phase: number): void {
        const chart = model.chart as Chart;

        this.$_init(doc);
        this._model = model;
        this._inverted = model.chart.isInverted();

        this.$_prepareBodies(doc, model);
        this.$_prepareAxes(doc, xAxes, true);
        this.$_prepareAxes(doc, yAxes, false);

        // 아래 checkWidth를 위해 tick을 생성한다.
        model.layoutAxes(width, height, this._inverted, phase);

        this._xContainers.forEach(c => c.measure(doc, chart, width, height, phase));
        this._yContainers.forEach(c => c.measure(doc, chart, width, height, phase));
    }

    layout(): void {
        const model = this._model;
        const w = this.width;
        const h = this.height;

        this.$_calcExtents(model, w, h);

        // back
        this._back.resize(w, h);

        // axes
        this.$_layoutAxes(model, true);
        this.$_layoutAxes(model, false);

        // bodies
        this.$_layoutBodies(model);

        // for testing
        this._debugger.text = model.colCount() + ', ' + model.rowCount();
        this._debugger.translate(w / 2, h / 2);
    }

    //-------------------------------------------------------------------------
    // internal
    //-------------------------------------------------------------------------
    private $_init(doc: Document): void {
        if (this._back) return;

        this.add(this._back = new RectElement(doc));
        this._back.setStyles({
            fill: '#f0f0f0',
            stroke: 'lightgray',
            strokeDasharray: '3'
        });

        this.add(this._bodyContainer = new LayerElement(doc, _undefined));
        this.add(this._axisContainer = new LayerElement(doc, _undefined));

        this.add(this._debugger = TextElement.createCenter(doc));
    }

    private $_prepareBodies(doc: Document, model: Split): void {
        const chart = model.chart;
        const count = model.paneCount();
        const views = this._bodies;
        const map = this._bodyMap = [];

        while (views.length < count) {
            const body = new PaneBodyView(doc, this._owner);

            this._bodyContainer.add(body);
            views.push(body);
        }
        while (views.length > count) {
            views.pop().remove();
        }

        for (let r = 0; r < model.rowCount(); r++) {
            const list: PaneBodyView[] = [];

            for (let c = 0; c < model.colCount(); c++) {
                const v = views[r * model.colCount() + c];
                list.push(v);
                v.row = r;
                v.col = c;
            }
            map.push(list);
        }
        views.forEach(v => {
            v.prepareSeries(doc, chart);
            // guides - axis view에서 guide view들을 추가할 수 있도록 초기화한다.
            v.prepareGuideContainers();
        });
    }

    private $_prepareAxes(doc: Document, mats: PaneAxisMatrix, isX: boolean): void {
        const containers = isX ? this._xContainers : this._yContainers;
        const count = isX ? mats.rows() : mats.cols();
        // console.log(isX ? 'x' : 'y', count);

        while (containers.length < count) {
            const c = new AxisContainer(doc, isX);

            this._axisContainer.add(c);
            containers.push(c);
        }
        while (containers.length > count) {
            containers.pop().remove();
        }

        containers.forEach((c, i) => {
            const bodies = isX ? this._bodyMap[i] : this._bodyMap.map(a => a[i]);
            c.prepare(doc, bodies, mats, i);
        });
    }

    private $_calcExtents(model: Split, width: number, height: number): void {
        if (this._inverted) {

        } else {
            // row points
            let count = model.rowCount();
            let axes = this._xContainers;
            let pts = this._rowPoints = new Array<number>((count + 1) * 2);
            let sum = height - axes.reduce((a, c) => a + c.mh, 0);
            let szPanes = new Array<number>(count);
            let p = 0;
            let i = 0;

            for (i = 0; i < count; i++) {
                szPanes[i] = sum / count;
            }

            for (i = 0; i < count; i++) {
                pts[i * 2] = p;
                pts[i * 2 + 1] = p += axes[i].mh;
                p += szPanes[i];
            }
            pts[i * 2] = p;
            pts[i * 2 + 1] = p + axes[i].mh;
            console.log('rows', pts);

            // col points
            count = model.colCount();
            axes = this._yContainers;
            pts = this._colPoints = new Array<number>((count + 1) * 2);
            sum = width - axes.reduce((a, c) => a + c.mw, 0);
            szPanes = new Array<number>(count);
            p = 0;
            i = 0;

            for (i = 0; i < count; i++) {
                szPanes[i] = sum / count;
            }

            for (i = 0; i < count; i++) {
                pts[i * 2] = p;
                pts[i * 2 + 1] = p += axes[i].mw;
                p += szPanes[i];
            }
            pts[i * 2] = p;
            pts[i * 2 + 1] = p + axes[i].mw;
            console.log('cols', pts);
        }
    }

    private $_layoutAxes(model: Split, isX: boolean): void {
        const containers = isX ? this._xContainers : this._yContainers;

        if (this._inverted) {
        } else {
            if (isX) {
            } else {
            }
        }
    }

    private $_layoutBodies(model: Split): void {
        const w = this.width;
        const h = this.height;
        const chart = model.chart as Chart;
        const body = chart.body;
        const rows = model.rowCount();
        const cols = model.colCount();
        const rowPts = this._rowPoints;
        const colPts = this._colPoints;
        const views = this._bodies;

        if (this._inverted) {
        } else {
            for (let r = 0; r < rows; r++) {
                const y1 = rowPts[(r + 1) * 2 - 1];
                const y2 = rowPts[(r + 1) * 2];

                for (let c = 0; c < cols; c++) {
                    const view = views[r * cols + c];
                    const x1 = colPts[(c + 1) * 2 - 1];
                    const x2 = colPts[(c + 1) * 2];

                    view.measure(this.doc, body, x2 - x1, y2 - y1, 1);
                    view.resize(x2 - x1, y2 - y1).translate(x1, h - y2);
                    view.layout();
                }
            }
        }
    }
}