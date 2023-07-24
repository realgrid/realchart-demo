////////////////////////////////////////////////////////////////////////////////
// AreaSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathBuilder } from "../../common/PathBuilder";
import { LayerElement, PathElement, RcElement } from "../../common/RcControl";
import { Utils } from "../../common/Utils";
import { SeriesGroupLayout } from "../../model/Series";
import { AreaSeries, AreaSeriesPoint } from "../../model/series/LineSeries";
import { LineSeriesView } from "./LineSeriesView";

export class AreaSeriesView extends LineSeriesView<AreaSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _areaContainer: RcElement;
    private _area: PathElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-area-series');

        this.insertFirst(this._areaContainer = new LayerElement(doc, 'rct-area-series-areas'));
        this._areaContainer.add(this._area = new PathElement(doc, 'rct-area-series-area'));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _layoutLines(pts: AreaSeriesPoint[]): void {
        super._layoutLines(pts);

        if (this._polar) {
            this._layoutPolar(this._area, pts);
        } else {
            this._layoutArea(this._area, pts);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _layoutMarkers(pts: AreaSeriesPoint[], width: number, height: number): void {
        super._layoutMarkers(pts, width, height);

        const yAxis = this.model._yAxisObj;
        const yOrg = height;

        for (let i = 0, cnt = pts.length; i < cnt; i++) {
            const p = pts[i];

            p.yLow = yOrg - yAxis.getPosition(height, p.yGroup - p.yValue);
        }
    }

    protected _layoutArea(path: PathElement, pts: AreaSeriesPoint[]): void {
        const series = this.model;
        const g = series._group;
        const len = this.height;
        const y = Utils.isNotEmpty(series.baseValue) ? series._yAxisObj.getPosition(len, series.baseValue) : len;
        const sb = new PathBuilder();

        if (g.layout === SeriesGroupLayout.STACK || g.layout === SeriesGroupLayout.FILL) {
            sb.move(pts[0].xPos, pts[0].yLow);
            sb.line(pts[0].xPos, pts[0].yPos);
            for (let i = 1; i < pts.length; i++) {
                sb.line(pts[i].xPos, pts[i].yPos);
            }
            // this._buildLines(points, sb, step, curved);
            sb.line(pts[pts.length - 1].xPos, pts[pts.length - 1].yLow);
            for (let i = pts.length - 1; i >= 0; i--) {
                sb.line(pts[i].xPos, pts[i].yLow);
            }
            path.setPath(sb.end());
        } else {
            sb.move(pts[0].xPos, y);
            sb.line(pts[0].xPos, pts[0].yPos);
            for (let i = 1; i < pts.length; i++) {
                sb.line(pts[i].xPos, pts[i].yPos);
            }
            // this._buildLines(points, sb, step, curved);
            sb.line(pts[pts.length - 1].xPos, y);
            path.setPath(sb.end());
        }

        path.setStyle('fill', series.color);
        path.setStyle('fillOpacity', '0.5');
    }

    protected _layoutPolar(path: PathElement, pts: AreaSeriesPoint[]): void {
        const series = this.model;
        const g = series._group;
        const len = this.height;
        const y = Utils.isNotEmpty(series.baseValue) ? series._yAxisObj.getPosition(len, series.baseValue) : len;
        const sb = new PathBuilder();

        if (g.layout === SeriesGroupLayout.STACK || g.layout === SeriesGroupLayout.FILL) {
            sb.move(pts[0].xPos, pts[0].yLow);
            sb.line(pts[0].xPos, pts[0].yPos);
            for (let i = 1; i < pts.length; i++) {
                sb.line(pts[i].xPos, pts[i].yPos);
            }
            // this._buildLines(points, sb, step, curved);
            sb.line(pts[pts.length - 1].xPos, pts[pts.length - 1].yLow);
            for (let i = pts.length - 1; i >= 0; i--) {
                sb.line(pts[i].xPos, pts[i].yLow);
            }
            path.setPath(sb.end());
        } else {
            sb.move(pts[0].xPos, pts[0].yPos);
            for (let i = 1; i < pts.length; i++) {
                sb.line(pts[i].xPos, pts[i].yPos);
            }
            path.setPath(sb.end());
        }

        path.setStyle('fill', series.color);
        path.setStyle('fillOpacity', '0.5');
    }
}