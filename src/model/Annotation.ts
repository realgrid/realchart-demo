////////////////////////////////////////////////////////////////////////////////
// Annotation.ts
// 2023. 11. 11. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, isString } from "../common/Common";
import { IPoint } from "../common/Point";
import { ISize } from "../common/Size";
import { Align, IAnnotationAnimation, IPercentSize, RtPercentSize, SVGStyleOrClass, VerticalAlign, calcPercent, parsePercentSize } from "../common/Types";
import { IChart } from "./Chart";
import { ChartItem } from "./ChartItem";
import { ISeries } from "./Series";

export enum AnnotationScope {
    // BODY = 'body',
    CHART = 'chart',
    CONTAINER = 'container'
};

/**
 * Annotation 모델.
 * @config chart.annotation[base]
 */
export abstract class Annotation extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _seriesObj: ISeries;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart, true);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    abstract _type(): string;
    /**
     * true로 지정하면 시리즈들 위에 표시된다.
     * 
     * @config
     */
    front = false;
    /**
     * Annotation 이름.\
     * 동적으로 Annotation을 다루기 위해서는 반드시 지정해야 한다. 
     * 
     * @config
     */
    name: string;
    /**
     * 수평 배치.
     * 
     * @config
     */
    align = Align.LEFT
    /**
     * 수직 배치.
     * 
     * @config
     */
    verticalAlign = VerticalAlign.TOP;
    offsetX = 10;
    offsetY = 10;
    /**
     * 회전 각도.\
     * 0 ~ 360 사이의 값으로 지정한다.
     * 
     * @config
     */
    rotation: number;
    /**
     * 차트 모델에서 지정된 annotationd의 표시 기준 영역.
     * 
     * @config
     */
    scope = AnnotationScope.CHART;
    /**
     * 연관 시리즈.\
     * 이 시리즈가 감춰질 때 같이 감춰진다.
     */
    series: string;
    /**
     * 처음 표시될 때 실행될 에니메이션 설정 정보.
     */
    loadAnimation: IAnnotationAnimation;
    /**
     * 배경 스타일.\
     * 경계 및 배경 색, padding 스타일을 지정할 수 있다.
     * 
     * @config
     */
    backgroundStyle: SVGStyleOrClass;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getPosition(inverted: boolean, left: number, top: number, wDomain: number, hDomain: number, width: number, height: number): IPoint {
        let x = left;
        let y = top;

        switch (this.align) {
            case Align.CENTER:
                x += (wDomain - width) / 2 + this.offsetX;
                break;

            case Align.RIGHT:
                x += wDomain - this.offsetX - width;
                break;

            default:
                x += this.offsetX;
                break;
        }

        switch (this.verticalAlign) {
            case VerticalAlign.MIDDLE:
                y += (hDomain - height) / 2 - this.offsetY;
                break;

            case VerticalAlign.BOTTOM:
                y += hDomain - this.offsetY - height;
                break;

            default:
                y += this.offsetY;
                break;
        }

        return { x, y };
    }

    update(): void {
        this._changed(ChartItem.UPDATED);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doPrepareRender(chart: IChart): void {
        this._seriesObj = chart.seriesByName(this.series);
    }
}

export interface IAnnotationOwner {
    chart: IChart;
}

/**
 * @internal
 */
export class AnnotationCollection {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    readonly chart: IChart;
    private _map: {[name: string]: Annotation} = {};
    private _items: Annotation[] = [];
    private _visibles: Annotation[] = [];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(owner: IAnnotationOwner) {
        this.chart = owner.chart;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get count(): number {
        return this._items.length;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getVisibles(): Annotation[] {
        return this._visibles.slice(0);
    }

    getAnnotation(name: string): Annotation {
        const g = this._map[name];
        if (g instanceof Annotation) return g;
    }

    get(name: string | number): Annotation {
        return isString(name) ? this._map[name] : this._items[name];
    }

    load(src: any): void {
        const chart = this.chart;
        const items: Annotation[] = this._items = [];
        const map = this._map = {};

        if (isArray(src)) {
            src.forEach((s, i) => {
                items.push(this.$_loadItem(chart, s, i));
            });
        } else if (isObject(src)) {
            items.push(this.$_loadItem(chart, src, 0));
        }

        items.forEach(a => {
            if (a.name) {
                map[a.name] = a;
            }
        });
    }

    prepareRender(): void {
        this._visibles = this._items.filter(item => item.visible);
        this._visibles.forEach(item => item.prepareRender());
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadItem(chart: IChart, src: any, index: number): Annotation {
        let t = src.type;

        if (!t) {
            if (isString(src.imageUrl)) t = 'image';
            else if (isString(src.shape)) t = 'shape';
            else t = 'text';
        }

        const cls = chart._getAnnotationType(t);

        if (!cls) {
            throw new Error('Invalid annotation type: ' + src.type);
        }

        const g = new cls(chart, src.name || `annotation ${index + 1}`);

        g.load(src);
        g.index = index;
        return g;
    }
}

/**
 * Annotation 모델.
 */
export abstract class SizableAnnotation extends Annotation {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    private _width: RtPercentSize;
    private _height: RtPercentSize;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _widthDim: IPercentSize;
    private _heightDim: IPercentSize;
    
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * Annotation 너비.
     * 픽셀 단위의 고정 값이나, plot 영역에 대한 상태 크기롤 지정할 수 있다.
     * 
     * @config
     */
    get width(): RtPercentSize {
        return this._width;
    }
    set width(value: RtPercentSize) {
        if (value !== this._width) {
            this._widthDim = parsePercentSize(this._width = value, true);
        }
    }
    /**
     * Annotation 높이.
     * 픽셀 단위의 고정 값이나, plot 영역에 대한 상태 크기롤 지정할 수 있다.
     * 
     * @config
     */
    get height(): RtPercentSize {
        return this._height;
    }
    set height(value: RtPercentSize) {
        if (value !== this._height) {
            this._heightDim = parsePercentSize(this._height = value, true);
        }
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getSize(width: number, height: number): ISize {
        return {
            width: calcPercent(this._widthDim, width),
            height: calcPercent(this._heightDim, height)
        };
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}
