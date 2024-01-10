////////////////////////////////////////////////////////////////////////////////
// HitstogramSeries.ts
// 2023. 07. 22. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray } from "../../common/Common";
import { Axis, IAxis } from "../Axis";
import { LineType } from "../ChartTypes";
import { DataPoint } from "../DataPoint";
import { Series } from "../Series";
import { AreaSeries, AreaSeriesPoint } from "./LineSeries";

export class BellCurveSeriesPoint extends AreaSeriesPoint {
}

/**
 * BellCurve 시리즈.<br/>
 * {@link source} 시리즈 데이터포인트들의 값을 바탕으로
 * {@link https://ko.wikipedia.org/wiki/정규_분포 정규분포} 곡선을 표시한다.<br/>
 * 
 * {@link data}는 아래 형식들로 전달할 수 있다.
 * 
 * ###### 단일 값 및 값 배열
 * |형식|설명|
 * |---|---|
 * |y|단일 숫자면 y값. x 값은 순서에 따라 자동 결정.|
 * |[]|빈 배열이면 null. x 값은 순서에 따라 자동 결정.|
 * |[y]|값 하나인 배열이면 y값. x 값은 순서에 따라 자동 결정.|
 * |[x, y,]|두 값 이상이면 순서대로 x, y값.<br/> 또는 {@link xField} 속성이 숫자이면 x값의 index. {@link yField}는 y값의 index.<br>{@link colorField}는 color값의 index.|
 *
 * ###### json 배열
 * |Series 속성|설명 |
 * |---|---|
 * |{@link xField}|속성 값, 또는 'x', 'name', 'label' 속성들 중 순서대로 값이 설정된 것이 x 값이 된다.|
 * |{@link yField}|속성 값, 또는 'y', 'value' 속성들 중 순서대로 값이 설정된 것이 y 값이 된다.|
 * |{@link colorField}|속성 값, 또는 'color' 속성 값으로 데이터포인트의 개별 색상으로 지정된다.|
 *
 * @config chart.series[type=bellcurve]
 */
export class BellCurveSeries extends AreaSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 이 시리즈 data point들을 구성할 수 있는 데이터를 포함한 원본 시리즈.
     * 시리즈 이름이나 index로 지정한다.
     * 
     * @config
     */
    source: string | number;
    /**
     * @default 3
     * @config
     */
    sigmas = 3;
    /**
     * @default 3
     * @config
     */
    pointsInSigma = 5;
    /**
     * true면 {@link lineType} 설정과 관계없이 spline 곡선으로 표시한다.
     * 
     * @config
     */
    curved = true; // bell'curve' 이니까...

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'bellcurve';
    }

    getLineType(): LineType {
        return this.curved ? LineType.SPLINE : LineType.DEFAULT;
    }

    protected _createPoint(source: any): DataPoint {
        return new BellCurveSeriesPoint(source);
    }

    protected _doLoadData(src: any): any[] {
        const data = super._doLoadData(src);

        if (isArray(data)) {
            return this.$_loadTable(data);
        }
    }

    _referOtherSeries(series: Series): boolean {
        if (this._points.isEmpty() && (series.name === this.source || series.index === this.source)) {
            series.referBy(this);
            return true;
        }
    }

    reference(other: Series, axis: IAxis): void {
        if (!axis._isX) {
            const vals = other._runPoints.map(p => p.yValue).filter(v => !isNaN(v));
            const pts = this.$_loadTable(vals);

            this._doLoadPoints(pts);
            this._runPoints = this._points.getPoints(this._xAxisObj, this._yAxisObj);

            this.collectValues(this._xAxisObj, (this._xAxisObj as Axis)._values);
            this.collectValues(this._yAxisObj, (this._yAxisObj as Axis)._values);
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadTable(vals: number[]): any[] {
        const len = vals.length;

        if (len < 1) {
            return;
        }

        const sum = vals.reduce((a, c) => a + c, 0);
        const mean = sum / len;
        const stdv = Math.sqrt(vals.reduce((a, c) => a + Math.pow(c - mean, 2)) / (len - 1));
        const step = stdv / this.pointsInSigma;
        const min = mean - this.sigmas * stdv;
        const max = mean + this.sigmas * stdv;
        let sigma = mean;

        const pts2 = [];

        pts2.push(this.$_getDenstiy(mean, stdv, sigma));
        while (sigma > min) {
            sigma -= step;
            pts2.unshift(this.$_getDenstiy(mean, stdv, sigma));
        }
        sigma = mean;
        while (sigma < max) {
            sigma += step;
            pts2.push(this.$_getDenstiy(mean, stdv, sigma));
        }

        return pts2;
    }

    private $_getDenstiy(mean: number, stdv: number, sigma: number): any {
        const dist = sigma - mean;
        const y = Math.exp(-(dist * dist) / (2 * stdv * stdv)) / (stdv * Math.sqrt(2 * Math.PI));

        return {
            x: sigma, 
            y: y
        };
    }
}