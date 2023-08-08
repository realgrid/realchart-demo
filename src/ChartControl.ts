////////////////////////////////////////////////////////////////////////////////
// ChartControl.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcControl } from "./common/RcControl";
import { RcEditTool } from "./common/RcEditTool";
import { IRect } from "./common/Rectangle";
import { Chart } from "./main";
import { ChartView } from "./view/ChartView";

export class ChartControl extends RcControl {

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
            this._model = value;
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

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    useImage(src: string): void {
    }

    protected _creatDefaultTool(): RcEditTool {
        return;
    }

    protected _doRender(bounds: IRect): void {
        console.time('render chart');

        if (this._model) {
            // Object.assign(this.dom().style, this._model.style);
        }

        this._chartView.measure(this.doc(), this._model, bounds.width, bounds.height, 1);
        this._chartView.resize(bounds.width, bounds.height);
        this._chartView.layout();

        console.timeEnd('render chart');
    }
}