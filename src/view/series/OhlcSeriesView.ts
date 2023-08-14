////////////////////////////////////////////////////////////////////////////////
// OhlcSeriesView.ts
// 2023. 08. 08. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Dom } from "../../common/Dom";
import { ElementPool } from "../../common/ElementPool";
import { RcElement } from "../../common/RcControl";
import { IRect } from "../../common/Rectangle";
import { GroupElement } from "../../common/impl/GroupElement";
import { LineElement } from "../../common/impl/PathElement";
import { RectElement } from "../../common/impl/RectElement";
import { OhlcSeries, OhlcSeriesPoint } from "../../model/series/OhlcSeries";
import { IPointView, PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class StickView extends GroupElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: OhlcSeriesPoint;

    private _back: RectElement;
    private _tickOpen: LineElement;
    private _tickClose: LineElement;
    private _bar: LineElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_STYLE + ' rct-ohlc-point');
    }

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
        this._tickOpen.setHLine(yOpen, 0, x);
        this._tickClose.setHLine(yClose, x, this.width);
        this._bar.setVLine(x, y, y + h);
        //this._bar.setBounds(0, Math.min(yClose, yOpen), w, Math.max(1, Math.abs(yOpen - yClose)));
        this._bar.setStyleName(p.close < p.open ? 'rct-ohlc-point-bar-fall' : 'rct-ohlc-point-bar')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doInitChildren(doc: Document): void {
        this.add(this._tickOpen = new LineElement(doc, 'rct-ohlc-point-tick'));
        this.add(this._tickClose = new LineElement(doc, 'rct-ohlc-point-tick'));
        this.add(this._bar = new LineElement(doc));
        this.add(this._back = new RectElement(doc, 'rct-ohlc-point-back'));

        Dom.setImportantStyle(this._back.dom.style, 'fill', 'transparent'); // for hit testing
    }
}

export class OhlcSeriesView extends SeriesView<OhlcSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _sticks = new ElementPool(this._pointContainer, StickView);

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-ohlc-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._sticks;
    }

    protected _prepareSeries(doc: Document, model: OhlcSeries): void {
        this.$_prepareSticks(model._visPoints as OhlcSeriesPoint[]);
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
    private $_prepareSticks(points: OhlcSeriesPoint[]): void {
        this._sticks.prepare(points.length, (box, i) => {
            box.point = points[i];
        })
    }

    private $_layoutSticks(width: number, height: number): void {
        const series = this.model;
        const inverted = this._inverted;
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
            const x = (p.xPos = xAxis.getPosition(width, p.xValue)) - wPoint / 2;
            const y = p.yPos = yOrg - yAxis.getPosition(height, p.yValue) * vr;
            const w = wPoint;
            const h = Math.abs(yOrg - yAxis.getPosition(height, p.lowValue) - y) * vr;
            let view: PointLabelView;

            box.setBounds(x, y, w, h);
            box.layout();

            if (labelViews && (view = labelViews.get(p, 0))) {
                const r = view.getBBounds();
                view.translate(x + (w - r.width) / 2, y - r.height - labelOff);
            }
        })
    }
}