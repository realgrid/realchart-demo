////////////////////////////////////////////////////////////////////////////////
// BubbleSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { cos, pickNum, sin } from "../../common/Common";
import { ElementPool } from "../../common/ElementPool";
import { Align, PI_2 } from "../../common/Types";
import { Shape } from "../../common/impl/SvgShape";
import { Axis } from "../../model/Axis";
import { Chart } from "../../model/Chart";
import { PointItemPosition } from "../../model/Series";
import { BubbleSeries, BubbleSeriesPoint } from "../../model/series/BubbleSeries";
import { IPointView, MarkerSeriesPointView, MarkerSeriesView, PointContainer, PointLabelView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

export class BubbleSeriesPointView extends MarkerSeriesPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _radius: number;
    _shape: Shape;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    beginHover(series: BubbleSeriesView, focused: boolean): void {
    }

    setHoverRate(series: BubbleSeriesView, focused: boolean, rate: number): void {
    }

    endHover(series: BubbleSeriesView, focused: boolean): void {
    }
}

/**
 * @internal 
 * 
 * View for BubbleSeries.
 */
export class BubbleSeriesView extends MarkerSeriesView<BubbleSeries, BubbleSeriesPoint> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _polar: any;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-bubble-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createMarkers(container: PointContainer): ElementPool<MarkerSeriesPointView> {
        return new ElementPool(container, BubbleSeriesPointView)
    }

    protected _prepareSeries(doc: Document, model: BubbleSeries): void {
        this.$_prepareMarkers(model, this._visPoints as BubbleSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        // invert 하지 않는다! // TODO: invert할 것!
        // this._pointContainer.invert(this._inverted, height);
        this.$_layoutMarkers(width, height);
    }

    protected override _runShowEffect(firstTime: boolean): void {
        firstTime && SeriesAnimation.grow(this);
    }

    protected override _doViewRateChanged(rate: number): void {
        this.$_layoutMarkers(this.width, this.height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareMarkers(series: BubbleSeries, points: BubbleSeriesPoint[]): void {
        const zAxis = series._xAxisObj._vlen < series._yAxisObj._vlen ? series._xAxisObj : series._yAxisObj;
        const len = zAxis._vlen;
        const count = points.length;
        // const {min, max} = series.getPixelMinMax(len);

        this._markers.prepare(count, (mv: BubbleSeriesPointView, i: number) => {
            const p = mv.point = points[i];

            mv._shape = series.shape;
            this._setPointStyle(mv, series, p);
        });
    }

    protected _getAutoPos(overflowed: boolean): PointItemPosition {
        return overflowed ? PointItemPosition.OUTSIDE : PointItemPosition.INSIDE;
    }

    private $_layoutMarkers(width: number, height: number): void {
        const series = this.model;
        const inverted = this._inverted;
        const needClip = series.needClip(false);
        const gr = this._getGrowRate();
        const rotation = +series.rotation || 0;
        const labels = series.pointLabel;
        const labelPos = labels.position;
        const labelOff = labels.getOffset();
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj as Axis;
        const yAxis = series._yAxisObj as Axis;
        const polar = this._polar = (series.chart as Chart).body.getPolar(xAxis);
        const yLen = yAxis.prev(inverted ? width : height);
        const xLen = xAxis.prev(polar ? polar.rd * PI_2 : inverted ? height : width);
        const zAxis = series._xAxisObj._vlen < series._yAxisObj._vlen ? series._xAxisObj : series._yAxisObj;
        const len = zAxis._vlen;
        const {min, max} = series.getPixelMinMax(len);
        const yOrg = inverted ? 0 : height;
        const drawer = this._getDrawer(series.shape);
        let labelView: PointLabelView;

        this._markers.forEach((mv: BubbleSeriesPointView, i: number) => {
            const p = mv.point as BubbleSeriesPoint;
            const lv = labelViews && (labelView = labelViews.get(p, 0));

            if (mv.setVis(!p.isNull && !isNaN(p.zValue))) {
                const sz = (mv._radius = series.getRadius(p.zValue, min, max)) * gr;
                let path: (string | number)[];
                let x: number;
                let y: number;

                if (polar) {
                    const a = polar.start + xAxis.getPos(PI_2, p.xValue);
                    const py = yAxis.getPos(polar.rd, p.yValue);
    
                    x = polar.cx + py * cos(a);
                    y = polar.cy + py * sin(a);
                } else {
                    x = xAxis.getPos(xLen, p.xValue);
                    y = yOrg - yAxis.getPos(yLen, p.yValue);

                    if (inverted) {
                        x = yAxis.getPos(yLen, p.yValue);
                        y = height - xAxis.getPos(xLen, p.xValue);
                    }
                }
                p.xPos = x;
                p.yPos = y;
    
                if (mv.setVis(!needClip || x >= 0 && x <= width && y >= 0 && y <= height)) {
                    mv.setPath(drawer(sz)).trans(x, y).rotate(rotation);
    
                    if (lv) {
                        labelView.setContrast(mv.dom);
                        labelView.layout(Align.CENTER);
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

    getNearest(x: number, y: number): {pv: IPointView, dist: number} {
        const pv = this._markers._internalItems().reduce((s: BubbleSeriesPointView, c: BubbleSeriesPointView) => s.distance(s._radius, x, y) < c.distance(c._radius, x, y) ? s : c) as BubbleSeriesPointView;
        return { pv, dist: pv.distance(pv._radius, x, y) };
    }

    canHover(dist: number, pv: BubbleSeriesPointView, hint: number): boolean {
        return dist <= pv._radius + hint;
    }
}