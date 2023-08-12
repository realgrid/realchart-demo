////////////////////////////////////////////////////////////////////////////////
// LollipopSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathElement, RcElement } from "../../common/RcControl";
import { GroupElement } from "../../common/impl/GroupElement";
import { LineElement } from "../../common/impl/PathElement";
import { PointItemPosition } from "../../model/Series";
import { CategoryAxis } from "../../model/axis/CategoryAxis";
import { LinearAxis } from "../../model/axis/LinearAxis";
import { LollipopSeries, LollipopSeriesPoint } from "../../model/series/LollipopSeries";
import { IPointView, PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class BarElement extends GroupElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: LollipopSeriesPoint;

    private _line: LineElement;
    private _marker: PathElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc);

        this.add(this._line = new LineElement(doc));
        this.add(this._marker = new PathElement(doc, 'rct-lollipop-series-marker'));
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    layout(inverted: boolean): void {
        this._line.setVLineC(this.width / 2, 0, this.height);
        this._marker.renderShape(this.point.shape, this.width / 2, 0, this.point.radius);
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

export class LollipopSeriesView extends SeriesView<LollipopSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars: ElementPool<BarElement>;
    private _labelInfo: LabelInfo = {} as any;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-lollipop-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._bars;
    }

    protected _prepareSeries(doc: Document, model: LollipopSeries): void {
        this.$_parepareBars(doc, model, model._visPoints as LollipopSeriesPoint[]);
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
    private $_parepareBars(doc: Document, model: LollipopSeries, points: LollipopSeriesPoint[]): void {
        const style = model.style;

        if (!this._bars) {
            this._bars = new ElementPool(this._pointContainer, BarElement);
        }
        this._bars.prepare(points.length, (v, i) => {
            v.point = points[i];
            v.setStyle('fill', points[i].color);
            v.setStyleOrClass(style);
        });
    }

    protected $_layoutBars(width: number, height: number): void {
        const series = this.model;
        const inverted = series.chart.isInverted();
        const vr = this._getViewRate();
        const labels = series.pointLabel;
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const wPad = xAxis instanceof CategoryAxis ? xAxis.categoryPad() * 2 : 0;
        const yLen = (inverted ? width : height) * vr;
        const xLen = inverted ? height : width;
        //const xBase = xAxis instanceof LinearAxis ? xAxis.getPosition(xLen, xAxis.xBase) : 0;
        const yBase = yAxis.getPosition(yLen, yAxis instanceof LinearAxis ? yAxis.baseValue : 0);
        const org = inverted ? 0 : height;;
        const labelInfo: LabelInfo = labelViews && Object.assign(this._labelInfo, {
            inverted,
            labelPos: series.getLabelPosition(),
            labelOff: labels.offset,
            width, height
        });

        this._bars.forEach((bar, i) => {
            const p = bar.point;
            const wUnit = xAxis.getUnitLength(xLen, i) * (1 - wPad);
            const wPoint = series.getPointWidth(wUnit);
            const yVal = yAxis.getPosition(yLen, p.yValue);
            const hPoint = yVal - yBase;
            let labelView: PointLabelView;
            let x: number;
            let y: number;

            if (inverted) {
                y = xLen - xAxis.getPosition(xLen, i) - wUnit / 2;
                x = org;
            } else {
                x = xAxis.getPosition(xLen, i) - wUnit / 2;
                y = org;
            }

            if (inverted) {
                y += series.getPointPos(wUnit);
                x += yAxis.getPosition(yLen, p.yGroup);
            } else {
                x += series.getPointPos(wUnit);;
                y -= yAxis.getPosition(yLen, p.yGroup);
            }

            bar.setBounds(x, y, wPoint, hPoint);
            bar.layout(inverted);

            // label
            if (labelInfo && (labelView = labelViews.get(p, 0))) {
                labelInfo.labelView = labelView;
                labelInfo.bar = bar;
                labelInfo.x = x + wPoint / 2;
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
            y -= r.height;
        } else {
            x -= r.width / 2;
            y -= r.height + labelOff;
        }

        info.labelView.setContrast(inner && info.bar.dom);
        info.labelView.layout().translate(x, y);
    }
}