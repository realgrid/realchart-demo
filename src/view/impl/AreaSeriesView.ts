////////////////////////////////////////////////////////////////////////////////
// LineSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { PathBuilder } from "../../common/PathBuilder";
import { PathElement, RcElement } from "../../common/RcControl";
import { Utils } from "../../common/Utils";
import { AreaSeries, LineSeriesPoint } from "../../model/series/LineSeries";
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

        this.insertFirst(this._areaContainer = new RcElement(doc));
        this._areaContainer.add(this._area = new PathElement(doc, null, 'rct-area-series-area'));
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _layoutLines(pts: LineSeriesPoint[]): void {
        super._layoutLines(pts);

        this._layoutArea(this._area, pts);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _layoutArea(path: PathElement, pts: LineSeriesPoint[]): void {
        const series = this.model;
        const len = this.height;
        const y = Utils.isNotEmpty(series.baseValue) ? series._yAxisObj.getPosition(len, series.baseValue) : len;
        const sb = new PathBuilder();

        sb.move(pts[0].xPos, y);
        sb.line(pts[0].xPos, pts[0].yPos);
        for (let i = 1; i < pts.length; i++) {
            sb.line(pts[i].xPos, pts[i].yPos);
        }
        // this._buildLines(points, sb, step, curved);
        sb.line(pts[pts.length - 1].xPos, y);
        path.setPath(sb.end());
    }
}