////////////////////////////////////////////////////////////////////////////////
// LineSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { cos, sin } from "../../common/Common";
import { Dom } from "../../common/Dom";
import { ElementPool } from "../../common/ElementPool";
import { PathBuilder } from "../../common/PathBuilder";
import { ClipRectElement, LayerElement, PathElement, RcElement } from "../../common/RcControl";
import { Align, FILL, IValueRange, PI_2, SVGStyleOrClass, _undef } from "../../common/Types";
import { SvgShapes } from "../../common/impl/SvgShape";
import { Axis } from "../../model/Axis";
import { Chart } from "../../model/Chart";
import { LineType } from "../../model/ChartTypes";
import { DataPoint, IPointPos } from "../../model/DataPoint";
import { PointItemPosition } from "../../model/Series";
import { ContinuousAxis } from "../../model/axis/LinearAxis";
import { LinePointLabel, LineSeries, LineSeriesBase, LineSeriesPoint, LineStepDirection, PointLine } from "../../model/series/LineSeries";
import { LineLegendMarkerView } from "../../model/series/legend/LineLegendMarkerView";
import { LegendItemView } from "../LegendView";
import { IPointView, PointContainer, SeriesView } from "../SeriesView";
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

export class LineContainer extends PointContainer {
}

export abstract class LineSeriesBaseView<T extends LineSeriesBase> extends SeriesView<T> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _lineContainer: LineContainer;
    private _line: PathElement;
    protected _needBelow = false;
    private _lowLine: PathElement;
    protected _upperClip: ClipRectElement;
    protected _lowerClip: ClipRectElement;
    protected _markers: ElementPool<LineMarkerView>;
    private _rangeLines: ElementPool<PathElement>;
    private _rangeClips: ClipRectElement[] = [];
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
        return this._lineContainer;
    }

    protected _getPointPool(): ElementPool<RcElement> {
        return this._markers;
    }

    needDecoreateLegend(): boolean {
        return true;
    }

    decoreateLegend(legendView: LegendItemView): void {
        const cs = getComputedStyle(this._line.dom);
        (legendView._marker as LineLegendMarkerView)._line.setStyle('strokeWidth', cs.strokeWidth);
        (legendView._marker as LineLegendMarkerView)._line.setStyle('strokeDasharray', cs.strokeDasharray);
    }

    protected _prepareSeries(doc: Document, model: T): void {
        model instanceof LineSeries && this._prepareBelow(model);
        this._prepareRanges(model, model._runRanges);
        !this._simpleMode && this.$_prepareMarkers(model, this._visPoints as LineSeriesPoint[]);
    }

    protected _renderSeries(width: number, height: number): void {
        this._lineContainer.invert(this._inverted, height);
        this._layoutMarkers(this._visPoints as LineSeriesPoint[], width, height);
        this.model.prepareLines(this._visPoints as LineSeriesPoint[]);
    }

    protected _doAfterLayout(): void {
        this._layoutLines();
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
            firstTime && SeriesAnimation.reveal(this, { from: getFrom(this) });
        }
    }

    protected _doViewRateChanged(rate: number): void {
        this._layoutMarkers(this._visPoints as LineSeriesPoint[], this.width, this.height);
        this._layoutLines();
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

        this._needBelow = series.belowStyle && series._minY < series.baseValue; // series.getBaseValue(yAxis)

        if (this._needBelow) {
            if (!lowLine) {
                this._lineContainer.insertChild(lowLine = this._lowLine = new PathElement(this.doc, 'rct-line-series-line rct-line-series-line-below'), this._line);
                this._upperClip = control.clipBounds();
                this._lowerClip = control.clipBounds();
                this._upperClip.setAttr(RcElement.ASSET_KEY, '1');
                this._lowerClip.setAttr(RcElement.ASSET_KEY, '1');
            }
            this._line.setClip(this._upperClip);
            lowLine.setClip(this._lowerClip);
            return true;
        } else {
            lowLine?.setClip();
            this._line.setClip();
            this._upperClip?.remove();
            this._lowerClip?.remove();
        }
    }

    protected _prepareRanges(model: T, ranges: IValueRange[]    ): void {
        const clips = this._rangeClips;
        let lines = this._rangeLines;

        if (!ranges) {
            if (lines) {
                lines.freeAll();
                clips.forEach(c => c.remove());
                clips.length = 0; 
            }
        } else {
            if (!lines) {
                lines = this._rangeLines = new ElementPool(this._lineContainer, PathElement);
            }
            lines.prepare(ranges.length);

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

    private $_resetClips(w: number, h: number, base: number, inverted: boolean): void {
        const reversed = this.model._yAxisObj.reversed;
        const x = 0;
        const y = 0;
        let clip: ClipRectElement;

        if (clip = this._upperClip) {
            if (inverted) {
                if (reversed) {
                    clip.setBounds(x, -base, h, w);                
                } else {
                    clip.setBounds(x, -w, h, w - base);                
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
                    clip.setBounds(x, -w, h, w);       
                } else {
                    clip.setBounds(x, -base, h, w - base);                
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

        this._pointContainer.setStyle('opacity', marker.visible ? '1' : '0');

        if (this._pointContainer.setVis(!series._simpleMode)) {
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

    protected _layoutMarker(mv: LineMarkerView, markerStyle: SVGStyleOrClass, x: number, y: number): void {
        const series = this.model;
        const p = mv.point as LineSeriesPoint;
        const rd = mv._radius = series.getRadius(p);

        markerStyle && mv.internalSetStyleOrClass(markerStyle);
        SvgShapes.setShape(mv, series.getShape(p), rd, rd);
        mv.translate(x -= rd, y -= rd);
    }

    protected _layoutMarkers(pts: LineSeriesPoint[], width: number, height: number): void {
        const series = this.model;
        const markerStyle = series.marker.style;
        const inverted = this._inverted;
        const needClip = series.needClip(false);
        const vr = this._getViewRate();
        const vis = series.marker.visible;
        const labels = series.pointLabel as LinePointLabel;
        const labelPos = labels.position;
        const labelAlign = labels.align;
        const alignOff = labels.getAlignOffset();
        const textAlign = labels.textAlign;
        const labelOff = labels.getOffset();
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj as Axis;
        const yAxis = series._yAxisObj;
        const polar = this._polar = (series.chart as Chart).body.getPolar(xAxis);
        const polared = !!polar;
        const yLen = inverted ? width : height;
        const xLen = polar ? polar.rd * PI_2 : inverted ? height : width;
        const yOrg = inverted ? 0 : height;

        pts.forEach((p, i) => {
            // const p = pts[i];
            let px: number;
            let py: number;

            if (polar) {
                const a = polar.start + xAxis.getPosition(xLen, p.xValue);
                const y = yAxis.getPosition(polar.rd, p.yGroup) * vr;

                px = p.xPos = polar.cx + y * cos(a);
                py = p.yPos = polar.cy + y * sin(a);
            } else {
                px = p.xPos = xAxis.getPosition(xLen, p.xValue);
                py = p.yPos = yOrg - yAxis.getPosition(yLen, p.yGroup);

                if (inverted) {
                    px = yAxis.getPosition(yLen, p.yGroup);
                    py = height - xAxis.getPosition(xLen, p.xValue);
                }
            }

            const mv = this._markers.get(i);
            const lv = labelViews && labelViews.get(p, 0);

            if (mv && mv.setVis(!p.isNull && (polared || !needClip || px >= 0 && px <= width && py >= 0 && py <= height))) {
                this._layoutMarker(mv, markerStyle, px, py);

                if (lv) {
                    const r = lv.getBBounds();

                    lv.visible = true;
                    lv.setContrast(null);

                    switch (labelPos) {
                        case PointItemPosition.INSIDE:
                            py -= r.height / 2 + labelOff;
                            break;
                        case PointItemPosition.FOOT:
                            py += labelOff + (vis ? mv._radius : 0);                            
                            break;
                        default:
                            py -= r.height + labelOff + (vis ? mv._radius : 0);
                            break;
                    }
                    switch (labelAlign) {
                        case Align.LEFT:
                            px -= r.width + (vis ? mv._radius : 0) + alignOff;
                            break;
                        case Align.RIGHT:
                            px += (vis ? mv._radius : 0) + alignOff;
                            break;
                        default:
                            px -= r.width / 2 + alignOff;
                            break;
                    }
                    lv.layout(textAlign).translate(px, py);
                }
            } else if (lv) {
                lv.setVis(false);
            }
        })
    }

    protected _layoutLines(): void {
        const series = this.model;

        if (!this._lineContainer.setVis(series._lines.length > 0)) {
            return; 
        }

        const w = this.width;
        const h = this.height;
        const inverted = this._inverted;
        const needBelow = series instanceof LineSeries && this._needBelow;
        const s = this._buildLines2(series._lines);

        if (series._runRanges) {
            this._rangeLines.forEach((line, i) => {
                const range = series._runRanges[i];

                line.setPath(s);
                line.internalClearStyleAndClass();
                line.internalSetStyle('stroke', range.color);
                line.internalSetStyleOrClass(range.style);
                Dom.setImportantStyle(line.dom.style, FILL, 'none');
                line.setClip(this._rangeClips[i]);
                this._clipRange(w, h, series._runRangeValue, range, this._rangeClips[i], inverted);
            })
        } else {
            const line = this._line;

            line.setPath(s);
            line.internalClearStyleAndClass();
            line.internalSetStyle('stroke', series.color);
            line.internalSetStyleOrClass(series.style);
            Dom.setImportantStyle(line.dom.style, FILL, 'none');
        }

        if (needBelow) {
            const lowLine = this._lowLine;
            const axis = series._yAxisObj as ContinuousAxis;
            const base = series.baseValue;// series.getBaseValue(axis);
            
            if (inverted) {
                this.$_resetClips(w, h, axis.getPosition(w, base), true);
            } else {
                this.$_resetClips(w, h, h - axis.getPosition(h, base), false);
            }

            lowLine.setPath(s);
            lowLine.internalClearStyleAndClass();
            lowLine.internalSetStyle('stroke', series.color);
            lowLine.internalSetStyleOrClass(series.style);
            lowLine.internalSetStyleOrClass(series.belowStyle);
            Dom.setImportantStyle(lowLine.dom.style, FILL, 'none');
        }
    }

    protected _buildLine2(line: PointLine, t: LineType, connected: boolean, sb: PathBuilder): void {
        const m = this.model;

        if (t === LineType.SPLINE) {
            this._drawCurve2(line, connected, sb);
        } else if (m instanceof LineSeries && t === LineType.STEP) {
            this._drawStep2(line, connected, sb, connected ? m.backDir() : m.stepDir);
        } else {
            this._drawLine2(line, connected , sb);
        }
    }

    protected _buildLines2(lines: PointLine[]): string {
        const m = this.model;
        const t = m.getLineType();
        const sb = new PathBuilder();

        if (t === LineType.SPLINE) {
            this._drawCurves(lines, sb);
        } else if (m instanceof LineSeries && t === LineType.STEP) {
            this._drawSteps(lines, sb, m.stepDir);
        } else {
            this._drawLines(lines, sb);
        }
        return sb.end();
    }

    private _drawLine2(pts: PointLine, connected: boolean, sb: PathBuilder): void {
        if (pts.length > 1) {
            sb.moveOrLine(connected, pts[0].xPos, pts[0].yPos);
            for (let i = 1; i < pts.length; i++) {
                sb.line(pts[i].xPos, pts[i].yPos);
            }
        }
    }

    private _drawLines(lines: PointLine[], sb: PathBuilder): void {
        lines.forEach(line => this._drawLine2(line, false, sb));
    }

    private _drawStep2(pts: PointLine, connected: boolean, sb: PathBuilder, dir: LineStepDirection): void {
        if (pts.length > 1) {
            sb.moveOrLine(connected, pts[0].xPos, pts[0].yPos);
            for (let i = 1; i < pts.length; i++) {
                if (dir === LineStepDirection.BACKWARD) {
                    sb.line(pts[i - 1].xPos, pts[i].yPos);
                    sb.line(pts[i].xPos, pts[i].yPos);
                } else {
                    sb.line(pts[i].xPos, pts[i - 1].yPos);
                    sb.line(pts[i].xPos, pts[i].yPos);
                }
            }
        }
    }

    private _drawSteps(lines: PointLine[], sb: PathBuilder, dir: LineStepDirection): void {
        lines.forEach(line => this._drawStep2(line, false, sb, dir));
    }

    private _drawCurve2(pts: PointLine, connected: boolean, sb: PathBuilder): void {
        if (pts.length > 1) {
            sb.moveOrLine(connected, pts[0].xPos, pts[0].yPos);
            this.$_drawCurve(pts, 0, pts.length - 1, sb);
        }
    }

    private _drawCurves(lines: PointLine[], sb: PathBuilder): void {
        lines.forEach(line => this._drawCurve2(line, false, sb));
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

    protected _buildAreas(lines: PointLine[], t1: LineType, t2?: LineType): string {
        const sb = new PathBuilder();

        t2 = t2 || t1;

        for (let i = 0; i < lines.length; i += 2) {
            const line = lines[i];
            const line2 = lines[i + 1];

            this._buildLine2(line, t1, false, sb);
            this._buildLine2(line2, t2, true, sb);
        }
        return sb.end(true);
    }
}

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
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _legendColorProp(): string {
        return 'stroke';
    }
}