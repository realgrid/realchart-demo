////////////////////////////////////////////////////////////////////////////////
// RcChartModels.ts
// 2023. 09. 19. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { _undef } from "../common/Types";
import { Annotation } from "../model/Annotation";
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
     * 지정 가능한 설정 값 목록은 {@link config Configuration API 페이지}에서 확인할 수 있다. 
     * 
     * ```js
     * Utils.log(chart.series.get('name'))
     * ```
     * 
     * 하위 객체의 설정 속성은 속성 경로를 지정해서 직접 가져올 수도 있다.
     * 
     * ```js
     * Utils.log(chart.axis.get('title.text'));
     * ```
     * 
     * 속성 변경은 {@link set}, {@link setAll}, {@link toggle}등으로 실행한다.
     * 
     * @param prop '**.**'으로 구분되는 속성 경로.
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
     * 지정 가능한 설정 값 목록은 {@link config Configuration API 페이지}에서 확인할 수 있다.\
     * 또, 이 객체 자신을 리턴하므로 javascript에서 builder 패턴으로 설정 값들을 연속해서 지정할 수 있다.
     * 
     * ```js
     *  chart.series.set('xAxis', 1).set('yAxis', 1);
     * ```
     * 
     * [get](#get)에서와 마찬가지로 하위 객체의 설정 속성을 속성 경로를 통해 직접 설정할 수도 있다.
     * 
     * ```js
     * chart.axis.set('title.text', 'New Title'));
     * ```
     * 
     * @param prop 설정 속성 경로 문자열
     * @param value 지정할 값(들)
     * @param redraw true로 지정하면 chart를 다시 그린다. 
     *               false로 지정하고 여러 설정 후에 {@link rc.RcChartControl.render render}를 호출해서 다시 그리게 할 수도 있다.
     * @returns 이 객체 자신
     */
    set(prop: string, value: any, redraw = true): RcChartObject {
        this.$_p.setProp(prop, value, redraw);
        return this;
    }
    /**
     * JSON 객체로 지정한 속성들의 값을 설정한다.\
     * 지정 가능한 설정 값 목록은 {@link config Configuration API 페이지}에서 확인할 수 있다. 
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
     *               false로 지정하고 여러 설정 후에 {@link rc.RcChartControl.render render}를 호출해서 다시 그리게 할 수도 있다.
     * @returns 이 객체 자신
     */
    setAll(props: object, redraw = true): RcChartObject {
        this.$_p.setProps(props, redraw);
        return this;
    }
    /**
     * Boolean 타입의 설정값을 변경한다.\
     * 지정 가능한 설정 값 목록은 {@link config Configuration API 페이지}에서 확인할 수 있다. 
     * 
     * ```js
     * chart.getSeries('ser02').toggle('visible');
     * ```
     * 
     * @param prop 설정 속성 이름
     * @param redraw true로 지정하면 chart를 다시 그린다. 
     *               false로 지정하고 여러 설정 후에 {@link rc.RcChartControl.render render}를 호출해서 다시 그리게 할 수도 있다.
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

    /**
     * 가이드 라벨 설정 모델.
     */
    get label(): RcChartObject {
        return this._label;
    }
}

/**
 * 차트 축 모델.
 */
export class RcChartAxis extends RcChartObject {

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

    /**
     * 축 방향.
     */
    get xy(): 'x' | 'y' {
        return (this.$_p as Axis)._isX ? 'x' : 'y';
    }
    /**
     * x축이면 true.
     */
    get isX(): boolean {
        return (this.$_p as Axis)._isX;
    }
    /**
     * 축 타이틀 설정 모델.
     */
    get title(): RcChartObject { return this._title; }
    /**
     * 축 선 설정 모델.
     */
    get line(): RcChartObject { return this._line; }
    /**
     * 축 그리드 설정 모델.
     */
    get grid(): RcChartObject { return this._grid; }
    /**
     * tick 선 설정 모델.
     */
    get tick(): RcChartObject { return this._tick; }
    /**
     * tick label 설정 모델.
     */
    get label(): RcChartObject { return this._label; }
    /**
     * 크로스헤어 설정 모델.
     */
    get crosshair(): RcChartObject { return this._crosshair; }
    /**
     * @internal 
     * 
     * 스크롤바 설정 모델.
     */
    get scrollBar(): RcChartObject { return this._scrollBar; }

