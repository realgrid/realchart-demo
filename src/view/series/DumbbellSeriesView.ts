////////////////////////////////////////////////////////////////////////////////
// DumbbellSeriesView.ts
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
import { DumbbellSeries, DumbbellSeriesPoint } from "../../model/series/DumbbellSeries";
import { IPointView, PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class BarElement extends GroupElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: DumbbellSeriesPoint;

    private _line: LineElement;
    private _hmarker: PathElement;
    private _lmarker: PathElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS + ' rct-dumbbell-point');

        this.add(this._line = new LineElement(doc));
        this.add(this._hmarker = new PathElement(doc, 'rct-dumbbell-point-marker'));
        this.add(this._lmarker = new PathElement(doc, 'rct-dumbbell-point-marker'));
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    layout(inverted: boolean): BarElement {
        const h = this.point.hPoint;

        if (inverted) {
            this._line.setHLineC(0, 0, h);
            this._hmarker.renderShape(this.point.shape, 0, 0, this.point.radius);
            this._lmarker.renderShape(this.point.shape, h, 0, this.point.radius);
        } else {
            this._line.setVLineC(0, 0, h);
            this._hmarker.renderShape(this.point.shape, 0, 0, this.point.radius);
            this._lmarker.renderShape(this.point.shape, 0, h, this.point.radius);
        }
        return this;
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

export class DumbbellSeriesView extends SeriesView<DumbbellSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _bars: ElementPool<BarElement>;
    private _labelInfo: LabelInfo = {} as any;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-dumbbell-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._bars;
    }

    protected _prepareSeries(doc: Document, model: DumbbellSeries): void {
        this.$_parepareBars(doc, model, model._visPoints as DumbbellSeriesPoint[]);
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
    private $_parepareBars(doc: Document, model: DumbbellSeries, points: DumbbellSeriesPoint[]): void {
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
        const labelOff = labels.offset;
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const wPad = xAxis instanceof CategoryAxis ? xAxis.categoryPad() * 2 : 0;
        const yLen = inverted ? width : height;
        const xLen = inverted ? height : width;
        //const xBase = xAxis instanceof LinearAxis ? xAxis.getPosition(xLen, xAxis.xBase) : 0;
        const yBase = yAxis.getPosition(yLen, yAxis instanceof LinearAxis ? yAxis.baseValue : 0);
        const org = inverted ? 0 : height;;
        const labelInfo: LabelInfo = labelViews && Object.assign(this._labelInfo, {
            inverted,
            labelPos: series.getLabelPosition(labels.position),
            labelOff: labels.offset,
            width, height
        });

        this._bars.forEach((bar, i) => {
            const p = bar.point;
            const wUnit = xAxis.getUnitLength(xLen, p.xValue) * (1 - wPad);
            const wPoint = series.getPointWidth(wUnit);
            const yVal = yAxis.getPosition(yLen, p.yValue);
            const hPoint = Math.abs(yAxis.getPosition(yLen, p.lowValue) - yVal) * vr;
            let labelView: PointLabelView;
            let x: number;
            let y: number;

            if (inverted) {
                y = xLen - xAxis.getPosition(xLen, p.xValue);
                x = org;
            } else {
                x = xAxis.getPosition(xLen, p.xValue);
                y = org;
            }

            if (inverted) {
                p.yPos = y += series.getPointPos(wUnit) - wPoint / 2;
                p.xPos = x += yAxis.getPosition(yLen, p.yGroup) * vr;
                x -= hPoint;
            } else {
                p.xPos = x += series.getPointPos(wUnit) - wPoint / 2;
                p.yPos = y -= yAxis.getPosition(yLen, p.yGroup) * vr;
            }

            p.hPoint = hPoint;
            bar.layout(inverted).translate(x, y);

            // labels
            if (labelViews) {
                // high
                if (labelView = labelViews.get(p, 1)) {
                    const r = labelView.getBBounds();

                    if (inverted) {
                        labelView.translate(x + hPoint + labelOff + p.radius, y - r.height / 2);
                    } else {
                        labelView.translate(x - r.width / 2, y - r.height - labelOff - p.radius);
                    }
                }
                // low
                if (labelView = labelViews.get(p, 0)) {
                    const r = labelView.getBBounds();

                    if (inverted) {
                        labelView.translate(x - r.width - labelOff - p.radius, y - r.height / 2);
                    } else {
                        labelView.translate(x - r.width / 2, y + hPoint + labelOff + p.radius);
                    }
                }
            }
        })
    }
}