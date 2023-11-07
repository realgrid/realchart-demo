////////////////////////////////////////////////////////////////////////////////
// PaneContainer.ts
// 2023. 11. 07. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { LayerElement } from "../common/RcControl";
import { ISize } from "../common/Size";
import { _undefined } from "../common/Types";
import { RectElement } from "../common/impl/RectElement";
import { TextElement } from "../common/impl/TextElement";
import { Axis, PaneAxisMatrix } from "../model/Axis";
import { Chart } from "../model/Chart";
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
    prepare(doc: Document, mats: PaneAxisMatrix, index: number): void {
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

    private _bodies: BodyView[] = [];
    private _xContainers: AxisContainer[] = [];
    private _yContainers: AxisContainer[] = [];

    private _owner: IPlottingOwner;
    private _model: Split;

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
        this.$_init(doc);
        this._model = model;

        this.$_prepareBodies(doc, model);
        this.$_prepareAxes(doc, xAxes, true);
        this.$_prepareAxes(doc, yAxes, false);
    }

    layout(): void {
        const model = this._model;
        const w = this.width;
        const h = this.height;

        // back
        this._back.resize(w, h);

        // bodies

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
        const count = model.paneCount();
        const views = this._bodies;

        while (views.length < count) {
            const body = new BodyView(doc, this._owner);

            this._bodyContainer.add(body);
            views.push(body);
        }

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
    }

    private $_layoutBodies(): void {
    }

    private $_layoutAxes(): void {
    }
}