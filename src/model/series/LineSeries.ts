////////////////////////////////////////////////////////////////////////////////
// LineSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp, assign } from "../../common/Common";
import { IPoint } from "../../common/Point";
import { RcElement } from "../../common/RcControl";
import { Align, SVGStyleOrClass, StyleProps } from "../../common/Types";
import { Shape } from "../../common/impl/SvgShape";
import { IAxis } from "../Axis";
import { IChart } from "../Chart";
import { LineType } from "../ChartTypes";
import { DataPoint, IPointPos } from "../DataPoint";
import { LegendItem } from "../Legend";
import { DataPointLabel, MarkerVisibility, PointItemPosition, Series, SeriesGroup, SeriesGroupLayout, SeriesMarker } from "../Series";
import { AreaLegendMarkerView } from "./legend/AreaLegendMarkerView";
import { LineLegendMarkerView } from "./legend/LineLegendMarkerView";
import { ShapeLegendMarkerView } from "./legend/ShapeLegendMarkerView";

export class LineSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    radius: number;
    shape: Shape;
}

/**
 * 데이터 포인트 maker 설정 정보.
 */
export class LineSeriesMarker extends SeriesMarker {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    radius = 4;
    /**
     * 첫번째 point의 marker 표시 여부.
     * 
     * @config
     */
    firstVisible = MarkerVisibility.DEFAULT;
    /**
     * 첫번째 point의 marker 표시 여부.
     * 
     * @config
     */
    lastVisible = MarkerVisibility.DEFAULT;
    /**
     * 최소값 point들의 marker 표시 여부.
     * 
     * @config
     */
    minVisible = MarkerVisibility.DEFAULT;
    /**
     * 최대값 point들의 marker 표시 여부.
     * 
     * @config
     */
    maxVisible = MarkerVisibility.DEFAULT;
}

export class LinePointLabel extends DataPointLabel {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly ALIGN_GAP = 4;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * @config
     */
    position = PointItemPosition.HEAD;
    /**
     * position 위치에서 수평 정렬 상태.
     * 
     * @config
     */
    align = Align.CENTER;
    /**
     * {@link align}이 'left', 'right'일 때 원래 표시 위치와의 간격.
     */
    alignOffset: number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getAlignOffset(): number {
        const off = +this.alignOffset;
        if (isNaN(off)) {
            return this.align === Align.LEFT || this.align === Align.RIGHT ? LinePointLabel.ALIGN_GAP : 0;
        }
        return off;
    }
}

/**
 * 포인트 label들은 PointItemPosition.HEAD, FOOT, INSIDE에 위치할 수 있다.
 * 기본값은 AUTO(HEAD)이다.
 * pointLabel.align으로 수평 정렬을 설정할 수있다.
 */
export abstract class LineSeriesBase extends Series {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _shape: Shape;
    _lines: PointLine[];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * @config
     */
    marker: LineSeriesMarker = new LineSeriesMarker(this);

    /**
     * null인 y값을 {@link baseValue}로 간주한다.
     * 
     * @config
     */
    nullAsBase = false;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getShape(p: LineSeriesPoint): Shape {
        return this.marker.visible ? ((p && p.shape) || this.marker.shape || this._shape) : null;
    }

    getRadius(p: LineSeriesPoint): number {
        return pickNum(p.radius, this.marker.radius);
    }

