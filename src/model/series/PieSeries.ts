////////////////////////////////////////////////////////////////////////////////
// PieSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IPercentSize, RtPercentSize, calcPercent, parsePercentSize } from "../../common/Types";
import { DataPoint } from "../DataPoint";
import { ILegendSource } from "../Legend";
import { ISeries, RadialSeries } from "../Series";

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
    prepare(series: ISeries): void {
        super.prepare(series);

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

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _colorByPoint(): boolean {
        return true;
    }

    createPoint(source: any): DataPoint {
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