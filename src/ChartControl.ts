////////////////////////////////////////////////////////////////////////////////
// ChartControl.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isObject } from "./common/Common";
import { RcControl, RcElement } from "./common/RcControl";
import { IRect } from "./common/Rectangle";
import { Axis } from "./model/Axis";
import { Chart, IChartEventListener } from "./model/Chart";
import { ChartItem } from "./model/ChartItem";
import { DataPoint } from "./model/DataPoint";
import { Series } from "./model/Series";
import { ChartPointerHandler } from "./tool/PointerHandler";
import { ChartView } from "./view/ChartView";

export class ChartControl extends RcControl implements IChartEventListener {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _model: Chart;
    private _chartView: ChartView;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, container: string | HTMLDivElement) {
        super(doc, container);

        this.addElement(this._chartView = new ChartView(doc));

        this.setPointerHandler(new ChartPointerHandler(this));
    }

    //-------------------------------------------------------------------------
    // IChartEventListener
    //-------------------------------------------------------------------------
    onModelChanged(chart: Chart, item: ChartItem): void {
        this.invalidateLayout();
    }

    onVisibleChanged(chart: Chart, item: ChartItem): void {
        // if (item instanceof Series) {
            this.invalidateLayout();
        // }
    }

    onPointVisibleChanged(chart: Chart, series: Series, point: DataPoint): void {
        this.invalidateLayout();
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * chart model.
     */
    get model(): Chart {
        return this._model;
    }
    set model(value: Chart) {
        if (value !== this._model) {
            if (this._model) {
                this._model.assets.unregister(this.doc(), this);
                this._model.removeListener(this);
            }
            this._model = value;
            if (this._model) {
                this._model.addListener(this);
                this._model.assets.register(this.doc(), this);
            }
            this.invalidateLayout();
        }
    }

    chartView(): ChartView {
        return this._chartView;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(config: any, loadAnimation = false): void {
        this.loaded = !loadAnimation; 
        this.clearAssetDefs();
        this.model = new Chart(config);
    }

    refresh(now: boolean): void {
        if (now) {
            this._render();
        } else {
            this.invalidateLayout();
        }
    }

    scroll(axis: Axis, pos: number): void {
        this._chartView.getAxis(axis)?.scroll(pos);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doRender(bounds: IRect): void {
        const model = this._model;
        const view = this._chartView;
        
        this.clearTemporaryDefs();

        if (model) {
            this.setData('theme', model.options.theme, true);
            this.setData('palette', model.options.palette);
        }
        view.measure(this.doc(), model, bounds.width, bounds.height, 1);
        view.setRect(bounds);
        view.layout();
    }

    protected _doRenderBackground(elt: HTMLDivElement, root: RcElement, width: number, height: number): void {
        if (this._model) {
            const style: any = this._model.options.style;

            if (isObject(style)) {
                for (const p in style) {
                    if (p.startsWith('padding')) {
                        root.setStyle(p, style[p]);
                    } else {
                        elt.style[p] = style[p];
                    }
                }
            }
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}
