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
import { PointLabelView, SeriesView } from "../SeriesView";

class MarkerView extends PathElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: ScatterSeriesPoint;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, null, 'rct-scatter-series-marker');
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
        this.$_prepareMarkser(model._visPoints as ScatterSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        this.$_layoutMarkers();
    }

    private $_prepareMarkser(points: ScatterSeriesPoint[]): void {
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
        const labelVis = labels.visible;
        const labelOff = labels.offset;
        const labelViews = this._labelContainer;
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
            if (labelVis) {
                if (labelView = labelViews.get(p, 0)) {
                    r = labelView.getBBounds();
                    labelView.translate(x - r.width / 2, y - r.height / 2);
                }
            }
        });
    }
}