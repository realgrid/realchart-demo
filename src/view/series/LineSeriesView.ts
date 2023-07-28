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
import { DataPoint } from "../../model/DataPoint";
import { LineSeries, LineSeriesBase, LineSeriesPoint, LineStepDirection, LineType } from "../../model/series/LineSeries";
import { SeriesView } from "../SeriesView";

export class LineMarkerView extends PathElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: LineSeriesPoint;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-line-series-marker');
    }
}

export abstract class LineSeriesView<T extends LineSeriesBase> extends SeriesView<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _lineContainer: RcElement;
    private _line: PathElement;
    protected _markers: ElementPool<LineMarkerView>;
    protected _polar: any;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);

        this.insertFirst(this._lineContainer = new RcElement(doc, 'rct-line-series-lines'));
        this._lineContainer.add(this._line = new PathElement(doc, 'rct-line-series-line'));
        this._markers = new ElementPool(this._pointContainer, LineMarkerView);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: T): void {
        this.$_prepareMarkser(model._visPoints as LineSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        this._layoutMarkers(this.model._visPoints as LineSeriesPoint[], width, height);
        this._layoutLines(this.model._visPoints as LineSeriesPoint[]);
    }

    protected _afterRender(): void {
        // const cr = this.clipRect(0, -this.height / 2, this.width, this.height * 2);
        
        // cr.dom.firstElementChild.animate([
        //     { width: '0'},
        //     { width: this.width + 'px'}
        // ], {
        //     duration: 1000,
        //     fill: 'none'
        // })?.addEventListener('finish', () => {
        //     this.control.removeDef(cr);
        // });
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _markersPerPoint(): number {
        return 1;
    }

    private $_prepareMarkser(points: LineSeriesPoint[]): void {
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
        const polar = this._polar = (series.chart as Chart).body.getPolar(series);
        const vis = series.marker.visible;
        const labels = series.pointLabel;
        const labelVis = labels.visible;
        const labelOff = labels.offset;
        const labelViews = this._labelContainer;
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj;
        const yOrg = height;

        for (let i = 0, cnt = pts.length; i < cnt; i++) {
            const p = pts[i];

            if (polar) {
                const a = polar.start + i * polar.deg;
                const y = yAxis.getPosition(polar.rd, p.yGroup);

                p.xPos = polar.cx + y * Math.cos(a);
                p.yPos = polar.cy + y * Math.sin(a);
            } else {
                p.xPos = xAxis.getPosition(width, p.xValue);
                p.yPos = yOrg - yAxis.getPosition(height, p.yGroup);
            }

            if (vis) {
                this._layoutMarker(this._markers.get(i), p.xPos, p.yPos);
            }
            if (labelVis) {
                const view = labelViews.get(p, 0);

                if (view) {
                    const r = view.getBBounds();

                    view.translate(p.xPos - r.width / 2, p.yPos - r.height - labelOff - (vis ? p.radius : 0));
                }
            }
        }
    }

    protected _layoutLines(pts: DataPoint[]): void {
        const m = this.model;
        const t = m.getLineType();
        const sb = new PathBuilder();

        sb.move(pts[0].xPos, pts[0].yPos);
        if (t === LineType.SPLINE) {
            this._drawCurve(pts, sb, 'yPos', false);
        } else if (m instanceof LineSeries && t === LineType.STEP) {
            this._drawStep(pts, sb, 'yPos', m.stepDir);
        } else {
            this._drawLine(pts, sb, 'yPos');
        }
        this._line.setPath(sb.end(this._polar));
        this._line.setStyle('stroke', m.color);
    }

    protected _drawLine(pts: DataPoint[], sb: PathBuilder, yProp: string): void {
        for (let i = 1; i < pts.length; i++) {
            sb.line(pts[i].xPos, pts[i][yProp]);
        }
    }

    protected _drawStep(pts: DataPoint[], sb: PathBuilder, yProp: string, dir: LineStepDirection): void {
        if (dir === LineStepDirection.BACKWARD) {
            for (let i = 1; i < pts.length; i++) {
                sb.line(pts[i - 1].xPos, pts[i][yProp]);
                sb.line(pts[i].xPos, pts[i][yProp]);
            }
        } else {
            for (let i = 1; i < pts.length; i++) {
                sb.line(pts[i].xPos, pts[i - 1][yProp]);
                sb.line(pts[i].xPos, pts[i][yProp]);
            }
        }
    }

    protected _drawCurve(pts: DataPoint[], sb: PathBuilder, yProp: string, reversed = false): void {
        if (pts && pts.length > 1) {
            const d = reversed ? -1 : 1;
            const start = reversed ? pts.length - 1 : 0;
            const end = reversed ? 0 : pts.length - 1;
            let p = start;

            if (pts.length == 2) {
                sb.move(pts[p].xPos, pts[p][yProp]);
                sb.line(pts[p + d].xPos, pts[p + d][yProp]);
                return;
            }

            const tension = 0.23;
            const tLeft = { x: 0, y: 0 };
            const tanRight = { x: 0, y: 0 };
            const v1 = { x: 0, y: 0 };
            const v2 = { x: pts[p + d].xPos - pts[p].xPos, y: pts[p + d][yProp] - pts[p][yProp] };
            const p1 = { x: 0, y: 0 };
            const p2 = { x: 0, y: 0 };
            const mp = { x: 0, y: 0 };
            let tan = { x: 0, y: 0 };
            let len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

            v2.x /= len;
            v2.y /= len;

            let tFactor = pts[p + d].xPos - pts[p].xPos;
            let prevX = pts[p].xPos;
            let prevY = pts[p][yProp];

            for (p += d; p != end; p += d) {
                v1.x = -v2.x;
                v1.y = -v2.y;

                v2.x = pts[p + d].xPos - pts[p].xPos;
                v2.y = pts[p + d][yProp] - pts[p][yProp];

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
                    sb.q(pts[p].xPos + tLeft.x, pts[p][yProp] + tLeft.y, pts[p].xPos, pts[p][yProp]);
                } else {
                    p1.x = prevX + tanRight.x;
                    p1.y = prevY + tanRight.y;
                    p2.x = pts[p].xPos + tLeft.x;
                    p2.y = pts[p][yProp] + tLeft.y;
                    mp.x = (p1.x + p2.x) / 2;
                    mp.y = (p1.y + p2.y) / 2;

                    sb.q(p1.x, p1.y, mp.x, mp.y);
                    sb.q(p2.x, p2.y, pts[p].xPos, pts[p][yProp]);
                }

                tFactor = pts[p + d].xPos - pts[p].xPos;
                tanRight.x = tan.x * tFactor * tension;
                tanRight.y = tan.y * tFactor * tension;
                prevX = pts[p].xPos;
                prevY = pts[p][yProp];
            }

            sb.q(prevX + tanRight.x, prevY + tanRight.y, pts[p].xPos, pts[p][yProp]);
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