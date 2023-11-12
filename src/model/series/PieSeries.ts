////////////////////////////////////////////////////////////////////////////////
// PieSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../../common/Common";
import { DEG_RAD, IPercentSize, ORG_ANGLE, RtPercentSize, calcPercent, parsePercentSize } from "../../common/Types";
import { FormattableText } from "../ChartItem";
import { DataPoint } from "../DataPoint";
import { ILegendSource } from "../Legend";
import { ISeries, PointItemPosition, RadialSeries, Series, SeriesGroup, SeriesGroupLayout, WidgetSeriesPoint } from "../Series";

export class PieSeriesPoint extends WidgetSeriesPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    sliced = false;
    startAngle = 0;
    angle = 0;
    borderRaidus: number;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get endAngle(): number {
        return this.startAngle + this.angle;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    parse(series: ISeries): void {
        super.parse(series);

        this.sliced = this.source.sliced;
    }

    protected _assignTo(proxy: any): any {
        return Object.assign(super._assignTo(proxy), {
            sliced: this.sliced
        });
    }
}

class PieSeriesText extends FormattableText {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor() {
        super(null, true);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

/**
 * @config chart.series[type=pie]
 */
export class PieSeries extends RadialSeries {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _innerDim: IPercentSize;
    private _sliceDim: IPercentSize;
    _groupPos: number;
    _groupSize: number;
    _startRad: number;
    _totalRad: number;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * @config
     */
    groupSize = 1;
    /**
     * 0보다 큰 값을 지정해서 도넛 형태로 표시할 수 있다.
     * 시리즈 원호의 반지름에 대한 상대적 크기나 픽셀 수로 지정할 수 있다.
     * {@link innerText}로 도넛 내부에 표시될 텍스트를 지정할 수 있다.
     * 
     * @config
     */
    innerRadius: RtPercentSize;
    /**
     * @config
     */
    labelDistance = 25;
    /**
     * @config
     */
    sliceOffset: RtPercentSize = '7%';
    /**
     * 클릭한 데이터 포인트를 slice 시킨다.
     * 기존 slice 됐던 포인트는 원복된다.
     * 
     * @config
     */
    autoSlice = true;
    /**
     * Slice animation duration.
     * 밀리세컨드(ms) 단위로 지정.
     * 
     * @config
     */
    sliceDuration = 300;
    /**
     * @config
     */
    borderRadius = 0;
    /**
     * {@link innerRadius}가 0보다 클 때, 도넛 내부에 표시되는 텍스트.
     * 기본 클래스 selector는 <b>'rct-pie-series-inner'</b>이다.
     * 
     * @config
     */
    innerText = new PieSeriesText();

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    hasInner(): boolean {
        return this._innerDim && this._innerDim.size > 0;
    }

    getInnerRadius(rd: number): number {
        // 반지름에 대한 비율로 전달해야 한다.
        const dim = this._innerDim;
        return dim ? dim.size / (dim.fixed ? rd : 100) : 0;
    }

    getSliceOffset(rd: number): number {
        return this._sliceDim ? calcPercent(this._sliceDim, rd) : 0;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'pie';
    }

    protected _createPoint(source: any): DataPoint {
        return new PieSeriesPoint(source);
    }

    protected _doLoad(src: any): void {
        super._doLoad(src);

        this._innerDim = parsePercentSize(this.innerRadius, true);
        this._sliceDim = parsePercentSize(this.sliceOffset, true);
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        let start = pickNum(this.startAngle % 360, 0);
        let total = Math.max(0, Math.min(360, pickNum(this.totalAngle, 360)));

        this._startRad = ORG_ANGLE + DEG_RAD * start;
        this._totalRad = DEG_RAD * total;

        // group에서 필요하면 설정한다. 이 값의 여부로 pieseriesview에서 stacking 상태인 지 확인한다.
        this._groupPos = NaN; 
    }
}

/**
 * @config chart.series[type=piegroup]
 */
export class PieSeriesGroup extends SeriesGroup<PieSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _polarDim: IPercentSize;
    private _innerDim: IPercentSize;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * polar 그룹일 때 원형 플롯 영역의 크기.
     * <br>
     * 픽셀 크기나 차지할 수 있는 전체 크기에 대한 상대적 크기로 지정할 수 있다.
     * <br>
     * Pie 시리즈들의 그룹이고, 
     * {@link layout}이 {@link SeriesGroupLayout.FILL}이나 {@link SeriesGroupLayout.STACK}인 경우
     * 개별 시리즈의 size 대신 이 속성값으로 표시되고,
     * 각 시리즈의 size는 상대 크기로 적용된다.
     * 
     * @config
     */
    polarSize: RtPercentSize = '80%';
    /**
     * Pie 시리즈들의 그룹이고, 
     * {@link layout}이 {@link SeriesGroupLayout.FILL}이나 {@link SeriesGroupLayout.STACK}인 경우,
     * 경우 0보다 큰 값을 지정해서 도넛 형태로 표시할 수 있다.
     * <br>
     * 포함된 pie 시리즈들의 innerSize는 무시된다.
     * 
     * @config
     */
    innerSize: RtPercentSize = 0;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getPolarSize(width: number, height: number): number {
        return calcPercent(this._polarDim, Math.min(width, height));
    }

    getInnerRadius(rd: number): number {
        // 반지름에 대한 비율로 전달해야 한다.
        const dim = this._innerDim;
        return dim ? dim.size / (dim.fixed ? rd : 100) : 0;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'piegroup';
    }

    _seriesType(): string {
        return 'pie';
    }

    needAxes(): boolean {
        return false;
    }

    protected _canContain(ser: Series): boolean {
        return ser instanceof PieSeries;
    }

    protected _doLoad(source: any): void {
        super._doLoad(source);

        this._polarDim = parsePercentSize(this.polarSize, true) || { size: 80, fixed: false };
        this._innerDim = parsePercentSize(this.innerSize, true);
    }

    protected _doPrepareSeries(series: PieSeries[]): void {
        if (this.layout === SeriesGroupLayout.STACK || this.layout === SeriesGroupLayout.FILL) {
            const sum = series.map(ser => (ser as PieSeries).groupSize).reduce((a, c) => a + pickNum(c, 1), 0);
            let p = 0;
            
            series.forEach((ser: PieSeries) => {
                ser._groupPos = p;
                p += ser._groupSize = pickNum(ser.groupSize, 1) / sum;
            });
        }
    }
}