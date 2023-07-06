////////////////////////////////////////////////////////////////////////////////
// AreaRangeSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathBuilder } from "../../common/PathBuilder";
import { PathElement, RcElement } from "../../common/RcControl";
import { Utils } from "../../common/Utils";
import { AreaRangeSeries, AreaRangeSeriesPoint, AreaSeries, LineSeriesPoint } from "../../model/series/LineSeries";
import { AreaSeriesView } from "./AreaSeriesView";
import { LineMarkerView, LineSeriesView } from "./LineSeriesView";

export class AreaRangeSeriesView extends AreaSeriesView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lowerLine: PathElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc);

        this._lineContainer.add(this._lowerLine = new PathElement(doc, null, 'rct-line-series-line'));
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
    }

    protected _layoutMarkers(pts: AreaRangeSeriesPoint[]): void {
        super._layoutMarkers(pts);

        const series = this.model;
        const yAxis = series._yAxisObj;

        for (let i = 0, cnt = pts.length; i < cnt; i++) {
            const p = pts[i];

            p.yLow = this.height - yAxis.getPosition(this.height, p.lowValue);
            this._layoutMarker(this._markers.get(i + cnt), p.xPos, p.yLow);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}