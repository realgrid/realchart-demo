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
import { Align, _undef } from "../../common/Types";
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
        // firstTime && SeriesAnimation.reveal(this);
        firstTime && SeriesAnimation.grow(this);
    }

    protected _doViewRateChanged(rate: number): void {
        this.$_layoutCells(this.width, this.height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parepareCells(model: HeatmapSeries, points: HeatmapSeriesPoint[]): void {
        const color = new Color(model._calcedColor);
        const obj = [{ fill: _undef }];

        this._cells.prepare(points.length, (v, i) => {
            const p = v.point = points[i];

            obj[0].fill = color.brighten(1 - p.heatValue / model._heatMax).toString();
            this._setPointStyle(v, model, p, obj);
        });
    }

    protected $_layoutCells(width: number, height: number): void {
        const series = this.model;
        const inverted = series.chart.isInverted();
        const vr = this._getViewRate();
        // const labels = series.pointLabel;
        // const labelOff = labels.getOffset();
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const yLen = inverted ? width : height;
        const xLen = inverted ? height : width;
        const org = inverted ? 0 : height;
        // const color = new Color(this._getColor());
        console.log('LAYOUT CELLS', vr);

        this._cells.forEach(cell => {
            const p = cell.point as HeatmapSeriesPoint;

            if (cell.setVis(!p.isNull)) {
                const wUnit = xAxis.getUnitLen(xLen, p.xValue) * vr;
                const hUnit = yAxis.getUnitLen(yLen, p.yValue) * vr;
                let x = (p.xPos = xAxis.getPos(xLen, p.xValue)) - wUnit / 2;
                let y = (p.yPos = org - yAxis.getPos(yLen, p.yValue)) - hUnit / 2;
                let labelView: PointLabelView;
    
                cell.setBounds(x, y, wUnit, hUnit);
                // cell.setStyle('fill', color.brighten(1 - p.heatValue / series._heatMax).toString());
    
                // label
                if (labelViews && (labelView = labelViews.get(p, 0))) {
                    const r = labelView.getBBox();
    
                    if (inverted) {
                        y = xLen - xAxis.getPos(xLen, p.xValue) - r.height / 2;
                        x = org + yAxis.getPos(yLen, p.yValue);
                    } else {
                        x += wUnit / 2;
                        y += (hUnit - r.height) / 2;
                    }
    
                    x -= r.width / 2;
                    labelView.layout(Align.CENTER).translate(x, y);
                }
            }
        });
    }
}