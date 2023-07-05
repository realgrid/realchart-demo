////////////////////////////////////////////////////////////////////////////////
// LineSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathBuilder } from "../../common/PathBuilder";
import { PathElement, RcElement } from "../../common/RcControl";
import { SvgShapes } from "../../common/impl/SvgShape";
import { DataPoint } from "../../model/DataPoint";
import { LineSeries, LineSeriesPoint } from "../../model/series/LineSeries";
import { SeriesView } from "../SeriesView";

class MarkerView extends PathElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: LineSeriesPoint;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, null, 'rct-line-series-marker');
    }
}

export abstract class LineSeriesView<T extends LineSeries> extends SeriesView<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lineContainer: RcElement;
    private _line: PathElement;
    private _markerContainer: RcElement;
    private _markers: ElementPool<MarkerView>;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);

        this.add(this._lineContainer = new RcElement(doc));
        this._lineContainer.add(this._line = new PathElement(doc, null, 'rct-line-series-line'));
        this.add(this._markerContainer = new RcElement(doc));
        this._markers = new ElementPool(this._markerContainer, MarkerView);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: T): void {
        const pts = model.getPoints().getVisibles();

        this.$_prepareMarkser(pts as LineSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        const pts = this._layoutMarkers();

        this._layoutLines(pts);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _markersPerPoint(): number {
        return 1;
    }

    private $_prepareMarkser(points: LineSeriesPoint[]): void {
        const series = this.model;
        const base = series.baseValue;
        const marker = series.marker;
        const vis = marker.visible();
        const mpp = this._markersPerPoint();
        const count = points.length;

        this._markers.prepare(count * mpp, (mv, i) => {
            const n = i % count;
            const p = points[n];

            if (n === count - 1) {

            } else if (n === 0) {

            } else {

            }

            p.radius = marker.radius;
            p.shape = marker.shape;
            mv.point = p;

            // mv.className = vis ? '' : 'dlchart-line-marker-hidden';
            // mv.clearStyles();
            // if (color) {
            //     m.setStyles({
            //         fill: color,
            //         stroke: color
            //     })
            // }
            // m.setStyles(styles);
            // this._needNegative && m.point.value < base && m.setStyles(negativeStyles);
        });
    }

    protected _layoutMarker(i: number, yProp = 'yPos'): void {
        const series = this.model;
        const m = this._markers.get(i);
        const p = m.point as LineSeriesPoint;
        let x = p.xPos = series._xAxisObj.getPosition(this.width, p.xValue);
        let y = p.yPos = this.height - series._yAxisObj.getPosition(this.height, p.yValue);
        const s = p.shape;
        const sz = p.radius;
        let path: (string | number)[];


        switch (s) {
            case 'square':
            case 'diamond':
            case 'triangle':
            case 'itriangle':
                x -= sz;
                y -= sz;
                path = SvgShapes[s](0, 0, sz * 2, sz * 2);
                break;

            default:
                path = SvgShapes.circle(0, 0, sz);
                break;
        }
        // if (m.visible = this._containsMarker(x, y)) {
            m.translate(x, y);
            m.setPath(path);
        // }
    }

    protected _layoutMarkers(): LineSeriesPoint[] {
        for (let i = 0, cnt = this._markers.count; i < cnt; i++) {
            this._layoutMarker(i);
        }

        return this._markers.map(m => m.point);
    }

    protected _layoutLines(pts: LineSeriesPoint[]): void {
        const sb = new PathBuilder();

        sb.move(pts[0].xPos, pts[0].yPos);
        for (let i = 1; i < pts.length; i++) {
            sb.line(pts[i].xPos, pts[i].yPos);
        }
        this._line.setPath(sb.end());
    }
}

export class LineSeriesViewImpl extends LineSeriesView<LineSeries> {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-line-series');
    }
}