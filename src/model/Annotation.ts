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
import { Axis } from "./Axis";
import { IChart } from "./Chart";
import { ChartItem } from "./ChartItem";
import { ISeries } from "./Series";

/**
 * 어노테이션 배치 기준.<br/>
 * [주의]body에 설정된 annoation에는 적용되지 않는다.
 */
export enum AnnotationScope {
    // BODY = 'body',
    /**
     * container에서 padding을 적용한 영역을 기준으로 표시한다.
     * 
     * @config
     */
    CHART = 'chart',
    /**
     * container 전체 영역을 기준으로 표시한다.
     * 
     * @config
     */
    CONTAINER = 'container'
};

/**
 * Annotation 모델.<br/>
 * 
 * @config chart.annotation[base]
 */
export abstract class Annotation extends ChartItem {

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
    _x: number;
    _y: number;
    _w: number;
    _h: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, name: string, public inBody: boolean) {
        super(chart, true);

        this.name = name;
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
     * 어노테이션 이름.\
     * 동적으로 어노테이션을 다루기 위해서는 반드시 지정해야 한다. 
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
    /**
     * {@link align}과 {@link verticalAlign}으로 지정된 위치에서 실제 표시될 위치의 수평 간격.
     * 
     * @config
     */
    offsetX = 0;
    /**
     * {@link align}과 {@link verticalAlign}으로 지정된 위치에서 실제 표시될 위치의 수직 간격.
     * 
     * @config
     */
    offsetY = 0;
    /**
     * 회전 각도.\
     * 0 ~ 360 사이의 값으로 지정한다.
     * 
     * @config
     */
    rotation: number;
    /**
     * 어노테이션 배치 기준.<br/>
     * [주의]body에 설정된 annoation에는 적용되지 않는다.
     * 
     * @config
     */
    scope = AnnotationScope.CHART;
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
    /**
     * true로 지정하면 상위 영역을 벗어난 부분도 표시되게 한다.<br/>
     * body에 포함된 경우 body 영역,
     * chart에 포함되고 scope이 'chart'일 때 chart 영역.
     * 
     * @config
     */
    noClip: boolean;
    /**
     * body 어노테이션일 경우,
     * x 축을 기준으로 지정하는 수평(inverted일 때 수직) 위치.<br/>
     * chart에 지정된 어노테이션에서는 무시된다.
     * 
     * @config
     */
    x1: number | Date;
    /**
     * body 어노테이션일 경우,
     * x 축을 기준으로 지정하는 수평(inverted일 때 수직) 위치.<br/>
     * chart에 지정된 어노테이션에서는 무시된다.
     * 
     * @config
     */
    x2: number | Date;
    /**
     * body 어노테이션일 경우,
     * y 축을 기준으로 지정하는 수직(inverted일 때 수평) 위치.<br/>
     * chart에 지정된 어노테이션에서는 무시된다.
     * 
     * @config
     */
    y1: number | Date;
    /**
     * body 어노테이션일 경우,
     * y 축을 기준으로 지정하는 수직(inverted일 때 수평) 위치.<br/>
     * chart에 지정된 어노테이션에서는 무시된다.
     * 
     * @config
     */
    y2: number | Date;
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
    getSize(wDomain: number, hDomain: number): ISize {
        const inverted = this.chart.isInverted();
        let width: number;
        let height: number;

        if (this.inBody) {
            const x1 = +this.x1;
            const x2 = +this.x2;
            const y1 = +this.y1;
            const y2 = +this.y2;

            this._x = this._y = this._w = this._h = NaN;

            if (!isNaN(x1)){
                const axis = this.chart.xAxis;

                if (inverted) {
                    this._y = hDomain - axis.getPos(hDomain, x1);
                } else {
                    this._x = axis.getPos(wDomain, x1);
                }
                if (!isNaN(x2)) {
                    if (inverted) {
                        height = this._h = hDomain - axis.getPos(hDomain, x2) - this._y;
                    } else {
                        width = this._w = axis.getPos(wDomain, x2) - this._x;
                    }
                }
            }

            if (!isNaN(y1)){
                const axis = this.chart.yAxis;

                if (inverted) {
                    this._x = axis.getPos(wDomain, y1);
                } else {
                    this._y = hDomain - axis.getPos(hDomain, y1);
                }
                if (!isNaN(y2)) {
                    if (inverted) {
                        width = this._w = axis.getPos(wDomain, y2) - this._x;
                    } else {
                        height = this._h = hDomain - axis.getPos(hDomain, y2) - this._y;
                    }
                }
            }
        }

        if (isNaN(width)) {
            width = calcPercent(this._widthDim, wDomain);
        } else if (width < 0) {
            this._x += width;
            width = -width;
        }
        if (isNaN(height)) {
            height = calcPercent(this._heightDim, hDomain);
        } else if (height < 0) {
            this._y += height;
            height = -height;
        }
        return { width, height }
    }

    getPosition(inverted: boolean, left: number, top: number, wDomain: number, hDomain: number, width: number, height: number): IPoint {
        let x: number;
        let y: number;

        if (isNaN(x = this._x)) {
            x = left;

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
        }

        if (isNaN(y = this._y)) {
            y = top;

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
        // this._seriesObj = chart.seriesByName(this.series);
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

    load(src: any, inBody: boolean): void {
        const chart = this.chart;
        const items: Annotation[] = this._items = [];
        const map = this._map = {};

        if (isArray(src)) {
            src.forEach((s, i) => {
                items.push(this.$_loadItem(chart, s, i, inBody));
            });
        } else if (isObject(src)) {
            items.push(this.$_loadItem(chart, src, 0, inBody));
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
    private $_loadItem(chart: IChart, src: any, index: number, inBody: boolean): Annotation {
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

        const g = new cls(chart, src.name || `annotation ${index + 1}`, inBody);

        g.load(src);
        g.index = index;
        return g;
    }
}
