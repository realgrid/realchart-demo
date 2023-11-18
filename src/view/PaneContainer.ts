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
import { Axis, PaneAxes, PaneAxisMatrix } from "../model/Axis";
import { Chart, IChart } from "../model/Chart";
import { Series } from "../model/Series";
import { Split } from "../model/Split";
import { AxisScrollView, AxisView } from "./AxisView";
import { BodyView, IPlottingOwner } from "./BodyView";
import { SectionView } from "./ChartElement";
import { SeriesView } from "./SeriesView";

class AxisSectionView extends SectionView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    row: number;
    col: number;
    axes: Axis[]; 
    views: AxisView[] = [];
    isX: boolean;
    isHorz: boolean;
    // isOpposite: boolean;
    private _gap = 0;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepare(doc: Document, isX: boolean, paxes: PaneAxes, bodies: BodyView[][], mats: PaneAxisMatrix): void {
        const views = this.views;
        const axes: Axis[] = [];

        this.isX = isX;

        if (paxes) {
            paxes._axes.forEach(a => {
                axes.push(a);
            });
        }

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
            const axis = axes[i];
            const pos = axis._runPos;

            v.model = axes[i];

            // if (pos === AxisPosition.BETWEEN) {
            //     let row = !this.isX ? this.row - 1 : this.row;
            //     let col = this.isX ? this.col - 1 : this.col;
            //     v.prepareGuides(doc, bodies[row][col]._guideContainer, bodies[row][col]._frontGuideContainer);
            //     row = this.row;
            //     col = this.col;
            //     v.prepareGuides(doc, bodies[row][col]._guideContainer, bodies[row][col]._frontGuideContainer);
            // } else {
            //     const row = this.row;// pos === AxisPosition.OPPOSITE ? this.row - 1 : this.row;
            //     const col = this.col;//pos === AxisPosition.OPPOSITE ? this.col - 1 : this.col;
            //     v.prepareGuides(doc, bodies[row][col]._guideContainer, bodies[row][col]._frontGuideContainer);
            // }
        });

        this.axes = axes;

        if (this.setVisible(views.length > 0)) {
            const m = views[0].model;

            // this.isHorz = m._isHorz;
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
    protected _setInverted(inverted: boolean): void {
        super._setInverted(inverted);

        this.isHorz = (inverted && !this.isX) || (!inverted && this.isX);
    }

    protected _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize {
        const axes = this.axes;

        if (this.isHorz) {
            let h = 0;
            this.views.forEach((v, i) => {
                h += v.measure(doc, axes[i], hintWidth, hintHeight, phase).height;
            });
            return { width: hintWidth, height: h };
        } else {
            let w = 0;
            this.views.forEach((v, i) => {
                w += v.measure(doc, axes[i], hintWidth, hintHeight, phase).width;
            });
            return { width: w, height: hintHeight };
        }
    }

    protected _doLayout(param?: any): void {
        if (this.isHorz) {
            this.views.forEach(v => {
                v.resize(this.width, v.mh);
                v.layout();
            })
        } else {
            this.views.forEach(v => {
                v.resize(v.mw, this.height);
                v.layout();
            })
        }
    }
}

