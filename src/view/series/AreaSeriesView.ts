////////////////////////////////////////////////////////////////////////////////
// AreaSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../../common/Common";
import { ElementPool } from "../../common/ElementPool";
import { PathBuilder } from "../../common/PathBuilder";
import { ClipElement, PathElement, RcElement } from "../../common/RcControl";
import { IValueRange } from "../../common/Types";
import { Utils } from "../../common/Utils";
import { SeriesGroupLayout } from "../../model/Series";
import { LinearAxis } from "../../model/axis/LinearAxis";
import { AreaSeries, AreaSeriesPoint } from "../../model/series/LineSeries";
import { LineContainer, LineSeriesBaseView } from "./LineSeriesView";

export class AreaSeriesView extends LineSeriesBaseView<AreaSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _areaContainer: LineContainer;
    private _area: PathElement;
    private _lowArea: PathElement;
    private _rangeAreas: ElementPool<PathElement>;
    private _rangeAreaClips: ClipElement[] = [];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, className?: string) {
        super(doc, className || 'rct-area-series');

        this.insertFirst(this._areaContainer = new LineContainer(doc, 'rct-area-series-areas'));
        this._areaContainer.insertFirst(this._area = new PathElement(doc, 'rct-area-series-area'));
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
    protected _prepareBelow(series: AreaSeries): boolean {
        let lowArea = this._lowArea;

        if (super._prepareBelow(series)) {
            if (!lowArea) {
                this._areaContainer.add(lowArea = this._lowArea = new PathElement(this.doc, 'rct-area-series-area'));
            }
            this._area.setClip(this._upperClip);
            lowArea.setClip(this._lowerClip);
            return true;
        } else {
            lowArea?.setClip();
            this._area.setClip();
        }
    }

    protected _prepareRanges(model: AreaSeries, ranges: IValueRange[]): void {
        super._prepareRanges(model, ranges);

        let areas = this._rangeAreas;
        let clips = this._rangeAreaClips;

        if (!ranges) {
            if (areas) {
                areas.freeAll();
                clips.forEach(c => c.remove());
                clips.length = 0; 
            }
        } else {
            if (!areas) {
                areas = this._rangeAreas = new ElementPool(this._areaContainer, PathElement);
            }
            areas.prepare(ranges.length);

            while (clips.length < ranges.length) {
                const c = new ClipElement(this.doc);

                c.setAttr(RcElement.ASSET_KEY, '1');
                this.control.clipContainer().append(c.dom);
                clips.push(c);
            }
            while (clips.length > ranges.length) {
                clips.pop().remove();
            }
        }
    }

    protected _renderSeries(width: number, height: number): void {
        super._renderSeries(width, height);

        this._areaContainer.invert(this._inverted, height);
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
        const w = this.width;
        const h = this.height;
        const series = this.model;
        const lowArea = this._needBelow ? this._lowArea : void 0;
        const g = series.group;
        const inverted = series.chart.isInverted();
        const yAxis = series._yAxisObj;
        const len = inverted ? this.width : this.height;
        const min = yAxis.axisMin();
        const base = series.getBaseValue(yAxis);
        const yMin = this.height - yAxis.getPosition(len, pickNum(Math.max(min, base), min));
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

        s = sb.end();
        // area.unsetData('polar');
        // area.setBoolData('simple', this._simpleMode);
        // area.setPath(s);
        // area.internalClearStyleAndClass();
        // series.color && area.setStyle('fill', series.color);
        // series.style && area.internalSetStyleOrClass(series.style);

        if (series._runRanges) {
            this._rangeAreas.forEach((area, i) => {
                const range = series._runRanges[i];

                area.setBoolData('simple', this._simpleMode);
                area.setPath(s);
                area.internalClearStyleAndClass();
                area.setStyle('fill', range.color);
                area.addStyleOrClass(range.style);
                area.setClip(this._rangeAreaClips[i]);
                this._clipRange(w, h, series._runRangeValue, range, this._rangeAreaClips[i], inverted);
            })
        } else {
            area.unsetData('polar');
            area.setBoolData('simple', this._simpleMode);
            area.setPath(s);
            area.internalClearStyleAndClass();
            series.color && area.setStyle('fill', series.color);
            series.style && area.internalSetStyleOrClass(series.style);
        }

        if (lowArea) {
            lowArea.setBoolData('simple', this._simpleMode);
            lowArea.setPath(s);
            lowArea.internalClearStyleAndClass();
            series.color && lowArea.setStyle('fill', series.color);
            series.belowStyle && lowArea.internalSetStyleOrClass(series.belowStyle);
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

        area.setBoolData('polar', true);
        area.clearStyleAndClass();
        area.setStyle('fill', series.color);
        area.addStyleOrClass(series.style);
    }
}