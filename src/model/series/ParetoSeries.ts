////////////////////////////////////////////////////////////////////////////////
// HitstogramSeries.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { LineType } from "../ChartTypes";
import { DataPoint } from "../DataPoint";
import { ISeries, Series } from "../Series";
import { LineSeriesBase } from "./LineSeries";

export class ParetoSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    parse(series: ISeries): void {
        super.parse(series);
    }
}

/**
 * 참조하는 원본 시리즈의 누적 비율을 표시한다.
 * <br>
 */
export class ParetoSeries extends LineSeriesBase {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * 이 시리즈 data point들을 구성할 수 있는 데이터를 포함한 원본 시리즈.
     * <br>
     * 시리즈 이름이나 index로 지정한다.
     */
    source: string | number;
    /**
     * true면 spline 곡선으로 표시한다.
     * <br>
     * 
     * @default false
     */
    curved = false;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'pareto';
    }

    getLineType(): LineType {
        return this.curved ? LineType.SPLINE : LineType.DEFAULT;
    }

    protected _createPoint(source: any): DataPoint {
        return new ParetoSeriesPoint(source);
    }

    _referOtherSeries(series: Series): boolean {
        if (series.name === this.source || series.index === this.source) {
            const src = this.$_loadPoints(series.getPoints().getPoints());
            this._doLoadPoints(src);
            return true;
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadPoints(pts: DataPoint[]): any[] {
        const list = [];
        const sum = pts.reduce((a, c) => a + c.yValue, 0);
        let acc = 0;

        pts.forEach(p => {
            const v = p.yValue * 100 / sum;

            list.push({
                x: p.x, 
                y: acc += v
            });
        })
        return list;
    }
}