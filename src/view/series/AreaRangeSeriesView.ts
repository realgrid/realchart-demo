////////////////////////////////////////////////////////////////////////////////
// AreaRangeSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathBuilder } from "../../common/PathBuilder";
import { LayerElement, PathElement, RcElement } from "../../common/RcControl";
import { AreaRangeSeries, AreaRangeSeriesPoint } from "../../model/series/LineSeries";
import { AreaSeriesView } from "./AreaSeriesView";
import { LineSeriesView, LineSeriesViewImpl } from "./LineSeriesView";

export class AreaRangeSeriesView extends LineSeriesView<AreaRangeSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lowerLine: PathElement;
    private _areaContainer: RcElement;
    private _area: PathElement;


    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-area-range');

        this.insertFirst(this._areaContainer = new LayerElement(doc, 'rct-area-series-areas'));
        this._areaContainer.add(this._area = new PathElement(doc, 'rct-area-series-area'));
        this._lineContainer.add(this._lowerLine = new PathElement(doc, 'rct-line-series-line'));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _markersPerPoint(): number {
        return 2;
    }

    protected _layoutArea(path: PathElement, pts: AreaRangeSeriesPoint[]): void {
        const series = this.model;
        const len = this.height;
        const sb = new PathBuilder();
        const cnt = pts.length;

        sb.move(pts[0].xPos, pts[0].yPos);
        for (let i = 1; i < pts.length; i++) {
            sb.line(pts[i].xPos, pts[i].yPos);
        }
        sb.line(pts[cnt - 1].xPos, pts[cnt - 1].yLow);
        for (let i = cnt - 2; i >= 0; i--) {
            sb.line(pts[i].xPos, pts[i].yLow);
        }
        path.setPath(sb.end());

        path.setStyle('fill', series.color);
        path.setStyle('fillOpacity', '0.5');
    }

    protected _layoutLines(pts: AreaRangeSeriesPoint[]): void {
        super._layoutLines(pts);

        // low lines
        const sb = new PathBuilder();
        const cnt = pts.length;

        sb.move(pts[cnt - 1].xPos, pts[cnt - 1].yLow);
        for (let i = cnt - 2; i >= 0; i--) {
            sb.line(pts[i].xPos, pts[i].yLow);
        }
        this._lowerLine.setPath(sb.end());

        this._layoutArea(this._area, pts);
    }

    protected _layoutMarkers(pts: AreaRangeSeriesPoint[], width: number, height: number): void {
        super._layoutMarkers(pts, width, height);

        const series = this.model;
        const yAxis = series._yAxisObj;
        const yOrg = height;

        for (let i = 0, cnt = pts.length; i < cnt; i++) {
            const p = pts[i];

            p.yLow = yOrg - yAxis.getPosition(height, p.lowValue);
            this._layoutMarker(this._markers.get(i + cnt), p.xPos, p.yLow);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}