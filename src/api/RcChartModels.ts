////////////////////////////////////////////////////////////////////////////////
// RcChartModels.ts
// 2023. 09. 19. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartItem } from "../model/ChartItem";
import { GaugeBase, ValueGauge } from "../model/Gauge";
import { Series } from "../model/Series";
import { ClockGauge } from "../model/gauge/ClockGauge";

/**
 * 차트 구성 요소 모델들의 기반 클래스.
 */
export abstract class RcChartObject {

    /**
     * @internal
     */
    $_p: ChartItem;

    /** 
     * @internal 
     */
    protected constructor(proxy: ChartItem) {
        this.$_p = proxy;
    }

    /**
     * 표시 여부.\
     * 모델 종류에 따라 기본값이 다르다.
     */
    get visible(): boolean { return this.$_p.visible; }
    set visible(value: boolean) { this.$_p.visible = value; }
    /**
     * 지정한 속성의 값(들)을 가져온다.
     * 
     * @param prop 속성 경로.
     * @param deep true면 하위 속성 객체들의 값들도 포함한다.
     * @returns 속성 값 혹은 객체.
     */
    getProp(prop: string, deep = false): any {
        return this.$_p.getProp(prop, deep);
    }
    /**
     * 지정한 속성의 값(들)을 설정한다.
     * 
     * @param prop 속성 경로.
     * @param value 지정할 값(들).
     */
    setProp(prop: string, value: any): void {
        this.$_p.setProp(prop, value);
    }
    /** 
     * @internal 
     */
    protected _changed(): void {
        this.$_p.chart._modelChanged(this.$_p);
    }
}

/**
 * 차트 시리즈 모델들의 기반 클래스.
 */
export abstract class RcChartSeries extends RcChartObject {

    /** 
     * @internal 
     */
    protected constructor(proxy: Series) {
        super(proxy);
    }
    /**
     * 시리즈 종류.
     */
    get type(): string { return (this.$_p as Series)._type();}
    /**
     * 시리즈 이름.
     */
    get name(): string { return (this.$_p as Series).name; }
}

/**
 * 차트 시리즈그룹 모델들의 기반 클래스.
 */
export abstract class RcSeriesGroup extends RcChartObject {
}

/**
 * **'line'** 시리즈.
 */
export class RcLineSeries extends RcChartSeries {
}

/**
 * **'area'** 시리즈.
 */
export class RcAreaSeries extends RcChartSeries {
}

/**
 * **'arearange'** 시리즈.
 */
export class RcAreaRangeSeries extends RcChartSeries {
}

/**
 * **'bar'** 시리즈.
 */
export class RcBarSeries extends RcChartSeries {
}

/**
 * **'barrange'** 시리즈.
 */
export class RcBarRangeSeries extends RcChartSeries {
}

/**
 * **'bellcurve'** 시리즈.
 */
export class RcBellCurveSeries extends RcChartSeries {
}

/**
 * **'boxplot'** 시리즈.
 */
export class RcBoxPlotSeries extends RcChartSeries {
}

/**
 * **'bubble'** 시리즈.
 */
export class RcBubbleSeries extends RcChartSeries {
}

/**
 * **'scatter'** 시리즈.
 */
export class RcScatterSeries extends RcChartSeries {
}

/**
 * **'candlestick'** 시리즈.
 */
export class RcCandlestickSeries extends RcChartSeries {
}

/**
 * **'dumbbell'** 시리즈.
 */
export class RcDumbbellSeries extends RcChartSeries {
}

/**
 * **'equalizer'** 시리즈.
 */
export class RcEqualizerSeries extends RcChartSeries {
}

/**
 * **'errorbar'** 시리즈.
 */
export class RcErrorBarSeries extends RcChartSeries {
}

/**
 * **'funnel'** 시리즈.
 */
export class RcFunnelSeries extends RcChartSeries {
}

/**
 * **'heatmap'** 시리즈.
 */
export class RcHeatmapSeries extends RcChartSeries {
}

/**
 * **'treemap'** 시리즈.
 */
export class RcTreemapSeries extends RcChartSeries {
}

/**
 * **'histogram'** 시리즈.
 */
export class RcHistogramSeries extends RcChartSeries {
}

/**
 * **'lollipop'** 시리즈.
 */
export class RcLollipopSeries extends RcChartSeries {
}

/**
 * **'ohlc'** 시리즈.
 */
export class RcOhlcSeries extends RcChartSeries {
}

/**
 * **'pareto'** 시리즈.
 */
export class RcParetoSeries extends RcChartSeries {
}

/**
 * **'pie'** 시리즈.
 */
export class RcPieSeries extends RcChartSeries {
}

/**
 * **'vector'** 시리즈.
 */
export class RcVectorSeries extends RcChartSeries {
}

/**
 * **'waterfall'** 시리즈.
 */
export class RcWaterfallSeries extends RcChartSeries {
}

/**
 * **'bargroup'** 시리즈그룹.
 */
export class RcBarSeriesGroup extends RcSeriesGroup {
}

