////////////////////////////////////////////////////////////////////////////////
// BoxPlotSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickProp, assign, pickNum3, pickProp3 } from "../../common/Common";
import { RcElement } from "../../common/RcControl";
import { RectElement } from "../../common/impl/RectElement";
import { DataPoint } from "../DataPoint";
import { LowRangedSeries, RangedSeries, Series } from "../Series";

/**
 * [min, low, mid, high, max|y]
 * [x, min, low, mid, high, max|y]
 */
export class BoxPlotSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    min: any;
    low: any;   // first quartile(q1, 25th percentile)
    mid: any;   // median (q2, 50th percentile)
    high: any;  // third quartile (q3 75th percentile)
    max: any;   // q4 or 100th percentile

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    minValue: number;
    lowValue: number;
    midValue: number;
    highValue: number;
    get maxValue(): number { return this.yValue; }

    lowPos: number;
    midPos: number;
    highPos: number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    // getInside(): IRect {
    //     return { x: 0, y: 0, width: this.width, height: this.height };
    // }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    labelCount(): number {
        return 2;
    }

    getLabel(index: number) {
        return index === 0 ? this.yValue : this.minValue;
    }

    protected _assignTo(proxy: any): any {
        return assign(super._assignTo(proxy), {
            min: this.min,
            low: this.low,
            mid: this.mid,
            high: this.high,
            minValue: this.minValue,
            lowValue: this.lowValue,
            midValue: this.midValue,
            highValue: this.highValue,
            maxValue: this.maxValue
        });
    }

    protected _readArray(series: BoxPlotSeries, v: any[]): void {
        if (v.length <= 4) {
            this.isNull = true;
        } else {
            const d = v.length > 5 ? 1 : 0;

            if (d > 0) {
                this.x = v[pickNum(series.xField, 0)];
            }
            this.min = v[pickNum(series.minField, 0 + d)];
            this.low = v[pickNum(series.lowField, 1 + d)];
            this.mid = v[pickNum(series.midField, 2 + d)];
            this.high = v[pickNum(series.highField, 3 + d)];
            this.y = v[pickNum3(series.maxField, series.yField, 4 + d)];
        }
    }

    protected _readObject(series: BoxPlotSeries, v: any): void {
        super._readObject(series, v);

        this.min = pickProp(v[series.minField], v.min);
        this.low = pickProp(v[series.lowField], v.low);
        this.mid = pickProp(v[series.midField], v.mid);
        this.y = pickProp3(v[series.highField], v.high, this.y);
    }

    protected _readSingle(v: any): void {
        super._readSingle(v);

        this.min = this.low = this.mid = this.high = this.y;
    }

    parse(series: BoxPlotSeries): void {
        super.parse(series);

        this.max = this.y;

        this.minValue = parseFloat(this.min);
        this.lowValue = parseFloat(this.low);
        this.midValue = parseFloat(this.mid);
        this.highValue = parseFloat(this.high);

        this.isNull ||= isNaN(this.minValue) || isNaN(this.lowValue) || isNaN(this.midValue);
    }
}

