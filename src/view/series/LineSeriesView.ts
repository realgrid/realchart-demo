////////////////////////////////////////////////////////////////////////////////
// LineSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathBuilder } from "../../common/PathBuilder";
import { PathElement, RcElement } from "../../common/RcControl";
import { SvgShapes } from "../../common/impl/SvgShape";
import { Chart } from "../../main";
import { LineType } from "../../model/ChartTypes";
import { DataPoint } from "../../model/DataPoint";
import { LineSeries, LineSeriesBase, LineSeriesPoint, LineStepDirection } from "../../model/series/LineSeries";
import { IPointView, PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

export class LineMarkerView extends PathElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: LineSeriesPoint;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_STYLE + ' rct-line-series-marker');
    }
}

export abstract class LineSeriesView<T extends LineSeriesBase> extends SeriesView<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _lineContainer: RcElement;
    private _line: PathElement;
    private _tester: PathElement;
    protected _markers: ElementPool<LineMarkerView>;
    protected _polar: any;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);

        this.insertFirst(this._lineContainer = new RcElement(doc, 'rct-line-series-lines'));
        this._lineContainer.add(this._line = new PathElement(doc, 'rct-line-series-line'));
        this._lineContainer.add(this._tester = new PathElement(doc));
        this._tester.setStyle('stroke', 'red');
        this._tester.setStyle('fill', 'none');
        this._markers = new ElementPool(this._pointContainer, LineMarkerView);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _getPointPool(): ElementPool<RcElement> {
        return this._markers;
    }

    protected _prepareSeries(doc: Document, model: T): void {
        this.$_prepareMarkers(model._visPoints as LineSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        this._layoutMarkers(this.model._visPoints as LineSeriesPoint[], width, height);
        this._layoutLines(this.model._visPoints as LineSeriesPoint[]);
    }

    protected _runShowEffect(firstTime: boolean): void {
        if (this._polar) {
            firstTime && SeriesAnimation.grow(this);
        } else {
            firstTime && SeriesAnimation.slide(this);
        }
    }

    protected _doViewRateChanged(rate: number): void {
        this._layoutMarkers(this.model._visPoints as LineSeriesPoint[], this.width, this.height);
        this._layoutLines(this.model._visPoints.slice() as LineSeriesPoint[]);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _markersPerPoint(): number {
        return 1;
    }

    private $_prepareMarkers(points: LineSeriesPoint[]): void {
        const series = this.model;
        const marker = series.marker;

        if (this._pointContainer.visible = marker.visible) {
            const mpp = this._markersPerPoint();
            const count = points.length;
    
            this._markers.prepare(count * mpp, (mv, i) => {
                const n = i % count;
                const p = points[n];
    
                if (n === count - 1) {
    
                } else if (n === 0) {
    
                } else {
    
                }
    
                p.radius = marker.radius;
                p.shape = marker.shape;
                mv.point = p;
    
                // mv.className = vis ? '' : 'dlchart-line-marker-hidden';
                // mv.clearStyles();
                // if (color) {
                //     m.setStyles({
                //         fill: color,
                //         stroke: color
                //     })
                // }
                // m.setStyles(styles);
                // this._needNegative && m.point.value < base && m.setStyles(negativeStyles);
            });
        }
    }

    protected _layoutMarker(mv: LineMarkerView, x: number, y: number): void {
        const color = this.model.color;
        const p = mv.point as LineSeriesPoint;
        const s = p.shape;
        const sz = p.radius;
        let path: (string | number)[];

        switch (s) {
            case 'square':
            case 'diamond':
            case 'triangle':
            case 'itriangle':
                x -= sz;
                y -= sz;
                path = SvgShapes[s](0, 0, sz * 2, sz * 2);
                break;

            default:
                path = SvgShapes.circle(0, 0, sz);
                break;
        }
        // if (m.visible = this._containsMarker(x, y)) {
            mv.translate(x, y);
            mv.setPath(path);
            mv.setStyle('stroke', 'gray');
            mv.setStyle('fill', color);
        // }
    }

    protected _layoutMarkers(pts: LineSeriesPoint[], width: number, height: number): void {
        const series = this.model;
        const inverted = this._inverted;
        const polar = this._polar = (series.chart as Chart).body.getPolar(series);
        const vr = this._getViewRate();
        const vis = series.marker.visible;
        const labels = series.pointLabel;
        const labelOff = labels.offset;
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const yLen = inverted ? width : height;
        const xLen = inverted ? height : width;
        const yOrg = height;
        let labelView: PointLabelView;

        for (let i = 0, cnt = pts.length; i < cnt; i++) {
            const p = pts[i];

            if (polar) {
                const a = polar.start + i * polar.deg;
                const y = yAxis.getPosition(polar.rd, p.yGroup) * vr;

                p.xPos = polar.cx + y * Math.cos(a);
                p.yPos = polar.cy + y * Math.sin(a);
            } else {
                if (inverted) {
                    p.xPos = yAxis.getPosition(yLen, p.yGroup);
                    p.yPos = yOrg - xAxis.getPosition(xLen, p.xValue);
                } else {
                    p.xPos = xAxis.getPosition(xLen, p.xValue);
                    p.yPos = yOrg - yAxis.getPosition(yLen, p.yGroup);
                }
            }

            if (vis) {
                this._layoutMarker(this._markers.get(i), p.xPos, p.yPos);
            }
            if (labelViews && (labelView = labelViews.get(p, 0))) {
                const r = labelView.getBBounds();

                labelView.translate(p.xPos - r.width / 2, p.yPos - r.height - labelOff - (vis ? p.radius : 0));
            }
        }
    }

    protected _layoutLines(pts: DataPoint[]): void {
        const m = this.model;
        const t = m.getLineType();
        const sb = new PathBuilder();

        if (t === LineType.SPLINE) {
            if (m.chart.isInverted()) {
                this._lineContainer.dom.style.transform = `translate(0px, ${this.height}px) rotate(-90deg)`;
                this._drawCurve(DataPoint.reverse(pts), sb, false);
            } else {
                this._lineContainer.dom.style.transform = '';
                this._drawCurve(pts, sb, false);
            }
        } else if (m instanceof LineSeries && t === LineType.STEP) {
            this._drawStep(pts, sb, m.stepDir);
        } else {
            this._drawLine(pts, sb);
        }
        this._line.setPath(sb.end(this._polar));
        this._line.setStyle('stroke', m.color);
    }

    protected _drawLine(pts: DataPoint[], sb: PathBuilder): void {
        sb.move(pts[0].xPos, pts[0].yPos);

        for (let i = 1; i < pts.length; i++) {
            sb.line(pts[i].xPos, pts[i].yPos);
        }
    }

    protected _drawStep(pts: DataPoint[], sb: PathBuilder, dir: LineStepDirection): void {
        sb.move(pts[0].xPos, pts[0].yPos);

        if (dir === LineStepDirection.BACKWARD) {
            for (let i = 1; i < pts.length; i++) {
                sb.line(pts[i - 1].xPos, pts[i].yPos);
                sb.line(pts[i].xPos, pts[i].yPos);
            }
        } else {
            for (let i = 1; i < pts.length; i++) {
                sb.line(pts[i].xPos, pts[i - 1].yPos);
                sb.line(pts[i].xPos, pts[i].yPos);
            }
        }
    }

    protected _drawCurve(pts: {xPos: number, yPos: number}[], sb: PathBuilder, reversed: boolean): void {
        if (pts && pts.length > 1) {
            const d = reversed ? -1 : 1;
            const start = reversed ? pts.length - 1 : 0;
            const end = reversed ? 0 : pts.length - 1;
            let p = start;

            sb.move(pts[p].xPos, pts[p].yPos);

            if (pts.length == 2) {
                sb.line(pts[p + d].xPos, pts[p + d].yPos);
                return;
            }

            const tension = 0.23;
            const tLeft = { x: 0, y: 0 };
            const tRight = { x: 0, y: 0 };
            const v1 = { x: 0, y: 0 };
            const v2 = { x: pts[p + d].xPos - pts[p].xPos, y: pts[p + d].yPos - pts[p].yPos };
            const p1 = { x: 0, y: 0 };
            const p2 = { x: 0, y: 0 };
            const mp = { x: 0, y: 0 };
            let tan = { x: 0, y: 0 };
            let len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

            v2.x /= len;
            v2.y /= len;

            let tFactor = (pts[p + d].xPos - pts[p].xPos)
            let prevX = pts[p].xPos;
            let prevY = pts[p].yPos;

            for (p += d; p != end; p += d) {
                v1.x = -v2.x;
                v1.y = -v2.y;

                v2.x = pts[p + d].xPos - pts[p].xPos;
                v2.y = pts[p + d].yPos - pts[p].yPos;

                len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
                v2.x /= len;
                v2.y /= len;

                if (v2.x < v1.x) {
                    tan.x = v1.x - v2.x;
                    tan.y = v1.y - v2.y;
                } else {
                    tan.x = v2.x - v1.x;
                    tan.y = v2.y - v1.y;
                }

                const tlen = Math.sqrt(tan.x * tan.x + tan.y * tan.y);
                tan.x /= tlen;
                tan.y /= tlen;

                if (v1.y * v2.y >= 0) {
                    tan = { x: 1, y: 0 };
                }

                tLeft.x = -tan.x * tFactor * tension;
                tLeft.y = -tan.y * tFactor * tension;

                if (p == (d + start)) {
                    sb.q(pts[p].xPos + tLeft.x, pts[p].yPos + tLeft.y, pts[p].xPos, pts[p].yPos);
                } else {
                    p1.x = prevX + tRight.x;
                    p1.y = prevY + tRight.y;
                    p2.x = pts[p].xPos + tLeft.x;
                    p2.y = pts[p].yPos + tLeft.y;
                    mp.x = (p1.x + p2.x) / 2;
                    mp.y = (p1.y + p2.y) / 2;

                    sb.q(p1.x, p1.y, mp.x, mp.y);
                    sb.q(p2.x, p2.y, pts[p].xPos, pts[p].yPos);
                }

                tFactor = (pts[p + d].xPos - pts[p].xPos);
                tRight.x = tan.x * tFactor * tension;
                tRight.y = tan.y * tFactor * tension;
                prevX = pts[p].xPos;
                prevY = pts[p].yPos;
            }

            sb.q(prevX + tRight.x, prevY + tRight.y, pts[p].xPos, pts[p].yPos);
        }
    }
}

export class LineSeriesViewImpl extends LineSeriesView<LineSeries> {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-line-series');
    }
}