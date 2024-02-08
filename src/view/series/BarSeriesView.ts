////////////////////////////////////////////////////////////////////////////////
// BarSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { assign, cos, sin } from "../../common/Common";
import { ElementPool } from "../../common/ElementPool";
import { RcElement } from "../../common/RcControl";
import { Align } from "../../common/Types";
import { SectorElement } from "../../common/impl/SectorElement";
import { Axis } from "../../model/Axis";
import { Chart } from "../../model/Chart";
import { DataPoint } from "../../model/DataPoint";
import { PointItemPosition, SeriesGroupLayout } from "../../model/Series";
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
    // IPointView
    //-------------------------------------------------------------------------
    point: DataPoint;
    // saveVal: number;

    savePrevs(): void {
        // TODO: 무엇을 저장해야지?
        // this.wSave = this.wPoint;
        // this.xSave = this.x;
    }
}

export abstract class BarSeriesViewBase<T extends BarSeriesBase> extends BoxedSeriesView<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars: ElementPool<PointElement>;
    private _sectors: ElementPool<BarSectorView>;
    protected override _labelInfo: LabelLayoutInfo = {} as any;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this.chart().isPolar() ? this._sectors : this._bars;
    }

    protected _preparePoints(doc: Document, model: T, points: DataPoint[]): void {
        if (model.chart.isPolar()) {
            this.$_parepareSectors(doc, model, this._visPoints);
        } else {
            this.$_parepareBars(doc, model, this._visPoints);
        }
    }

    protected override _setPointStyle(v: RcElement, model: T, p: DataPoint): void {
        super._setPointStyle(v, model, p);

        if (p.yValue < model.baseValue && model.belowStyle) {
            v.addStyleOrClass(model.belowStyle);
        }
    }

    protected override _layoutPoints(width: number, height: number): void {
        if (this.model.chart.isPolar()) {
            this.$_layoutSectors();
        } else {
            super._layoutPoints(width, height);
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
        const gr = this._getGrowRate();
        const labels = series.pointLabel;
        const labelViews = this._labelViews();
        const body = (series.chart as Chart).body;
        const xAxis = series._xAxisObj as Axis;
        const yAxis = series._yAxisObj;
        const polar = body.getPolar(xAxis);
        const totalAngle = xAxis.getTotalAngle();
        const cx = polar.cx;
        const cy = polar.cy;
        let labelInfo: LabelLayoutInfo;
        let labelPos: PointItemPosition;
        let labelOff: number;

        if (labelViews) {
            labelInfo = this._labelInfo;
            labelPos = series.getLabelPosition(labels.position);
            labelOff = series.getLabelOff(labels.getOffset());
        }

        this._sectors.forEach((view, i) => {
            const p = view.point;
            const yVal = yAxis.getPos(polar.rd, p.yValue) * gr;
            let yGroup = yAxis.getPos(polar.rd, p.yGroup) * gr;
            const wUnit = xAxis.getUnitLen(totalAngle, p.xValue);
            const wPoint = series.getPointWidth(wUnit);
            let a = polar.start + xAxis.getPos(totalAngle, p.xValue);

            a += series.getPointPos(wUnit);
    
            view.setSector({
                cx, 
                cy, 
                rx: yGroup, 
                ry: yGroup,
                innerRadius: (yGroup - yVal) / yGroup,
                start: a - wPoint / 2,
                angle: wPoint,
                clockwise: true
            })

            a = view.start + view.angle / 2;
            p.xPos = cx + view.rx * cos(a);
            p.yPos = cy + view.ry * sin(a);

            // label
            if (labelViews && (labelInfo.labelView = labelViews.get(p, 0))) {
                const r = labelInfo.labelView.getBBox();
                let x: number;
                    
                if (labelPos === PointItemPosition.OUTSIDE) {
                    yGroup = cy + (view.ry + r.height + labelOff) * sin(a);
                    x = cx + (view.rx + r.width + labelOff) * cos(a);
                } else if (labelPos === PointItemPosition.HEAD) {
                    yGroup = cy + (view.ry - r.height / 2 - labelOff) * sin(a) - r.height / 2;
                    x = cx + (view.rx - r.height / 2 - labelOff) * cos(a);
                } else {
                    yGroup = cy + view.ry * 0.7 * sin(a) - r.height / 2;
                    x = cx + view.rx * 0.7 * cos(a);
                }
                labelInfo.labelView.layout(Align.CENTER).trans(x - r.width / 2, yGroup);
            }
        })
    }
}

export class BarSeriesView extends BarSeriesViewBase<BarSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _rdTop: number;
    private _rdBottom: number;

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

    // needFronting(): boolean {
    //     return this.model.group?._stacked || this.model.group?.layout == SeriesGroupLayout.OVERLAP;
    // }

    protected override _prepareSeries(doc: Document, model: BarSeries): void {
        super._prepareSeries(doc, model);

        this._rdTop = +model.topRadius || 0;
        this._rdBottom = +model.bottomRadius || 0;
    }

    protected _layoutPoint(view: BarElement, i: number, x: number, y: number, wPoint: number, hPoint: number): void {
        view.wPoint = wPoint;
        view.hPoint = hPoint;
        view.layout(x, y, this._rdTop, this._rdBottom);
    }
}