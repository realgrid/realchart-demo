////////////////////////////////////////////////////////////////////////////////
// ScatterSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathElement } from "../../common/RcControl";
import { IRect } from "../../common/Rectangle";
import { SvgShapes } from "../../common/impl/SvgShape";
import { ScatterSeries, ScatterSeriesPoint } from "../../model/series/ScatterSeries";
import { PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class MarkerView extends PathElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: ScatterSeriesPoint;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-scatter-series-marker');
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
    protected _prepareSeries(doc: Document, model: ScatterSeries): void {
        this.$_prepareMarkers(model._visPoints as ScatterSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        this.$_layoutMarkers();
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

    private $_layoutMarkers(): void {
        const series = this.model;
        const marker = series.marker;
        const labels = series.pointLabel;
        const labelOff = labels.offset;
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        let labelView: PointLabelView;
        let r: IRect;

        this._markers.forEach((m, i) => {
            const p = m.point;

            const x = p.xPos = xAxis.getPosition(this.width, p.xValue);
            const y = p.yPos = this.height - yAxis.getPosition(this.height, p.yValue);
            const s = marker.shape;
            const sz = marker.radius;
            let path: (string | number)[];

            // m.className = model.getPointStyle(i);

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
            m.setPath(path);
            m.translate(x, y);

            // label
            if (labelViews) {
                if (labelView = labelViews.get(p, 0)) {
                    r = labelView.getBBounds();
                    labelView.translate(x - r.width / 2, y - r.height / 2);
                }
            }
        });
    }
}