    /**
     * null, ranges를 모두 고려해야 한다.
     */
    prepareLines(pts: LineSeriesPoint[]): void {
        this._lines = this._doPrepareLines(pts);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createLabel(chart: IChart): DataPointLabel {
        return new LinePointLabel(chart);
    }

    protected _createPoint(source: any): DataPoint {
        return new LineSeriesPoint(source);
    }

    hasMarker(): boolean {
        return true;
    }

    /**
     * rendering 시점에 chart가 series별로 기본 shape를 지정한다.
     */
    setShape(shape: Shape): void {
        this._shape = shape;
    }

    _defViewRangeValue(): "x" | "y" | "z" {
        return 'x';
    }

    protected _createLegendMarker(doc: Document, size: number): RcElement {
        return new LineLegendMarkerView(doc, size);
    }

    legendMarker(doc: Document, size: number): RcElement {
        const m = super.legendMarker(doc, size);

        (m as ShapeLegendMarkerView).setShape(this.getShape(null), Math.min(+size || LegendItem.MARKER_SIZE, this.marker.radius * 2));
        return m;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    abstract getLineType(): LineType;

    protected _doPrepareLines(pts: DataPoint[]): PointLine[] {
        const len = pts.length;
        const lines = [];

        if (this._containsNull) {
            let i = 0;
            
            while (i < len) {
                const line: PointLine = [];

                while (pts[i].isNull && i < len) {
                    i++;
                }
                while (i < len && !pts[i].isNull) {
                    line.push(pts[i++])
                }
                line.length > 0 && lines.push(line);
            }
        } else {
            lines.push(pts.slice());
        }
        return lines;
    }
}

export enum LineStepDirection {
    FORWARD = 'forward',
    BACKWARD = 'backward'
}

export type PointLine = IPointPos[];

/**
 * @config chart.series[type=line]
 */
export class LineSeries extends LineSeriesBase {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _base: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * @config
     */
    lineType = LineType.DEFAULT;
    /**
     * @config
     */
    stepDir = LineStepDirection.FORWARD;
    /**
     * y축 기준 위/아래 구분의 기준이 되는 값.
     * 
     * @config
     */
    baseValue = 0;
    /**
     * true로 지정하면 y값이 지정되지 않은 null 포인터를 무시하고 다음 포인트에 연결한다.
     * false면 null 포인트에서 연결이 끊어진다.
     * 
     * @config
     */
    connectNullPoints = false; // TODO: 더 좋은 이름을 찾을 것! (HI: connectNulls, ignoreNulls, passthrouchNulls,...)
    /**
     * {@link baseValue} 혹은 y축의 baseValue보다 작은 쪽의 선들에 적용되는 스타일.
     * 
     * @config
     */
    belowStyle: SVGStyleOrClass;
    /**
     * {@link connectNullPoints}이 true일 때 null 포인트의 양끝 포인트를 연결하는 선에 적용되는 스타일.
     */
    nullStyle: SVGStyleOrClass;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    backDir(): LineStepDirection {
        return this.stepDir === LineStepDirection.BACKWARD ? LineStepDirection.FORWARD : LineStepDirection.BACKWARD;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'line';
        
    }
    getLineType(): LineType {
        return (this.group instanceof LineSeriesGroup || this.group instanceof AreaSeriesGroup) ? this.group.lineType : this.lineType;
    }

    getBaseValue(axis: IAxis): number {
        return axis._isX ? NaN : this._base;
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        this._base = pickNum(this.baseValue, this._yAxisObj.getBaseValue());
    }
}

export class AreaSeriesPoint extends LineSeriesPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    yLow: number;
}

/**
 * 영역 시리즈.\
 * 대부분 {@link config.series.line 'line'} 시리즈와 동일하고 라인 아래 부분을 별도의 색상으로 채운다.
 * 
 * @config chart.series[type=area]
 */
export class AreaSeries extends LineSeries {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _areas: PointLine[];
    
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart, name);

        this.marker.visible = chart && chart.isPolar();
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * area 영역에 추가적으로 적용되는 스타일셋이나 class selector.
     * 
     * @config
     */
    areaStyle: StyleProps;
    /**
     * base 아래쪽 area 영역에 추가적으로 적용되는 스타일셋이나 class selector.
     * 
     * @config
     */
    belowAreaStyle: StyleProps;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    /**
     * 미리 생성된 line들을 기준으로 area들을 생성한다.
     */
    prepareAreas(): void {

        function bottom(pts: PointLine): PointLine {
            const area = [];

            if (pts.length > 0) {
                let p = (pts[pts.length - 1] as DataPoint).toPoint();
                p.yPos = (pts[pts.length - 1] as AreaSeriesPoint).yLow;
                area.push(p);
                
                p = (pts[0] as DataPoint).toPoint();
                p.yPos = pickNum((pts[0] as AreaSeriesPoint).yLow, pts[0].yPos);
                area.push(p);
            }
            return area;
        }

        const inverted = this.chart.isInverted();
        const g = this.group;
        const lines = this._lines;
        const areas = this._areas = [];

        if (g && g._stacked) {//} g.layout === SeriesGroupLayout.FILL) {
            // null로 분할된 line들을 area 하나로 묶는다.
            const area = [].concat(...lines);
            areas.push(area);
            // 아래 선분을 추가한다.
            areas.push(bottom(area));
        } else {
            lines.forEach(pts => {
                // 위 line.
                const area = pts.slice(0);
                areas.push(area);
                // 아래 선분
                areas.push(bottom(area));
            });
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'area';
    }

    isBased(axis: IAxis): boolean {
        return axis === this._yAxisObj;
    }

    protected _createLegendMarker(doc: Document, size: number): RcElement {
        return new AreaLegendMarkerView(doc, size);
    }

    protected _createPoint(source: any): DataPoint {
        return new AreaSeriesPoint(source);
    }

    protected _doPrepareLines(pts: DataPoint[]): PointLine[] {
        // null이 포함된 line 정보도 필요하다.
        if (this._containsNull && this.group && this.group._stacked) {
            const len = pts.length;
            const lines = [];
            let i = 0;
            
            while (i < len) {
                const isNull = pts[i].isNull;
                const line: PointLine = [];

                do {
                    line.push(pts[i++]);
                } while (i < len && pts[i].isNull == isNull);

                lines.push(line);
            }
            return lines;
        }
        return super._doPrepareLines(pts);
    }
}

/**
 * [low, high(y)]
 * [x, low, high(y)]
 */
export class AreaRangeSeriesPoint extends AreaSeriesPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    low: any;
    high: any;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    lowValue: number;
    highValue: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    parse(series: AreaRangeSeries): void {
        super.parse(series);

        this.y = this.high = pickProp(this.high, this.low);
        this.lowValue = parseFloat(this.low);
        this.highValue = this.yValue = parseFloat(this.high);

        this.isNull ||= isNaN(this.lowValue);
    }

