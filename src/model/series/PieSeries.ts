////////////////////////////////////////////////////////////////////////////////
// PieSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../../common/Common";
import { IPercentSize, RtPercentSize, calcPercent, parsePercentSize } from "../../common/Types";
import { DataPoint } from "../DataPoint";
import { ILegendSource } from "../Legend";
import { ISeries, PointItemPosition, RadialSeries, Series, SeriesGroup, SeriesGroupLayout } from "../Series";

export class PieSeriesPoint extends DataPoint implements ILegendSource {

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
    // methods
    //-------------------------------------------------------------------------
    legendColor(): string {
        return this.color;
    }

    legendLabel(): string {
        return this.x;
    }

    legendVisible(): boolean {
        return this.visible;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    parse(series: ISeries): void {
        super.parse(series);

        this.sliced = this.source.sliced;
    }
}

export class PieSeries extends RadialSeries {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _innerDim: IPercentSize;
    private _sliceDim: IPercentSize;
    _groupPos: number;
    _groupSize: number;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    groupSize = 1;
    /**
     * 0보다 큰 값을 지정해서 도넛 형태로 표시할 수 있다.
     */
    innerSize: RtPercentSize = 0;
    sliceOffset: RtPercentSize = '7%';
    labelDistance = 25;
    /**
     * true이면 섹터 하나만 마우스 클릭으로 sliced 상태가 될 수 있다.
     * Point의 sliced 속성을 직접 지정하는 경우에는 이 속성이 무시된다.
     */
    exclusive = true;
    /**
     * Slice animation duration.
     * 밀리세컨드 단위로 지정.
     * @default 300ms.
     */
    sliceDuration = 300;
    borderRadius = 0;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getInnerRadius(rd: number): number {
        // 반지름에 대한 비율로 전달해야 한다.
        const dim = this._innerDim;
        return dim ? dim.size / (dim.fixed ? rd : 100) : 0;
    }

    getSliceOffset(rd: number): number {
        return this._sliceDim ? calcPercent(this._sliceDim, rd) : 0;
    }

    getLabelPosition(): PointItemPosition {
        const p = this.pointLabel.position;
        return p === PointItemPosition.AUTO ? PointItemPosition.INSIDE : p;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'pie';
    }

    protected _colorByPoint(): boolean {
        return true;
    }

    protected _createPoint(source: any): DataPoint {
        return new PieSeriesPoint(source);
    }

    getLegendSources(list: ILegendSource[]): void {
        this._visPoints.forEach(p => {
            list.push(p as PieSeriesPoint);
        })        
    }

    protected _doLoad(src: any): void {
        super._doLoad(src);

        this._innerDim = parsePercentSize(this.innerSize, true);
        this._sliceDim = parsePercentSize(this.sliceOffset, true);
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        // group에서 필요하면 설정한다. 이 값의 여부로 pieseriesview에서 stacking 상태인 지 확인한다.
        this._groupPos = NaN; 
    }
}

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
     */
    polarSize: RtPercentSize = '80%';
    /**
     * Pie 시리즈들의 그룹이고, 
     * {@link layout}이 {@link SeriesGroupLayout.FILL}이나 {@link SeriesGroupLayout.STACK}인 경우,
     * 경우 0보다 큰 값을 지정해서 도넛 형태로 표시할 수 있다.
     * <br>
     * 포함된 pie 시리즈들의 innerSize는 무시된다.
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
    protected _seriesType(): string {
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