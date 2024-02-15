////////////////////////////////////////////////////////////////////////////////
// RcChartModels.ts
// 2023. 09. 19. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray } from "../common/Common";
import { _undef } from "../common/Types";
import { Annotation } from "../model/Annotation";
import { Axis } from "../model/Axis";
import { ChartItem } from "../model/ChartItem";
import { DataPoint } from "../model/DataPoint";
import { ValueGauge } from "../model/Gauge";
import { Series } from "../model/Series";

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
     * 지정한 설정 값(들)을 가져온다.<br/>
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
     * 지정한 속성의 값(들)을 설정한다.<br/>
     * 지정 가능한 설정 값 목록은 {@link config Configuration API 페이지}에서 확인할 수 있다.<br/>
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

    protected override _doInit(proxy: ChartItem): void {
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
    protected override _doInit(proxy: Axis): void {
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

export class RcPointLabel extends RcChartAxis {
}

/**
 * {@link name | 이름}을 갖는 모델 base.
 */
export abstract class RcNamedObject extends RcChartObject {

    /**
     * config에서 설정해된 name을 리턴한다.<br/>
     * 최초 설정한 이름은 변경할 수 없다.
     */
    get name(): string {
        return (this.$_p as any).name;
    }
}

/**
 * 시리즈 내부에서 생성되는 데이터포인트 모델 정보.
 */
export interface IRcDataPoint {
    pid: number;
    xValue: number;
    yValue: number;
    zValue: number;
}

/**
 * 차트 시리즈 모델들의 기반 클래스.
 */
export class RcChartSeries extends RcNamedObject {

    private _pointLabel: RcChartObject;
    private _trendLine: RcChartObject;
    private _tooltip: RcChartObject;

    /** 
     * @internal 
     */
    protected override _doInit(proxy: ChartItem): void {
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
     * 시리즈에 설정된 데이터포인트 개수.<br/>
     */
    get pointCount(): number {
        return (this.$_p as Series)._runPoints.length;
    }

    /**
     * 시리즈에 설정된 데이터포인트들 중 표시 중인 것들의 개수.<br/>
     */
    get visiblePointCount(): number {
        return (this.$_p as Series)._visPoints.length;
    }

    /**
     * 지정한 x축 값에 위치한 첫번째 데이터포인트의 정보를 리턴한다.<br/>
     * 전달되는 데이터포인트 정보는 리턴 시점의 복사본이다.
     * 
     * @param xValue x값.
     * @returns 데이터포인트 모델 정보 객체.
     */
    getPointAt(xValue: number | string): IRcDataPoint {
        const p = (this.$_p as Series).getPointAt(xValue);
        return p && p.proxy();
    }

    /**
     * @internal findPoint가 구현된 시리즈가 없음.
     * 지정한 값들에 해당하는 첫번째 데이터포인트의 정보를 리턴한다.<br/>
     * 전달되는 데이터포인트 정보는 리턴 시점의 복사본이다.
     * 
     * @param keys 데이터포이터를 찾기 위한 값 목록.
     * @returns 데이터포인트 모델 정보 객체.
     */
    findPoint(keys: any): IRcDataPoint {
        const p = (this.$_p as Series).findPoint(keys);
        return p && p.proxy();
    }

    /**
     * xValue에 해당하는 첫번째 데이터포인터의 yValue를 리턴한다.
     * 
     * @param xValue x값 혹은 x,y값이 포함된 데이터포인트 정보. x축이 category 축이면 카테고리 이름을 지정할 수 있다.
     * @param prop 가져올 값. 지정하지 않으면 'yValue'.
     * @returns prop로 지정한 데이터포인트 값.
     */
    getValueAt(xValue: number | string | IRcDataPoint, prop = 'yValue'): number {
        const p = (this.$_p as Series).getPointAt(xValue);
        return p ? p[prop] : _undef;
    }
    /**
     * xValue에 해당하는 첫번째 데이터포인터의 값들을 변경한다.<br/>
     * 시리즈에 data를 지정하는 것과 동일한 방식으로 데이터포인트의 값(들)을 변경할 수 있다.<br/>
     * [주의] json으로 필드값(들)을 지정할 때는 시리즈에 지정된 field 이름 속성들과 같은 이름으로 값들을 지정해야 한다.
     * 
     * ```
     * const x = '카테고리';
     * const v = chart.series.getValueAt(x);
     * 
     * chart.series.updatePoint(x, v + 10);
     * ```
     * 
     * @param xValue x값. x축이 category 축이면 카테고리 이름을 지정할 수 있다.
     * @param values 변경할 단일 값, 배열, 또는 json.
     * @returns 변경됐으면 true.
     */
    updatePoint(xValue: number | string | IRcDataPoint, values: any): boolean {
        const p = (this.$_p as Series).getPointAt(xValue);

        if (p) {
            return !!(this.$_p as Series).updatePoint(p, values);
        }
        return false;
    }
    /**
     * 데이터포인트를 추가한다.
     * 
     * @param source 데이터포인트 원본 정보.
     * @returns 실제 추가된 데이터포인트 정보 객체를 리턴한다.
     */
    addPoint(source: any): IRcDataPoint {
        const p = (this.$_p as Series).addPoint(source);
        return p && p.proxy();
    }
    /**
     * 데이터포인트를 제거한다.
     * 
     * @param xValue 제거할 데이터포인트의 x값 혹은 카테고리 이름. 또는 getPointAt이나 findPoint로 가져온 데이터포인트 정보 객체.
     * @returns 실제로 제거되면 true를 리턴한다.
     */
    removePoint(xValue: number | string | IRcDataPoint): boolean {
        return !!(this.$_p as Series).removePoint((this.$_p as Series).getPointAt(xValue));
    }
    /**
     * 하나 이상의 데이터포인트들을 추가한다.
     * 
     * @param source 데이터포인트 원본 목록.
     * @returns 실제 추가된 데이터포인트 정보 객체 배열을 리턴한다.
     */
    addPoints(source: any[]): IRcDataPoint[] {
        return (this.$_p as Series).addPoints(source).map(p => p.proxy());
    }
    /**
     * 하나 이상의 데이터포인트들을 제거한다.
     * 
     * @param xValue 제거할 데이터포인트의 x값 혹은 카테고리 이름 목록. 또는 getPointAt이나 findPoint로 가져온 데이터포인트 정보 객체 목록.
     * @returns 실제로 제거된 데이터포인트 개수.
     */
    removePoints(xValues: (number | string | IRcDataPoint)[]): number {
        const pts: DataPoint[] = [];

        if (isArray(xValues)) {
            xValues.forEach(v => {
                pts.push((this.$_p as Series).getPointAt(v));
            })
            return (this.$_p as Series).removePoints(pts);
        }
        return 0;
    }
    /**
     * 시리즈 data 원본을 변경한다.<br/>
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

/**
 * {@link RcChartGauge 차트 게이지}와 {@link RcGaugeGroup 게이지그룹} 모델들의 기반 클래스.
 */
export class RcChartGauge extends RcNamedObject {
    /**
     * 게이지의 값을 변경한다.
     */
    setValue(value: any): void {
        (this.$_p as ValueGauge).updateValue(value);
    }
}

/**
 * 차트 게이지그룹 모델들의 기반 클래스.
 */
export abstract class RcGaugeGroup extends RcNamedObject {
}

/**
 * 어노테이션 모델.
 */
export class RcAnnotation extends RcNamedObject {

    update(): void {
        (this.$_p as Annotation).update();
    }
}

/**
 * 차트 타이틀 모델.<br/>
 * 기본적으로 차트 {@link config.title#align 중앙} 상단에 {@link config.title#text} 문자열을 표시한다.<br/>
 * 이 타이틀과 함께 {@link rc.RcSubtitle 부제목}을 추가로 표시할 수도 있다.
 */
export class RcTitle extends RcChartObject {
}

/**
 * 차트 부제목 모델.
 */
export class RcSubtitle extends RcChartObject {
}

/**
 * 차트 범례 모델.
 */
export class RcLegend extends RcChartObject {
}

/**
 * 시리즈들이 그려지는 영역 모델.
 */
export class RcBody extends RcChartObject {
}
