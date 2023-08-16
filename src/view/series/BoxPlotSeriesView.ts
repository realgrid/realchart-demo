////////////////////////////////////////////////////////////////////////////////
// BoxPlotSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { RcElement } from "../../common/RcControl";
import { IRect } from "../../common/Rectangle";
import { GroupElement } from "../../common/impl/GroupElement";
import { LineElement } from "../../common/impl/PathElement";
import { RectElement } from "../../common/impl/RectElement";
import { CategoryAxis } from "../../model/axis/CategoryAxis";
import { BoxPlotSeries, BoxPlotSeriesPoint } from "../../model/series/BoxPlotSeries";
import { IPointView, PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class BoxView extends GroupElement implements IPointView {

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
        super(doc, SeriesView.POINT_STYLE + ' rct-boxplot-point');
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    layout(): void {
        const p = this.point;
        const w = this.width;
        const h = this.height;
        const len = p.yValue - p.minValue;

        this._box.setStyle('fill', p.color);

        const x = w / 2;;
        let y = 0;
        const yLow = y + h - h * (p.lowValue - p.minValue) / len;
        const yHigh = y + h - h * (p.highValue - p.minValue) / len;

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
        this.add(this._stemUp = new LineElement(doc, 'rct-boxplot-point-stem'));
        this.add(this._stemDown = new LineElement(doc, 'rct-boxplot-point-stem'));
        this.add(this._box = new RectElement(doc, 'rct-boxplot-point-box'));
        this.add(this._mid = new LineElement(doc, 'rct-boxplot-point-mid'));
        this.add(this._min = new LineElement(doc, 'rct-boxplot-point-min'));
        this.add(this._max = new LineElement(doc, 'rct-boxplot-point-max'));
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
    protected _getPointPool(): ElementPool<RcElement> {
        return this._boxes;
    }

    protected _prepareSeries(doc: Document, model: BoxPlotSeries): void {
        this.$_prepareBoxes(model._visPoints as BoxPlotSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        this._pointContainer.invert(this.model.chart.isInverted(), height);
        this.$_layoutBoxes(width, height);
    }

    protected _runShowEffect(firstTime: boolean): void {
        firstTime && SeriesAnimation.grow(this);
    }

    protected _doViewRateChanged(rate: number): void {
        this.$_layoutBoxes(this.width, this.height);
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
        const inverted = series.chart.isInverted();
        const vr = this._getViewRate();
        const labels = series.pointLabel;
        const labelOff = labels.offset;
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const wPad = xAxis instanceof CategoryAxis ? xAxis.categoryPad() * 2 : 0;
        const yLen = inverted ? width : height;
        const xLen = inverted ? height : width;
        const org = inverted ? 0 : height;;

        this._boxes.forEach((box, i) => {
            const p = box.point;
            const wUnit = xAxis.getUnitLength(xLen, i) * (1 - wPad);
            const wPoint = series.getPointWidth(wUnit);
            const yVal = yAxis.getPosition(yLen, p.yValue);
            const hPoint = Math.abs(yAxis.getPosition(yLen, p.minValue) - yVal) * vr;
            let x: number;
            let y: number;

            // if (inverted) {
            //     y = xLen - xAxis.getPosition(xLen, i) - wUnit / 2;
            //     x = org;
            // } else {
                x = xAxis.getPosition(xLen, i) - wUnit / 2;
                y = org;
            // }

            // if (inverted) {
            //     p.yPos = y += series.getPointPos(wUnit);
            //     p.xPos = x += yAxis.getPosition(yLen, p.yGroup) * vr;
            //     x -= hPoint;
            // } else {
                p.xPos = x += series.getPointPos(wUnit);
                p.yPos = y -= yAxis.getPosition(yLen, p.yGroup) * vr;
            // }

            // if (inverted) {
            //     box.setBounds(x, y, hPoint, wPoint);
            // } else {
                box.setBounds(x, y, wPoint, hPoint);
            // }
            box.layout();

            if (labelViews) {
                if (inverted) {
                    y = xLen - xAxis.getPosition(xLen, i) - wUnit / 2;
                    x = org;
                    p.yPos = y += series.getPointPos(wUnit);
                    p.xPos = x += yAxis.getPosition(yLen, p.yGroup) * vr;
                    x -= hPoint;
                }

                let view: PointLabelView;
                let r: IRect;

                if (view = labelViews.get(p, 1)) {
                    r = view.getBBounds();
                    if (inverted) {
                        view.translate(x + hPoint + labelOff, y + (wPoint - r.height) / 2);
                    } else {
                        view.translate(x + (wPoint - r.width) / 2, y - r.height - labelOff);
                    }
                }
                if (view = labelViews.get(p, 0)) {
                    r = view.getBBounds();
                    if (inverted) {
                        view.translate(x - r.width - labelOff, y + (wPoint - r.height) / 2);
                    } else {
                        view.translate(x + (wPoint - r.width) / 2, y + hPoint + labelOff);
                    }
                }
            }
        })
    }
}