////////////////////////////////////////////////////////////////////////////////
// RcChartModels.ts
// 2023. 09. 19. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Axis } from "../model/Axis";
import { ChartItem } from "../model/ChartItem";
import { ValueGauge } from "../model/Gauge";
import { Series } from "../model/Series";
import { CircleGauge } from "../model/gauge/CircleGauge";

/**
 * 차트 구성 요소 모델들의 기반 클래스.
 */
export class RcChartObject {

    /**
     * @internal
     */
    $_p: ChartItem;

    /** 
     * @internal 
     */
    protected constructor(proxy: ChartItem) {
        this._doInit(this.$_p = proxy);
    }

    /** 
     * @internal 
     */
    protected _createObjects(...objs: string[]): void {
        for (const obj of objs) {
            this['_' + obj] = new RcChartObject(this.$_p[obj]);

            // ! 각 객체 속성에 주석을 작성할 필요가 있다.
            // Object.defineProperty(this, obj, {
            //     value: this['_' + obj] = new RcChartObject(this.$_p[obj]),
            //     writable: false,
            //     enumerable: true
            // });
        }
    }

    /** 
     * @internal 
     */
    protected _doInit(proxy: ChartItem): void {
    }

    /**
     * 지정한 설정 값(들)을 가져온다.\
     * 지정 가능한 설정 값 목록은 Configuration API 페이지에 확인할 수 있다. 
     * 
     * @param prop 속성 경로.
     * @returns 속성 값 혹은 객체.
     */
    get(prop: string): any {
        const v = this.$_p.getProp(prop);
    
        if (v instanceof ChartItem) {
            const obj = this[prop];
            return obj instanceof RcChartObject ? obj : void 0;
        } else {
            return v;
        }
    }
    /**
     * 지정한 속성의 값(들)을 설정한다.\
     * 지정 가능한 설정 값 목록은 Configuration API 페이지에 확인할 수 있다.
     * 이 객체 자신을 리턴하므로 javascript에서 builder 패턴으로 설정 값들을 연속해서 지정할 수 있다.
     * 
     * ```js
     *  chart.series.set('xAxis', 1).set('yAxis', 1);
     * ```
     * 
     * @param prop 설정 속성 경로 문자열
     * @param value 지정할 값(들)
     * @param redraw true로 지정하면 chart를 다시 그린다. 
     *               false로 지정하고 여러 설정 후에 {@link RcChartControl.render}를 호출해서 다시 그리게 할 수도 있다.
     * @returns 이 객체 자신
     */
    set(prop: string, value: any, redraw = true): RcChartObject {
        this.$_p.setProp(prop, value, redraw);
        return this;
    }
    /**
     * JSON 객체로 지정한 속성들의 값을 설정한다.\
     * 지정 가능한 설정 값 목록은 Configuration API 페이지에 확인할 수 있다.
     * 
     * ```js
     *  chart.series.set({
     *      xAxis: 1,
     *      yAxis: 1,
     *      yField: 'salary'
     *  });
     * ```
     * 
     * @param props 여러 설정 값들이 지정된 JSON 객체
     * @param redraw true로 지정하면 chart를 다시 그린다. 
     *               false로 지정하고 여러 설정 후에 {@link RcChartControl.render}를 호출해서 다시 그리게 할 수도 있다.
     * @returns 이 객체 자신
     */
    setAll(props: object, redraw = true): RcChartObject {
        this.$_p.setProps(props, redraw);
        return this;
    }
    /**
     * Boolean 타입의 설정값을 변경한다.
     * 
     * ```js
     * chart.getSeries('ser02').toggle('visible');
     * ```
     * 
     * @param prop 설정 속성 이름
     * @param redraw true로 지정하면 chart를 다시 그린다. 
     *               false로 지정하고 여러 설정 후에 {@link RcChartControl.render}를 호출해서 다시 그리게 할 수도 있다.
     * @returns 이 객체 자신
     */
    toggle(prop: string, redraw = true): RcChartObject {
        this.$_p.setProp(prop, !this.$_p.getProp(prop), redraw);
        return this;
    }

