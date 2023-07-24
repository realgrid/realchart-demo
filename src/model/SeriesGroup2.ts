////////////////////////////////////////////////////////////////////////////////
// SeriesGroup2.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, pickNum } from "../common/Common";
import { RcObject } from "../common/RcObject";
import { IPercentSize, RtPercentSize, calcPercent, parsePercentSize } from "../common/Types";
import { IAxis } from "./Axis";
import { IChart } from "./Chart";
import { DataPoint } from "./DataPoint";
import { Series, SeriesGroupLayout } from "./Series";
import { BoxSeries } from "./series/BarSeries";
import { PieSeries } from "./series/PieSeries";

export interface ISeriesGroup2 {

    layout: SeriesGroupLayout;
    _groupWidth: number;
    _groupPos: number;
    groupPadding: number;

    getPolarSize(width: number, height: number): number;
    getInnerRadius(rd: number): number
    collectValues(axis: IAxis): number[];
}

export class SeriesGroup2 extends RcObject {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _layout = SeriesGroupLayout.DEFAULT;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _polarDim: IPercentSize;
    private _innerDim: IPercentSize;

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    visible = true;

    /**
     * 그룹 이름.
     * <br>
     * 시리즈에서 이 값으로 자신이 속하는 그룹을 지정할 수 있다.
     */
    name: string;

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

    /**
     * 그룹 내의 포인트들을 배치하는 방식.
     */
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

    /**
     * {@link layout}이 {@link SeriesGroupLayout.FILL}일 때 상대적 최대값.
     * <br>
     * 
     * @default 100
     */
    layoutMax = 100;

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
    // 축 단위 내에서 이 그룹이 차지하는 계산된 영역 너비. 0 ~ 1 사이의 값.
    _groupWidth = 1;
    // 축 단위 내에서 이 그룹이 시작하는 위치. 0 ~ 1 사이의 상대 값.
    _groupPos = 0;
    _series: Series[] = [];
    _stackPoints: Map<number, DataPoint[]>;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(src: any): void {
        for (const p in src) {
            // if (this.hasOwnProperty(p)) {
                this[p] = src[p];
            // }
        }

        this._polarDim = parsePercentSize(this.polarSize, true) || { size: 80, fixed: false };
        this._innerDim = parsePercentSize(this.innerSize, true);
    }

    getPolarSize(width: number, height: number): number {
        return calcPercent(this._polarDim, Math.min(width, height));
    }

    getInnerRadius(rd: number): number {
        // 반지름에 대한 비율로 전달해야 한다.
        const dim = this._innerDim;
        return dim ? dim.size / (dim.fixed ? rd : 100) : 0;
    }

    prepareRender(): void {
        let series = this._series.filter(ser => ser.visible).sort((s1, s2) => (s1.zOrder || 0) - (s2.zOrder || 0));

        if (series.length > 0) {
            this.$_validate();

            if (series[0] instanceof PieSeries) {
                if (this._layout === SeriesGroupLayout.STACK || this._layout === SeriesGroupLayout.FILL) {
                    const sum = series.map(ser => (ser as PieSeries).groupSize).reduce((a, c) => a + pickNum(c, 1), 0);
                    let p = 0;
                    
                    series.forEach((ser: PieSeries) => {
                        ser._groupPos = p;
                        p += ser._groupSize = pickNum(ser.groupSize, 1) / sum;
                    });
                }
            } else {
                if (this._layout === SeriesGroupLayout.DEFAULT) {
                    const series2 = series.filter(ser => ser instanceof BoxSeries) as BoxSeries[];
                    
                    const cnt = series2.length;
    
                    if (cnt > 1) {
                        const sum = series2.map(ser => ser.pointWidth).reduce((a, c) => a + c);
                        let x = 0;
                        
                        series2.forEach(ser => {
                            ser._groupWidth = ser.pointWidth / sum;
                            ser._groupPos = x;
                            x += ser._groupWidth;
                        });
                    } else if (cnt === 1) {
                        series2[0]._groupWidth = 1;
                    }
                } else if (this._layout === SeriesGroupLayout.STACK) {
                }
            }
        }
    }

