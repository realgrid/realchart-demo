////////////////////////////////////////////////////////////////////////////////
// AreaSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathBuilder } from "../../common/PathBuilder";
import { ClipRectElement, PathElement, RcElement } from "../../common/RcControl";
import { FILL, IValueRange } from "../../common/Types";
import { Utils } from "../../common/Utils";
import { SeriesGroupLayout } from "../../model/Series";
import { LinearAxis } from "../../model/axis/LinearAxis";
import { AreaSeries, AreaSeriesGroup, AreaSeriesPoint } from "../../model/series/LineSeries";
import { AreaLegendMarkerView } from "../../model/series/legend/AreaLegendMarkerView";
import { LegendItemView } from "../LegendView";
import { LineContainer, LineSeriesBaseView } from "./LineSeriesView";

export class AreaSeriesView extends LineSeriesBaseView<AreaSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _areaContainer: LineContainer;
    private _area: PathElement;
    private _lowArea: PathElement;
    private _rangeAreas: ElementPool<PathElement>;
    private _rangeAreaClips: ClipRectElement[] = [];

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
    decoreateLegend(legendView: LegendItemView): void {
        super.decoreateLegend(legendView);

        const cs = getComputedStyle(this._area.dom);
        (legendView._marker as AreaLegendMarkerView)._area.setStroke('none');
        (legendView._marker as AreaLegendMarkerView)._area.setFill(cs.fill);
        (legendView._marker as AreaLegendMarkerView)._area.setStyle('fillOpacity', cs.fillOpacity);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    getClipContainer2(): RcElement {
        return this._areaContainer;
    }

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
                areas = this._rangeAreas = new ElementPool(this._areaContainer, PathElement, 'rct-area-series-area');
            }
            areas.prepare(ranges.length);

            while (clips.length < ranges.length) {
                const c = new ClipRectElement(this.doc);

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

        this.model.prepareAreas();
        this._areaContainer.invert(this._inverted, height);
    }

    protected _layoutMarkers(pts: AreaSeriesPoint[], width: number, height: number): void {
        super._layoutMarkers(pts, width, height);

        const inverted = this._inverted;
        const yAxis = this.model._yAxisObj;
        const yLen = inverted ? width : height;
        const yOrg = inverted ? 0 : height;

        for (let i = 0, cnt = pts.length; i < cnt; i++) {
            const p = pts[i];
            
            p.yLow = yOrg - yAxis.getPos(yLen, p.yGroup - p.yValue);
        }
    }

    protected _doAfterLayout(): void {
        (this.model.group as AreaSeriesGroup)?.prepareLines(this.model);

        super._doAfterLayout();
    
        if (this._polar) {
            this._layoutPolar(this._area, this._visPoints as AreaSeriesPoint[]);
        } else {
            this.$_layoutArea(this._area);
        }
    }

    private $_layoutArea(area: PathElement): void {
        const series = this.model;

        if (!this._areaContainer.setVis(series._areas.length > 0)) {
            return; 
        }

        const w = this.width;
        const h = this.height;
        const inverted = series.chart.isInverted();
        const lowArea = this._needBelow ? this._lowArea : void 0;
        const s = this._buildAreas(series._areas, series.getLineType());

        if (series._runRanges) {
            this._rangeAreas.forEach((area, i) => {
                const range = series._runRanges[i];

                area.setBoolData('simple', this._simpleMode);
                area.setPath(s);
                area.internalClearStyleAndClass();
                area.setFill(range.color);
                this._setFill(area, range.style);
                range.areaStyle && area.internalSetStyleOrClass(range.areaStyle);
                area.setClip(this._rangeAreaClips[i]);
                this._clipRange(w, h, series._runRangeValue, range, this._rangeAreaClips[i], inverted);
            })
        } else {
            area.setPath(s);
            area.unsetData('polar');
            area.setBoolData('simple', this._simpleMode);
            area.internalClearStyleAndClass();
            series.color && area.internalSetStyle(FILL, series.color);
            this._setFill(area, series.style);
            series.areaStyle && area.internalSetStyleOrClass(series.areaStyle);
        }

        if (lowArea) {
            lowArea.setBoolData('simple', this._simpleMode);
            lowArea.setPath(s);
            lowArea.internalClearStyleAndClass();
            series.color && lowArea.internalSetStyle(FILL, series.color);
            series.areaStyle && lowArea.internalSetStyleOrClass(series.areaStyle);
            this._setFill(lowArea, series.belowStyle);
            series.belowAreaStyle && lowArea.internalSetStyleOrClass(series.belowAreaStyle);
        }
    }

    protected _layoutPolar(area: PathElement, pts: AreaSeriesPoint[]): void {
        const series = this.model;
        const g = series.group;
        const yAxis = series._yAxisObj;
        const base = yAxis instanceof LinearAxis ? series.getBaseValue(yAxis) : NaN;
        const len = this.height;
        const y = yAxis.getPos(len, Utils.isNotEmpty(base) ? base : yAxis.axisMax());
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
        area.setFill(series.color);
        area.addStyleOrClass(series.style);
    }
}