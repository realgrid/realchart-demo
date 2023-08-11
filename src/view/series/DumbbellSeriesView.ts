////////////////////////////////////////////////////////////////////////////////
// DumbbellSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathElement } from "../../common/RcControl";
import { GroupElement } from "../../common/impl/GroupElement";
import { LineElement } from "../../common/impl/PathElement";
import { TextAnchor } from "../../common/impl/TextElement";
import { PointItemPosition } from "../../model/Series";
import { CategoryAxis } from "../../model/axis/CategoryAxis";
import { LinearAxis } from "../../model/axis/LinearAxis";
import { DumbbellSeries, DumbbellSeriesPoint } from "../../model/series/DumbbellSeries";
import { PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class BarElement extends GroupElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _line: LineElement;
    private _hmarker: PathElement;
    private _lmarker: PathElement;

    point: DumbbellSeriesPoint;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc);

        this.add(this._line = new LineElement(doc));
        this.add(this._hmarker = new PathElement(doc, 'rct-Dumbbell-series-marker'));
        this.add(this._lmarker = new PathElement(doc, 'rct-Dumbbell-series-marker'));
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    layout(inverted: boolean): void {
        this._line.setVLineC(this.width / 2, 0, this.height);
        this._hmarker.renderShape(this.point.shape, this.width / 2, 0, this.point.radius);
        this._lmarker.renderShape(this.point.shape, this.width / 2, this.height, this.point.radius);
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
        const labelVis = labels.visible && !this._animating();
        const labelOff = labels.offset;
        const labelViews = this._labelContainer;
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const wPad = xAxis instanceof CategoryAxis ? xAxis.categoryPad() * 2 : 0;
        const yLen = inverted ? width : height;
        const xLen = inverted ? height : width;
        //const xBase = xAxis instanceof LinearAxis ? xAxis.getPosition(xLen, xAxis.xBase) : 0;
        const yBase = yAxis.getPosition(yLen, yAxis instanceof LinearAxis ? yAxis.baseValue : 0);
        const org = inverted ? 0 : height;;
        const labelInfo: LabelInfo = labelVis && Object.assign(this._labelInfo, {
            inverted,
            labelPos: series.getLabelPosition(),
            labelOff: labels.offset,
            width, height
        });

        this._labelContainer.setVisible(labelVis);

        this._bars.forEach((bar, i) => {
            const p = bar.point;
            const wUnit = xAxis.getUnitLength(xLen, i) * (1 - wPad);
            const wPoint = series.getPointWidth(wUnit);
            const yVal = yAxis.getPosition(yLen, p.yValue);
            const hPoint = Math.abs(yAxis.getPosition(yLen, p.lowValue) - yVal) * vr;
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
                x += yAxis.getPosition(yLen, p.yGroup) * vr;
            } else {
                x += series.getPointPos(wUnit);
                y -= yAxis.getPosition(yLen, p.yGroup) * vr;
            }

            bar.setBounds(x, y, wPoint, hPoint);
            bar.layout(inverted);

            // labels
            if (labelVis) {
                if (labelView = labelViews.get(p, 1)) {
                    const r = labelView.getBBounds();

                    if (inverted) {
                        labelView.translate(x + hPoint + labelOff, y - r.height / 2);
                    } else {
                        x += wPoint / 2 - r.width / 2;
                        labelView.translate(x, y - r.height - labelOff);
                    }
                }
                if (labelView = labelViews.get(p, 0)) {
                    const r = labelView.getBBounds();

                    if (inverted) {
                        labelView.translate(x - r.width - labelOff, y - r.height / 2);
                    } else {
                        x += wPoint / 2 - r.width / 2;
                        labelView.translate(x, y + hPoint + labelOff);
                    }
                }
            }
        })
    }
}