    // getGuide(index: number): RcChartObject {
    //     return;
    // }

    /**
     * 시리즈 연결 여부.\
     * 연결된 시리즈가 하나도 없으면 true.
     */
    get isEmpty(): boolean {
        return (this.$_p as Axis).isEmpty();
    }

    /**
     * 줌 상태를 제거하고 모든 데이터포인트들이 표시되도록 한다.
     */
    resetZoom(): void {
        (this.$_p as Axis).resetZoom();
    }

    /**
     * 지정한 영역에 포함된 데이터포인트들만 표시되도록 한다.
     * 
     * @param start 영역의 시작 값.
     * @param end 영역의 끝 값. 영역에는 포함되지 않는다.
     */
    zoom(start: number, end: number): void {
        (this.$_p as Axis).zoom(start, end);
    }
}

// export class RcCategoryAxis extends RcChartAxis {
// }

// export abstract class RcContinuousAxis extends RcChartAxis {
// }

// export class RcLinearAxis extends RcContinuousAxis {
// }

// export class RcTimeAxis extends RcContinuousAxis {
// }

// export class RcLogAxis extends RcContinuousAxis {
// }

export class RcPointLabel extends RcChartAxis {
}

export abstract class RcNamedObject extends RcChartObject {

    /**
     * config에서 설정해된 name을 리턴한다.\
     * 최초 설정한 이름은 변경할 수 없다.
     */
    get name(): string {
        return (this.$_p as any).name;
    }
}

/**
 * 차트 시리즈 모델들의 기반 클래스.\
 */
export class RcChartSeries extends RcNamedObject {

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

    /**
     * xValue에 해당하는 데이터포인터의 yValue를 리턴한다.
     */
    getValueAt(xValue: number): number {
        const p = (this.$_p as Series).getPointAt(xValue);
        return p ? p.yValue : _undef;
    }
    
    setValueAt(xValue: number, yValue: number): void {
        const p = (this.$_p as Series).getPointAt(xValue);
        if (p) {
            (this.$_p as Series).setValueAt(xValue, yValue);
        }
    }

    getPoint(keys: any): any {
        return (this.$_p as Series).getPoint(keys);
    }

    updatePoint(keys: any, values: any): void {
        (this.$_p as Series).updatePoint(keys, values);
    }

    /**
     * 시리즈 data 원본을 변경한다.\
     * [주의] x축이 카테고리 축이고, x축의 categories 속성이 명시적으로 설정되지 않았다면,
     * 이 함수 호출 후 카테고리가 변경될 수 있다.
     * 
     * @param data 원본 데이터포인트 값 배열.
     */
    updateData(data: any): void {
        (this.$_p as Series).updateData(data);
    }
}

/**
 * 차트 시리즈그룹 모델.
 */
export class RcSeriesGroup extends RcNamedObject {
}

// export abstract class RcLineSeriesBase extends RcChartSeries {
// }

// export class RcLineSeries extends RcLineSeriesBase {
// }

// /**
//  * **'area'** 시리즈.
//  */
// export class RcAreaSeries extends RcChartSeries {
// }

// /**
//  * **'arearange'** 시리즈.
//  */
// export class RcAreaRangeSeries extends RcChartSeries {
// }

// /**
//  * **'bar'** 시리즈.
//  * 
//  * @see {@link rc.RcLineSeries}
//  */
// export class RcBarSeries extends RcChartSeries {
// }

// /**
//  * **'barrange'** 시리즈.
//  */
// export class RcBarRangeSeries extends RcChartSeries {
// }

// /**
//  * **'bellcurve'** 시리즈.
//  */
// export class RcBellCurveSeries extends RcChartSeries {
// }

// /**
//  * **'boxplot'** 시리즈.
//  */
// export class RcBoxPlotSeries extends RcChartSeries {
// }

// /**
//  * **'bubble'** 시리즈.
//  */
// export class RcBubbleSeries extends RcChartSeries {
// }

// /**
//  * **'scatter'** 시리즈.
//  */
// export class RcScatterSeries extends RcChartSeries {
// }

// /**
//  * **'candlestick'** 시리즈.
//  */
// export class RcCandlestickSeries extends RcChartSeries {
// }

