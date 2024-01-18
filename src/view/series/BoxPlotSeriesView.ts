////////////////////////////////////////////////////////////////////////////////
// BoxPlotSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { RcElement } from "../../common/RcControl";
import { LineElement } from "../../common/impl/PathElement";
import { RectElement } from "../../common/impl/RectElement";
import { BoxPlotSeries, BoxPlotSeriesPoint } from "../../model/series/BoxPlotSeries";
import { IPointView, RangeElement, RangedSeriesView, SeriesView } from "../SeriesView";

class BoxView extends RangeElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: BoxPlotSeriesPoint;

    private _stemUp: LineElement;
    private _stemDown: LineElement;
    private _box: RectElement;
    private _mid: LineElement;
    private _min: LineElement;
    private _max: LineElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS + ' rct-boxplot-point');
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    layout(): void {
        const p = this.point;
        const w = this.width;
        const h = this.height;
        const len = Math.max(0.0001, p.yValue - p.minValue);
        const x = w / 2;
        let y = 0;
        const yLow = y + h - h * (p.lowValue - p.minValue) / len;
        const yHigh = y + h - h * (p.highValue - p.minValue) / len;
        const hBox = h * (p.highValue - p.lowValue) / len;

        p.color && this._box.setFill(p.color);
        this.x = this.tx + x; // savePrevs()에서 사용한다.

        this._stemUp.setVLine(x, y, yHigh);
        this._stemDown.setVLine(x, yLow, h);
        this._min.setHLine(y, w / 4, w * 3 / 4);
        this._max.setHLine(y + h, w / 4, w * 3 / 4);
        this._box.setBox(0, yHigh, w, hBox);
        this._mid.setHLine(y + h - h * (p.midValue - p.minValue) / len, 0, w);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doInitChildren(doc: Document): void {
        this.add(this._stemUp = new LineElement(doc, 'rct-boxplot-point-stem'));
        this.add(this._stemDown = new LineElement(doc, 'rct-boxplot-point-stem'));
        this.add(this._box = new RectElement(doc, 'rct-boxplot-point-box'));
        this.add(this._mid = new LineElement(doc, 'rct-boxplot-point-mid'));
        this.add(this._min = new LineElement(doc, 'rct-boxplot-point-min'));
        this.add(this._max = new LineElement(doc, 'rct-boxplot-point-max'));
    }
}

export class BoxPlotSeriesView extends RangedSeriesView<BoxPlotSeries> {

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
    protected _getPointPool(): ElementPool<RcElement> {
        return this._boxes;
    }

    protected _getLowValue(p: BoxPlotSeriesPoint): number {
        return p.minValue;
    }

    protected _preparePoints(doc: Document, model: BoxPlotSeries, points: BoxPlotSeriesPoint[]): void {
        this._boxes.prepare(points.length, (box, i) => {
            const p = box.point = points[i];

            this._setPointStyle(box, model, p);
        })
    }

    protected _layoutPoint(box: BoxView, i: number, x: number, y: number, wPoint: number, hPoint: number): void {
        box.setBounds(x - wPoint / 2, y, wPoint, hPoint);
        box.layout();
    }
}