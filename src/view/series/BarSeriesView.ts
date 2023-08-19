////////////////////////////////////////////////////////////////////////////////
// BarSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { RcElement } from "../../common/RcControl";
import { SectorElement } from "../../common/impl/SectorElement";
import { TextAnchor } from "../../common/impl/TextElement";
import { Chart } from "../../main";
import { DataPoint } from "../../model/DataPoint";
import { BarSeries, ColumnSeries } from "../../model/series/BarSeries";
import { BarElement, BoxedSeriesView, IPointView, LabelLayoutInfo } from "../SeriesView";

class BarSectorView extends SectorElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: DataPoint;
}

export class BarSeriesView extends BoxedSeriesView<BarSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars: ElementPool<BarElement>;
    private _sectors: ElementPool<BarSectorView>;
    protected _labelInfo: LabelLayoutInfo = {} as any;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-bar-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this.chart()._polar ? this._sectors : this._bars;
    }

    protected _preparePointViews(doc: Document, model: BarSeries, points: DataPoint[]): void {
        if (model.chart._polar) {
            this.$_parepareSectors(doc, model, model._visPoints);
        } else {
            this.$_parepareBars(doc, model, model._visPoints);
        }
    }

    protected _layoutPointViews(width: number, height: number): void {
        if (this.model.chart._polar) {
            this.$_layoutSectors();
        } else {
            super._layoutPointViews(width, height);
        }
    }

    protected _layoutPointView(view: BarElement, i: number, x: number, y: number, wPoint: number, hPoint: number): void {
        view.wPoint = wPoint;
        view.hPoint = hPoint;
        view.layout(x, y);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareBars(doc: Document, model: ColumnSeries, points: DataPoint[]): void {
        const style = model.style;

        if (!this._bars) {
            this._bars = new ElementPool(this._pointContainer, BarElement);
        }
        this._bars.prepare(points.length, (v, i) => {
            const p = v.point = points[i];
            v.setStyleOrClass(style);
            p.color && v.setStyle('fill', p.color);
        });
    }

    private $_parepareSectors(doc: Document, model: ColumnSeries, points: DataPoint[]): void {
        const style = model.style;

        if (!this._sectors) {
            this._sectors = new ElementPool(this._pointContainer, BarSectorView);
        }
        this._sectors.prepare(points.length, (v, i) => {
            const p = v.point = points[i];
            v.setStyleOrClass(style);
            p.color && v.setStyle('fill', p.color);
        });
    }

    private $_layoutSectors(): void {
        const series = this.model;
        const vr = this._getViewRate();
        const labels = series.pointLabel;
        const labelViews = this._labelViews();
        const body = (series.chart as Chart).body;
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const polar = body.getPolar(series);
        const labelInfo: LabelLayoutInfo = labelViews && Object.assign(this._labelInfo, {
            labelPos: series.getLabelPosition(labels.position),
            labelOff: series.getLabelOff(labels.offset)
        });

        this._sectors.forEach((view, i) => {
            const p = view.point;
            const y = yAxis.getPosition(polar.rd, p.yGroup) * vr;
            const wUnit = xAxis.getUnitLength(Math.PI * 2, i);
            const wPoint = series.getPointWidth(wUnit);
    
            view.setSector({
                cx: polar.cx, 
                cy: polar.cy, 
                rx: y, 
                ry: y,
                start: polar.start + i * polar.deg,
                angle: wPoint,
                clockwise: true
            })

            // label
            if (labelViews && (labelInfo.labelView = labelViews.get(p, 0))) {
                const a = view.start + view.angle
                const x = view.cx + view.rx / 2 * Math.cos(a);
                const y = view.cy + view.ry / 2 * Math.sin(a);
                const r = labelInfo.labelView.getBBounds();

                labelInfo.labelView._text.anchor = TextAnchor.MIDDLE;
                labelInfo.labelView.translate(x - r.width / 2, y - r.height / 2);
            }
        })
    }
}