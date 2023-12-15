////////////////////////////////////////////////////////////////////////////////
// AreaRangeSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Dom } from "../../common/Dom";
import { PathElement } from "../../common/RcControl";
import { FILL } from "../../common/Types";
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
        super(doc, 'rct-arearange-series');

        this.insertFirst(this._areaContainer = new LineContainer(doc, 'rct-arearange-series-areas'));
        // TODO: negative 처리 등에 문제가 없으면 lineContainer에 추가한다.
        this._areaContainer.add(this._area = new PathElement(doc, 'rct-arearange-series-area'));
        // this._lineContainer.add(this._area = new PathElement(doc, 'rct-line-series-line'));
        this._lineContainer.add(this._lowerLine = new PathElement(doc, 'rct-areanrange-series-line'));
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
        const markerStyle = series.marker.style;
        const inverted = this._inverted;
        const yAxis = series._yAxisObj;
        const yLen = inverted ? width : height;
        const yOrg = height;

        for (let i = 0, cnt = pts.length; i < cnt; i++) {
            const p = pts[i];

            p.yLow = yOrg - yAxis.getPosition(yLen, p.lowValue);
        }

        // maker를 표시하지 않도록 설정해도 hit testing을 위해 감춰진(opacity=0) marker를 그려야 한다.
        // if (series.marker.visible) {
            const markers = this._markers;
    
            for (let i = 0, cnt = pts.length; i < cnt; i++) {
                const p = pts[i];
                const mv = markers.get(i + cnt);
                let x: number;
                let y: number;

                if (inverted) {
                    x = yAxis.getPosition(yLen, p.lowValue);
                    y = markers.get(i).ty;
                } else {
                    x = p.xPos;
                    y = p.yLow;
                }

                if (mv && mv.setVis(!p.isNull && x >= 0 && x <= width && y >= 0 && y <= height)) {
                    this._layoutMarker(mv, markerStyle, x, y);
                }
            }
        // }
    }

    protected _layoutLines(): void {
        super._layoutLines();

        this.$_layoutArea(this._area);
    }

    private $_layoutArea(area: PathElement): void {
        const series = this.model;

        if (!this._areaContainer.setVis(series._lines.length > 0)) {
            return; 
        }

        const s = this._buildAreas(series._lines, series.getLineType());

        area.setPath(s);
        area.unsetData('polar');
        area.setBoolData('simple', this._simpleMode);
        area.internalClearStyleAndClass();
        series.color && area.internalSetStyle(FILL, series.color);
        this._setFill(area, series.style);
        series.areaStyle && area.internalSetStyleOrClass(series.areaStyle);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}