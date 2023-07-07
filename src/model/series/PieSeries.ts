////////////////////////////////////////////////////////////////////////////////
// PieSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RtPercentSize } from "../../common/Types";
import { DataPoint } from "../DataPoint";
import { ILegendSource } from "../Legend";
import { RadialSeries, Series } from "../Series";

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
}

export class PieSeries extends RadialSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    centerX = 0;
    centerY = 0;
    singleColor = false;
    innerSize: RtPercentSize = 0;
    size: RtPercentSize;
    slicedOffset: RtPercentSize = 10;
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

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    isPolar(): boolean {
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

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        const colors = this.chart.colors;

        this._visPoints.forEach((p, i) => {
            if (!p.color) {
                p.color = colors[i % colors.length];
            }
        })
    }
}