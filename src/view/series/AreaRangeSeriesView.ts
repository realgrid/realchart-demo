////////////////////////////////////////////////////////////////////////////////
// AreaRangeSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../../common/Common";
import { Dom } from "../../common/Dom";
import { IPoint2, PathBuilder } from "../../common/PathBuilder";
import { IPoint } from "../../common/Point";
import { PathElement } from "../../common/RcControl";
import { IPointPos } from "../../model/DataPoint";
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
                const mv = markers.get(i + cnt);
                let x: number;
                let y: number;

                if (p.isNull) {
                    mv.visible = false;
                } else {
                    mv.visible = true;

                    if (inverted) {
                        x = yAxis.getPosition(yLen, p.lowValue);
                        y = markers.get(i).ty;
                    } else {
                        x = p.xPos;
                        y = p.yLow;
                    }
    
                    this._layoutMarker(mv, x, y);
                }
            }
        }
    }

    protected _layoutLines(points: AreaRangeSeriesPoint[]): void {
        super._layoutLines(points);

        // low lines
        const lowPts = points.map(p => {
            return {xPos: p.xPos, yPos: p.yLow, isNull: p.isNull};
        });
        const pts = lowPts.slice().reverse();
        const sb = new PathBuilder();
        let i = 0;

        while (i < pts.length && pts[i].isNull) {
            i++;
        }

        sb.move(pts[i].xPos, pts[i].yPos);
        this._buildLines(pts, i + 1, sb);

        this._lowerLine.setPath(sb.end(false));
        this._lowerLine.setStyle('stroke', this.model.color);

        this.$_layoutArea(this._area, this._linePts, pts);
    }

    private $_layoutArea(area: PathElement, pts: IPointPos[], lowPts: IPointPos[]): void {
        const sb = new PathBuilder();
        let i = 0;

        // sb.move(pts[0].xPos, upPts[0].yPos)
        // this._buildLines(pts, 1, sb);
        // sb.line(lowPts[0].xPos, lowPts[0].yPos);
        // this._buildLines(lowPts, 1, sb);

        while (i < pts.length && pts[i].isNull) {
            i++;
        }

        const len = pts.length;
        let start = i++;
        let end: number;
        let pts2: IPointPos[];
        let lowPts2: IPointPos[];

        while (i < len) {
            if (pts[i].isNull) {
                end = i;

                if (end > start) {
                    pts2 = pts.slice(start, end);
                    lowPts2 = lowPts.slice(len - end, len - start);
    
                    sb.move(pts2[0].xPos, pts2[0].yPos);
                    this._buildLines(pts2, 1, sb);
                    sb.line(lowPts2[0].xPos, lowPts2[0].yPos);
                    this._buildLines(lowPts2, 1, sb);
                }

                while (i < len && pts[i].isNull) {
                    i++;
                }
                start = i;
            } else {
                i++;
            }
        }

        if (i > start) {
            end = i;
            pts2 = pts.slice(start, end);
            lowPts2 = lowPts.slice(len - end, len - start);
    
            sb.move(pts2[0].xPos, pts2[0].yPos);
            this._buildLines(pts2, 1, sb);
            sb.line(lowPts2[0].xPos, lowPts2[0].yPos);
            this._buildLines(lowPts2, 1, sb);
        }
        area.setPath(sb.end());
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}