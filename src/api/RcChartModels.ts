////////////////////////////////////////////////////////////////////////////////
// RcChartModels.ts
// 2023. 09. 19. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartItem } from "../model/ChartItem";
import { ValueGauge } from "../model/Gauge";
import { Series } from "../model/Series";
import { ClockGauge } from "../model/gauge/ClockGauge";

/**
 * 차트 구성 요소 모델들의 기반 클래스.
 */
export abstract class RcChartObject {

    /** @private */
    $_p: ChartItem;

    constructor(proxy: ChartItem) {
        this.$_p = proxy;
    }

    /**
     * 표시 여부.
     * 모델 종류에 따라 기본값이 다르다.
     */
    get visible(): boolean { return this.$_p.visible; }
    set visible(value: boolean) { this.$_p.visible = value; }

    getProp(prop: string, deep = false): any {
        return this.$_p.getProp(prop, deep);
    }

    setProp(prop: string, value: any): void {
        this.$_p.setProp(prop, value);
    }

    setProps(props: object): void {
        this.$_p.setProps(props);
    }

    protected _changed(): void {
        this.$_p.chart._modelChanged(this.$_p);
    }
}

/**
 * 차트 시리즈 모델들의 기반 클래스.
 */
export abstract class RcChartSeries extends RcChartObject {

    constructor(proxy: Series) {
        super(proxy);
    }

    get type(): string { return (this.$_p as Series)._type();}
    get name(): string { return (this.$_p as Series).name; }
}

/**
 * 차트 시리즈그룹 모델들의 기반 클래스.
 */
export abstract class RcSeriesGroup extends RcChartObject {
}

export class RcLineSeries extends RcChartSeries {
}

export class RcAreaSeries extends RcChartSeries {
}

export class RcAreaRangeSeries extends RcChartSeries {
}

export class RcBarSeries extends RcChartSeries {
}

export class RcBarRangeSeries extends RcChartSeries {
}

export class RcBellCurveSeries extends RcChartSeries {
}

export class RcBoxPlotSeries extends RcChartSeries {
}

export class RcBubbleSeries extends RcChartSeries {
}

export class RcScatterSeries extends RcChartSeries {
}

export class RcCandlestickSeries extends RcChartSeries {
}

export class RcDumbbellSeries extends RcChartSeries {
}

export class RcEqualizerSeries extends RcChartSeries {
}

export class RcErrorBarSeries extends RcChartSeries {
}

export class RcFunnelSeries extends RcChartSeries {
}

export class RcHeatmapSeries extends RcChartSeries {
}

export class RcTreemapSeries extends RcChartSeries {
}

export class RcHistogramSeries extends RcChartSeries {
}

export class RcLollipopSeries extends RcChartSeries {
}

export class RcOhlcSeries extends RcChartSeries {
}

export class RcParetoSeries extends RcChartSeries {
}

export class RcPieSeries extends RcChartSeries {
}

export class RcVectorSeries extends RcChartSeries {
}

export class RcWaterfallSeries extends RcChartSeries {
}

export class RcBarSeriesGroup extends RcSeriesGroup {
}

export class RcLineSeriesGroup extends RcSeriesGroup {
}

export class RcAreaSeriesGroup extends RcSeriesGroup {
}

export class RcPieSeriesGroup extends RcSeriesGroup {
}

export class RcBumpSeriesGroup extends RcSeriesGroup {
}

/**
 * 차트 게이지 모델들의 기반 클래스.
 */
export abstract class RcChartGauge extends RcChartObject {
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
 * 원이나 원호로 값을 표시하는 게이지.
 */
export class RcCircleGauge extends RcValueGauge {
}

/**
 * 선분에 값을 표시하는 게이지.
 */
export class RcLinearGauge extends RcValueGauge {
}

/**
 * 목표 값과 현재 값을 선형으로 표시하는 게이지.
 */
export class RcBulletGauge extends RcValueGauge {
}

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
export abstract class RcGaugeGroup extends RcChartObject {
}

/**
 * {@link RcCircleGauge} 그룹 모델.
 */
export class RcCircleGaugeGroup extends RcGaugeGroup {
}

/**
 * {@link RcLinearGauge} 그룹 모델.
 */
export class RcLinearGaugeGroup extends RcGaugeGroup {
}

/**
 * {@link RcBulletGauge} 그룹 모델.
 */
export class RcBulletGaugeGroup extends RcGaugeGroup {
}