    protected _assignTo(proxy: any): any {
        return assign(super._assignTo(proxy), {
            low: this.low,
            high: this.high,
            lowValue: this.lowValue,
            highValue: this.highValue
        });
    }

    protected _readArray(series: AreaRangeSeries, v: any[]): void {
        const d = v.length > 2 ? 1 : 0;

        this.low = v[pickNum(series.lowField, 0 + d)];
        this.high = v[pickNum(series.highField, 1 + d)];
        if (d > 0) {
            this.x = v[pickNum(series.xField, 0)];
        }
    }

    protected _readObject(series: AreaRangeSeries, v: any): void {
        super._readObject(series, v);

        this.low = pickProp(v[series.lowField], v.low);
        this.high = pickProp(v[series.lowField], v.high);
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);

        this.low = this.y;
    }

    getTooltipPos(): IPoint {
        return { x: this.xPos, y: this.yLow };
    }
}

/**
 * @config chart.series[type=arearange]
 */
export class AreaRangeSeries extends LineSeriesBase {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * json 객체나 배열로 전달되는 데이터포인트 정보에서 낮은(low) 값을 지정하는 속성명이나 인덱스.\
     * undefined이면, data point의 값이 array일 때는 항목 수가 3이상이면 1, 아니면 0, 객체이면 'low'.
     * 
     * @config
     */
    lowField: string;
    /**
     * json 객체나 배열로 전달되는 데이터포인트 정보에서 높은(high) 값을 지정하는 속성명이나 인덱스.\
     * undefined이면, data point의 값이 array일 때는 항목 수가 3이상이면 2, 아니면 1, 객체이면 'high'.
     * 
     * @config
     */
    highField: string;
    /**
     * area 영역에 추가적으로 적용되는 스타일셋이나 class selector.\
     * 
     * @config
     */
    areaStyle: StyleProps;
    /**
     * true면 spline 곡선으로 표시한다.
     * <br>
     * 
     * @default false
     */
    curved = false;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'arearange';
    }

    protected _createPoint(source: any): DataPoint {
        return new AreaRangeSeriesPoint(source);
    }

    getLineType(): LineType {
        return this.curved ? LineType.SPLINE : LineType.DEFAULT;
    }

    collectValues(axis: IAxis, vals: number[]): void {
        super.collectValues(axis, vals);

        if (vals && axis === this._yAxisObj) {
            this._runPoints.forEach((p: AreaRangeSeriesPoint) => !p.isNull && vals.push(p.lowValue));
        }
    }

    protected _doPrepareLines(pts: DataPoint[]): PointLine[] {
        const lines = super._doPrepareLines(pts);
        const lines2: PointLine[] = [];

        // top line
        lines.forEach(line => {
            const line2: PointLine = [];

            for (let i = line.length - 1; i >= 0; i--) {
                const p = line[i] as AreaRangeSeriesPoint;
                const pt = p.toPoint();
                pt.yPos = p.yLow;
                line2.push(pt);
            }
            lines2.push(line, line2);
        })
        return lines2;
    }
}

/**
 * @config chart.series[type=linegroup]
 */
export class LineSeriesGroup extends SeriesGroup<LineSeries> {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 이 그룹에 포함된 시리즈들의 line 종류.
     * 
     * @config
     */
    lineType = LineType.DEFAULT;
    baseValue = 0;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'linegroup';
    }

    _seriesType(): string {
        return 'line';
    }

    protected _canContain(ser: Series): boolean {
        return ser instanceof LineSeries;
    }

    getBaseValue(axis: IAxis): number {
        return axis === this._yAxisObj ? pickNum(this.baseValue, axis.getBaseValue()) : NaN;
    }
}

/**
 * @config chart.series[type=areagroup]
 */
export class AreaSeriesGroup extends SeriesGroup<AreaSeries> {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 이 그룹에 포함된 시리즈들의 line 종류.
     * 
     * @config
     */
    lineType = LineType.DEFAULT;
    baseValue = 0;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepareLines(series: AreaSeries): void {
        if (this._stacked) {
            const idx = this._visibles.indexOf(series);

            // 이전 시리즈의 line을 area의 아래쪽으로 재설정한다.
            if (idx > 0) {
                const prev = this._visibles[idx - 1] as AreaSeries;
                const areas = series._areas;
                const prevAreas = prev._areas;

                for (let i = 0; i < areas.length; i += 2) {
                    areas[i + 1] = prevAreas[i].reverse();
                }

                // TODO: 양 끝이 null 처리...
                if (this.layout === SeriesGroupLayout.STACK) {
                }
            }
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'areagroup';
    }

    _seriesType(): string {
        return 'area';
    }

    protected _canContain(ser: Series): boolean {
        return ser instanceof AreaSeries;
    }

    getBaseValue(axis: IAxis): number {
        return axis === this._yAxisObj ? pickNum(this.baseValue, axis.getBaseValue()) : NaN;
    }
}