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
import { PointItemPosition } from "../../model/Series";
import { CategoryAxis } from "../../model/axis/CategoryAxis";
import { LinearAxis } from "../../model/axis/LinearAxis";
import { BarSeries } from "../../model/series/BarSeries";
import { BarElement, PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class BarSectorView extends SectorElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: DataPoint;
}

type LabelInfo = {
    inverted: boolean,
    labelPos: PointItemPosition,
    labelOff: number,
    width: number,
    height: number,
    labelView: PointLabelView,
    bar: BarElement,
    x: number,
    y: number
};

export class BarSeriesView extends SeriesView<BarSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars: ElementPool<BarElement>;
    private _sectors: ElementPool<BarSectorView>;
    private _labelInfo: LabelInfo = {} as any;

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
            this.$_parepareSectors(doc, model, model._visPoints);
        } else {
            this.$_parepareBars(doc, model, model._visPoints);
        }
    }

    protected _renderSeries(width: number, height: number): void {
        if (this.model.chart._polar) {
            this.$_layoutSectors();
        } else {
            this.$_layoutBars(width, height);
        }
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
    private $_parepareBars(doc: Document, model: BarSeries, points: DataPoint[]): void {
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

    private $_parepareSectors(doc: Document, model: BarSeries, points: DataPoint[]): void {
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

    protected $_layoutBars(width: number, height: number): void {
        const series = this.model;
        const inverted = this._inverted;
        const vr = this._getViewRate();
        const labels = series.pointLabel;
        const labelVis = labels.visible && !this._animating();
        const labelViews = this._labelContainer;
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const wPad = xAxis instanceof CategoryAxis ? xAxis.categoryPadding * 2 : 0;
        const yLen = (inverted ? width : height) * vr;
        const xLen = inverted ? height : width;
        const yBase = yAxis.getPosition(yLen, yAxis instanceof LinearAxis ? yAxis.baseValue : 0);
        const org = inverted ? 0 : height;;
        const labelInfo: LabelInfo = labelVis && Object.assign(this._labelInfo, {
            inverted,
            labelPos: series.getLabelPosition(),
            labelOff: labels.offset,
            width, height
        });

        this._labelContainer.visible = labelVis;

        this._bars.forEach((bar, i) => {
            const p = bar.point;
            const wUnit = xAxis.getUnitLength(xLen, i) * (1 - wPad);
            const wPoint = series.getPointWidth(wUnit);
            const yVal = yAxis.getPosition(yLen, p.yValue);
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
            bar.hPoint = yVal - yBase;

            if (inverted) {
                y += series.getPointPos(wUnit) + wPoint / 2;
                x += yAxis.getPosition(yLen, p.yGroup) - bar.hPoint;
            } else {
                x += series.getPointPos(wUnit) + wPoint / 2;
                y -= yAxis.getPosition(yLen, p.yGroup) - bar.hPoint;
            }

            bar.render(x, y, inverted);

            // label
            if (labelInfo && (labelInfo.labelView = labelViews.get(p, 0))) {
                labelInfo.bar = bar;
                labelInfo.x = x;
                labelInfo.y = y;
                this.$_layoutLabel(labelInfo);
            }
        })
    }

    private $_layoutLabel(info: LabelInfo): void {
        const r = info.labelView.getBBounds();
        let inner = true;
        let {inverted, x, y, bar, labelOff} = info;

        if (inverted) {
            y -= r.height / 2;
        } else {
            x -= r.width / 2;
        }

        switch (info.labelPos) {
            case PointItemPosition.INSIDE:
                if (info.inverted) {
                    x += bar.hPoint / 2 + labelOff;
                } else {
                    y -= (bar.hPoint + r.height) / 2 + labelOff;
                }
                break;

            case PointItemPosition.HEAD:
                if (info.inverted) {
                    x += bar.hPoint - r.width - labelOff;
                } else {
                    y -= bar.hPoint - labelOff;
                }
                break;

            case PointItemPosition.FOOT:
                break;

            case PointItemPosition.OUTSIDE:
            default:
                if (info.inverted) {
                    x += bar.hPoint + labelOff;
                } else {
                    y -= bar.hPoint + r.height + labelOff;
                }
                inner = false;
                break;
        }

        info.labelView.setContrast(inner && info.bar.dom);
        info.labelView.layout().translate(x, y);
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

    private $_layoutSectorLabel(info: LabelInfo): void {
    }
}