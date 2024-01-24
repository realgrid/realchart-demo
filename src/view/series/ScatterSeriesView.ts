////////////////////////////////////////////////////////////////////////////////
// ScatterSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { cos, sin } from "../../common/Common";
import { IRect } from "../../common/Rectangle";
import { PI_2 } from "../../common/Types";
import { Utils } from "../../common/Utils";
import { SvgShapes } from "../../common/impl/SvgShape";
import { Axis } from "../../model/Axis";
import { Chart } from "../../model/Chart";
import { PointItemPosition } from "../../model/Series";
import { ScatterSeries, ScatterSeriesPoint } from "../../model/series/ScatterSeries";
import { MarkerSeriesView, PointLabelView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

export class ScatterSeriesView extends MarkerSeriesView<ScatterSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _polar: any;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-scatter-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: ScatterSeries): void {
        this.$_prepareMarkers(model, this._visPoints as ScatterSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        // invert 하지 않는다! // TODO: invert할 것!
        // this._pointContainer.invert(this._inverted, height);
        this.$_layoutMarkers(width, height);
    }

    protected _runShowEffect(firstTime: boolean): void {
        if (firstTime) {
            if (this._polar) {
                SeriesAnimation.grow(this);
            } else {
                SeriesAnimation.grow(this);
                // SeriesAnimation.reveal(this);
            }
        }
    }

    private $_prepareMarkers(model: ScatterSeries, points: ScatterSeriesPoint[]): void {
        const count = points.length;

        this._pointContainer.setFill(model._runColor);

        this._markers.prepare(count, (mv, i) => {
            const p = mv.point = points[i];

            this._setPointStyle(mv, model, p);
        })
    }

    protected _getAutoPos(overflowed: boolean): PointItemPosition {
        return PointItemPosition.OUTSIDE;
    }

    protected _doViewRateChanged(rate: number): void {
        this.$_layoutMarkers(this.width, this.height);
    }

    private $_layoutMarkers(width: number, height: number): void {
        const series = this.model;
        const inverted = this._inverted;
        const needClip = series.needClip(false);
        const xAxis = series._xAxisObj as Axis;
        const yAxis = series._yAxisObj as Axis;
        const polar = this._polar = (series.chart as Chart).body.getPolar(xAxis);
        const gr = this._getGrowRate();
        const sz = Math.max(0, (+series.radius || 0)) * gr;
        const rotation = +series.rotation || 0;
        const jitterX = +series.jitterX || 0;
        const jitterY = +series.jitterY || 0;
        const labels = series.pointLabel;
        const labelPos = labels.position;
        const labelOff = labels.getOffset();
        const labelViews = this._labelViews();
        const yLen = yAxis.prev(inverted ? width : height);
        const xLen = xAxis.prev(polar ? polar.rd * PI_2 : inverted ? height : width);
        const yOrg = inverted ? 0 : height;
        let labelView: PointLabelView;
        let r: IRect;

        this._markers.forEach((mv, i) => {
            const p = mv.point;
            const lv = labelViews && (labelView = labelViews.get(p, 0));

            if (mv.setVis(!p.isNull)) {
                const drawer = this._getDrawer(series.getShape(p));
                const xJitter = Utils.jitter(p.xValue, jitterX);
                const yJitter = Utils.jitter(p.yGroup, jitterY);
                let path: (string | number)[];
                let x: number;
                let y: number;

                if (polar) {
                    const a = polar.start + xAxis.getPos(PI_2, xJitter);
                    const py = yAxis.getPos(polar.rd, yJitter) * gr;
    
                    x = polar.cx + py * cos(a);
                    y = polar.cy + py * sin(a);
                } else {
                    x = xAxis.getPos(xLen, xJitter);
                    y = yOrg - yAxis.getPos(yLen, yJitter);

                    if (inverted) {
                        x = yAxis.getPos(yLen, yJitter);
                        y = height - xAxis.getPos(xLen, xJitter);
                    }
                }

                p.xPos = x;
                p.yPos = y;

                if (mv.setVis(!!polar || !needClip || x >= 0 && x <= width && y >= 0 && y <= height)) {
                    mv.setPath(drawer(sz));
                    mv.trans(x, y).rotate(rotation);
    
                    // label
                    if (lv) {
                        this._layoutLabelView(labelView, labelPos, labelOff, sz, x, y);
                    }
                } else if (lv) {
                    lv.setVis(false);
                }
            } else if (lv) {
                lv.setVis(false);
            }
        });
    }
}