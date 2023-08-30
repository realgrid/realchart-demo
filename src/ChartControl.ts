////////////////////////////////////////////////////////////////////////////////
// ChartControl.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcControl } from "./common/RcControl";
import { IRect } from "./common/Rectangle";
import { ImageElement } from "./common/impl/ImageElement";
import { RectElement } from "./common/impl/RectElement";
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
    private _background: RectElement;
    private _image: ImageElement;
    private _chartView: ChartView;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, container: string | HTMLDivElement) {
        super(doc, container);

        this.addElement(this._background = new RectElement(doc, 'rct-background'));
        this.addElement(this._image = new ImageElement(doc, 'rct-background-image'));
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
            this._model && this._model.removeListener(this);
            this._model = value;
            this._model && this._model.addListener(this);
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
        console.time('render chart');

        this.clearTemporaryDefs();

        if (this._model) {
            // Object.assign(this.dom().style, this._model.style);
        }

        this._model && this.$_layoutBackground(this._background, bounds.width, bounds.height);
        this._chartView.measure(this.doc(), this._model, bounds.width, bounds.height, 1);
        this._chartView.resize(bounds.width, bounds.height);
        this._chartView.layout();

        console.timeEnd('render chart');
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_layoutBackground(elt: RectElement, w: number, h: number): void {
        const opts = this._model.options;
        const img = this._image;

        elt.setStyleOrClass(opts.backgroundStyle);
        elt.resize(w, h);

        if (img.setVisible(img.setImage(opts.backgroundImage.url, w, h))) {
            img.setStyleOrClass(opts.backgroundImage.style);
        }
    }
}