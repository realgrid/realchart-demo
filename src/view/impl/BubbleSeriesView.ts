////////////////////////////////////////////////////////////////////////////////
// BubbleSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathElement, RcElement } from "../../common/RcControl";
import { SvgShapes } from "../../common/impl/SvgShape";
import { BubbleSeries, BubbleSeriesPoint } from "../../model/series/BubbleSeries";
import { SeriesView } from "../SeriesView";

class MarkerView extends PathElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: BubbleSeriesPoint;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, null, 'rct-bubble-series-marker');
    }
}

export class BubbleSeriesView extends SeriesView<BubbleSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _markerContainer: RcElement;
    private _markers: ElementPool<MarkerView>;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-bubble-series')

        this.add(this._markerContainer = new RcElement(doc));
        this._markers = new ElementPool(this._markerContainer, MarkerView);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: BubbleSeries): void {
        const pts = model.getPoints().getVisibles();

        this.$_prepareMarkser(model._visPoints as BubbleSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        this.$_layoutMarkers();
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_prepareMarkser(points: BubbleSeriesPoint[]): void {
        const series = this.model;
        const zAxis = series._xAxisObj._length < series._yAxisObj._length ? series._xAxisObj : series._yAxisObj;
        const len = zAxis._length;
        const marker = series.marker;
        const count = points.length;
        const {min, max} = series.getPxMinMax(len);

        this._markers.prepare(count, (m, i) => {
            const p = points[i];

            p.radius = series.getRadius(p.zValue, min, max);
            p.shape = marker.shape;
            m.point = p;
        });
    }

    private $_layoutMarkers(): void {
        const series = this.model;
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;

        this._markers.forEach((m, i) => {
            const p = m.point;

            if (!isNaN(p.zValue)) {
                const x = p.xPos = xAxis.getPosition(this.width, p.xValue);
                const y = p.yPos = this.height - yAxis.getPosition(this.height, p.yValue);
                const s = p.shape;
                const sz = p.radius * 1;//this._sizeRate;
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
            }
        });
    }
}