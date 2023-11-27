////////////////////////////////////////////////////////////////////////////////
// ScatterSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IRect } from "../../common/Rectangle";
import { PI_2 } from "../../common/Types";
import { Utils } from "../../common/Utils";
import { SvgShapes } from "../../common/impl/SvgShape";
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
        // this._pointContainer.invert(this.model.chart.isInverted(), height);
        this.$_layoutMarkers(width, height);
    }

    protected _runShowEffect(firstTime: boolean): void {
        if (firstTime) {
            if (this._polar) {
                SeriesAnimation.grow(this);
            } else {
                SeriesAnimation.slide(this);
            }
        }
    }

    private $_prepareMarkers(model: ScatterSeries, points: ScatterSeriesPoint[]): void {
        const color = model.color;
        const count = points.length;

        this._pointContainer.setStyle('fill', color);

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
        const polar = this._polar = (series.chart as Chart).body.getPolar(series);
        const vr = polar ? this._getViewRate() : 1;
        const jitterX = series.jitterX;
        const jitterY = series.jitterY;
        const labels = series.pointLabel;
        const labelPos = labels.position;
        const labelOff = labels.offset;
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const yLen = inverted ? width : height;
        const xLen = inverted ? height : width;
        const yOrg = height;
        let labelView: PointLabelView;
        let r: IRect;

        this._markers.forEach((mv, i) => {
            const p = mv.point;
            const lv = labelViews && (labelView = labelViews.get(p, 0));

            if (mv.setVisible(!p.isNull)) {
                const s = series.shape;
                const sz = series.radius * vr;
                const xJitter = Utils.jitter(p.xValue, jitterX);
                const yJitter = Utils.jitter(p.yGroup, jitterY);
                let path: (string | number)[];
                let x: number;
                let y: number;

                // m.className = model.getPointStyle(i);

                if (polar) {
                    const a = polar.start + xAxis.getPosition(PI_2, xJitter);
                    const py = yAxis.getPosition(polar.rd, yJitter) * vr;
    
                    x = p.xPos = polar.cx + py * Math.cos(a);
                    y = p.yPos = polar.cy + py * Math.sin(a);
                } else {
                    x = p.xPos = xAxis.getPosition(xLen, xJitter);
                    y = p.yPos = yOrg - yAxis.getPosition(yLen, yJitter);
                    if (inverted) {
                        x = yAxis.getPosition(yLen, yJitter);
                        y = yOrg - xAxis.getPosition(xLen, xJitter);
                    }
                }

                if (mv.setVisible(x >= 0 && x <= width && y >= 0 && y <= height)) {
                    switch (s) {
                        case 'square':
                        case 'diamond':
                        case 'triangle':
                        case 'itriangle':
                        case 'star':
                            path = SvgShapes[s](0 - sz, 0 - sz, sz * 2, sz * 2);
                            break;
    
                        default:
                            path = SvgShapes.circle(0, 0, sz);
                            break;
                    }
                    mv.setPath(path);
                    mv.translate(x, y);
    
                    // label
                    if (lv) {
                        this._layoutLabelView(labelView, labelPos, labelOff, sz, x, y);
                    }
                } else if (lv) {
                    lv.setVisible(false);
                }
            } else if (lv) {
                lv.setVisible(false);
            }
        });
    }
}