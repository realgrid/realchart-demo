////////////////////////////////////////////////////////////////////////////////
// AreaSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../../common/Common";
import { PathBuilder } from "../../common/PathBuilder";
import { PathElement } from "../../common/RcControl";
import { Utils } from "../../common/Utils";
import { SeriesGroupLayout } from "../../model/Series";
import { LinearAxis } from "../../model/axis/LinearAxis";
import { AreaSeries, AreaSeriesPoint } from "../../model/series/LineSeries";
import { LineSeriesBaseView } from "./LineSeriesView";

export class AreaSeriesView extends LineSeriesBaseView<AreaSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    // private _areaContainer: RcElement;
    private _area: PathElement;
    private _lowArea: PathElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, className?: string) {
        super(doc, className || 'rct-area-series');

        this._lineContainer.insertFirst(this._area = new PathElement(doc, 'rct-area-series-area'));
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
    protected _prepareBelow(series: AreaSeries, w: number, h: number): boolean {
        let lowArea = this._lowArea;

        this._area.setStyle('fill', this.model.color);
        this._lowArea?.setStyle('fill', this.model.color);

        if (super._prepareBelow(series, w, h)) {
            if (!lowArea) {
                this._lineContainer.insertChild(lowArea = this._lowArea = new PathElement(this.doc, 'rct-area-series-area'), this._area);
            }
            this._area.setClip(this._upperClip);
            lowArea.setClip(this._lowerClip);
            return true;
        } else {
            lowArea?.setClip();
            this._area.setClip();
        }
    }

    protected _layoutMarkers(pts: AreaSeriesPoint[], width: number, height: number): void {
        super._layoutMarkers(pts, width, height);

        const yAxis = this.model._yAxisObj;
        const yOrg = height;

        for (let i = 0, cnt = pts.length; i < cnt; i++) {
            const p = pts[i];
            p.yLow = yOrg - yAxis.getPosition(height, p.yGroup - p.yValue);
        }
    }

    protected _layoutArea(area: PathElement, pts: AreaSeriesPoint[]): void {
        const series = this.model;
        const lowArea = this._needBelow ? this._lowArea : void 0;
        const g = series.group;
        const inverted = series.chart.isInverted();
        const yAxis = series._yAxisObj;
        const len = inverted ? this.width : this.height;
        const base = series.getBaseValue(yAxis);
        const yMin = this.height - yAxis.getPosition(len, pickNum(base, yAxis.axisMin()));
        const sb = new PathBuilder();
        let i = 0;
        let s: string;

        while (i < pts.length && pts[i].isNull) {
            i++;
        }

        if (g && (g.layout === SeriesGroupLayout.STACK || g.layout === SeriesGroupLayout.FILL)) {
            const iSave = i;

            sb.move(pts[i].xPos, pts[i].yLow);
            sb.line(pts[i].xPos, pts[i].yPos);
            
            i++;
            while (i < pts.length) {
                sb.line(pts[i].xPos, pts[i].yPos);
                i++;
            }

            i = pts.length - 1;
            sb.line(pts[i].xPos, pts[i].yLow);

            while (i >= iSave) {
                sb.line(pts[i].xPos, pts[i].yLow);
                i--;
            }
        } else {
            sb.move(pts[i].xPos, yMin);
            sb.line(pts[i].xPos, pts[i].yPos);

            this._buildLines(pts, i + 1, sb);

            const path = sb._path;

            i = 6;
            while (i < path.length) {
                if (path[i] === 'M') {
                    path.splice(i, 0, 'L', path[i - 2], yMin);
                    i += 3;
                    path.splice(i, 0, 'M', path[i + 1], yMin);
                    path[i + 3] = 'L';
                    i += 6;
                } else if (path[i] === 'Q') {
                    i += 4;
                } else { // 'L'
                    i += 3;
                }
            }

            sb.line(path[path.length - 2] as number, yMin);
        }

        area.setPath(s = sb.end());

        area.clearStyleAndClass();
        area.setStyle('fill', series.color);
        area.addStyleOrClass(series.style);

        if (lowArea) {
            lowArea.setPath(s);

            lowArea.clearStyleAndClass();
            lowArea.setStyle('fill', series.color);
            lowArea.setStyleOrClass(series.style);
            lowArea.setStyleOrClass(series.belowStyle);
        }
    }

    protected _layoutPolar(area: PathElement, pts: AreaSeriesPoint[]): void {
        const series = this.model;
        const g = series.group;
        const yAxis = series._yAxisObj;
        const base = yAxis instanceof LinearAxis ? series.getBaseValue(yAxis) : NaN;
        const len = this.height;
        const y = yAxis.getPosition(len, Utils.isNotEmpty(base) ? base : yAxis.axisMax());
        const sb = new PathBuilder();

        if (g && (g.layout === SeriesGroupLayout.STACK || g.layout === SeriesGroupLayout.FILL)) {
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
            area.setPath(sb.end());
        } else {
            sb.move(pts[0].xPos, pts[0].yPos);
            for (let i = 1; i < pts.length; i++) {
                sb.line(pts[i].xPos, pts[i].yPos);
            }
            area.setPath(sb.end());
        }

        area.clearStyleAndClass();
        area.setStyle('fill', series.color);
        area.addStyleOrClass(series.style);
    }
}