class AxisContainer extends SectionView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    sections: AxisSectionView[] = [];
    private _isHorz: boolean;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, public isX: boolean) {
        super(doc);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepare(doc: Document, bodies: BodyView[][], mats: PaneAxisMatrix, index: number): void {
        // const paxes = (this.isX ? mats.getColumn(index) : mats.getRow(index));
        const paxes = (this.isX ? mats.getRow(index) : mats.getColumn(index));

        while (this.sections.length < paxes.length) {
            const s = new AxisSectionView(doc);
            this.add(s);
            this.sections.push(s);
        }
        while (this.sections.length > paxes.length) {
            this.sections.pop().remove();
        }

        this.sections.forEach((s, i) => {
            if (this.isX) {
                s.row = index;
                s.col = i;
            } else {
                s.col = index;
                s.row = i;
            }
            s.prepare(doc, this.isX, paxes[i], bodies, mats);
        });
    }

    checkWidths(doc: Document, w: number, h: number): number {
        if (this.sections.length > 0) {
            return this.sections.reduce((a, s) => a + s.checkWidths(doc, w, h), 0);
        }
        return 0;
    }

    checkHeights(doc: Document, w: number, h: number): number {
        if (this.sections.length > 0) {
            return this.sections.reduce((a, s) => a + s.checkHeights(doc, w, h), 0);
        }
        return 0;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _setInverted(inverted: boolean): void {
        super._setInverted(inverted);

        this._isHorz = (inverted && !this.isX) || (!inverted && this.isX);
    }

    protected _doMeasure(doc: Document, chart: Chart, hintWidth: number, hintHeight: number, phase: number): ISize {
        let width = 0;
        let height = 0;

        if (this._isHorz) {
            this.sections.forEach(sec => {
                height = Math.max(height, sec.measure(doc, chart, hintWidth, hintHeight, phase).height);
            });
        } else {
            this.sections.forEach(sec => {
                width = Math.max(width, sec.measure(doc, chart, hintWidth, hintHeight, phase).width);
            });
        }
        return { width, height };
    }

    protected _doLayout(pts: number[]): void {
        if (this._isHorz) {
            this.sections.forEach((sec, i) => {
                if (this.height > 0) {
                    sec.resize(pts[(i + 1) * 2] - pts[(i + 1) * 2 - 1], this.height).translate(pts[i * 2 + 1] - pts[1], 0);
                    sec.layout();
                }
            });
        } else {
            this.sections.forEach((sec, i) => {
                if (this.width > 0) {
                    sec.resize(this.width, pts[(i + 1) * 2] - pts[(i + 1) * 2 - 1]).translate(0, this.height - (pts[(i + 1) * 2] - pts[1]));
                    sec.layout();
                }
            });
        }
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
    prepareRender(doc: Document, chart: IChart): void {
        const r = this.row;
        const c = this.col;
        const body = chart.split.getPane(r, c).body;
        const series = chart._getSeries().getPaneSeries(r, c);
        const gauges = chart._getGauges().getPaneVisibles(r, c);

        this._animatable = RcControl._animatable && chart.animatable();

        this._prepareSeries(doc, chart, series);
        this._prepareGauges(doc, chart, gauges);
        this._prepareAnnotations(doc, body.getAnnotations());
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
    prepare(doc: Document, model: Split): void {
        const chart = model.chart as Chart;

        this.$_init(doc);
        this._model = model;

        this.$_prepareBodies(doc, model);
    }

    measure(doc: Document, model: Split, xAxes: PaneAxisMatrix, yAxes: PaneAxisMatrix, w: number, h: number, phase: number): void {
        const chart = model.chart as Chart;
        const inverted = this._inverted = model.chart.isInverted();
        const wSave = w;
        const hSave = h;

        this.$_prepareAxes(doc, xAxes, true);
        this.$_prepareAxes(doc, yAxes, false);

        // 아래 checkWidth를 위해 tick을 생성한다.
        model.layoutAxes(w, h, inverted, phase);

        if (inverted) {
            w -= this._xContainers.reduce((a, c) => a + c.checkWidths(doc, w, h), 0);
            h -= this._yContainers.reduce((a, c) => a + c.checkHeights(doc, w, h), 0);
        } else {
            h -= this._xContainers.reduce((a, c) => a + c.checkHeights(doc, w, h), 0);
            w -= this._yContainers.reduce((a, c) => a + c.checkWidths(doc, w, h), 0);
        }

        // 조정된 크기로 tick을 다시 생성한다.
        model.layoutAxes(w, h, inverted, phase);

        this._xContainers.forEach(c => c.measure(doc, chart, w, h, phase));
        this._yContainers.forEach(c => c.measure(doc, chart, w, h, phase));

        w = wSave;
        h = hSave;

        if (inverted) {
            w -= this._xContainers.reduce((a, c) => a + c.mw, 0);
            h -= this._yContainers.reduce((a, c) => a + c.mh, 0);
        } else {
            h -= this._xContainers.reduce((a, c) => a + c.mh, 0);
            w -= this._yContainers.reduce((a, c) => a + c.mw, 0);
        }

        // 조정된 크기로 tick을 다시 생성한다 2.
        model.layoutAxes(w, h, inverted, phase);

        this._xContainers.forEach(c => c.measure(doc, chart, w, h, phase));
        this._yContainers.forEach(c => c.measure(doc, chart, w, h, phase));

        const xLens = model.getXLens(inverted ? h : w);
        const yLens = model.getYLens(inverted ? w : h);

        model.calcAxesPoints(xLens, yLens);
    }

    layout(): void {
        const model = this._model;
        const w = this.width;
        const h = this.height;

        // back
        this._back.resize(w, h);

        this.$_calcExtents(model, w, h);

        // axes
        this.$_layoutAxes(model, true, w, h);
        this.$_layoutAxes(model, false, w, h);

        // bodies
        this.$_layoutBodies(model, w, h);
    }

    seriesByDom(dom: Element): SeriesView<Series> {
        for (const body of this._bodies) {
            const v = body.seriesByDom(dom);
            if (v) return v;
        }
    }

    //-------------------------------------------------------------------------
    // internal
    //-------------------------------------------------------------------------
    private $_init(doc: Document): void {
        if (this._back) return;

        this.add(this._back = new RectElement(doc));
        this._back.setStyles({
            fill: 'none',
            //fill: '#f0f0f0',
            // stroke: 'lightgray',
            // strokeDasharray: '3'
        });

        this.add(this._bodyContainer = new LayerElement(doc, _undefined));
        this.add(this._axisContainer = new LayerElement(doc, _undefined));
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
            v.prepareRender(doc, chart);
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
            c.prepare(doc, this._bodyMap, mats, i);
        });
    }

    private $_calc(axes: AxisContainer[], count: number, len: number, size: string): number[] {
        const pts = new Array<number>((count + 1) * 2);
        const sum = len - axes.reduce((a, c) => a + c[size], 0);
        const szPanes = new Array<number>(count);
        let p = 0;
        let i = 0;

        for (i = 0; i < count; i++) {
            szPanes[i] = sum / count;
        }

        for (i = 0; i < count; i++) {
            pts[i * 2] = p;
            pts[i * 2 + 1] = p += axes[i][size];
            p += szPanes[i];
        }
        pts[i * 2] = p;
        pts[i * 2 + 1] = p + axes[i][size];
        return pts;
    }

    private $_calcExtents(model: Split, width: number, height: number): void {
        if (this._inverted) {
            // row points
            this._rowPoints = this.$_calc(this._xContainers, model.rowCount(), width, 'mw');
            this._colPoints = this.$_calc(this._yContainers, model.colCount(), height, 'mh');
        } else {
            this._rowPoints = this.$_calc(this._xContainers, model.rowCount(), height, 'mh');
            this._colPoints = this.$_calc(this._yContainers, model.colCount(), width, 'mw');
        }
    }

    private $_layoutAxes(model: Split, isX: boolean, w: number, h: number): void {
        const rowPts = this._rowPoints;
        const colPts = this._colPoints;
        const containers = isX ? this._xContainers : this._yContainers;

        if (this._inverted) {
            if (isX) {
                const y = colPts[1];
                const h2 = colPts[colPts.length - 2] - y;

                containers.forEach((c, i) => {
                    c.resize(c.mw, h2).translate(rowPts[i * 2], h - colPts[colPts.length - 2]); //y);
                    c.layout(colPts);
                });
            } else {
                const x = rowPts[1];
                const w2 = rowPts[2] - x;

                containers.forEach((c, i) => {
                    c.resize(w2, c.mh).translate(rowPts[i * 2 + 1], h - colPts[i * 2 + 1]);
                    c.layout(rowPts);
                });
            }
        } else {
            if (isX) {
                const x = colPts[1];
                w = colPts[colPts.length - 2] - x;

                containers.forEach((c, i) => {
                    c.resize(w, c.mh).translate(x, h - rowPts[i * 2 + 1]);
                    c.layout(colPts);
                });
            } else {
                const y = rowPts[rowPts.length - 2];
                const h2 = y - rowPts[1];

                containers.forEach((c, i) => {
                    c.resize(c.mw, h2).translate(colPts[i * 2], h - y);
                    c.layout(rowPts);
                });
            }
        }
    }

    private $_layoutBodies(model: Split, w: number, h: number): void {
        const chart = model.chart as Chart;
        const body = chart.body;
        const rows = model.rowCount();
        const cols = model.colCount();
        const rowPts = this._rowPoints;
        const colPts = this._colPoints;
        const views = this._bodies;

        if (this._inverted) {
            for (let r = 0; r < rows; r++) {
                const x1 = rowPts[(r + 1) * 2 - 1];
                const x2 = rowPts[(r + 1) * 2];

                for (let c = 0; c < cols; c++) {
                    const view = views[r * cols + c];
                    const y1 = colPts[c * 2 + 1];
                    const y2 = colPts[(c + 1) * 2];

                    view.measure(this.doc, model.getPane(r, c).body, x2 - x1, y2 - y1, 1);
                    view.resize(x2 - x1, y2 - y1).translate(x1, this.height - y2);
                    view.layout();
                }
            }
        } else {
            for (let r = 0; r < rows; r++) {
                const y1 = rowPts[(r + 1) * 2 - 1];
                const y2 = rowPts[(r + 1) * 2];

                for (let c = 0; c < cols; c++) {
                    const view = views[r * cols + c];
                    const x1 = colPts[(c + 1) * 2 - 1];
                    const x2 = colPts[(c + 1) * 2];

                    view.measure(this.doc, model.getPane(r, c).body, x2 - x1, y2 - y1, 1);
                    view.resize(x2 - x1, y2 - y1).translate(x1, h - y2);
                    view.layout();
                }
            }
        }
    }
}