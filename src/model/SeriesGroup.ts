////////////////////////////////////////////////////////////////////////////////
// SeriesGroup.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject } from "../common/Common";
import { RcObject } from "../common/RcObject";
import { RtPercentSize } from "../common/Types";
import { Shape } from "../common/impl/SvgShape";
import { IAxis } from "./Axis";
import { IChart } from "./Chart";
import { ChartItem } from "./ChartItem";
import { ISeries, Series } from "./Series";
import { BoxSeries } from "./series/BarSeries";

export enum SeriesGroupLayout {

    /**
     * 시리즈 종류에 따른 기본 표시 방식.
     * <br>
     * bar 종류의 시리즈인 경우 포인트들을 순서대로 옆으로 배치하고,
     * line 종류인 경우 {@link OVERLAP}과 동일하게 순서대로 표시된다.
     * <br>
     * 기본 값이다.
     */
    DEFAULT = 'default',
    /**
     * 포인트들을 순서대로 겹쳐서 표시한다.
     * <br>
     * bar 종류의 시리지은 경우, 
     * 마지막 시리즈의 포인트 값이 큰 경우 이전 포인트들은 보이지 않을 수 있다.
     */
    OVERLAP = 'overlap',
    /**
     * 포인트 그룹 내에서 각 포인트들을 순서대로 쌓아서 표시한다.
     */
    STACK = 'stack',
    /**
     * 포인트 그룹 내에서 각 포인트의 비율을 표시한다.
     * 그룹 합은 SeriesGroup.max로 지정한다.
     * 각 포인트들은 STACK과 마찬가지로 순서대로 쌓여서 표시된다.
     * SeriesGroup.baseValue 보다 값이 큰 point는 baseValue 위쪽에 작은 값을 가진
     * 포인트들은 baseValue 아래쪽에 표시된다.
     */
    FILL = 'fill',
    /**
     * FILL과 동일히다.
     * 다만 baseValue보다 작은 point들도 baseValue 위쪽에 표시한다.
     */
    //FILL_POSITIVE = 'fillPositive',
    /**
     * FILL과 동일히다.
     * 다만 baseValue를 기준으로 양쪽에 속한 포인트들의 합이 SeriesGroup.max가 
     * 되도록 표시한다.
     */
    //FILL_BOTH = 'fillBoth'
}

export interface ISeriesGroup {

    layout: SeriesGroupLayout;
    _groupWidth: number;
    _groupPos: number;
    groupPadding: number;

    collectValues(axis: IAxis): number[];
}

