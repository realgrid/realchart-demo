////////////////////////////////////////////////////////////////////////////////
// CandlestickSeriesView.ts
// 2023. 07. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { RcElement } from "../../common/RcControl";
import { IRect } from "../../common/Rectangle";
import { GroupElement } from "../../common/impl/GroupElement";
import { LineElement } from "../../common/impl/PathElement";
import { RectElement } from "../../common/impl/RectElement";
import { CandlestickSeries, CandlestickSeriesPoint } from "../../model/series/CandlestickSeries";
import { IPointView, PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class StickView extends GroupElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: CandlestickSeriesPoint;

    private _back: RectElement;
    private _wickUpper: LineElement;
    private _wickLower: LineElement;
    private _body: RectElement;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    layout(): void {
        const p = this.point;
        const w = this.width;
        const h = this.height;
        const len = p.highValue - p.lowValue;
        const x = this.width / 2;
        let y = 0;
        const yOpen = y + h - h * (Math.min(p.openValue, p.closeValue) - p.lowValue) / len;
        const yClose = y + h - h * (Math.max(p.openValue, p.closeValue) - p.lowValue) / len;

        this._back.setBounds(0, 0, w, h);
        this._wickUpper.setVLine(x, y, yClose);
        this._wickLower.setVLine(x, yOpen, h);
        this._body.setBounds(0, Math.min(yClose, yOpen), w, Math.max(1, Math.abs(yOpen - yClose)));
        this._body.setStyleName(p.close < p.open ? 'rct-candlestick-series-body-fall' : 'rct-candlestick-series-body')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doInitChildren(doc: Document): void {
        this.add(this._back = new RectElement(doc, 'rct-candlestick-series-back'));
        this.add(this._wickUpper = new LineElement(doc, 'rct-candlestick-series-wick'));
        this.add(this._wickLower = new LineElement(doc, 'rct-candlestick-series-wick'));
        this.add(this._body = new RectElement(doc));
    }
}

export class CandlestickSeriesView extends SeriesView<CandlestickSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _sticks = new ElementPool(this._pointContainer, StickView);

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-candlestick-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._sticks;
    }

    protected _prepareSeries(doc: Document, model: CandlestickSeries): void {
        this.$_prepareSticks(model._visPoints as CandlestickSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        this.$_layoutSticks(width, height);
    }

    protected _runShowEffect(firstTime: boolean): void {
        firstTime && SeriesAnimation.grow(this);
    }

    protected _doViewRateChanged(rate: number): void {
        this.$_layoutSticks(this.width, this.height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareSticks(points: CandlestickSeriesPoint[]): void {
        this._sticks.prepare(points.length, (box, i) => {
            box.point = points[i];
        })
    }

    private $_layoutSticks(width: number, height: number): void {
        const series = this.model;
        const vr = this._getViewRate();
        const labels = series.pointLabel;
        const labelOff = labels.offset;
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const yOrg = this.height;

        this._sticks.forEach((box, i) => {
            const wUnit = xAxis.getUnitLength(width, i);
            const wPoint = series.getPointWidth(wUnit);
            const p = box.point;
            const x = p.xPos = xAxis.getPosition(this.width, p.xValue) - wPoint / 2;
            const y = p.yPos = yOrg - yAxis.getPosition(this.height, p.yValue) * vr;
            const w = wPoint;
            const h = Math.abs(yOrg - yAxis.getPosition(height, p.lowValue) - y) * vr;

            box.setBounds(x, y, w, h);
            box.layout();

            if (labelViews) {
                let view: PointLabelView;
                let r: IRect;

                if (view = labelViews.get(p, 0)) {
                    r = view.getBBounds();
                    view.translate(x + (w - r.width) / 2, y - r.height - labelOff);
                }
                if (view = labelViews.get(p, 1)) {
                    r = view.getBBounds();
                    view.translate(x + (w - r.width) / 2, y + h + labelOff);
                }
            }
        })
    }
}