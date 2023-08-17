////////////////////////////////////////////////////////////////////////////////
// LineSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Dom } from "../../common/Dom";
import { ElementPool } from "../../common/ElementPool";
import { PathBuilder } from "../../common/PathBuilder";
import { ClipElement, PathElement, RcElement } from "../../common/RcControl";
import { SvgShapes } from "../../common/impl/SvgShape";
import { Chart } from "../../main";
import { LineType } from "../../model/ChartTypes";
import { DataPoint, IPointPos } from "../../model/DataPoint";
import { ContinuousAxis } from "../../model/axis/LinearAxis";
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
        super(doc, SeriesView.POINT_STYLE + ' rct-line-point-marker');
    }
}

export class LineContainer extends RcElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    inverted = false;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    invert(v: boolean, height: number): boolean {
        if (v !== this.inverted) {
            if (this.inverted = v) {
                this.dom.style.transform = `translate(${height}px, ${height}px) rotate(-90deg) scale(1, -1)`;
                // this.dom.style.transform = `translate(0px, ${height}px) rotate(90deg) scale(-1, 1)`;
                // this.dom.style.transform = `rotate(-90deg) scale(-1, 1)`;
            } else {
                this.dom.style.transform = ``;
            }
        }
        return this.inverted;
    }
}

export abstract class LineSeriesView<T extends LineSeriesBase> extends SeriesView<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _lineContainer: LineContainer;
    private _line: PathElement;
    private _needBelow = false;
    private _lowLine: PathElement;
    protected _lineClip: ClipElement;
    protected _upperClip: ClipElement;
    protected _lowerClip: ClipElement;
    protected _markers: ElementPool<LineMarkerView>;
    protected _polar: any;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);

        this.insertFirst(this._lineContainer = new LineContainer(doc, 'rct-line-series-lines'));
        this._lineContainer.add(this._line = new PathElement(doc, 'rct-line-series-line'));
        Dom.setImportantStyle(this._line.dom.style, 'fill', 'none');
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
        this._lineContainer.invert(this.model.chart.isInverted(), height);
        this.$_prepareBelow(width, height);
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

    private $_prepareBelow(w: number, h: number): void {
        const control = this.control;
        const series = this.model;

        if (this._needBelow = series.belowStyle && series._minValue < (series._yAxisObj as ContinuousAxis).baseValue) {
            if (!this._lowLine) {
                this._lineContainer.insertChild(this._lowLine = new PathElement(this.doc), this._line);
                Dom.setImportantStyle(this._lowLine.dom.style, 'fill', 'none');
                this._upperClip = control.clipBounds();
                this._lowerClip = control.clipBounds();
            }
            this._lowLine.setStyleOrClass(series.style);
            this._lowLine.setStyleOrClass(series.belowStyle);
            this._line.setClip(this._upperClip);
            this._lowLine.setClip(this._lowerClip);
        } else if (this._lowLine) {

        } else {

        }
    }

    private $_resetClips(w: number, h: number, base: number): void {
        let clip = this._upperClip;

        if (clip) {
            clip.setBounds(0, 0, w, base);                
        }
        if (clip = this._lowerClip) {
            clip.setBounds(0, base, w, h - base);                
        }
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
            let px: number;
            let py: number;

            if (polar) {
                const a = polar.start + i * polar.deg;
                const y = yAxis.getPosition(polar.rd, p.yGroup) * vr;

                p.xPos = polar.cx + y * Math.cos(a);
                p.yPos = polar.cy + y * Math.sin(a);
            } else {
                px = p.xPos = xAxis.getPosition(xLen, p.xValue);
                py = p.yPos = yOrg - yAxis.getPosition(yLen, p.yGroup);

                if (inverted) {
                    px = yAxis.getPosition(yLen, p.yGroup);
                    py = yOrg - xAxis.getPosition(xLen, p.xValue);
                }
            }

            if (vis) {
                this._layoutMarker(this._markers.get(i), px, py);
            }
            if (labelViews && (labelView = labelViews.get(p, 0))) {
                const r = labelView.getBBounds();

                labelView.translate(px - r.width / 2, py - r.height - labelOff - (vis ? p.radius : 0));
            }
        }
    }

    protected _layoutLines(pts: DataPoint[]): void {
        const sb = new PathBuilder();

        sb.move(pts[0].xPos, pts[0].yPos);
        this._buildLines(pts, sb, false);

        let s: string;

        this._line.setPath(s = sb.end(this._polar));
        this._line.setStyle('stroke', this.model.color);

        if (this._needBelow) {
            const axis = this.model._yAxisObj as ContinuousAxis;
            this.$_resetClips(this.width, this.height, this.height - axis.getPosition(this.height, axis.baseValue));
            this._lowLine.setPath(s);//this._line.path());
        }
    }

    protected _buildLines(pts: IPointPos[], sb: PathBuilder, reversed: boolean): void {
        const m = this.model;
        const t = m.getLineType();

        if (t === LineType.SPLINE) {
            this._drawCurve(pts, sb, reversed);
        } else if (m instanceof LineSeries && t === LineType.STEP) {
            this._drawStep(pts, sb, m.stepDir, reversed);
        } else {
            this._drawLine(pts, sb, reversed);
        }
    }

    protected _drawLine(pts: IPointPos[], sb: PathBuilder, reversed: boolean): void {
        if (reversed) {
            for (let i = pts.length - 2; i >= 0; i--) {
                sb.line(pts[i].xPos, pts[i].yPos);
            }
        } else {
            for (let i = 1; i < pts.length; i++) {
                sb.line(pts[i].xPos, pts[i].yPos);
            }
        }
    }

    protected _drawStep(pts: IPointPos[], sb: PathBuilder, dir: LineStepDirection, reversed: boolean): void {
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

    protected _drawCurve(pts: IPointPos[], sb: PathBuilder, reversed: boolean): void {
        if (pts && pts.length > 1) {
            const d = reversed ? -1 : 1;
            const start = reversed ? pts.length - 1 : 0;
            const end = reversed ? 0 : pts.length - 1;
            let p = start;

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