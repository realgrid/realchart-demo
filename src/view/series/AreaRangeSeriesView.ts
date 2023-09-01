////////////////////////////////////////////////////////////////////////////////
// AreaRangeSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../../common/Common";
import { Dom } from "../../common/Dom";
import { PathBuilder } from "../../common/PathBuilder";
import { PathElement } from "../../common/RcControl";
import { IPointPos } from "../../model/DataPoint";
import { LinearAxis } from "../../model/axis/LinearAxis";
import { AreaRangeSeries, AreaRangeSeriesPoint } from "../../model/series/LineSeries";
import { LineContainer, LineSeriesBaseView } from "./LineSeriesView";

export class AreaRangeSeriesView extends LineSeriesBaseView<AreaRangeSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _lowerLine: PathElement;
    private _areaContainer: LineContainer;
    private _area: PathElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-area-range');

        this.insertFirst(this._areaContainer = new LineContainer(doc, 'rct-area-series-areas'));
        // TODO: negative 처리 등에 문제가 없으면 lineContainer에 추가한다.
        this._areaContainer.add(this._area = new PathElement(doc, 'rct-area-series-area'));
        // this._lineContainer.add(this._area = new PathElement(doc, 'rct-line-series-line'));
        this._lineContainer.add(this._lowerLine = new PathElement(doc, 'rct-line-series-line'));
        Dom.setImportantStyle(this._lowerLine.dom.style, 'fill', 'none');
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _markersPerPoint(): number {
        return 2;
    }

    protected _renderSeries(width: number, height: number): void {
        this._areaContainer.invert(this.model.chart.isInverted(), height);

        super._renderSeries(width, height);
    }

    protected _layoutLines(points: AreaRangeSeriesPoint[]): void {
        super._layoutLines(points);

        // low lines
        const pts = points.map(p => {
            return {xPos: p.xPos, yPos: p.yLow, isNull: p.isNull};
        });
        const sb = new PathBuilder();
        const cnt = pts.length;

        sb.move(pts[cnt - 1].xPos, pts[cnt - 1].yPos);
        this._buildLines(pts, 1, sb, true);

        this._lowerLine.setPath(sb.end(false));
        this._lowerLine.setStyle('stroke', this.model.color);

        this.$_layoutArea(this._area, points);
    }

    private $_layoutArea(path: PathElement, points: AreaRangeSeriesPoint[]): void {
        const series = this.model;
        const inverted = series.chart.isInverted();
        const yAxis = series._yAxisObj;
        const len = inverted ? this.width : this.height;
        const base = yAxis instanceof LinearAxis ? yAxis.baseValue : NaN;
        const yMin = len - yAxis.getPosition(len, pickNum(base, yAxis.axisMin()));
        const yMax = yAxis.getPosition(len, pickNum(base, yAxis.axisMax()));
        const sb = new PathBuilder();
        const cnt = points.length;

        let pts = points as IPointPos[];

        sb.move(pts[0].xPos, pts[0].yPos);
        this._buildLines(pts, 1, sb, false);

        pts = points.map(p => {
            return {xPos: p.xPos, yPos: p.yLow, isNull: p.isNull};
        });
        sb.line(pts[cnt - 1].xPos, pts[cnt - 1].yPos);
        this._buildLines(pts, 1, sb, true);
        
        path.setPath(sb.end());
        path.setStyle('fill', series.color);
        path.setStyle('fillOpacity', '0.5');
    }

    protected _layoutMarkers(pts: AreaRangeSeriesPoint[], width: number, height: number): void {
        super._layoutMarkers(pts, width, height);

        const series = this.model;
        const inverted = this._inverted;
        const yAxis = series._yAxisObj;
        const yLen = inverted ? width : height;
        const yOrg = height;

        for (let i = 0, cnt = pts.length; i < cnt; i++) {
            const p = pts[i];

            p.yLow = yOrg - yAxis.getPosition(yLen, p.lowValue);
        }

        if (series.marker.visible) {
            const markers = this._markers;
    
            for (let i = 0, cnt = pts.length; i < cnt; i++) {
                const p = pts[i];
                let x: number;
                let y: number;

                if (inverted) {
                    x = yAxis.getPosition(yLen, p.lowValue);
                    y = markers.get(i).ty;
                } else {
                    x = p.xPos;
                    y = p.yLow;
                }

                this._layoutMarker(markers.get(i + cnt), x, y);
            }
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}