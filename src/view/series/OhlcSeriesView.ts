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
import { GroupElement } from "../../common/impl/GroupElement";
import { LineElement } from "../../common/impl/PathElement";
import { RectElement } from "../../common/impl/RectElement";
import { OhlcSeries, OhlcSeriesPoint } from "../../model/series/OhlcSeries";
import { IPointView, PointLabelView, RangedSeriesView, SeriesView } from "../SeriesView";

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
        super(doc, SeriesView.POINT_CLASS);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    layout(): void {
        const p = this.point;
        const w = this.width;
        const h = this.height;
        const len = p.highValue - p.lowValue;
        const x = 0;//this.width / 2;
        const x1 = -w / 2;
        let y = 0;
        const yOpen = y + h - h * (Math.min(p.openValue, p.closeValue) - p.lowValue) / len;
        const yClose = y + h - h * (Math.max(p.openValue, p.closeValue) - p.lowValue) / len;

        this._back.setBox(x1, 0, w, h);
        this._tickOpen.setHLine(yOpen, x1, x);
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

export class OhlcSeriesView extends RangedSeriesView<OhlcSeries> {

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

    protected _getLowValue(p: OhlcSeriesPoint): number {
        return p.lowValue;
    }

    protected _preparePointViews(doc: Document, model: OhlcSeries, points: OhlcSeriesPoint[]): void {
        this.$_prepareSticks(points);
    }

    protected _layoutPointView(view: StickView, index: number, x: number, y: number, wPoint: number, hPoint: number): void {
        view.setBounds(x, y, wPoint, hPoint);
        view.layout();
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareSticks(points: OhlcSeriesPoint[]): void {
        this._sticks.prepare(points.length, (box, i) => {
            const p = box.point = points[i];

            this._setPointStyle(box, p);
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
            const p = box.point;

            if (box.setVisible(!p.isNull)) {
                const wUnit = xAxis.getUnitLength(width, p.xValue);
                const wPoint = series.getPointWidth(wUnit);
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
            }
        })
    }
}