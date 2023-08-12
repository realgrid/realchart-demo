////////////////////////////////////////////////////////////////////////////////
// HeatmapSeriesView.ts
// 2023. 08. 02. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Color } from "../../common/Color";
import { ElementPool } from "../../common/ElementPool";
import { PathElement, RcElement } from "../../common/RcControl";
import { RectElement } from "../../common/impl/RectElement";
import { CategoryAxis } from "../../model/axis/CategoryAxis";
import { HeatmapSeries, HeatmapSeriesPoint } from "../../model/series/HeatmapSeries";
import { IPointView, PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class CellView extends RectElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: HeatmapSeriesPoint;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
}

export class HeatmapSeriesView extends SeriesView<HeatmapSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _cells: ElementPool<CellView>;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-heatmap-series')

        this._cells = new ElementPool(this._pointContainer, CellView);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._cells;
    }

    protected _prepareSeries(doc: Document, model: HeatmapSeries): void {
        this.$_parepareCells(model._visPoints as HeatmapSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        this.$_layoutCells(width, height);
    }

    protected _runShowEffect(firstTime: boolean): void {
        firstTime && SeriesAnimation.slide(this);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareCells(points: HeatmapSeriesPoint[]): void {
        this._cells.prepare(points.length, (v, i) => {
            v.point = points[i];
        });
    }

    protected $_layoutCells(width: number, height: number): void {
        const series = this.model;
        const inverted = series.chart.isInverted();
        const labels = series.pointLabel;
        const labelOff = labels.offset;
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const yLen = inverted ? width : height;
        const xLen = inverted ? height : width;
        const color = new Color(series.color);

        this._cells.forEach(cell => {
            const p = cell.point as HeatmapSeriesPoint;
            console.log(p.xValue, p.yValue);
            const wUnit = xAxis.getUnitLength(xLen, p.xValue);
            const wPoint = wUnit;//series.getPointWidth(wUnit);
            const hUnit = yAxis.getUnitLength(yLen, p.yValue);
            const hPoint = hUnit;// series.getPointWidth(hUnit);
            const org = inverted ? 0 : height;;
            let x: number;
            let y: number;
            let labelView: PointLabelView;

            if (inverted) {
                y = xLen - xAxis.getPosition(xLen, p.xValue) - wUnit / 2;
                x = org;
            } else {
                x = xAxis.getPosition(xLen, p.xValue) - wUnit / 2;
                y = org - yAxis.getPosition(yLen, p.yValue) - wUnit / 2;
            }

            cell.setBounds(x, y, wPoint, hPoint);
            cell.setStyle('fill', color.brighten(1 - p.colorValue / series._colorMax).toString());

            // label
            if (labelViews && (labelView = labelViews.get(p, 0))) {
                const r = labelView.getBBounds();

                if (inverted) {
                    labelView.translate(x, y - r.height / 2);
                } else {
                    labelView.translate(x + wPoint / 2 - r.width / 2, y + hPoint / 2 - r.height / 2);
                }
            }
        });
    }
}