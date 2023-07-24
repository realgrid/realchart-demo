////////////////////////////////////////////////////////////////////////////////
// BarSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { SectorElement } from "../../common/impl/SectorElement";
import { Chart } from "../../main";
import { DataPoint } from "../../model/DataPoint";
import { BarSeries } from "../../model/series/BarSeries";
import { BarElement, PointLabelView, SeriesView } from "../SeriesView";

class BarSectorView extends SectorElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: DataPoint;
}

export class BarSeriesView extends SeriesView<BarSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars: ElementPool<BarElement>;
    private _sectors: ElementPool<BarSectorView>;

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
        if (model.chart._polar) {
            this.$_parepareSectors(doc, model._visPoints);
        } else {
            this.$_parepareBars(doc, model._visPoints);
        }
    }

    protected _renderSeries(width: number, height: number): void {
        if (this.model.chart._polar) {
            this.$_layoutSectors();
        } else {
            this.$_layoutBars(width, height);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareBars(doc: Document, points: DataPoint[]): void {
        if (!this._bars) {
            this._bars = new ElementPool(this._pointContainer, BarElement);
        }
        this._bars.prepare(points.length, (v, i) => {
            v.point = points[i];
            v.setStyle('fill', points[i].color);
        });
    }

    private $_parepareSectors(doc: Document, points: DataPoint[]): void {
        if (!this._sectors) {
            this._sectors = new ElementPool(this._pointContainer, BarSectorView);
        }
        this._sectors.prepare(points.length, (v, i) => {
            v.point = points[i];
            v.setStyle('fill', points[i].color);
        });
    }

    protected $_layoutBars(width: number, height: number): void {
        const series = this.model;
        const inverted = series.chart.isInverted();
        const labels = series.pointLabel;
        const labelVis = labels.visible;
        const labelOff = labels.offset;
        const labelViews = this._labelContainer;
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const yBase = yAxis.getPosition(width, yAxis.baseValue);
        const len = inverted ? width : height;
        const wLen = inverted ? height : width;
        const org = inverted ? 0 : height;
        let labelView: PointLabelView;

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
            if (labelVis && (labelView = labelViews.get(p, 0))) {
                const r = labelView.getBBounds();

                if (inverted) {
                    labelView.translate(x + bar.hPoint + labelOff, y - r.height / 2);
                } else {
                    labelView.translate(x - r.width / 2, y - bar.hPoint - r.height - labelOff);
                }
            }
        })
    }

    private $_layoutSectors(): void {
        const m = this.model;
        const body = (m.chart as Chart).body;
        const xAxis = m._xAxisObj;
        const yAxis = m._yAxisObj;
        const polar = body.getPolar(m);

        this._sectors.forEach((view, i) => {
            const p = view.point;
            const y = yAxis.getPosition(polar.rd, p.yGroup);
            const wUnit = xAxis.getUnitLength(Math.PI * 2, i);
            const wPoint = m.getPointWidth(wUnit);
    
            view.setSector({
                cx: polar.cx, 
                cy: polar.cy, 
                rx: y, 
                ry: y,
                start: polar.start + i * polar.deg,
                angle: wPoint,
                clockwise: true
            })
        })
    }
}