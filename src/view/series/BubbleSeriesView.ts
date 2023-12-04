////////////////////////////////////////////////////////////////////////////////
// BubbleSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IRect } from "../../common/Rectangle";
import { Align } from "../../common/Types";
import { SvgShapes } from "../../common/impl/SvgShape";
import { PointItemPosition } from "../../model/Series";
import { BubbleSeries, BubbleSeriesPoint } from "../../model/series/BubbleSeries";
import { MarkerSeriesPointView, MarkerSeriesView, PointLabelView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class MarkerView extends MarkerSeriesPointView<BubbleSeriesPoint> {
}

/**
 * @internal 
 * 
 * View for BubbleSeries.
 */
export class BubbleSeriesView extends MarkerSeriesView<BubbleSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-bubble-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: BubbleSeries): void {
        this.$_prepareMarkers(model, this._visPoints as BubbleSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        // this._pointContainer.invert(this.model.chart.isInverted(), height);
        this.$_layoutMarkers(width, height);
    }

    protected _runShowEffect(firstTime: boolean): void {
        firstTime && SeriesAnimation.grow(this);
    }

    protected _doViewRateChanged(rate: number): void {
        this.$_layoutMarkers(this.width, this.height);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareMarkers(series: BubbleSeries, points: BubbleSeriesPoint[]): void {
        const zAxis = series._xAxisObj._vlen < series._yAxisObj._vlen ? series._xAxisObj : series._yAxisObj;
        const len = zAxis._vlen;
        const count = points.length;
        const {min, max} = series.getPixelMinMax(len);

        this._markers.prepare(count, (mv, i) => {
            const p = mv.point = points[i];

            p.shape = series.shape;
            this._setPointStyle(mv, series, p);
        });
    }

    protected _getAutoPos(overflowed: boolean): PointItemPosition {
        return overflowed ? PointItemPosition.OUTSIDE : PointItemPosition.INSIDE;
    }

    private $_layoutMarkers(width: number, height: number): void {
        const series = this.model;
        const inverted = this._inverted;
        const noClip = series.noClip;
        const vr = this._getViewRate();
        const labels = series.pointLabel;
        const labelPos = labels.position;
        const labelOff = labels.getOffset();
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const yLen = inverted ? width : height;
        const xLen = inverted ? height : width;
        const zAxis = series._xAxisObj._vlen < series._yAxisObj._vlen ? series._xAxisObj : series._yAxisObj;
        const len = zAxis._vlen;
        const {min, max} = series.getPixelMinMax(len);
        const yOrg = height;
        let labelView: PointLabelView;
        let r: IRect;

        this._markers.forEach((mv, i) => {
            const p = mv.point as BubbleSeriesPoint;
            const lv = labelViews && (labelView = labelViews.get(p, 0));

            if (mv.setVisible(!p.isNull && !isNaN(p.zValue))) {
                const sz = (p.radius = series.getRadius(p.zValue, min, max)) * vr;
                let path: (string | number)[];
                let x: number;
                let y: number;

                // m.className = model.getPointStyle(i);

                x = p.xPos = xAxis.getPosition(xLen, p.xValue);
                y = p.yPos = yOrg - yAxis.getPosition(yLen, p.yValue);
                if (inverted) {
                    x = yAxis.getPosition(yLen, p.yGroup);
                    y = yOrg - xAxis.getPosition(xLen, p.xValue);
                }
    
                if (mv.setVisible(noClip || x >= 0 && x <= width && y >= 0 && y <= height)) {
                    path = SvgShapes.circle(0, 0, sz);
                    mv.setPath(path);
                    mv.translate(x, y);
    
                    // label
                    if (lv) {
                        labelView.setContrast(mv.dom);
                        labelView.layout(Align.CENTER);
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