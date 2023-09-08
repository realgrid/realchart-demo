////////////////////////////////////////////////////////////////////////////////
// ScatterSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathElement, RcElement } from "../../common/RcControl";
import { IRect } from "../../common/Rectangle";
import { SvgShapes } from "../../common/impl/SvgShape";
import { ScatterSeries, ScatterSeriesPoint } from "../../model/series/ScatterSeries";
import { IPointView, PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class MarkerView extends PathElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: ScatterSeriesPoint;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS);
    }
}

export class ScatterSeriesView extends SeriesView<ScatterSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _markers: ElementPool<MarkerView>;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-scatter-series')

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

    protected _prepareSeries(doc: Document, model: ScatterSeries): void {
        this.$_prepareMarkers(this._visPoints as ScatterSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        // this._pointContainer.invert(this.model.chart.isInverted(), height);
        this.$_layoutMarkers(width, height);
    }

    protected _runShowEffect(firstTime: boolean): void {
        firstTime && SeriesAnimation.slide(this);
    }

    private $_prepareMarkers(points: ScatterSeriesPoint[]): void {
        const series = this.model;
        const color = series.color;
        const marker = series.marker;
        const count = points.length;

        this._pointContainer.setStyle('fill', color);

        this._markers.prepare(count, (m, i) => {
            const p = points[i];

            m.point = p;
            // m.setStyle('fill', color);
        })
    }

    private $_layoutMarkers(width: number, height: number): void {
        const series = this.model;
        const inverted = this._inverted;
        const marker = series.marker;
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

            if (mv.setVisible(!p.isNull)) {
                const s = marker.shape;
                const sz = marker.radius;
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

                switch (s) {
                    case 'square':
                    case 'diamond':
                    case 'triangle':
                    case 'itriangle':
                        path = SvgShapes[s](0 - sz, 0 - sz, sz * 2, sz * 2);
                        break;

                    default:
                        path = SvgShapes.circle(0, 0, sz);
                        break;
                }
                mv.setPath(path);
                mv.translate(x, y);

                this._setPointIndex(mv, p);

                // label
                if (labelViews && (labelView = labelViews.get(p, 0))) {
                    r = labelView.getBBounds();
                    labelView.translate(x - r.width / 2, y - r.height / 2);
                }
            }
        });
    }
}