// /**
//  * **'dumbbell'** 시리즈.
//  */
// export class RcDumbbellSeries extends RcChartSeries {
// }

// /**
//  * **'equalizer'** 시리즈.
//  */
// export class RcEqualizerSeries extends RcChartSeries {
// }

// /**
//  * **'errorbar'** 시리즈.
//  */
// export class RcErrorBarSeries extends RcChartSeries {
// }

// /**
//  * **'funnel'** 시리즈.
//  */
// export class RcFunnelSeries extends RcChartSeries {
// }

// /**
//  * **'heatmap'** 시리즈.
//  */
// export class RcHeatmapSeries extends RcChartSeries {
// }

// /**
//  * **'treemap'** 시리즈.
//  */
// export class RcTreemapSeries extends RcChartSeries {
// }

// /**
//  * **'histogram'** 시리즈.
//  */
// export class RcHistogramSeries extends RcChartSeries {
// }

// /**
//  * **'lollipop'** 시리즈.
//  */
// export class RcLollipopSeries extends RcChartSeries {
// }

// /**
//  * **'ohlc'** 시리즈.
//  */
// export class RcOhlcSeries extends RcChartSeries {
// }

// /**
//  * **'pareto'** 시리즈.
//  */
// export class RcParetoSeries extends RcChartSeries {
// }

// /**
//  * **'pie'** 시리즈.
//  */
// export class RcPieSeries extends RcChartSeries {
// }

// /**
//  * **'vector'** 시리즈.
//  */
// export class RcVectorSeries extends RcChartSeries {
// }

// /**
//  * **'waterfall'** 시리즈.
//  */
// export class RcWaterfallSeries extends RcChartSeries {
// }

// /**
//  * **'bargroup'** 시리즈그룹.
//  */
// export class RcBarSeriesGroup extends RcSeriesGroup {
// }

// /**
//  * **'linegroup'** 시리즈그룹.
//  */
// export class RcLineSeriesGroup extends RcSeriesGroup {
// }

// /**
//  * **'areagroup'** 시리즈그룹.
//  */
// export class RcAreaSeriesGroup extends RcSeriesGroup {
// }

// /**
//  * **'piegroup'** 시리즈그룹.
//  */
// export class RcPieSeriesGroup extends RcSeriesGroup {
// }

// /**
//  * **'bumpgroup'** 시리즈그룹.
//  */
// export class RcBumpSeriesGroup extends RcSeriesGroup {
// }

/**
 * {@link RcChartGauge 차트 게이지}와 {@link RcGaugeGroup 게이지그룹} 모델들의 기반 클래스.
 */
export abstract class RcChartGaugeBase extends RcNamedObject {
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

export abstract class RcLinearGaugeBase extends RcValueGauge {

    private _label: RcChartObject;
    private _scale: RcGaugeScale;

    protected _doInit(proxy: ChartItem): void {
        this._createObjects('label');

        this._scale = new RcGaugeScale(proxy['scale']);
    }

    /**
     * label 모델.
     */
    get label(): RcChartObject { return this._label; }
    /**
     * scale 모델.
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
export class RcLinearGauge extends RcLinearGaugeBase {

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
export class RcBulletGauge extends RcLinearGaugeBase {
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

// /**
//  * **'circle'** 게이지그룹.
//  * {@link RcCircleGauge} 그룹 모델.
//  */
// export class RcCircleGaugeGroup extends RcGaugeGroup {
// }

// /**
//  * **'linear'** 게이지그룹.
//  * {@link RcLinearGauge} 그룹 모델.
//  */
// export class RcLinearGaugeGroup extends RcGaugeGroup {
// }

// /**
//  * **'bullet'** 게이지그룹.
//  * {@link RcBulletGauge} 그룹 모델.
//  */
// export class RcBulletGaugeGroup extends RcGaugeGroup {
// }

export class RcTitle extends RcChartObject {
}

export class RcSubtitle extends RcChartObject {
}

export class RcLegend extends RcChartObject {
}

export class RcBody extends RcChartObject {
}

export class RcAnnotation extends RcNamedObject {

    update(): void {
        (this.$_p as Annotation).update();
    }
}

export class RcTextAnnotation extends RcAnnotation {
}

export class RcImageAnnotation extends RcAnnotation {
}

export class RcShapeAnnotation extends RcAnnotation {
}