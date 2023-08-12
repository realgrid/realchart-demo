////////////////////////////////////////////////////////////////////////////////
// BubbleSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathElement } from "../../common/RcControl";
import { IRect } from "../../common/Rectangle";
import { SvgShapes } from "../../common/impl/SvgShape";
import { BubbleSeries, BubbleSeriesPoint } from "../../model/series/BubbleSeries";
import { PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class MarkerView extends PathElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: BubbleSeriesPoint;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-bubble-series-marker');
    }
}

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
    protected _prepareSeries(doc: Document, model: BubbleSeries): void {
        const pts = model.getPoints().getVisibles();

        this.$_prepareMarkser(model._visPoints as BubbleSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
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
        const count = points.length;
        const {min, max} = series.getPxMinMax(len);

        this._markers.prepare(count, (m, i) => {
            const p = points[i];

            p.radius = series.getRadius(p.zValue, min, max);
            p.shape = marker.shape;
            m.point = p;
        });
    }

    private $_layoutMarkers(width: number, height: number): void {
        const series = this.model;
        const vr = this._getViewRate();
        const labels = series.pointLabel;
        const labelOff = labels.offset;
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        let labelView: PointLabelView;
        let r: IRect;

        this._markers.forEach((m, i) => {
            const p = m.point;

            if (!isNaN(p.zValue)) {
                const x = p.xPos = xAxis.getPosition(width, p.xValue);
                const y = p.yPos = this.height - yAxis.getPosition(height, p.yValue);
                const s = p.shape;
                const sz = p.radius * vr;
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
                if (labelViews && (labelView = labelViews.get(p, 0))) {
                    r = labelView.getBBounds();
                    labelView.translate(x - r.width / 2, y - r.height / 2);
                }
            }
        });
    }
}