    /** 
     * @internal 
     */
    protected _changed(): void {
        this.$_p.chart._modelChanged(this.$_p);
    }
}

export abstract class RcAxisGuide extends RcChartObject {

    private _label: RcChartObject;

    protected _doInit(proxy: ChartItem): void {
        this._createObjects('label');
    }

    get label(): RcChartObject {
        return this._label;
    }
}

/**
 * Axis 모델들의 기반 클래스.\
 */
export abstract class RcChartAxis extends RcChartObject {

    private _title: RcChartObject;
    private _line: RcChartObject;
    private _grid: RcChartObject;
    private _tick: RcChartObject;
    private _label: RcChartObject;
    private _crosshair: RcChartObject;
    private _scrollBar: RcChartObject;

    /** 
     * @internal 
     */
    protected _doInit(proxy: Axis): void {
        this._createObjects('title', 'line', 'grid', 'tick', 'label', 'crosshair');
    }

    get title(): RcChartObject { return this._title; }
    get line(): RcChartObject { return this._line; }
    get grid(): RcChartObject { return this._grid; }
    get tick(): RcChartObject { return this._tick; }
    get label(): RcChartObject { return this._label; }
    get crosshair(): RcChartObject { return this._crosshair; }
    get scrollBar(): RcChartObject { return this._scrollBar; }

    // getGuide(index: number): RcChartObject {
    //     return;
    // }
}

export class RcCategoryAxis extends RcChartAxis {
}

export abstract class RcContinuousAxis extends RcChartAxis {
}

export class RcLinearAxis extends RcContinuousAxis {
}

export class RcTimeAxis extends RcContinuousAxis {
}

export class RcLogAxis extends RcContinuousAxis {
}

export class RcPointLabel extends RcChartAxis {
}

/**
 * 차트 시리즈 모델들의 기반 클래스.\
 */
export abstract class RcChartSeries extends RcChartObject {

    private _pointLabel: RcChartObject;
    private _trendLine: RcChartObject;
    private _tooltip: RcChartObject;

    /** 
     * @internal 
     */
    protected _doInit(proxy: ChartItem): void {
        this._createObjects('pointLabel', 'trendline', 'tooltip');
    }

    /**
     * point label 모델.
     */
    get pointLabel(): RcChartObject { return this._pointLabel; }
    /**
     * point label 모델.
     */
    get trendLine(): RcChartObject { return this._trendLine; }
    /**
     * point label 모델.
     */
    get tooltip(): RcChartObject { return this._tooltip; }
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
 * {@link RcChartGauge 차트 게이지}와 {@link RcGaugeGroup 게이지그룹} 모델들의 기반 클래스.
 */
export abstract class RcChartGaugeBase extends RcChartObject {
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
    updateValue(value: any, animate = true): void {
        (this.$_p as ValueGauge).updateValue(value, animate);
    }
}

export class RcGaugeScale extends RcChartObject {

    private _line: RcChartObject;
    private _tick: RcChartObject;
    private _tickLabel: RcChartObject;

    /**
     * @internal
     */
    protected _doInit(proxy: ChartItem): void {
        this._createObjects('line', 'tick', 'tickLabel');
    }

    /**
     * line 모델.
     */
    get line(): RcChartObject { return this._line};
    /**
     * tick 모델.
     */
    get tick(): RcChartObject { return this._tick};
    /**
     * tickLabel 모델.
     */
    get tickLabel(): RcChartObject { return this._tickLabel};
}

export abstract class RcCircularGauge extends RcValueGauge {

    private _label: RcChartObject

    protected _doInit(proxy: ChartItem): void {
        this._createObjects('label');
    }

    /**
     * label 모델.
     * 
     * {@link config.gauge.$gauge.band Configuration 속성들} 참조.
     */
    get label(): RcChartObject { return this._label; }
} 

export class RcGaugeRangeBand extends RcChartObject {

    private _rangeLabel: RcChartObject;
    private _tickLabel: RcChartObject;

    protected _doInit(proxy: ChartItem): void {
        this._createObjects('rangeLabel', 'thickLabel');
    }

