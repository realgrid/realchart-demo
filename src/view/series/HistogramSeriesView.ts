////////////////////////////////////////////////////////////////////////////////
// HistogramSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { RcElement } from "../../common/RcControl";
import { SvgShapes } from "../../common/impl/SvgShape";
import { HistogramSeries, HistogramSeriesPoint } from "../../model/series/HistogramSeries";
import { BoxPointElement, ClusterableSeriesView, LabelLayoutInfo, SeriesView } from "../SeriesView";

class BarElement extends BoxPointElement {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    layout(x: number, y: number): void {
        this.setPath(SvgShapes.rect({
            x: x - this.wPoint / 2,
            y,
            width: this.wPoint,
            height: -this.hPoint
        }));
    }
}

export class HistogramSeriesView extends ClusterableSeriesView<HistogramSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars: ElementPool<BarElement> = new ElementPool(this._pointContainer, BarElement);

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-histogram-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._bars;
    }

    protected _preparePointViews(doc: Document, model: HistogramSeries, points: HistogramSeriesPoint[]): void {
        this.$_parepareBars(doc, points);
    }

    protected _layoutPointView(bar: BarElement, i: number, x: number, y: number, wPoint: number, hPoint: number): void {
        bar.wPoint = wPoint;
        bar.hPoint = hPoint;
        bar.layout(x, y);
    }

    protected _layoutPointViews(width: number, height: number): void {
        const series = this.model;
        const inverted = this._inverted;
        const vr = this._getViewRate();
        const labels = series.pointLabel;
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const yLen = inverted ? width : height;
        const xLen = inverted ? height : width;
        const yBase = yAxis.getPosition(yLen, series.getBaseValue(yAxis));
        const org = inverted ? 0 : height;;
        const info: LabelLayoutInfo = labelViews && Object.assign(this._labelInfo, {
            inverted,
            labelPos: series.getLabelPosition(labels.position),
            labelOff: series.getLabelOff(labels.offset)
        });

        this._getPointPool().forEach((pointView: BarElement, i) => {
            const p = pointView.point as HistogramSeriesPoint;
            const x1 = xAxis.getPosition(xLen, p.min);
            const x2 = xAxis.getPosition(xLen, p.max);
            const yVal = yAxis.getPosition(yLen, p.yValue);
            const w = (x2 - x1) + (x2 > x1 ? -1 : 1);
            const h = yVal - yBase;
            let x = x1 + (x2 - x1) / 2;
            let y = org;

            p.xPos = x;
            p.yPos = y -= yVal;

            // 아래에서 위로 올라가는 animation을 위해 바닥 지점을 전달한다.
            this._layoutPointView(pointView, i, x, y + h, w, h * vr);

            if (info && (info.labelView = labelViews.get(p, 0))) {
                if (inverted) {
                    y = xLen - x;
                    x = org;
                    p.yPos = y;
                    p.xPos = x += yAxis.getPosition(yLen, p.yGroup); // stack/fill일 때 org와 다르다.
                }

                info.pointView = pointView;
                info.x = x;
                info.y = y;
                info.wPoint = w;
                info.hPoint = h;
                this._layoutLabel(info);
            }
        })
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareBars(doc: Document, points: HistogramSeriesPoint[]): void {
        this._bars.prepare(points.length, (v, i) => {
            const p = v.point = points[i];

            this._setPointStyle(v, p);
        });
    }

    private $_layoutBars(width: number, height: number): void {
        const xAxis = this.model._xAxisObj;
        const yAxis = this.model._yAxisObj;
        const y = this.height;
        const vr = this._getViewRate();

        this._bars.forEach((bar, i) => {
            const p = bar.point as HistogramSeriesPoint;
            const x1 = xAxis.getPosition(width, p.min);
            const x2 = xAxis.getPosition(width, p.max);
            const x = x1 + (x2 - x1) / 2;
            const h = yAxis.getPosition(height, bar.point.yValue) * vr;
            const w = Math.max(1, x2 - x1 - 1);

            p.xPos = x;
            p.yPos = y - h;

            bar.wPoint = w;
            bar.hPoint = h;
            bar.layout(x, y);
        })
    }
}