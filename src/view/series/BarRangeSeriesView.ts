////////////////////////////////////////////////////////////////////////////////
// BarRangeSeriesView.ts
// 2023. 07. 25. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { DataPoint } from "../../model/DataPoint";
import { CategoryAxis } from "../../model/axis/CategoryAxis";
import { BarRangeSeries, BarRangeSeriesPoint } from "../../model/series/BarRangeSeries";
import { BarElement, PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

export class BarRangeSeriesView extends SeriesView<BarRangeSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars = new ElementPool(this._pointContainer, BarElement);

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-barrange-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: BarRangeSeries): void {
        this.$_parepareBars(model._visPoints);
    }

    protected _renderSeries(width: number, height: number): void {
        this.$_layoutBars(width, height);
    }

    protected _runShowEffect(firstTime: boolean): void {
        firstTime && SeriesAnimation.grow(this);
    }

    protected _doViewRateChanged(rate: number): void {
        this.$_layoutBars(this.width, this.height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareBars(points: DataPoint[]): void {
        this._bars.prepare(points.length, (v, i) => {
            v.point = points[i];
            v.setStyle('fill', points[i].color);
        });
    }

    protected $_layoutBars(width: number, height: number): void {
        const series = this.model;
        const inverted = series.chart.isInverted();
        const vr = this._getViewRate();
        const labels = series.pointLabel;
        const labelVis = labels.visible && !this._animating();
        const labelOff = labels.offset;
        const labelViews = this._labelContainer;
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const wPad = xAxis instanceof CategoryAxis ? xAxis.categoryPadding * 2 : 0;
        const yLen = inverted ? width : height;
        const xLen = inverted ? height : width;
        // const xBase = xAxis instanceof LinearAxis ? xAxis.getPosition(xLen, xAxis.xBase) : 0;
        // const yBase = yAxis.getPosition(yLen, yAxis instanceof LinearAxis ? yAxis.yBase : 0);
        const org = inverted ? 0 : height;;
        let labelView: PointLabelView;

        this._labelContainer.setVisible(labelVis);

        this._bars.forEach((bar, i) => {
            const p = bar.point as BarRangeSeriesPoint;
            const wUnit = xAxis.getUnitLength(xLen, i) * (1 - wPad);
            const wPoint = series.getPointWidth(wUnit);
            const yVal = yAxis.getPosition(yLen, p.yValue);
            const hPoint = Math.abs(yAxis.getPosition(yLen, p.lowValue) - yVal) * vr;
            let x: number;
            let y: number;

            if (inverted) {
                y = xLen - xAxis.getPosition(xLen, i) - wUnit / 2;
                x = org;
            } else {
                x = xAxis.getPosition(xLen, i) - wUnit / 2;
                y = org;
            }

            bar.wPoint = wPoint;
            bar.hPoint = hPoint;

            if (inverted) {
                y += series.getPointPos(wUnit) + wPoint / 2;
                x += yAxis.getPosition(yLen, p.yGroup) * vr - hPoint;
            } else {
                x += series.getPointPos(wUnit) + wPoint / 2;
                y -= yAxis.getPosition(yLen, p.yGroup) * vr - hPoint;
            }

            bar.render(x, y, inverted);

            // labels
            if (labelVis) {
                if (labelView = labelViews.get(p, 0)) {
                    const r = labelView.getBBounds();

                    if (inverted) {
                        labelView.translate(x + hPoint + labelOff, y - r.height / 2);
                    } else {
                        labelView.translate(x - r.width / 2, y - hPoint - r.height - labelOff);
                    }
                }
                if (labelView = labelViews.get(p, 1)) {
                    const r = labelView.getBBounds();

                    if (inverted) {
                        labelView.translate(x - r.width - labelOff, y - r.height / 2);
                    } else {
                        labelView.translate(x - r.width / 2, y + labelOff);
                    }
                }
            }
        })
    }
}