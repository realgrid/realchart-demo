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
import { Align, IAnnotationAnimation, IPercentSize, RtPercentSize, SVGStyleOrClass, VerticalAlign, _undef, calcPercent, parsePercentSize } from "../common/Types";
import { IChart } from "./Chart";
import { ChartItem } from "./ChartItem";

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
    private _offsetX: number | string = 0;
    private _offsetY: number | string = 0;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _widthDim: IPercentSize;
    private _heightDim: IPercentSize;
    private _offsetXDim: {size: number, suffix: string};
    private _offsetYDim: {size: number, suffix: string};
    _x: number;
    _y: number;
    _w: number;
    _h: number;
    _anchorObj: ChartItem;

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
     * 어노테이션 이름.<br/>
     * 동적으로 어노테이션을 다루기 위해서는 반드시 지정해야 한다. 
     * 
     * @config
     */
    name: string;
    /**
     * 어노테이션 배치 기준이 되는 차트 구성 요소.<br/>
     * 현재, 같은 영역(body 혹은 chart)에 포함된 {@link config.base.gauge 게이지}나 다른 어노테이션의 {@link name 이름}을 지정할 수 있다.
     * 
     * @config
     */
    anchor: string;
    /**
     * 수평 배치.<br/>
     * 
     * @config
     * 
     * @default Align.LEFT anchor가 지정되면 'center', 아니면 'left'
     */
    align: Align;
    /**
     * 수직 배치.<br/>
     * 
     * @config
     */
    verticalAlign = VerticalAlign.TOP;
    /**
     * {@link align}과 {@link verticalAlign}으로 지정된 위치에서 실제 표시될 위치의 수평 간격.<br/>
     * 값이 양수일 때, {@link anchor}가 지정된 경우 anchor 아이템으 밖으로 멀어지고, 아니면 영역 경계 안쪽으로 멀어진다.
     * 또, {@link anchor}가 지정된 경우 **'0.5w'** 등으로 이 어노테이션의 너비를 기준으로 한 크기로 지정할 수 있다.
     * 
     * @config
     */
    get offsetX(): number | string {
        return this._offsetX;
    }
    set offsetX(value: number | string) {
        if (value != this._offsetX) {
            this._offsetX = value;
            this._offsetXDim = this.$_parsOffset(value);
        }
    }
    private $_parsOffset(value: number | string): {size: number, suffix: string} {
        if (isString(value)) {
            const s = value[value.length - 1];
            if (s === 'h' || s === 'w') {
                const sz = parseFloat(value);
                if (sz === parseFloat(value.substring(0, value.length - 1))) {
                    return {
                        size: sz,
                        suffix: s
                    }
                }
            }
        }
    }
    /**
     * {@link align}과 {@link verticalAlign}으로 지정된 위치에서 실제 표시될 위치의 수직 간격.<br/>
     * 값이 양수일 때, {@link anchor}가 지정된 경우 anchor 아이템으 밖으로 멀어지고, 아니면 영역 경계 안쪽으로 멀어진다.
     * 또, {@link anchor}가 지정된 경우 **'0.5h'**처럼 이 어노테이션의 너비를 기준으로 한 크기로 지정할 수 있다.
     * 
     * @config
     */
    get offsetY(): number | string {
        return this._offsetY;
    }
    set offsetY(value: number | string) {
        if (value != this._offsetY) {
            this._offsetY = value;
            this._offsetYDim = this.$_parsOffset(value);
        }
    }
    /**
     * 회전 각도.<br/>
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
     * 배경 스타일.<br/>
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
     * Annotation 너비.<br/>
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
     * Annotation 높이.<br/>
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
    private $_calcOffet(w: number, h: number, dim: {size: number, suffix: string}): number {
        return dim.size * (dim.suffix === 'h' ? h : w);
    }

    getOffset(w: number, h: number): IPoint {
        return {
            x: this._offsetXDim ? this.$_calcOffet(w, h, this._offsetXDim) : +this._offsetX,
            y: this._offsetYDim ? this.$_calcOffet(w, h, this._offsetYDim) : +this._offsetY
        };
    }

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
        let offset: IPoint;
        let x: number;
        let y: number;

        if (isNaN(x = this._x)) {
            offset = this.getOffset(width, height);
            x = left;

            switch (this.align) {
                case Align.CENTER:
                    x += (wDomain - width) / 2 + offset.x;
                    break;
    
                case Align.RIGHT:
                    x += wDomain - offset.x - width;
                    break;
    
                default:
                    if (this._anchorObj) {
                        // center
                        x += (wDomain - width) / 2 + offset.x;
                    } else {
                        // left
                        x += offset.x;
                    }
                    break;
            }
        }

        if (isNaN(y = this._y)) {
            offset = offset || this.getOffset(width, height);
            y = top;

            switch (this.verticalAlign) {
                case VerticalAlign.MIDDLE:
                    y += (hDomain - height) / 2 - offset.y;
                    break;
    
                case VerticalAlign.BOTTOM:
                    y += hDomain - offset.y - height;
                    break;
    
                default:
                    y += offset.y;
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
    protected override _doPrepareRender(chart: IChart): void {
        // this._seriesObj = chart.seriesByName(this.series);
    }
}

export interface IAnnotationOwner {
    chart: IChart;
    anchorByName(name: string): ChartItem;
}

/**
 * @internal
 */
export class AnnotationCollection {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _map: {[name: string]: Annotation} = {};
    private _items: Annotation[] = [];
    private _visibles: Annotation[] = [];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public owner: IAnnotationOwner) {
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
        const chart = this.owner.chart;
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
        this._visibles.forEach(item => {
            item.prepareRender();
            item._anchorObj = item.anchor ? this.owner.anchorByName(item.anchor) : _undef;
        });
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
