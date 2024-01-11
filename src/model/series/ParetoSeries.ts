////////////////////////////////////////////////////////////////////////////////
// HitstogramSeries.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum } from "../../common/Common";
import { Axis, IAxis } from "../Axis";
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
}

/**
 * Pareto 시리즈<br/>
 * 참조하는 원본 시리즈의 누적 비율을 표시한다.<br/>
 * {@link source}로 지정된 시리즈의 데이터포인트 값들로 부터 누적 포인트들을 계산해서 표시한다.
 * 
 * @config chart.series[type=pareto]
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
    _type(): string {
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
            series.referBy(this);
            return true;
        }
    }

    reference(other: Series, axis: IAxis): void {
        if (!axis._isX) {
            this.$_loadPoints(other._runPoints);
            this.collectValues(this._xAxisObj, (this._xAxisObj as Axis)._values);
            this.collectValues(this._yAxisObj, (this._yAxisObj as Axis)._values);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadPoints(pts: DataPoint[]): void {
        const list = [];
        const sum = pts.reduce((a, c) => a + pickNum(c.yValue, 0), 0);
        let acc = 0;

        pts.forEach(p => {
            if (!p.isNull) {
                list.push({
                    x: p.xValue, 
                    y: acc += p.yValue * 100 / sum
                });
            }
        })

        this._doLoadPoints(list);
        this._runPoints = this._points.getPoints(this._xAxisObj, this._yAxisObj);
    }
}