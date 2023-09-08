////////////////////////////////////////////////////////////////////////////////
// BubbleSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathElement, RcElement } from "../../common/RcControl";
import { IRect } from "../../common/Rectangle";
import { SvgShapes } from "../../common/impl/SvgShape";
import { BubbleSeries, BubbleSeriesPoint } from "../../model/series/BubbleSeries";
import { IPointView, PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class MarkerView extends PathElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: BubbleSeriesPoint;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS);
    }
}

/**
 * @internal 
 * 
 * View for BubbleSeries.
 */
export class BubbleSeriesView extends SeriesView<BubbleSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _markers: ElementPool<MarkerView>;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-bubble-series')

        this._markers = new ElementPool(this._pointContainer, MarkerView);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._markers;
    }

    invertable(): boolean {
        return false;
    }

    protected _prepareSeries(doc: Document, model: BubbleSeries): void {
        this.$_prepareMarkser(model._visPoints as BubbleSeriesPoint[]);
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
    private $_prepareMarkser(points: BubbleSeriesPoint[]): void {
        const series = this.model;
        const zAxis = series._xAxisObj._length < series._yAxisObj._length ? series._xAxisObj : series._yAxisObj;
        const len = zAxis._length;
        const marker = series.marker;
        const style = marker.style;
        const count = points.length;
        const {min, max} = series.getPxMinMax(len);

        this._markers.prepare(count, (m, i) => {
            const p = m.point = points[i];

            p.radius = series.getRadius(p.zValue, min, max);
            p.shape = marker.shape;
            style && m.setStyleOrClass(style);
            p.color && m.setStyle('fill', p.color);
        });
    }

    private $_layoutMarkers(width: number, height: number): void {
        const series = this.model;
        const inverted = this._inverted;
        const vr = this._getViewRate();
        const labels = series.pointLabel;
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

            if (mv.setVisible(!p.isNull && !isNaN(p.zValue))) {
                const sz = p.radius * vr;
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
    
                path = SvgShapes.circle(0, 0, sz);
                mv.setPath(path);
                mv.translate(x, y);

                // label
                if (labelViews && (labelView = labelViews.get(p, 0))) {
                    labelView.setContrast(mv.dom);
                    labelView.layout();
                    r = labelView.getBBounds();
                    if (labelView.setVisible(r.width <= p.radius)) {
                        labelView.translate(x - r.width / 2, y - r.height / 2);
                    }
                }
            }
        });
    }
}