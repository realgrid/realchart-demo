////////////////////////////////////////////////////////////////////////////////
// WaterfallSeries.ts
// 2023. 07. 29. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcElement } from "../../common/RcControl";
import { RectElement } from "../../common/impl/RectElement";
import { IChart } from "../Chart";
import { DataPoint } from "../DataPoint";
import { RangedSeries, Series } from "../Series";

export class WaterfallSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _isSum: boolean;
    _intermediate: boolean;
    save: number;
    low = 0;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    parse(series: WaterfallSeries): void {
        super.parse(series);

        this._isSum = this.source.isSum === true;
        this._intermediate = this.source.intermediate;
        if (this._isSum) this.y = 0; // 이렇게 하지 않으면 isNull이 true가 된다.
        // series에서 this.y를 변경하므로 원본을 저장하고 나중에 복원한다.
        this.save = this.y;
    }
}

/**
 * 폭포(Waterfall) 시리즈.<br/>
 * 순서대로 추가되는 증가/감소 값들의 누적 상태를 표시하는 데 사용된다.<br/><br/>
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
 * @config chart.series[type=waterfall]
 */
export class WaterfallSeries extends RangedSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name?: string) {
        super(chart, name);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 지정한 반지름 크기로 데이터포인트 bar의 모서리를 둥글게 표시한다.\
     * 최대값이 bar 폭으로 절반으로 제한되므로 아주 큰 값을 지정하면 반원으로 표시된다.
     * 
     * @config
     */
    cornerRadius: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    _type(): string {
        return 'waterfall';
    }

    canCategorized(): boolean {
        return true;
    }

    protected _createPoint(source: any): DataPoint {
        return new WaterfallSeriesPoint(source);
    }

    protected _createLegendMarker(doc: Document, size: number): RcElement {
        return RectElement.create(doc, Series.LEGEND_MARKER, 0, 0, size, size, 2);
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        const pts = this._runPoints as WaterfallSeriesPoint[];
        if (pts.length < 1) return;

        let p = pts[0];
        let yPrev = p.y = p._isSum ? 0 : p.y;
        let prev = yPrev;
        let total = yPrev;  // 전체 total
        let sum = yPrev;    // 중간 total
        let low = 0;        // 시작값
        let v: number;
        let y: number;

        for (let i = 1, cnt = pts.length; i < cnt; i++) {
            p = pts[i];

            if (p._isSum) {
                const pPrev = pts[i - 1];
                const inter = p._intermediate === true || i < cnt - 1 && p._intermediate !== false;
                const v = p.save = p.y = inter ? sum : total;

                p.yGroup = p.yValue = p.y;

                if (inter) {
                    if (sum < 0) {
                        low = pPrev.low;
                        y = low - v;
                    } else {
                        y = pPrev.y;
                        low = y - v;
                    }
                } else {
                    low = pts[0].low;
                    y = low + v;
                }
                sum = 0;
                
            } else {
                v = p.y;

                if (v < 0) {
                    if (prev < 0) {
                        y = yPrev + prev;
                        low = y + v;
                    } else {
                        y = yPrev;
                        low = y + v;
                    }
                } else {
                    if (prev < 0) {
                        low = yPrev;
                        y = low + v;
                    } else {
                        low = yPrev;
                        y = low + v;
                    }
                }

                sum += v;
                total += v;
            }

            prev = p.y;
            p.y = yPrev = y;
            p.low = low;

        }
    }

    protected _getBottomValue(p: WaterfallSeriesPoint): number {
        // [NOTE] low value를 axis에 포함시키지 않는다. 다른 ranged 시리즈와 다르다.
        p.y = p.save;
        return NaN;
    }
}