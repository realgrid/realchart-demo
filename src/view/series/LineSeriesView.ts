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
import { LineElement } from "../../common/impl/PathElement";
import { Shape, SvgShapes } from "../../common/impl/SvgShape";
import { Chart } from "../../model/Chart";
import { LineType } from "../../model/ChartTypes";
import { DataPoint, IPointPos } from "../../model/DataPoint";
import { ContinuousAxis } from "../../model/axis/LinearAxis";
import { LineSeries, LineSeriesBase, LineSeriesPoint, LineStepDirection } from "../../model/series/LineSeries";
import { IPointView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

export class LineMarkerView extends PathElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    point: LineSeriesPoint;
    _radius: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS);
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

export abstract class LineSeriesBaseView<T extends LineSeriesBase> extends SeriesView<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _lineContainer: LineContainer;
    private _line: PathElement;
    protected _needBelow = false;
    private _lowLine: PathElement;
    protected _upperClip: ClipElement;
    protected _lowerClip: ClipElement;
    protected _markers: ElementPool<LineMarkerView>;
    protected _polar: any;
    protected _linePts: IPointPos[];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);

        this.insertFirst(this._lineContainer = new LineContainer(doc, 'rct-line-series-lines'));
        this._lineContainer.add(this._line = new PathElement(doc, 'rct-line-series-line'));
        this._markers = new ElementPool(this._pointContainer, LineMarkerView);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    getClipContainer(): RcElement {
        return null;
    }

    protected _getPointPool(): ElementPool<RcElement> {
        return this._markers;
    }

    protected _prepareSeries(doc: Document, model: T): void {
        model instanceof LineSeries && this._prepareBelow(model);
        !this._simpleMode && this.$_prepareMarkers(model, this._visPoints as LineSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        const series = this.model;

        this._lineContainer.invert(this._inverted, height);
        this._layoutMarkers(this._visPoints as LineSeriesPoint[], width, height);
        this._layoutLines(this._visPoints as LineSeriesPoint[]);
    }

    protected _runShowEffect(firstTime: boolean): void {

        function getFrom(self: LineSeriesBaseView<any>): 'left' | 'right' | 'top' | 'bottom' {
            const reversed = self.model._xAxisObj.reversed;

            if (self._inverted) {
                return reversed ? 'top' : 'bottom';
            } else {
                return reversed ? 'right' : 'left';
            }
        }

        if (this._polar) {
            firstTime && SeriesAnimation.grow(this);
        } else {
            firstTime && SeriesAnimation.slide(this, { from: getFrom(this) });
        }
    }

    protected _doViewRateChanged(rate: number): void {
        this._layoutMarkers(this._visPoints as LineSeriesPoint[], this.width, this.height);
        this._layoutLines(this._visPoints.slice() as LineSeriesPoint[]);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _markersPerPoint(): number {
        return 1;
    }

    protected _prepareBelow(series: LineSeries): boolean {
        const control = this.control;
        let lowLine = this._lowLine;

        this._needBelow = series.belowStyle && series._minValue < series.baseValue; // series.getBaseValue(yAxis)

        if (this._needBelow) {
            if (!lowLine) {
                this._lineContainer.insertChild(lowLine = this._lowLine = new PathElement(this.doc), this._line);
                this._upperClip = control.clipBounds();
                this._lowerClip = control.clipBounds();
            }
            this._line.setClip(this._upperClip);
            lowLine.setClip(this._lowerClip);
            return true;
        } else {
            lowLine?.setClip();
            this._line.setClip();
        }
    }

    private $_resetClips(w: number, h: number, base: number, inverted: boolean): void {
        const reversed = this.model._yAxisObj.reversed;
        const x = 0;
        const y = 0;
        let clip: ClipElement;

        if (clip = this._upperClip) {
            if (inverted) {
                if (reversed) {
                    clip.setBounds(x, h - base, h, w);                
                } else {
                    clip.setBounds(x, h - w, h, w - base);                
                }
            } else {
                if (reversed) {
                    clip.setBounds(x, y + base, w, h - base);                
                } else {
                    clip.setBounds(x, y, w, base);                
                }
            }
        }
        if (clip = this._lowerClip) {
            if (this._inverted) {
                if (reversed) {
                    clip.setBounds(x, h - w, h, w - base);                
                } else {
                    clip.setBounds(x, h - base, h, w);                
                }
            } else {
                if (reversed) {
                    clip.setBounds(x, y, w, base);                
                } else {
                    clip.setBounds(x, y + base, w, h - base);                
                }
            }
        }
    }

    private $_prepareMarkers(series: T, points: LineSeriesPoint[]): void {
        const needBelow = series instanceof LineSeries && this._needBelow;
        const base = needBelow ? series.baseValue : NaN;
        const marker = series.marker;
        const sts = [marker.style, null];

        if (this._pointContainer.visible = (marker.visible && !series._simpleMode)) {
            const mpp = this._markersPerPoint();
            const count = points.length;
    
            this._markers.prepare(count * mpp, (mv, i) => {
                const n = i % count;
                const p = points[n];

                if (!p.isNull) {
                    mv.point = p;
                    sts[1] = needBelow && p.yValue < base ? series.belowStyle : null;
                    this._setPointStyle(mv, series, p, sts);
                }
            });
        } else {
            this._markers.prepare(0);
        }
    }

    protected _layoutMarker(mv: LineMarkerView, x: number, y: number): void {
        const series = this.model;
        const p = mv.point as LineSeriesPoint;
        const rd = mv._radius = series.getRadius(p);

        SvgShapes.setShape(mv, series.getShape(p), rd);
        mv.translate(x -= rd, y -= rd);
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

        for (let i = 0, cnt = pts.length; i < cnt; i++) {
            const p = pts[i];
            let px: number;
            let py: number;

            if (polar) {
                const a = polar.start + i * polar.deg;
                const y = yAxis.getPosition(polar.rd, p.yGroup) * vr;

                px = p.xPos = polar.cx + y * Math.cos(a);
                py = p.yPos = polar.cy + y * Math.sin(a);
            } else {
                px = p.xPos = xAxis.getPosition(xLen, p.xValue);
                py = p.yPos = yOrg - yAxis.getPosition(yLen, p.yGroup);

                if (inverted) {
                    px = yAxis.getPosition(yLen, p.yGroup);
                    py = yOrg - xAxis.getPosition(xLen, p.xValue);
                }
            }

            const mv = this._markers.get(i);
            const lv = labelViews && labelViews.get(p, 0);

            if (mv && mv.setVisible(!p.isNull)) {
                this._layoutMarker(mv, px, py);

                if (lv) {
                    const r = lv.getBBounds();

                    lv.visible = true;
                    lv.translate(px - r.width / 2, py - r.height - labelOff - (vis ? mv._radius : 0));
                }
            } else if (lv) {
                lv.visible = false;
            }
        }
    }

    protected _layoutLines(pts: DataPoint[]): void {
        const series = this.model;
        const needBelow = series instanceof LineSeries && this._needBelow;
        const sb = new PathBuilder();
        let i = 0;
        let s: string;

        while (i < pts.length) {
            const p = pts[i++];

            if (!p.isNull) {
                sb.move(p.xPos, p.yPos);
                break;
            }
        }

        this._linePts = pts;

        if (i < pts.length - 1) {
            this._buildLines(pts, i, sb);
            this._line.setPath(s = sb.end(this._polar));
    
            this._line.clearStyleAndClass();
            this._line.setStyle('stroke', series.color);
            this._line.addStyleOrClass(series.style);
            Dom.setImportantStyle(this._line.dom.style, 'fill', 'none');
    
            if (needBelow) {
                const axis = series._yAxisObj as ContinuousAxis;
                const base = series.baseValue;// series.getBaseValue(axis);
                
                if (this._inverted) {
                    this.$_resetClips(this.width, this.height, axis.getPosition(this.width, base), true);
                } else {
                    this.$_resetClips(this.width, this.height, this.height - axis.getPosition(this.height, base), false);
                }
    
                this._lowLine.setPath(s);//this._line.path());
    
                this._lowLine.clearStyleAndClass();
                this._lowLine.setStyle('stroke', series.color);
                this._lowLine.addStyleOrClass(series.style);
                this._lowLine.addStyleOrClass(series.belowStyle);
                Dom.setImportantStyle(this._lowLine.dom.style, 'fill', 'none');
            }
        }
    }

    protected _buildLines(pts: IPointPos[], from: number, sb: PathBuilder): void {
        const m = this.model;
        const t = m.getLineType();

        if (t === LineType.SPLINE) {
            this._drawCurve(pts, from - 1, sb);
        } else if (m instanceof LineSeries && t === LineType.STEP) {
            this._drawStep(pts, from, sb, m.stepDir);
        } else {
            this._drawLine(pts, from, sb);
        }
    }

    protected _drawLine(pts: IPointPos[], from: number, sb: PathBuilder): void {
        const len = pts.length;
        let i = from;

        while (i < len) {
            if (pts[i].isNull) {
                do {
                    i++;
                } while (i < len && pts[i].isNull);

                if (i < len) {
                    sb.move(pts[i].xPos, pts[i].yPos);
                    i++;
                }
            } else {
                sb.line(pts[i].xPos, pts[i].yPos);
                i++;
            }
        }
    }
    
    protected _drawCurve(pts: IPointPos[], from: number, sb: PathBuilder): void {
        const len = pts.length;
        let i: number;

        if (pts && pts.length > 1) {
            let start = from;

            i = from;
            while (i < len) {
                if (pts[i].isNull) {
                    if (i - 1 > start) {
                        this.$_drawCurve(pts, start, i - 1, sb);
                    }
                    do {
                        i++;
                    } while (i < len && pts[i].isNull);

                    start = i;

                    if (i < len) {
                        sb.move(pts[i].xPos, pts[i].yPos);
                        i++;
                    }
                } else {
                    i++;
                }
            }
            if (i - 1 > start) {
                this.$_drawCurve(pts, start, i - 1, sb);
            }
        }
    }

    private $_drawCurve(pts: IPointPos[], start: number, end: number, sb: PathBuilder): void {
        let p = start;

        if (Math.abs(end - start) === 1) {
            sb.line(pts[p + 1].xPos, pts[p + 1].yPos);
            return;
        }

        const tension = 0.23;
        const tLeft = { x: 0, y: 0 };
        const tRight = { x: 0, y: 0 };
        const v1 = { x: 0, y: 0 };
        const v2 = { x: pts[p + 1].xPos - pts[p].xPos, y: pts[p + 1].yPos - pts[p].yPos };
        const p1 = { x: 0, y: 0 };
        const p2 = { x: 0, y: 0 };
        const mp = { x: 0, y: 0 };
        let tan = { x: 0, y: 0 };
        let len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

        v2.x /= len;
        v2.y /= len;

        let tFactor = (pts[p + 1].xPos - pts[p].xPos)
        let prevX = pts[p].xPos;
        let prevY = pts[p].yPos;

        for (++p; p != end; p++) {
            v1.x = -v2.x;
            v1.y = -v2.y;

            v2.x = pts[p + 1].xPos - pts[p].xPos;
            v2.y = pts[p + 1].yPos - pts[p].yPos;

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

            if (p === start + 1) {
                sb.quad(pts[p].xPos + tLeft.x, pts[p].yPos + tLeft.y, pts[p].xPos, pts[p].yPos);
            } else {
                p1.x = prevX + tRight.x;
                p1.y = prevY + tRight.y;
                p2.x = pts[p].xPos + tLeft.x;
                p2.y = pts[p].yPos + tLeft.y;
                mp.x = (p1.x + p2.x) / 2;
                mp.y = (p1.y + p2.y) / 2;

                sb.quad(p1.x, p1.y, mp.x, mp.y);
                sb.quad(p2.x, p2.y, pts[p].xPos, pts[p].yPos);
            }

            tFactor = (pts[p + 1].xPos - pts[p].xPos);
            tRight.x = tan.x * tFactor * tension;
            tRight.y = tan.y * tFactor * tension;
            prevX = pts[p].xPos;
            prevY = pts[p].yPos;
        }

        sb.quad(prevX + tRight.x, prevY + tRight.y, pts[p].xPos, pts[p].yPos);
    }

    protected _drawStep(pts: IPointPos[], from: number, sb: PathBuilder, dir: LineStepDirection): void {
        const len = pts.length;
        let i = from;

        while (i < len) {
            if (pts[i].isNull) {
                do {
                    i++;
                } while (i < len && pts[i].isNull);

                if (i < len) {
                    sb.move(pts[i].xPos, pts[i].yPos);
                    i++;
                }
            } else {
                if (dir === LineStepDirection.BACKWARD) {
                    sb.line(pts[i - 1].xPos, pts[i].yPos);
                    sb.line(pts[i].xPos, pts[i].yPos);
                } else {
                    sb.line(pts[i].xPos, pts[i - 1].yPos);
                    sb.line(pts[i].xPos, pts[i].yPos);
                }
                i++
            }
        }
    }
}

// class MarkerView extends RcElement {

//     //-------------------------------------------------------------------------
//     // constructor
//     //-------------------------------------------------------------------------
//     private _size: number;
//     private _shape: string;
//     private _line: LineElement;
//     private _marker: PathElement;

//     //-------------------------------------------------------------------------
//     // constructor
//     //-------------------------------------------------------------------------
//     constructor(doc: Document, size: number) {
//         super(doc, SeriesView.LEGEND_MARKER);

//         this._size = size;
//         this.add(this._line = new LineElement(doc));
//         this._line.setHLine(size / 2, 0, size * 2);
//         this.add(this._marker = new PathElement(doc));
//         this._marker.translate(size / 2, 0);
//         this.setShape(Shape.CIRCLE, 12);
//     }

//     //-------------------------------------------------------------------------
//     // methods
//     //-------------------------------------------------------------------------
//     setShape(value: string, size: number): void {
//         if (value !== this._shape || size !== this._size) {
//             this._shape = value;
//             SvgShapes.setShape(this._marker, value as any, (this._size = size) / 2);   
//             this._marker.translate(size / 2, 0);
//             this._line.setHLine(size / 2, 0, size * 2);
//         }
//     }
// }

export class LineSeriesView extends LineSeriesBaseView<LineSeries> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly CLASS = 'rct-line-series';

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, LineSeriesView.CLASS);
        //010-6669-7701
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}