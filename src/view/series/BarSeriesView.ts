////////////////////////////////////////////////////////////////////////////////
// BarSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { RcElement } from "../../common/RcControl";
import { Align, PI_2 } from "../../common/Types";
import { SectorElement } from "../../common/impl/SectorElement";
import { Axis } from "../../model/Axis";
import { Chart } from "../../model/Chart";
import { DataPoint } from "../../model/DataPoint";
import { BarSeries, BarSeriesBase } from "../../model/series/BarSeries";
import { BarElement, BoxedSeriesView, IPointView, LabelLayoutInfo, PointElement, SeriesView } from "../SeriesView";

class BarSectorView extends SectorElement implements IPointView {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS);
    }

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: DataPoint;
}

export abstract class BarSeriesViewBase<T extends BarSeriesBase> extends BoxedSeriesView<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars: ElementPool<PointElement>;
    private _sectors: ElementPool<BarSectorView>;
    protected _labelInfo: LabelLayoutInfo = {} as any;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this.chart().isPolar() ? this._sectors : this._bars;
    }

    protected _preparePointViews(doc: Document, model: T, points: DataPoint[]): void {
        if (model.chart.isPolar()) {
            this.$_parepareSectors(doc, model, this._visPoints);
        } else {
            this.$_parepareBars(doc, model, this._visPoints);
        }
    }

    protected _setPointStyle(v: RcElement, model: T, p: DataPoint): void {
        super._setPointStyle(v, model, p);

        if (p.yValue < model.baseValue && model.belowStyle) {
            v.addStyleOrClass(model.belowStyle);
        }
    }

    protected _layoutPointViews(width: number, height: number): void {
        if (this.model.chart.isPolar()) {
            this.$_layoutSectors();
        } else {
            super._layoutPointViews(width, height);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _createBarPool(container: RcElement): ElementPool<PointElement>;

    private $_parepareBars(doc: Document, model: T, points: DataPoint[]): void {
        if (!this._bars) {
            this._bars = this._createBarPool(this._pointContainer);
        }
        this._bars.prepare(points.length, (v, i) => {
            const p = v.point = points[i];
            
            this._setPointStyle(v, model, p);
        });
    }

    private $_parepareSectors(doc: Document, model: T, points: DataPoint[]): void {
        if (!this._sectors) {
            this._sectors = new ElementPool(this._pointContainer, BarSectorView);
        }
        this._sectors.prepare(points.length, (v, i) => {
            const p = v.point = points[i];

            this._setPointStyle(v, model, p);
        });
    }

    private $_layoutSectors(): void {
        const series = this.model;
        const vr = this._getViewRate();
        const labels = series.pointLabel;
        const labelViews = this._labelViews();
        const body = (series.chart as Chart).body;
        const xAxis = series._xAxisObj as Axis;
        const yAxis = series._yAxisObj;
        const polar = body.getPolar(xAxis);
        const labelInfo: LabelLayoutInfo = labelViews && Object.assign(this._labelInfo, {
            labelPos: series.getLabelPosition(labels.position),
            labelOff: series.getLabelOff(labels.getOffset())
        });

        this._sectors.forEach((view, i) => {
            const p = view.point;
            let y = yAxis.getPosition(polar.rd, p.yGroup) * vr;
            const wUnit = xAxis.getUnitLength(PI_2, p.xValue);
            const wPoint = series.getPointWidth(wUnit);
            let a = polar.start + xAxis.getPosition(PI_2, p.xValue);
    
            view.setSector({
                cx: polar.cx, 
                cy: polar.cy, 
                rx: y, 
                ry: y,
                start: a - wPoint / 2,
                angle: wPoint,
                clockwise: true
            })

            const x = p.xPos = view.cx + view.rx * 0.7 * Math.cos(a);
            a = view.start + view.angle / 2;
            y = p.yPos = view.cy + view.ry * 0.7 * Math.sin(a);

            // label
            if (labelViews && (labelInfo.labelView = labelViews.get(p, 0))) {
                const r = labelInfo.labelView.getBBounds();

                labelInfo.labelView.layout(Align.CENTER).translate(x - r.width / 2, y - r.height / 2);
            }
        })
    }
}

export class BarSeriesView extends BarSeriesViewBase<BarSeries> {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-bar-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createBarPool(container: RcElement): ElementPool<PointElement> {
        return new ElementPool(container, BarElement);
    }

    protected _layoutPointView(view: BarElement, i: number, x: number, y: number, wPoint: number, hPoint: number): void {
        view.wPoint = wPoint;
        view.hPoint = hPoint;
        view.layout(x, y);
    }
}