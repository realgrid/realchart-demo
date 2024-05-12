////////////////////////////////////////////////////////////////////////////////
// LineSeriesView.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { cos, pickNum, sin } from "../../common/Common";
import { Dom } from "../../common/Dom";
import { ElementPool } from "../../common/ElementPool";
import { PathBuilder } from "../../common/PathBuilder";
import { IPoint } from "../../common/Point";
import { ClipRectElement, PathElement, RcElement } from "../../common/RcControl";
import { Align, FILL, IValueRange, PI_2, SVGStyleOrClass, _undef } from "../../common/Types";
import { LabelElement } from "../LabelElement";
import { SvgShapes } from "../../common/impl/SvgShape";
import { Axis } from "../../model/Axis";
import { Chart } from "../../model/Chart";
import { LineType } from "../../model/ChartTypes";
import { PointItemPosition } from "../../model/Series";
import { ContinuousAxis } from "../../model/axis/LinearAxis";
import { IPointPos, LinePointLabel, LineSeries, LineSeriesBase, LineSeriesMarker, LineSeriesPoint, LineStepDirection, PointLine } from "../../model/series/LineSeries";
import { LineLegendMarkerView } from "../../model/series/legend/LineLegendMarkerView";
import { LegendItemView } from "../LegendView";
import { IPointView, MarkerSeriesPointView, PointContainer, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

export class LineMarkerView extends MarkerSeriesPointView implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _radius: number;
    private _saveRadius: number;
    index: number;
    _t: string;
    // _started = false;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    beginHover(series: LineSeriesBaseView<LineSeries>, focused: boolean): void {
        // if (this._started) debugger;
        // this._started = true;
        //if (focused) {
            this._saveRadius = this._radius;
        //}
    }

    setHoverRate(series: LineSeriesBaseView<LineSeries>, focused: boolean, rate: number): void {
        const p = this.point as LineSeriesPoint;
        const r = (+series.model.marker.hoverScale || 1.8) - 1;
        let rd = this._radius;

        if (focused) {
            if (!isNaN(rate)) {
                rd = this._radius = this._saveRadius * (1 + rate * r);
            }
        } else {
            rd = this._radius = this._saveRadius * (1 + r - (isNaN(rate) ? r : r * rate));
        }

        SvgShapes.setShape(this, series.model.getShape(p), rd, rd);
     
        if (this.index > 0) {
            this.trans(p['px2'] - rd, p['py2'] - rd);
        } else {
            this.trans(p.xPos - rd, p.yPos - rd);
        }
    }

    endHover(series: LineSeriesBaseView<LineSeries>, focused: boolean): void {
        // this._started = false;
        //if (focused) {
            this._radius = this._saveRadius;
        //}
    }

    getTooltipPos(): IPoint {
        return { x: this.point.xPos, y: this.point.yPos };
    }

    override distance(rd: number, x: number, y: number): number {
        const px = this.index === 0 ? this.point.xPos : (this.point as any).px2;
        const py = this.index === 0 ? this.point.yPos : (this.point as any).py2;
        return this.point.isNull ? Number.MAX_VALUE : Math.sqrt((px - x) ** 2 + (py - y) ** 2) - rd;
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
    override getClipContainer(): RcElement {
        return this._lineContainer;
    }

    protected _getPointPool(): ElementPool<RcElement> {
        return this._markers;
    }

    override needDecoreateLegend(): boolean {
        return true;
    }

    override decoreateLegend(legendView: LegendItemView): void {
        const cs = getComputedStyle(this._line.dom);
        const marker = legendView._marker as LineLegendMarkerView;

        marker._line.setStyle('strokeWidth', cs.strokeWidth);
        if (marker._shape) {
            marker._marker.internalSetStyles(this.model.marker.style);
            // marker 오른쪽 line이 표시되지 않을 수 있다.
            marker._line.setStyle('strokeDasharray', '');
        } else {
            marker._line.setStyle('strokeDasharray', cs.strokeDasharray);
        }
    }

    protected _prepareSeries(doc: Document, model: T): void {
        model instanceof LineSeries && this._prepareBelow(model);
        !this._simpleMode && this.$_prepareMarkers(model, this._visPoints as LineSeriesPoint[]);
    }

    protected override _prepareViewRanges(model: T): void {
        super._prepareViewRanges(model);
        this._prepareRanges(model, model._runRanges);
    }

    protected _renderSeries(width: number, height: number): void {
        this._lineContainer.invert(this._inverted, height);
        this._layoutMarkers(this._visPoints as LineSeriesPoint[], width, height);
        this.model.prepareLines(this._visPoints as LineSeriesPoint[]);
    }

    protected override _doAfterLayout(): void {
        this._layoutLines();
    }

    protected override _runShowEffect(firstTime: boolean): void {

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

    protected override _doViewRateChanged(rate: number): void {
        this._layoutMarkers(this._visPoints as LineSeriesPoint[], this.width, this.height);
        this._layoutLines();
    }

    override getPointsAt(axis: Axis, pos: number): IPointView[] {
        return [];
    }

    getNearest(x: number, y: number): {pv: IPointView, dist: number} {
        const rd = this.model.marker.radius;
        const pv = this._markers._internalItems().reduce((s, c) => s.distance(rd, x, y) < c.distance(rd, x, y) ? s : c);
        return { pv, dist: pv.distance(rd, x, y) };
    }

    getHintDistance(): number {
        return this.model.marker.hintDistance;
    }

    canHover(dist: number, pv: LineSeriesMarker, hint: number): boolean {
        return dist <= this.model.marker.radius + hint;
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

        this._needBelow = series.belowStyle && series._minY < series.getBaseValue(series._yAxisObj);

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

    protected _prepareRanges(model: T, ranges: IValueRange[]): void {
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
        const base = needBelow ? series.getBaseValue(series._yAxisObj) : NaN;
        const marker = series.marker;
        const sts = [marker.style, null];

        // this._pointContainer.setStyle('opacity', marker.visible ? '1' : '0');

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
                mv.point = p;
                mv.index = i < count ? 0 : 1;
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
        mv.setPos(x, y);
        mv.trans(x -= rd, y -= rd);
    }

    protected _layoutMarkers(pts: LineSeriesPoint[], width: number, height: number): void {
        const series = this.model;
        const marker = series.marker;
        const markerStyle = marker.style;
        const inverted = this._inverted;
        const needClip = series.needClip(false);
        const gr = this._getGrowRate();
        const vis = marker.visible;
        const fVis = marker.firstVisible;
        const lVis = marker.lastVisible;
        const labels = series.pointLabel as LinePointLabel;
        const labelPos = labels.position;
        const labelAlign = labels.align;
        const alignOff = labels.getAlignOffset();
        const textAlign = labels.textAlign;
        const labelOff = labels.getOffset();
        const labelViews = this._labelViews();
        const xAxis = series._xAxisObj as Axis;
        const yAxis = series._yAxisObj as Axis;
        const polar = this._polar = (series.chart as Chart).body.getPolar(xAxis);
        const polared = !!polar;
        const yLen = yAxis.prev(inverted ? width : height);
        const xLen = xAxis.prev(polar ? polar.rd * PI_2 : inverted ? height : width);
        const yOrg = inverted ? 0 : height;
        const count = pts.length;

        pts.forEach((p, i) => {
            // const p = pts[i];
            let px: number;
            let py: number;

            if (polar) {
                const a = polar.start + xAxis.getPos(xLen, p.xValue);
                const y = yAxis.getPos(polar.rd, p.yGroup) * gr;

                px = p.px = polar.cx + y * cos(a);
                py = p.py = polar.cy + y * sin(a);
            } else {
                px = p.px = xAxis.getPos(xLen, p.xValue);
                py = p.py = yOrg - yAxis.getPos(yLen, p.yGroup);

                if (inverted) {
                    px = yAxis.getPos(yLen, p.yGroup);
                    py = height - xAxis.getPos(xLen, p.xValue);
                }
            }
            p.xPos = px;
            p.yPos = py;

            const mv = this._markers.get(i);
            const lv = labelViews && labelViews.get(p, 0);

            if (mv && mv.setVis(!p.isNull && (polared || !needClip || px >= 0 && px <= width && py >= 0 && py <= height))) {
                this._layoutMarker(mv, markerStyle, px, py);
                // current visible
                const cv = (i == 0 && fVis != void 0) ? fVis
                    : (i == count - 1 && lVis != void 0) ? lVis
                    : vis;
                mv.setStyle('opacity', cv ? '1' : '0');

                if (lv) {
                    const r = lv.getBBox();
                    const rd = mv._radius;

                    lv.visible = true;
                    lv.setContrast(null);

                    switch (labelPos) {
                        case PointItemPosition.INSIDE:
                            py -= r.height / 2 + labelOff;
                            break;
                        case PointItemPosition.FOOT:
                            // py += labelOff + (vis ? mv._radius : 0);                            
                            py += labelOff + (vis ? rd : 0);                            
                            break;
                        default:
                            // py -= r.height + labelOff + (vis ? mv._radius : 0);
                            py -= r.height + labelOff + (vis ? rd : 0);
                            break;
                    }
                    switch (labelAlign) {
                        case Align.LEFT:
                            // px -= r.width + (vis ? mv._radius : 0) + alignOff;
                            px -= r.width + (vis ? rd : 0) + alignOff;
                            break;
                        case Align.RIGHT:
                            // px += (vis ? mv._radius : 0) + alignOff;
                            px += (vis ? rd : 0) + alignOff;
                            break;
                        default:
                            px -= r.width / 2 + alignOff;
                            break;
                    }
                    lv.layout(textAlign).trans(px, py);
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
        let s = this._buildLines2(series._lines, this._polar);

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
            line.internalSetStyle('stroke', series._runColor);
            line.internalSetStyleOrClass(series.style);
            Dom.setImportantStyle(line.dom.style, FILL, 'none');
        }

        if (needBelow) {
            const lowLine = this._lowLine;
            const axis = series._yAxisObj as ContinuousAxis;
            const base = series.getBaseValue(axis);
            
            if (inverted) {
                this.$_resetClips(w, h, axis.getPos(w, base), true);
            } else {
                this.$_resetClips(w, h, h - axis.getPos(h, base), false);
            }

            lowLine.setPath(s);
            lowLine.internalClearStyleAndClass();
            lowLine.internalSetStyle('stroke', series._runColor);
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

    protected _buildLines2(lines: PointLine[], close: boolean): string {
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
        return sb.end(close);
    }

    private _drawLine2(pts: PointLine, connected: boolean, sb: PathBuilder): void {
        if (pts.length > 1) {
            sb.moveOrLine(connected, pts[0].px, pts[0].py);
            for (let i = 1; i < pts.length; i++) {
                if (this.model instanceof LineSeries && this.model.connectNullPoints && pts[i].isNull) continue;
                sb.line(pts[i].px, pts[i].py);
            }
        }
    }

    private _drawLines(lines: PointLine[], sb: PathBuilder): void {
        lines.forEach(line => this._drawLine2(line, false, sb));
    }

    private _drawStep2(pts: PointLine, connected: boolean, sb: PathBuilder, dir: LineStepDirection): void {
        if (pts.length > 1) {
            sb.moveOrLine(connected, pts[0].px, pts[0].py);
            for (let i = 1; i < pts.length; i++) {
                switch (dir) {
                    case LineStepDirection.BACKWARD:
                        sb.line(pts[i - 1].px, pts[i].py);
                        sb.line(pts[i].px, pts[i].py);
                        break;
                    case LineStepDirection.CENTER:
                        sb.line((pts[i].px + pts[i - 1].px) / 2 , pts[i - 1].py);
                        sb.line((pts[i].px + pts[i - 1].px) / 2, pts[i].py);
                        i + 1 === pts.length && sb.line(pts[i].px, pts[i].py);
                        break;
                    default:
                        sb.line(pts[i].px, pts[i - 1].py);
                        sb.line(pts[i].px, pts[i].py);
                        break;
                }
            }
        }
    }

    private _drawSteps(lines: PointLine[], sb: PathBuilder, dir: LineStepDirection): void {
        lines.forEach(line => this._drawStep2(line, false, sb, dir));
    }

    private _drawCurve2(pts: PointLine, connected: boolean, sb: PathBuilder): void {
        if (pts.length > 1) {
            sb.moveOrLine(connected, pts[0].px, pts[0].py);
            this._drawSpline(pts, 0, pts.length - 1, sb);
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
                        this._drawSpline(pts, start, i - 1, sb);
                    }
                    do {
                        i++;
                    } while (i < len && pts[i].isNull);

                    start = i;

                    if (i < len) {
                        sb.move(pts[i].px, pts[i].py);
                        i++;
                    }
                } else {
                    i++;
                }
            }
            if (i - 1 > start) {
                this._drawSpline(pts, start, i - 1, sb);
            }
        }
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

    override setHoverStyle(pv: RcElement): void {
        super.setHoverStyle(pv);
        pv.internalImportantStylesOrClass(this.model.marker.hoverStyle);
    }
}

export class LineSeriesView extends LineSeriesBaseView<LineSeries> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly CLASS = 'rct-line-series';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _flagView: LabelElement;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, LineSeriesView.CLASS);

        this._flagView = new LabelElement(doc, 'rct-line-series-flag');
        this._pointContainer.add(this._flagView);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected override _legendColorProp(): string {
        return 'stroke';
    }

    protected override _doLayout(): void {
        super._doLayout();

        const m = this.model;
        const flag = m.flag;
        const v = this._flagView;
        let s: string;

        if (v.setVis(flag.visible && !!(s = flag.label()))) {
            v.setText(s);
            v.setModel(this.doc, flag, null, null);
            v.layout(Align.LEFT);
            
            const r = v.getBBox();
            let x: number;
            let y: number;

            x = this._markers.last.x
            y = this._markers.last.y;

            if (this._inverted) {
                if (m._xAxisObj.reversed) {
                    y += flag.offset;
                } else {
                    y -= flag.offset + r.height;
                }                
                x -= r.width / 2;
            } else {
                if (m._xAxisObj.reversed) {
                    x -= flag.offset + r.width;
                } else {
                    x += flag.offset;
                }   
                y -= r.height / 2;
            }
            v.trans(x, y);
        }
    }
}