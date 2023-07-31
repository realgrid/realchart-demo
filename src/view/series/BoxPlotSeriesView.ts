////////////////////////////////////////////////////////////////////////////////
// BoxPlotSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { IRect } from "../../common/Rectangle";
import { GroupElement } from "../../common/impl/GroupElement";
import { LineElement } from "../../common/impl/PathElement";
import { RectElement } from "../../common/impl/RectElement";
import { BoxPlotSeries, BoxPlotSeriesPoint } from "../../model/series/BoxPlotSeries";
import { PointLabelView, SeriesView } from "../SeriesView";

class BoxView extends GroupElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _back: RectElement;
    private _stemUp: LineElement;
    private _stemDown: LineElement;
    private _box: RectElement;
    private _mid: LineElement;
    private _min: LineElement;
    private _max: LineElement;

    point: BoxPlotSeriesPoint;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    layout(): void {
        const p = this.point;
        const w = this.width;
        const h = this.height;
        const len = p.yValue - p.minValue;
        const x = w / 2;// p.width / 2;
        let y = 0;
        const yLow = y + h - h * (p.lowValue - p.minValue) / len;
        const yHigh = y + h - h * (p.highValue - p.minValue) / len;

        this._back.setBounds(0, 0, w, h);
        this._stemUp.setVLine(x, y, yHigh);
        this._stemDown.setVLine(x, yLow, h);
        this._min.setHLine(y, w / 4, w * 3 / 4);
        this._max.setHLine(y + h, w / 4, w * 3 / 4);
        this._box.setBounds(0, yHigh, w, h * (p.highValue - p.lowValue) / len);
        this._mid.setHLine(y + h - h * (p.midValue - p.minValue) / len, 0, w);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doInitChildren(doc: Document): void {
        this.add(this._back = new RectElement(doc, 'rct-boxplot-series-back'));
        this.add(this._stemUp = new LineElement(doc, 'rct-boxplot-series-stem'));
        this.add(this._stemDown = new LineElement(doc, 'rct-boxplot-series-stem'));
        this.add(this._box = new RectElement(doc, 'rct-boxplot-series-box'));
        this.add(this._mid = new LineElement(doc, 'rct-boxplot-series-mid'));
        this.add(this._min = new LineElement(doc, 'rct-boxplot-series-min'));
        this.add(this._max = new LineElement(doc, 'rct-boxplot-series-max'));
    }
}

export class BoxPlotSeriesView extends SeriesView<BoxPlotSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _boxes = new ElementPool(this._pointContainer, BoxView);

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-boxplot-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: BoxPlotSeries): void {
        this.$_prepareBoxes(model._visPoints as BoxPlotSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        this.$_layoutBoxes(width, height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareBoxes(points: BoxPlotSeriesPoint[]): void {
        this._boxes.prepare(points.length, (box, i) => {
            box.point = points[i];
        })
    }

    private $_layoutBoxes(width: number, height: number): void {
        const series = this.model;
        const labels = series.pointLabel;
        const labelVis = labels.visible;
        const labelOff = labels.offset;
        const labelViews = this._labelContainer;
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const yOrg = this.height;

        this._boxes.forEach((box, i) => {
            const p = box.point;
            const wUnit = xAxis.getUnitLength(width, i);
            const wPoint = series.getPointWidth(wUnit);
            const x = p.xPos = xAxis.getPosition(this.width, p.xValue) - wPoint / 2;
            const y = p.yPos = yOrg - yAxis.getPosition(this.height, p.yValue);
            const w = wPoint;
            const h = Math.abs(yAxis.getPosition(height, p.minValue) - y);

            box.setBounds(x, y, w, h);
            box.layout();

            if (labelVis) {
                let view: PointLabelView;
                let r: IRect;

                if (view = labelViews.get(p, 1)) {
                    r = view.getBBounds();
                    view.translate(x + (w - r.width) / 2, y - r.height - labelOff);
                }
                if (view = labelViews.get(p, 0)) {
                    r = view.getBBounds();
                    view.translate(x + (w - r.width) / 2, y + h + labelOff);
                }
            }
        })
    }
}