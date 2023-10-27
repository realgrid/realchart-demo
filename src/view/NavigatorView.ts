////////////////////////////////////////////////////////////////////////////////
// NavigatorView.ts
// 2023. 10. 18. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathBuilder } from "../common/PathBuilder";
import { LayerElement, PathElement, RcElement } from "../common/RcControl";
import { ISize } from "../common/Size";
import { RectElement } from "../common/impl/RectElement";
import { Axis } from "../model/Axis";
import { Chart } from "../model/Chart";
import { Series } from "../model/Series";
import { SeriesNavigator } from "../model/SeriesNavigator";
import { AxisView } from "./AxisView";
import { createSeriesView } from "./BodyView";
import { ChartElement } from "./ChartElement";
import { SeriesView } from "./SeriesView";

export class NavigatorHandleView extends RcElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _back: RectElement;
    private _shape: PathElement;

    _vertical: boolean;
    private _w: number;
    private _h: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, NavigatorView.HANDLE_STYLE);

        this.add(this._back = new RectElement(doc));
        this.add(this._shape = new PathElement(doc));
        this._shape.setStyle('fill', 'white');
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    layout(width: number, height: number, vertical: boolean): void {
        if (width !== this._w || height !== this._h || vertical !== this._vertical) {
            let sz = Math.min(width, height) * 1.3;
            const pb = new PathBuilder();
    
            this._back.rect = {
                x: -sz / 2,
                y: -sz / 2,
                width: sz,
                height: sz,
                rx: sz / 2
            };

            sz /= 3;
            pb.polygon(-sz - 1, 0, -1, -sz, -1, sz);
            pb.polygon(sz + 1, 0, 1, -sz, 1, sz);
            this._shape.setPath(pb.end());

            this._w = width;
            this._h = height;
            this._vertical = vertical;
        }
    }
}

/**
 * @internal
 */
export class NavigatorView extends ChartElement<SeriesNavigator> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly CLASS_NAME = 'rct-navigator';
    static readonly BACK_STYLE = 'rct-navigator-back';
    static readonly MASK_STYLE = 'rct-navigator-mask';
    static readonly HANDLE_STYLE = 'rct-navigator-handle';
    static readonly HANDLE_BACK_STYLE = 'rct-navigator-handle-back';

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static isHandle(dom: Element): boolean {
        return dom.parentElement.classList.contains(NavigatorView.HANDLE_STYLE);
    }

    static isMask(dom: Element): boolean {
        return dom.classList.contains(NavigatorView.MASK_STYLE);
    }

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _back: RectElement;
    private _container: LayerElement;
    private _seriesView: SeriesView<Series>;
    private _xAxisView: AxisView;
    private _yAxisView: AxisView;
    _mask: RectElement;
    _startHandle: NavigatorHandleView;
    _endHandle: NavigatorHandleView;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, NavigatorView.CLASS_NAME);

        this.add(this._back = new RectElement(doc, NavigatorView.BACK_STYLE))
        this.add(this._container = new LayerElement(doc, null));
        this.add(this._mask = new RectElement(doc, NavigatorView.MASK_STYLE))
        this.add(this._startHandle = new NavigatorHandleView(doc));
        this.add(this._endHandle = new NavigatorHandleView(doc));

        this._startHandle.setStyle('cursor', 'ew-resize');
        this._endHandle.setStyle('cursor', 'ew-resize');
        this._mask.setStyle('cursor', 'ew-resize');
        this._mask.dom.addEventListener('dblclick', () => {
            if (this.model.axis()._zoom) {
                this.model.axis().resetZoom();
            }
        });
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doMeasure(doc: Document, model: SeriesNavigator, hintWidth: number, hintHeight: number, phase: number): ISize {
        const chart = model._naviChart as Chart;
        const series = chart.firstSeries;
        let width = hintWidth;
        let height = hintHeight;

        if (model._vertical) {
            width = model.thickness + model.gap + model.gapFar;
        } else {
            height = model.thickness + model.gap + model.gapFar;
        }

        model._naviChart.layoutAxes(width, height, false, 1);

        this.$_prepareSeriesView(doc, chart);
        this.$_prepareXAxisView(doc, chart);
        this.$_prepareYAxisView(doc, chart);

        (model._naviChart.xAxis as Axis).calcPoints(width, 1);
        (model._naviChart.yAxis as Axis).calcPoints(height, 1);

        return { width, height };
    }

    protected _doLayout(param: any): void {
        const model = this.model;
        const zoom = model.axis()._zoom;
        const w = this.width;
        const h = this.height;

        // background
        this._back.resize(w, h);

        // handle
        if (model._vertical) {
        } else {
            const x1 = zoom ? zoom.start * w / model.axisLen() : 0;
            const x2 = zoom ? zoom.end * w / model.axisLen() : w;
            // console.log('end', zoom ? zoom.end : w, x2);

            this._mask.setBounds(x1, 0, x2 - x1, h);

            this._startHandle.layout(h / 3, h / 3, false)
            this._startHandle.translate(x1, h / 2);
            this._endHandle.layout(h / 3, h / 3, false);
            this._endHandle.translate(x2, h / 2);
        }

        // seires
        if (this._seriesView) {
            this._seriesView.measure(this.doc, model._naviChart.firstSeries, w, h, 1);
            this._seriesView.resize(w, h);
            this._seriesView.layout();
        }

        // x axis
        if (this._xAxisView) {
            this._xAxisView.measure(this.doc, model._naviChart.xAxis as Axis, w, h, 1);
            this._xAxisView.resize(w, h);
            this._xAxisView.layout();
        }

        // y axis
        if (this._yAxisView) {
            this._yAxisView.measure(this.doc, model._naviChart.yAxis as Axis, w, h, 1);
            this._yAxisView.resize(w, h);
            this._yAxisView.layout();
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareSeriesView(doc: Document, chart: Chart): void {
        const series = chart.firstSeries;
        let view = this._seriesView;

        if (view && view.model !== series) {
            view.remove();
            view = this._seriesView = null;
        }
        if (!view) {
            this._container.add(view = this._seriesView = createSeriesView(doc, series));
            view._simpleMode = true;
        }
        if (view) {
            view.prepareSeries(doc, series);
        }
    }

    private $_prepareXAxisView(doc: Document, chart: Chart): void {
        const axis = chart.xAxis as Axis;
        let view = this._xAxisView;

        if (view && view.model !== axis) {
            view.remove();
            view = this._xAxisView = null;
        }
        if (!view) {
            this._container.add(view = this._xAxisView = new AxisView(doc));
            view._simpleMode = true;
        }
        if (view) {
        }
    }

    private $_prepareYAxisView(doc: Document, chart: Chart): void {
        const axis = chart.yAxis as Axis;
        let view = this._yAxisView;

        if (view && view.model !== axis) {
            view.remove();
            view = this._yAxisView = null;
        }
        if (!view) {
            this._container.add(view = this._yAxisView = new AxisView(doc));
            view._simpleMode = true;
        }
        if (view) {
        }
    }
}