/**
 * **'linegroup'** 시리즈그룹.
 */
export class RcLineSeriesGroup extends RcSeriesGroup {
}

/**
 * **'areagroup'** 시리즈그룹.
 */
export class RcAreaSeriesGroup extends RcSeriesGroup {
}

/**
 * **'piegroup'** 시리즈그룹.
 */
export class RcPieSeriesGroup extends RcSeriesGroup {
}

/**
 * **'bumpgroup'** 시리즈그룹.
 */
export class RcBumpSeriesGroup extends RcSeriesGroup {
}

/**
 * 차트 게이지와 게이지그룹 모델들의 기반 클래스.
 */
export abstract class RcChartGaugeBase extends RcChartObject {

    // /**
    //  * left
    //  * 
    //  * @config
    //  */
    // get left(): number | string {
    //     return (this.$_p as GaugeBase).left;
    // }
    // set left(value: number | string) {
    //     if (value !== (this.$_p as GaugeBase).left) {
    //         (this.$_p as GaugeBase).left = value;
    //         this._changed();
    //     }
    // }
    // /**
    //  * right
    //  * 
    //  * @config
    //  */
    // get right(): number | string {
    //     return (this.$_p as GaugeBase).right;
    // }
    // set right(value: number | string) {
    //     if (value !== (this.$_p as GaugeBase).right) {
    //         (this.$_p as GaugeBase).right = value;
    //         this._changed();
    //     }
    // }
    // /**
    //  * top
    //  * 
    //  * @config
    //  */
    // get top(): number | string {
    //     return (this.$_p as GaugeBase).top;
    // }
    // set top(value: number | string) {
    //     if (value !== (this.$_p as GaugeBase).top) {
    //         (this.$_p as GaugeBase).top = value;
    //         this._changed();
    //     }
    // }
    // /**
    //  * bottom
    //  * 
    //  * @config
    //  */
    // get bottom(): number | string {
    //     return (this.$_p as GaugeBase).bottom;
    // }
    // set bottom(value: number | string) {
    //     if (value !== (this.$_p as GaugeBase).bottom) {
    //         (this.$_p as GaugeBase).bottom = value;
    //         this._changed();
    //     }
    // }
    // /**
    //  * width
    //  * 
    //  * @config
    //  */
    // get width(): number | string {
    //     return (this.$_p as GaugeBase).width;
    // }
    // set width(value: number | string) {
    //     if (value !== (this.$_p as GaugeBase).width) {
    //         (this.$_p as GaugeBase).width = value;
    //         this._changed();
    //     }
    // }
    // /**
    //  * height
    //  * 
    //  * @config
    //  */
    // get height(): number | string {
    //     return (this.$_p as GaugeBase).height;
    // }
    // set height(value: number | string) {
    //     if (value !== (this.$_p as GaugeBase).height) {
    //         (this.$_p as GaugeBase).height = value;
    //         this._changed();
    //     }
    // }
}

/**
 * 차트 게이지 모델들의 기반 클래스.
 */
export abstract class RcChartGauge extends RcChartGaugeBase {
}

/**
 * 값을 표시하는 차트 게이지 모델들의 기반 클래스.
 */
export abstract class RcValueGauge extends RcChartGauge {
    /**
     * 게이지의 값을 변경한다.
     */
    updateValue(value: any): void {
        (this.$_p as ValueGauge).updateValue(value);
    }
}

/**
 * **'circle'** 게이지.
 * 원이나 원호로 값을 표시하는 게이지.
 */
export class RcCircleGauge extends RcValueGauge {
}

/**
 * **'linear'** 게이지.
 * 선분에 값을 표시하는 게이지.
 */
export class RcLinearGauge extends RcValueGauge {
}

/**
 * **'bullet'** 게이지.
 * 목표 값과 현재 값을 선형으로 표시하는 게이지.
 * 
 * @see {@link RcCircleGauge}
 * @see {@link RcLinearGauge}
 */
export class RcBulletGauge extends RcValueGauge {
}

/**
 * **'clock'** 게이지.
 * 시간을 표시하는 시간 게이지.
 */
export class RcClockGauge extends RcChartGauge {
    /**
     * 시게 동작 여부.
     * 
     * @default true
     */
    get active() { return (this.$_p as ClockGauge).active; }
    set active(value: boolean) { (this.$_p as ClockGauge).active = value; }
}

/**
 * 차트 게이지그룹 모델들의 기반 클래스.
 */
export abstract class RcGaugeGroup extends RcChartGaugeBase {
}

/**
 * **'circle'** 게이지그룹.
 * {@link RcCircleGauge} 그룹 모델.
 */
export class RcCircleGaugeGroup extends RcGaugeGroup {
}

/**
 * **'linear'** 게이지그룹.
 * {@link RcLinearGauge} 그룹 모델.
 */
export class RcLinearGaugeGroup extends RcGaugeGroup {
}

/**
 * **'bullet'** 게이지그룹.
 * {@link RcBulletGauge} 그룹 모델.
 */
export class RcBulletGaugeGroup extends RcGaugeGroup {
}
