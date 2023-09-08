////////////////////////////////////////////////////////////////////////////////
// ChartControl.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcControl } from "./common/RcControl";
import { IRect } from "./common/Rectangle";
import { Chart, IChartEventListener } from "./model/Chart";
import { ChartItem } from "./model/ChartItem";
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
    onVisibleChanged(chart: Chart, item: ChartItem): void {
        if (item instanceof Series) {
            this.invalidateLayout();
        }
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
    refresh(): void {
        this.invalidateLayout();
    }

    update(config: any, loadAnimation = false): void {
        this.loaded = !loadAnimation; 
        this.model = new Chart(config);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    useImage(src: string): void {
    }

    protected _doRender(bounds: IRect): void {
        this.clearTemporaryDefs();

        this._chartView.measure(this.doc(), this._model, bounds.width, bounds.height, 1);
        this._chartView.resize(bounds.width, bounds.height);
        this._chartView.layout();
    }

    protected _doRenderBackground(elt: HTMLDivElement, width: number, height: number): void {
        if (this._model) {
            Object.assign(elt.style, this._model.options.style);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}