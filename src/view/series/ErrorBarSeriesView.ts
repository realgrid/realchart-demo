////////////////////////////////////////////////////////////////////////////////
// ErrorBarSeriesView.ts
// 2023. 07. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { GroupElement } from "../../common/impl/GroupElement";
import { LineElement } from "../../common/impl/PathElement";
import { RectElement } from "../../common/impl/RectElement";
import { CategoryAxis } from "../../model/axis/CategoryAxis";
import { ErrorBarSeries, ErrorBarSeriesPoint } from "../../model/series/ErrorBarSeries";
import { PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class BarElement extends GroupElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _back: RectElement;
    private _whiskerUp: LineElement;
    private _whiskerDown: LineElement;
    private _stem: LineElement;

    point: ErrorBarSeriesPoint;

    //-------------------------------------------------------------------------
    // constructors
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc);

        this.add(this._back = new RectElement(doc, 'rct-errorbar-back'));
        this.add(this._stem = new LineElement(doc, 'rct-errorbar-stem'));
        this.add(this._whiskerUp = new LineElement(doc, 'rct-errorbar-whisker dlchart-errorBar-series-whisker-up'));
        this.add(this._whiskerDown = new LineElement(doc, 'rct-errorbar-whisker dlchart-errorBar-series-whisker-down'));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    layout(inverted: boolean): void {
        const w = this.width
        const h = this.height;
        const x = w / 2;

        this._back.setBounds(0, 0, w, h);
        this._stem.setVLine(x, 0, h);
        this._whiskerUp.setHLine(0, 0, w);
        this._whiskerDown.setHLine(h, 0, w);
    }
}

export class ErrorBarSeriesView extends SeriesView<ErrorBarSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars = new ElementPool(this._pointContainer, BarElement);

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-errorbar-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: ErrorBarSeries): void {
        this.$_parepareBars(model._visPoints as ErrorBarSeriesPoint[]);
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
    private $_parepareBars(points: ErrorBarSeriesPoint[]): void {
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
        const labelVis = labels.visible && this._animating();
        const labelOff = labels.offset;
        const labelViews = this._labelContainer;
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const wPad = xAxis instanceof CategoryAxis ? xAxis.categoryPad() * 2 : 0;
        const yLen = inverted ? width : height;
        const xLen = inverted ? height : width;
        const org = inverted ? 0 : height;;
        let labelView: PointLabelView;

        this._labelContainer.setVisible(labelVis);

        this._bars.forEach((bar, i) => {
            const p = bar.point;
            const wUnit = xAxis.getUnitLength(xLen, i) * (1 - wPad);
            const wPoint = series.getPointWidth(wUnit);
            const yVal = yAxis.getPosition(yLen, p.yValue);
            const hPoint = Math.abs(yAxis.getPosition(yLen, p.lowValue) - yVal) * vr;
            let x: number;
            let y: number;

            if (inverted) {
                y = xLen - xAxis.getPosition(xLen, i) - wUnit / 2;
                x = org + yVal * vr;
            } else {
                x = xAxis.getPosition(xLen, i) - wPoint / 2;
                y = org - yVal * vr;
            }

            bar.setBounds(x, y, wPoint, hPoint);
            bar.layout(inverted);

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