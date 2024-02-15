////////////////////////////////////////////////////////////////////////////////
// BarSeries.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickNum, pickNum3 } from "../../common/Common";
import { RcElement } from "../../common/RcControl";
import { RectElement } from "../../common/impl/RectElement";
import { IAxis } from "../Axis";
import { DataPoint } from "../DataPoint";
import { BasedSeries, ClusterableSeriesGroup, IClusterable, Series, SeriesGroupLayout } from "../Series";

/**
 * [y]
 * [x, y]
 */
export class BarSeriesPoint extends DataPoint {
    
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    // borderRaidus: number;
}

export abstract class BarSeriesBase extends BasedSeries {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * true로 지정하면 포인트 bar 별로 색을 다르게 표시한다.
     * 
     * @config
     */
    colorByPoint = false;


    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    canCategorized(): boolean {
        return true;
    }

    _colorByPoint(): boolean {
        return this.colorByPoint;
    }

    protected _createPoint(source: any): DataPoint {
        return new BarSeriesPoint(source);
    }

    protected _getGroupBase(): number {
        return this.group ? (this.group as BarSeriesGroupBase<any>).baseValue : this.baseValue;
    }
}

/**
 * Bar 시리즈.<br/>
 * 수평 또는 수직 막대로 여러 값들을 **비교**하는 데 사용한다.
 * 막대의 길이가 y값을 나타낸다.<br/>
 * 이 시리즈를 기준으로 생성되는 x축은 [category](/config/config/xAxis/category)이다.<br/><br/>
 * 
 * {@link data}는 아래 형식들로 전달할 수 있다.<br/>
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
 * @config chart.series[type=bar]
 */
export class BarSeries extends BarSeriesBase {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 지정한 반지름 크기로 데이터포인트 bar의 위쪽 모서리를 둥글게 표시한다.\
     * 최대값이 bar 폭으로 절반으로 제한되므로 아주 큰 값을 지정하면 반원으로 표시된다.
     * 
     * @config
     */
    topRadius: number;
    /**
     * 지정한 반지름 크기로 데이터포인트 bar의 아래쪽 모서리를 둥글게 표시한다.
     * 최대값이 bar 폭으로 절반으로 제한되므로 아주 큰 값을 지정하면 반원으로 표시된다.
     * 
     * @config
     */
    bottomRadius: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'bar';
    }

    protected _createLegendMarker(doc: Document, size: number): RcElement {
        return RectElement.create(doc, Series.LEGEND_MARKER, 0, 0, size, size, 2);
    }
}

export abstract class BarSeriesGroupBase<T extends BarSeriesBase> extends ClusterableSeriesGroup<T> implements IClusterable {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * @config
     */
    baseValue: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    canCategorized(): boolean {
        return true;
    }

    override getBaseValue(axis: IAxis): number {
        return axis._isX ? NaN : pickNum3(this.baseValue, axis.getBaseValue(), 0);
    }

    protected _doPrepareSeries(series: T[]): void {
        if (this.layout === SeriesGroupLayout.DEFAULT) {
            const sum = series.length > 1 ? series.map(ser => ser.pointWidth).reduce((a, c) => a + c, 0) : series[0].pointWidth;
            let x = 0;
            
            series.forEach(ser => {
                ser._childWidth = ser.pointWidth / sum;
                ser._childPos = x;
                x += ser._childWidth;
            });
        } else if (this.layout === SeriesGroupLayout.STACK) {
        }
    }
}

/**
 * @config chart.series[type=bargroup]
 */
export class BarSeriesGroup extends BarSeriesGroupBase<BarSeries> {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'bargroup';
    }

    _seriesType(): string {
        return 'bar';
    }

    protected _canContain(ser: Series): boolean {
        return ser instanceof BarSeries;
    }
}