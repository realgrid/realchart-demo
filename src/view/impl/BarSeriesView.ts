////////////////////////////////////////////////////////////////////////////////
// BarSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { DataPoint } from "../../model/DataPoint";
import { BarSeries, ColumnSeries } from "../../model/series/BarSeries";
import { BarElement, SeriesView } from "../SeriesView";

export class BarSeriesView extends SeriesView<ColumnSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars = new ElementPool(this._pointContainer, BarElement);

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-bar-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: BarSeries): void {
        this.$_parepareBars(doc, model._visPoints);
    }

    protected _renderSeries(width: number, height: number): void {
        this.$_layoutBars(width, height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareBars(doc: Document, points: DataPoint[]): void {
        this._bars.prepare(points.length, (v, i) => {
            v.point = points[i];
            v.setStyle('fill', points[i].color);
        });
    }

    protected $_layoutBars(width: number, height: number): void {
        const series = this.model;
        const inverted = series.isInverted();
        const labels = series.pointLabel;
        const labelVis = labels.visible;
        const labelOff = labels.offset;
        const labelViews = this._labelContainer;
        const xAxis = this.model._xAxisObj;
        const yAxis = this.model._yAxisObj;
        const yBase = yAxis.getPosition(width, yAxis.baseValue);
        const len = inverted ? width : height;
        const wLen = inverted ? height : width;
        const org = inverted ? 0 : height;

        this._bars.forEach((bar, i) => {
            const p = bar.point;
            const wUnit = xAxis.getUnitLength(wLen, i);
            const wPoint = series.getPointWidth(wUnit);
            const yVal = yAxis.getPosition(len, p.yValue);
            let x: number;
            let y: number;

            if (inverted) {
                y = wLen - xAxis.getPosition(wLen, i) - wUnit / 2;
                x = org;
            } else {
                x = xAxis.getPosition(wLen, i) - wUnit / 2;
                y = org;
            }

            bar.wPoint = wPoint;
            bar.hPoint = yVal - yBase;

            if (inverted) {
                y += series.getPointPos(wUnit) + wPoint / 2;
                x += yAxis.getPosition(len, p.yGroup) - bar.hPoint;
            } else {
                x += series.getPointPos(wUnit) + wPoint / 2;
                y -= yAxis.getPosition(len, p.yGroup) - bar.hPoint;
            }

            bar.render(x, y, inverted);

            // label
            if (labelVis) {
                const view = labelViews.get(p, 0);

                if (view) {
                    const r = view.getBBounds();
    
                    if (inverted) {
                        view.translate(x + bar.hPoint + labelOff, y - r.height / 2);
                    } else {
                        view.translate(x - r.width / 2, y - bar.hPoint - r.height - labelOff);
                    }
                }
            }
        })
    }
}