////////////////////////////////////////////////////////////////////////////////
// ScatterSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathElement, RcElement } from "../../common/RcControl";
import { SvgShapes } from "../../common/impl/SvgShape";
import { ScatterSeries, ScatterSeriesPoint } from "../../model/series/ScatterSeries";
import { SeriesView } from "../SeriesView";

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
    private _markerContainer: RcElement;
    private _markers: ElementPool<MarkerView>;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-scatter-series')

        this.add(this._markerContainer = new RcElement(doc));
        this._markers = new ElementPool(this._markerContainer, MarkerView);
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
        const marker = series.marker;
        const count = points.length;

        this._markers.prepare(count, (m, i) => {
            const p = points[i];
            m.point = p;
        })
    }

    private $_layoutMarkers(): void {
        const series = this.model;
        const marker = series.marker;
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;

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
        });
    }
}