export class SeriesGroup extends RcObject {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * 그룹 이름.
     * <br>
     * 시리즈에서 이 값으로 자신이 속하는 그룹을 지정할 수 있다.
     */
    name: string;
    /**
     * 그룹 내의 포인트들을 배치하는 방식.
     */
    private _layout = SeriesGroupLayout.DEFAULT;
    /**
     * 이 group이 축의 단위 너비 내에서 차지하는 영역의 상대 크기.
     * <br>
     * 0보다 큰 값으로 지정한다.
     * group이 여러 개인 경우 이 너비를 모두 합한 크기에 대한 상대값으로 group의 너비가 결정된다.
     */
    groupWidth = 1;
    /**
     * 시리즈 point bar들의 양 끝을 점유하는 빈 공간 크기 비율.
     * <br>
     * 0 ~ 1 사이의 비율 값으로 지정한다.
     */
    groupPadding = 0.2;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get layout(): SeriesGroupLayout {
        return this._layout;
    }
    set layout(value: SeriesGroupLayout) {
        if ([SeriesGroupLayout.OVERLAP, SeriesGroupLayout.STACK, SeriesGroupLayout.FILL].indexOf(value) < 0) {
            this._layout = SeriesGroupLayout.DEFAULT;
        } else {
            this._layout = value;
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    // 축 단위 내에서 이 그룹이 차지하는 계산된 영역 너비. 0 ~ 1 사이의 값.
    _groupWidth = 1;
    // 축 단위 내에서 이 그룹이 시작하는 위치. 0 ~ 1 사이의 상대 값.
    _groupPos = 0;
    _series: Series[] = [];

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(src: any): void {
        for (const p in src) {
            // if (this.hasOwnProperty(p)) {
                this[p] = src[p];
            // }
        }
    }

    private $_validate(): void {
        const series = this._series;

        // 모든 시리즈가 같은 축을 공유해야 한다.
        for (let i = 1; i < series.length; i++) {
            if (series[i]._xAxisObj !== series[i - 1]._xAxisObj || series[i]._yAxisObj !== series[i - 1]._yAxisObj) {
                throw new Error('같은 그룹 내의 시리즈들은 동일한 축들에 연결돼야 한다.');
            }
        }
    }

    prepareRender(): void {
        this.$_validate();

        if (this._layout === SeriesGroupLayout.DEFAULT) {
            const series = this._series.filter(ser => ser instanceof BoxSeries) as BoxSeries[];
            const cnt = series.length;

            if (cnt > 1) {
                const sum = series.map(ser => ser.pointWidth).reduce((a, c) => a + c);
                let x = 0;
                
                series.forEach(ser => {
                    ser._groupWidth = ser.pointWidth / sum;
                    ser._groupPos = x;
                    x += ser._groupWidth;
                });
            } else if (cnt === 1) {
                series[0]._groupWidth = 1;
            }
        }
    }

    collectValues(axis: IAxis): number[] {
        let vals: number[] = [];

        this._series.forEach(ser => {
            vals = vals.concat(ser.collectValues(axis));
        })
        return vals;
    }
}

export class SeriesGroupCollection {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    private static readonly DEFAULT = new SeriesGroup();

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly chart: IChart;
    private _items: SeriesGroup[] = [];
    private _map = new Map<string, SeriesGroup>();

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        this.chart = chart;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get first(): SeriesGroup {
        return this._items[0] || SeriesGroupCollection.DEFAULT;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    get(name: string | number): SeriesGroup {
        return  this._map[name] || this._items[name] || this._items[0] || SeriesGroupCollection.DEFAULT;
    }

    load(src: any): void {
        const chart = this.chart;

        this._items = [];
        this._map.clear();

        if (isArray(src)) {
            src.forEach((s, i) => this._items.push(this.$_loadGroup(chart, s)));
        } else if (isObject(src)) {
            this._items.push(this.$_loadGroup(chart, src));
        }

        chart._getSeries().forEach(ser => {
            const g = this.get(ser.group);

            ser._group = g;
            ser.gindex = g._series.length;
            g._series.push(ser);
        })
    }

    prepareRender(): void {
        if (this._items.length > 0) {
            const sum = this._items.map(g => g.groupWidth).reduce((a, c) => a + c, 0);
            let x = 0;

            this._items.forEach((g, i) => {
                g._groupWidth = g.groupWidth / sum;
                g._groupPos = x;
                x += g._groupWidth;
                g.prepareRender();
            });
        } else {
            const g = this.first;

            g._groupWidth = 1;
            g.prepareRender();
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadGroup(chart: IChart, src: any): SeriesGroup {
        const g = new SeriesGroup();

        g.load(src);
        src.name && this._map.set(src.name, g);
        return g;
    }
}

export enum MarerVisibility {
    /** visible 속성에 따른다. */
    DEFAULT = 'default',
    /** visible 속성과 상관없이 항상 표시한다. */
    VISIBLE = 'visible',
    /** visible 속성과 상관없이 항상 표시하지 않는다. */
    HIDDEN = 'hidden'
}

export abstract class SeriesMarker extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * 명시적으로 지정하지 않으면 typeIndex에 따라 Shapes 중 하나로 돌아가면서 설정된다.
     */
    shape: Shape;
    /**
     * shape의 반지름.
     */
    radius = 3;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public series: Series) {
        super(series.chart);
    }
}

/**
 * Chart가 polar가 아닌 경우, plot area 영역을 기준으로 size, centerX, centerY가 적용된다.
 */
export class RadialSeries extends Series {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    startAngle = 0;
    centerX = 0;
    centerY = 0;
    size: RtPercentSize;
}