    /**
     * rangeLabel 모델.
     * 
     * {@link config.gauge.$gauge.band.rangeLabel Configuration 속성들} 참조.
     */
    get rangeLabel(): RcChartObject { return this._rangeLabel; }
    /**
     * tickLabel 모델.
     * 
     * {@link config.gauge.$gauge.band.tickLabel Configuration 속성들} 참조.
     */
    get tickLabel(): RcChartObject { return this._tickLabel; }
}

/**
 * **'circle'** 게이지.
 * 원이나 원호로 값을 표시하는 게이지.
 *
 * {@link config.gauge.circle Configuration 속성들} 참조.
 * 
 * @configvar gauge=circle
 */
export class RcCircleGauge extends RcCircularGauge {

    private _band: RcGaugeRangeBand;
    private _scale: RcChartObject;
    private _rim: RcChartObject;
    private _valueRim: RcChartObject;
    private _marker: RcChartObject;
    private _hand: RcChartObject;
    private _pin: RcChartObject;

    protected _doInit(proxy: CircleGauge): void {
        this._createObjects('scale', 'rim', 'valueRim', 'marker', 'hand', 'pin');
        this._band = new RcGaugeRangeBand(proxy.band)
    }

    /**
     * band 모델.
     * 
     * {@link config.gauge.circle.band Configuration 속성들} 참조.
     */
    get band(): RcGaugeRangeBand { return this._band; }
    /**
     * scale 모델.
     * 
     * {@link config.gauge.circle.scale Configuration 속성들} 참조.
     */
    get scale(): RcChartObject { return this._scale; }
    /**
     * rim 모델.
     * 
     * {@link config.gauge.circle.rim Configuration 속성들} 참조.
     */
    get rim(): RcChartObject { return this._rim; }
    /**
     * valueRim 모델.
     * 
     * {@link config.gauge.circle.valueRim Configuration 속성들} 참조.
     */
    get valueRim(): RcChartObject { return this._valueRim; }
    /**
     * marker 모델.
     * 
     * {@link config.gauge.circle.marker Configuration 속성들} 참조.
     */
    get marker(): RcChartObject { return this._marker; }
    /**
     * hand 모델.
     * 
     * {@link config.gauge.circle.hand Configuration 속성들} 참조.
     */
    get hand(): RcChartObject { return this._hand; }
    /**
     * pin 모델.
     * 
     * {@link config.gauge.circle.pin Configuration 속성들} 참조.
     */
    get pin(): RcChartObject { return this._pin; }
}

export abstract class RcLinerGaugeBase extends RcValueGauge {

    private _label: RcChartObject;
    private _scale: RcGaugeScale;

    protected _doInit(proxy: ChartItem): void {
        this._createObjects('label');

        this._scale = new RcGaugeScale(proxy['scale']);
    }

    /**
     * label 모델.
     * 
     * {@link config.gauge.$gauge.label Configuration 속성들} 참조.
     */
    get label(): RcChartObject { return this._label; }
    /**
     * scale 모델.
     * 
     * {@link config.gauge.$gauge.scale Configuration 속성들} 참조.
     */
    get scale(): RcChartObject { return this._scale; }
}

/**
 * **'linear'** 게이지.\
 * 선분에 값을 표시하는 게이지.
 * 
 * @see {@link RcCircleGauge}
 * @see {@link RcBulletGauge}
 * 
 * @configvar gauge=linear
 */
export class RcLinearGauge extends RcLinerGaugeBase {

    private _marker: RcChartObject;
    private _band: RcChartObject;
}

/**
 * **'bullet'** 게이지.\
 * 목표 값과 현재 값을 선형으로 표시하는 게이지.
 * 
 * @see {@link RcCircleGauge}
 * @see {@link RcLinearGauge}
 * 
 * @configvar gauge=bullet
 */
export class RcBulletGauge extends RcValueGauge {
}

/**
 * **'clock'** 게이지.\
 * 시간을 표시하는 시간 게이지.
 */
export class RcClockGauge extends RcChartGauge {
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

export class RcTitle extends RcChartObject {
}

export class RcSubtitle extends RcChartObject {
}

export class RcLegend extends RcChartObject {
}

export class RcBody extends RcChartObject {
}