/**
 * {@link https://en.wikipedia.org/wiki/Box_plot BoxPlot} 시리즈.<br/>
 * 주요 값들의 대략적인 범위 및 분포를 표시하는 시리즈.<br/><br/>
 * 
 * {@link data}는 아래 형식들로 전달할 수 있다.<br/>
 * [주의] 데이터포인트 구성에 필요한 모든 값을 제공하지 않으면 null이 된다.
 * 
 * <br/>
 * ###### 단일 값 및 값 배열
 * |형식|설명|
 * |---|---|
 * |y|단일 숫자면 low, y값. x 값은 순서에 따라 자동 결정.|
 * |[]|빈 배열이면 null. x 값은 순서에 따라 자동 결정.|
 * |[min, low, mid, high, y]|형식 설명 순서대로 값 결정. x 값은 데이터포인트 순서에 따라 자동 결정.|
 * |[x, min, low, mid, high, y]|형깃 설명 순서대로 값 결정.<br/> 또는 {@link xField} 속성이 숫자이면 x값, {@link minField}는 min값,<br/> {@link lowField}는 low값, {@link midField}는 mid값,<br/> {@link highField}는 high값, {@link yField}는 y값의 index.|
 *
 * ###### json 배열
 * |Series 속성|설명|
 * |---|---|
 * |{@link xField}|속성 값, 또는 'x', 'name', 'label' 속성들 중 순서대로 값이 설정된 것이 x 값이 된다.|
 * |{@link minField}|속성 값, 또는 'min' 속성 값이 min 값이 된다.|
 * |{@link lowField}|속성 값, 또는 'low' 속성 값이 low 값이 된다.|
 * |{@link midField}|속성 값, 또는 'mid' 속성 값이 mid 값이 된다.|
 * |{@link highField}|속성 값, 또는 'high' 속성 값이 high 값이 된다.|
 * |{@link yField}|속성 값, 또는 'y', 'value' 속성들 중 순서대로 값이 설정된 것이 y 값이 된다.|
 * |{@link colorField}|속성 값, 또는 'color' 속성 값으로 데이터포인트의 개별 색상으로 지정된다.|
 * 
 * @config chart.series[type=boxplot]
 */
export class BoxPlotSeries extends LowRangedSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * json 객체나 배열로 전달되는 데이터포인트 정보에서 min값을 지정하는 속성명이나 인덱스.<br/>
     * undefined이면, data point의 값이 array일 때는 항목 수가 6이상이면 1 아니면 0, 객체이면 'min'.
     * 
     * @config
     */
    minField: string;
    /**
     * json 객체나 배열로 전달되는 데이터포인트 정보에서 low값을 지정하는 속성명이나 인덱스.<br/>
     * undefined이면, data point의 값이 array일 때는 항목 수가 6이상이면 2 아니면 1, 객체이면 'low'.
     * 
     * @config
     */
    lowField: string;
    /**
     * json 객체나 배열로 전달되는 데이터포인트 정보에서 mid값을 지정하는 속성명이나 인덱스.<br/>
     * undefined이면, data point의 값이 array일 때는 항목 수가 6이상이면 3 아니면  2, 객체이면 'mid'.
     * 
     * @config
     */
    midField: string;
    /**
     * json 객체나 배열로 전달되는 데이터포인트 정보에서 high값을 지정하는 속성명이나 인덱스.<br/>
     * undefined이면, data point의 값이 array일 때는 항목 수가 6이상이면 4 아니면 3, 객체이면 'high'.
     * 
     * @config
     */
    highField: string;
    /**
     * json 객체나 배열로 전달되는 데이터포인트 정보에서 max값을 지정하는 속성명이나 인덱스.<br/>
     * undefined이면, {@link yField} 값으로 대체되거나 data point의 값이 array일 때는 항목 수가 6이상이면 5 아니면 4, 객체이면 'max'.
     * 
     * @config
     */
    maxField: string;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _minFielder: (src: any) => any;
    _lowFielder: (src: any) => any;
    _midFielder: (src: any) => any;
    _highFielder: (src: any) => any;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'boxplot';
    }

    tooltipText = '<b>${name}</b><br>min: <b>${minValue}</b><br>low: <b>${lowValue}</b><br>mid: <b>${midValue}</b><br>high: <b>${highValue}</b><br>max: <b>${maxValue}</b>';

    pointLabelCount(): number {
        return 2;
    }

    protected _createFielders(): void {
        super._createFielders();

        this._minFielder = this._createFielder(this.minField);
        this._lowFielder = this._createFielder(this.lowField);
        this._midFielder = this._createFielder(this.midField);
        this._highFielder = this._createFielder(this.highField);
    }

    protected _createPoint(source: any): DataPoint {
        return new BoxPlotSeriesPoint(source);
    }

    protected _getBottomValue(p: BoxPlotSeriesPoint): number {
        return p.minValue;
    }

    protected _createLegendMarker(doc: Document, size: number): RcElement {
        return RectElement.create(doc, Series.LEGEND_MARKER, 0, 0, size, size, 2);
    }
}