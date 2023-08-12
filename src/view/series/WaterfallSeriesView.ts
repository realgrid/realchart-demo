////////////////////////////////////////////////////////////////////////////////
// WaterfallSeriesView.ts
// 2023. 07. 29. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { LayerElement } from "../../common/RcControl";
import { LineElement } from "../../common/impl/PathElement";
import { SvgShapes } from "../../common/impl/SvgShape";
import { PointItemPosition } from "../../model/Series";
import { CategoryAxis } from "../../model/axis/CategoryAxis";
import { WaterfallSeries, WaterfallSeriesPoint } from "../../model/series/WaterfallSeries";
import { BoxPointElement, PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class BarElement extends BoxPointElement {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    render(x: number, y: number, inverted: boolean): void {
        this.setPath(SvgShapes.rect({
            x: x - this.wPoint / 2,
            y,
            width: this.wPoint,
            height: -this.hPoint
        }));
    }
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

export class WaterfallSeriesView extends SeriesView<WaterfallSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lineContainer: LayerElement;
    private _bars: ElementPool<BarElement> = new ElementPool(this._pointContainer, BarElement);
    private _lines: ElementPool<LineElement>;
    private _labelInfo: LabelInfo = {} as any;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-Waterfall-series')

        this.add(this._lineContainer = new LayerElement(doc, 'rct-waterfall-series-lines'));
        this._lines = new ElementPool(this._lineContainer, LineElement);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: WaterfallSeries): void {
        this.$_parepareBars(doc, model._visPoints as WaterfallSeriesPoint[]);
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
    private $_parepareBars(doc: Document, points: WaterfallSeriesPoint[]): void {
        this._bars.prepare(points.length, (v, i) => {
            const p = points[i];

            v.point = p;
            v.setStyleOrClass(p._isSum ? 'rct-waterfall-series-sum' : p.y < 0 ? 'rct-waterfall-series-negative' : '');
        });

        this._lines.prepare(points.length - 1);
    }

    private $_layoutBars(width: number, height: number): void {
        const series = this.model;
        const inverted = series.chart.isInverted();
        const vr = this._getViewRate();
        const labels = series.pointLabel;
        const labelVis = labels.visible && !this._animating();
        const labelOff = labels.offset;
        const labelViews = this._labelContainer;
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const wPad = xAxis instanceof CategoryAxis ? xAxis.categoryPad() * 2 : 0;
        const yLen = inverted ? width : height;
        const xLen = inverted ? height : width;
        // const xBase = xAxis instanceof LinearAxis ? xAxis.getPosition(xLen, xAxis.xBase) : 0;
        // const yBase = yAxis.getPosition(yLen, yAxis instanceof LinearAxis ? yAxis.yBase : 0);
        const org = inverted ? 0 : height;;
        const labelInfo: LabelInfo = labelVis && Object.assign(this._labelInfo, {
            inverted,
            labelPos: series.getLabelPosition(),
            labelOff: labels.offset,
            width, height
        });
        let xPrev: number;
        let yPrev: number;
        let wPrev: number;
        let hPrev: number;
        let labelView: PointLabelView;

        this._labelContainer.setVisible(labelVis);

        this._bars.forEach((bar, i) => {
            const p = bar.point as WaterfallSeriesPoint;
            const wUnit = xAxis.getUnitLength(xLen, i) * (1 - wPad);
            const wPoint = series.getPointWidth(wUnit);
            const yVal = yAxis.getPosition(yLen, p.yValue);
            const hPoint = Math.abs(yAxis.getPosition(yLen, p.low) - yVal) * vr;
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
                x += yAxis.getPosition(yLen, p.yValue) * vr - hPoint;
            } else {
                x += series.getPointPos(wUnit) + wPoint / 2;
                y -= yAxis.getPosition(yLen, p.yValue * vr) - hPoint;
            }

            bar.render(x, y, inverted);

            if (i > 0) {
                const line = this._lines.get(i - 1);

                if (inverted) {

                } else {
                    const y2 = p._isSum ? y - hPoint : p.y >= 0 ? y : y - hPoint;
                    line.setHLine(y2, xPrev + wPrev / 2, x - wPoint / 2);
                }
            }

            xPrev = x;
            yPrev = y;
            wPrev = wPoint;
            hPrev = hPoint;

            // TODO: BarSeries와 합칠 것!
            // label
            if (labelInfo && (labelView = labelViews.get(p, 0))) {
                labelInfo.labelView = labelView;
                labelInfo.bar = bar;
                labelInfo.x = x;
                labelInfo.y = y;
                this.$_layoutLabel(labelInfo);
            }
         })
    }

    // TODO: BarSeries와 합칠 것!
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
}