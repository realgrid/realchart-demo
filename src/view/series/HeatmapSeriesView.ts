////////////////////////////////////////////////////////////////////////////////
// HeatmapSeriesView.ts
// 2023. 08. 02. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Color } from "../../common/Color";
import { ElementPool } from "../../common/ElementPool";
import { RcElement } from "../../common/RcControl";
import { Align, _undefined } from "../../common/Types";
import { RectElement } from "../../common/impl/RectElement";
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
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS);
    }
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
        this.$_parepareCells(model, this._visPoints as HeatmapSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        this._pointContainer.invert(this._inverted, height);
        this.$_layoutCells(width, height);
    }

    protected _runShowEffect(firstTime: boolean): void {
        firstTime && SeriesAnimation.slide(this);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareCells(model: HeatmapSeries, points: HeatmapSeriesPoint[]): void {
        const color = new Color(model._calcedColor);
        const obj = [{ fill: _undefined }];

        this._cells.prepare(points.length, (v, i) => {
            const p = v.point = points[i];

            obj[0].fill = color.brighten(1 - p.heatValue / model._heatMax).toString();
            this._setPointStyle(v, model, p, obj);
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
        const org = inverted ? 0 : height;
        // const color = new Color(this._getColor());

        this._cells.forEach(cell => {
            const p = cell.point as HeatmapSeriesPoint;

            if (cell.setVisible(!p.isNull)) {
                const wUnit = xAxis.getUnitLength(xLen, p.xValue);
                const wPoint = wUnit;
                const hUnit = yAxis.getUnitLength(yLen, p.yValue);
                const hPoint = hUnit;
                let x = (p.xPos = xAxis.getPosition(xLen, p.xValue)) - wUnit / 2;
                let y = (p.yPos = org - yAxis.getPosition(yLen, p.yValue)) - hUnit / 2;
                let labelView: PointLabelView;
    
                cell.setBounds(x, y, wPoint, hPoint);
                // cell.setStyle('fill', color.brighten(1 - p.heatValue / series._heatMax).toString());
    
                // label
                if (labelViews && (labelView = labelViews.get(p, 0))) {
                    const r = labelView.getBBounds();
    
                    if (inverted) {
                        y = xLen - xAxis.getPosition(xLen, p.xValue);
                        x = org;
                        y -= r.height / 2;
                        x += yAxis.getPosition(yLen, p.yValue);// - r.width / 2;
                    } else {
                        x += wPoint / 2;// (wPoint - r.width) / 2;
                        y += (hPoint - r.height) / 2;
                    }
    
                    x -= r.width / 2;
                    labelView.layout(Align.CENTER).translate(x, y);
                }
            }
       });
    }
}