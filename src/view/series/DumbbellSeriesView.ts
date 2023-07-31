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
import { PointItemPosition } from "../../model/Series";
import { CategoryAxis } from "../../model/axis/CategoryAxis";
import { LinearAxis } from "../../model/axis/LinearAxis";
import { DumbbellSeries, DumbbellSeriesPoint } from "../../model/series/DumbbellSeries";
import { PointLabelView, SeriesView } from "../SeriesView";

class BarElement extends GroupElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _line: LineElement;
    private _marker: PathElement;

    point: DumbbellSeriesPoint;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc);

        this.add(this._line = new LineElement(doc));
        this.add(this._marker = new PathElement(doc, 'rct-Dumbbell-series-marker'));
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
        super(doc, 'rct-Dumbbell-series')
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
        const labels = series.pointLabel;
        const labelViews = this._labelContainer;
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const wPad = xAxis instanceof CategoryAxis ? xAxis.categoryPadding * 2 : 0;
        const yLen = inverted ? width : height;
        const xLen = inverted ? height : width;
        //const xBase = xAxis instanceof LinearAxis ? xAxis.getPosition(xLen, xAxis.xBase) : 0;
        const yBase = yAxis.getPosition(yLen, yAxis instanceof LinearAxis ? yAxis.yBase : 0);
        const org = inverted ? 0 : height;;
        const labelInfo: LabelInfo = labels.visible && Object.assign(this._labelInfo, {
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
                y += series.getPointPos(wUnit);// + wPoint / 2;
                x += yAxis.getPosition(yLen, p.yGroup);// - hPoint;
            } else {
                x += series.getPointPos(wUnit);// + wPoint / 2;
                y -= yAxis.getPosition(yLen, p.yGroup);// - hPoint;
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