    // Axis에서 요청한다.
    collectValues(axis: IAxis): number[] {
        if (axis === this._series[0]._yAxisObj) {
            switch (this._layout) {
                case SeriesGroupLayout.STACK:
                    return this.$_collectStack(axis);

                case SeriesGroupLayout.FILL:
                    return this.$_collectFill(axis);
    
                case SeriesGroupLayout.DEFAULT:
                case SeriesGroupLayout.OVERLAP:
                    return this.$_collectValues(axis);
            }
        } else {
            return this.$_collectValues(axis);
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_validate(): void {
        const series = this._series;
        const polar = series[0].needAxes();

        // 모든 시리즈가 같은 축을 공유해야 한다.
        for (let i = 1; i < series.length; i++) {
            if (series[i].needAxes() != polar) {
                throw new Error('같은 그룹에 포함될 수 없는 시리지들입니다.');
            }
            if (series[i]._xAxisObj !== series[i - 1]._xAxisObj || series[i]._yAxisObj !== series[i - 1]._yAxisObj) {
                throw new Error('같은 그룹 내의 시리즈들은 동일한 축들에 연결돼야 한다.');
            }
        }
    }

    private $_collectValues(axis: IAxis): number[] {
        let vals: number[] = [];

        this._series.forEach(ser => {
            vals = vals.concat(ser.collectValues(axis));
        })
        return vals;
    }

    private $_collectPoints(): Map<number, DataPoint[]> {
        const series = this._series;
        const map: Map<number, DataPoint[]> = this._stackPoints = new Map();

        series[0]._visPoints.forEach(p => map.set(p.xValue, [p]));

        for (let i = 1; i < series.length; i++) {
            series[i]._visPoints.forEach(p => {
                const pts = map.get(p.xValue);
                
                if (pts) {
                    pts.push(p);
                } else {
                    map.set(p.xValue, [p]);
                }
            });
        }
        return map;
    }

    private $_collectStack(axis: IAxis): number[] {
        const map = this.$_collectPoints();
        const vals: number[] = [];

        for (const pts of map.values()) {
            for (let i = 1; i < pts.length; i++) {
                pts[i].yGroup = pts[i - 1].yGroup + pts[i].yValue;
            }
            vals.push(pts[pts.length - 1].yGroup);
        }
        return vals;
    }

    private $_collectFill(axis: IAxis): number[] {
        const max = this.layoutMax || 100;
        const map = this.$_collectPoints();
        const vals: number[] = [];

        for (const pts of map.values()) {
            let sum = 0;
            for (const p of pts) {
                sum += p.yValue || 0;
            }
            let prev = 0;
            for (const p of pts) {
                p.yValue = p.yValue / sum * max;
                prev = p.yGroup = p.yValue + prev;
            }
            vals.push(max);
        }
         
        return vals;
    }
}

export class SeriesGroupCollection2 {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    private static readonly DEFAULT = new SeriesGroup2();

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly chart: IChart;
    private _items: SeriesGroup2[] = [];
    private _map = new Map<string, SeriesGroup2>();

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        this.chart = chart;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get first(): SeriesGroup2 {
        return this._items[0] || SeriesGroupCollection2.DEFAULT;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    get(name: string | number): SeriesGroup2 {
        return  this._map[name] || this._items[name] || this._items[0];
    }

    load(src: any): void {
        const chart = this.chart;

        this._items = [];
        this._map.clear();

        if (isArray(src)) {
            src.forEach((s, i) => this._items.push(this.$_loadGroup(chart, s)));
        } else if (isObject(src)) {
            this._items.push(this.$_loadGroup(chart, src));
        } else {
            const g = SeriesGroupCollection2.DEFAULT;
            g._series = [];
            this._items.push(g);
        }

        chart._getSeries2().forEach(ser => {
            const g = this.get(ser.group);

            ser._group = g;
            g._series.push(ser);
        })
    }

    prepareRender(): void {
        const n = this._items.length;

        if (n > 1) {
            const sum = this._items.map(g => g.groupWidth).reduce((a, c) => a + c, 0);
            let x = 0;

            this._items.forEach((g, i) => {
                g._groupWidth = g.groupWidth / sum;
                g._groupPos = x;
                x += g._groupWidth;
                g.prepareRender();
            });
        } else if (n === 1) {
            const g = this.first;

            g._groupWidth = 1;
            g.prepareRender();
        }
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadGroup(chart: IChart, src: any): SeriesGroup2 {
        const g = new SeriesGroup2();

        g.load(src);
        src.name && this._map.set(src.name, g);
        return g;
    }
}

