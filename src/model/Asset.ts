////////////////////////////////////////////////////////////////////////////////
// Asset.ts
// 2023. 09. 08. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { SVGNS, isArray, isObject, isString, assign } from "../common/Common";
import { RcElement } from "../common/RcControl";
import { ISize } from "../common/Size";
import { SVGStyles, isNull } from "../common/Types";
import { Utils } from "../common/Utils";
import { PaletteMode } from "./ChartTypes";

export interface IAssetItem {
    /**
     * 에셋 id.<br/>
     * 시리즈나 축에서 이 에셋 항목을 참조할 때 사용하는 키로서
     * 차트 내에서 유일한 문자열로 반드시 지정해야 한다.
     * 
     * @config
     */
    id: string;
}

abstract class AssetItem<T extends IAssetItem> {

    constructor(public source: T) {}

    hasDef(): boolean { return true; }
    abstract getEelement(doc: Document, source: T): Element;
}

export interface IGradient extends IAssetItem {

    /**
     * 양끝 색을 두 개의 색이 포함된 배열로 지정하거나, 
     * 끝 값을 'white'로 전제하고 시작 색 값 하나만 지정할 수 있다.
     * 
     * @config
     */
    color: string[] | string;
    /**
     * 0에서 1사이의 불투명도.<br/>
     * 지정하지 않거나 타당한 값이 아니면 1(완전 불투명)로 적용한다.
     * 또는, 시작/끝 불투명도 두 값을 배열로 지정할 수도 있다. 
     * 
     * @config
     */
    opacity?: number[] | number;
}

/**
 * 시작점과 끝점 사이에 색상이 서서히 변경되는 효과를 표시한다.<br/>
 * 채우기 색이나 선 색으로 사용될 수 있다.
 * 
 * @config chart.asset[type=lineargradient]
 */
export interface ILinearGradient extends IGradient {

    // dir?: 'down' | 'up' | 'right' | 'left' | (string | number)[];
    dir?: 'down' | 'up' | 'right' | 'left';
}

abstract class Gradient<T extends IGradient> extends AssetItem<T> {

    protected _setStops(doc: Document, elt: Element): void {
        const stop1 = doc.createElementNS(SVGNS, 'stop');
        const stop2 = doc.createElementNS(SVGNS, 'stop');
        const color = this.source.color;
        const alpha = isNull(this.source.opacity) ? 1 : this.source.opacity;
        const color1 = isArray(color) ? color[0] : color;
        const color2 = isArray(color) && color.length > 1 ? color[1] : 'white';
        const alpha1 = isArray(alpha) ? alpha[0] : alpha;
        const alpha2 = isArray(alpha) && alpha.length > 1 ? alpha[1] : alpha;

        elt.setAttribute('id', this.source.id);

        stop1.setAttribute('offset', '0');
        stop1.setAttribute('stop-color', color2);
        stop1.setAttribute('stop-opacity', alpha1 as any);

        stop2.setAttribute('offset', '1');
        stop2.setAttribute('stop-color', color1);
        stop2.setAttribute('stop-opacity', alpha2 as any);

        elt.appendChild(stop1);
        elt.appendChild(stop2);
    }
}

/**
 * @config config.asset
 */
export class LinearGradient extends Gradient<ILinearGradient> {

    static readonly TYPE = 'lineargradient';

    getEelement(doc: Document, source: ILinearGradient): Element {
        const elt = doc.createElementNS(SVGNS, 'linearGradient');
        let {x1, x2, y1, y2} = {x1: 0, x2: 0, y1: 0, y2: 0};

        this._setStops(doc, elt);

        switch (source.dir) {
            case 'up':
                y1 = 1;
                break;
            case 'right':
                x2 = 1;
                break;
            case 'left':
                x1 = 1;
                break;
            default:
                y2 = 1;
                break;
        }

        elt.setAttribute('x1', x1 as any);
        elt.setAttribute('y1', y1 as any);
        elt.setAttribute('x2', x2 as any);
        elt.setAttribute('y2', y2 as any);

        return elt;
    }
}

/**
 * 원 중심에서 바깥으로 생상이 변해가는 효과를 표시한다.<br/>
 * 채우기 색이나 선 색으로 사용될 수 있다.
 * 
 * @config chart.asset[type=radialgradient]
 */
export interface IRadialGradient extends IGradient {

    cx?: number | string;
    cy?: number | string;
    rd?: number | string;
}

export class RadialGradient extends Gradient<IRadialGradient> {

    static readonly TYPE = 'radialgradient';

    getEelement(doc: Document, src: IRadialGradient): Element {
        const elt = doc.createElementNS(SVGNS, 'radialGradient');

        if (!isNull(src.cx)) {
            elt.setAttribute('cx', src.cx as any);
        }
        if (!isNull(src.cy)) {
            elt.setAttribute('cy', src.cy as any);
        }
        if (!isNull(src.rd)) {
            elt.setAttribute('rd', src.rd as any);
        }
        this._setStops(doc, elt);

        return elt;
    }
}

/**
 * 도형 패턴을 지정해서 채우기(fill) 색상 대신 사용할 수 있다.<br/>
 */
export interface IPattern extends IAssetItem {
    /**
     * 문자열로 지정하면 path 'd', 숫자로 지정하면 stock pattern index.
     */
    pattern: string | number; 
    /**
     * 지정하지 않으면 {@link height}나 20 pixels.
     */
    width?: number;
    /**
     * 지정하지 않으면 {@link widths}나 20 pixels.
     */
    height?: number;
    style?: SVGStyles;
}


export class Pattern extends AssetItem<IPattern> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly TYPE = 'pattern';
	static readonly STOCK: {
		path: string;
        width: number;
		height: number;
		fill?: boolean;
		style?: SVGStyles;
	}[] = [
		{
			path: 'M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9',
			width: 10,
			height: 10,
			style: { strokeWidth: '0.3px' },
		},
		{
			path: 'M0 0 L0 3 L5.2 6 L10.4 3 L10.4 0 M5.2 6 L5.2 12 L0 15 L0 18 M5.2 12 L10.4 15 L10.4 18',
			width: 10.4,
			height: 18,
			style: { strokeWidth: '0.3px' },
		},
        {
			path: 'M0 0h5v5H0zM5 5h5v5H5z',
			fill: true,
			width: 10,
			height: 10,
		},
		{
			path: 'm5 .037 4.957 4.957L5 9.951.043 4.994z',
			fill: true,
			width: 10,
			height: 10,
		},
		{
			path: 'M0 2.8 L5 0 L10 2.8 L10 14 L5 16.8 L0 14 L0 2.8 M5 0 L5 5.6 L0 8.4 L5 11.2 L5 16.8 M5 5.6 L10 8.4 L5 11.2',
			style: { strokeWidth: '0.3px' },
			width: 10,
			height: 16.8,
		},
		{
			path: 'm5 .037 4.957 4.957L5 9.951.043 4.994z',
			fill: false,
			width: 10,
			height: 10,
			style: { strokeWidth: '0.3px' },
		},
		{
			path: 'M 0 0 L 12 12 L 24 0 M 4 0 L 12 8 L 20 0 M 8 0 L 12 4 L 16 0 M 0 4 L 8 12 L 0 20 M 0 8 L 4 12 L 0 16 M 0 24 L 12 12 L 24 24 M 4 24 L 12 16 L 20 24 M 8 24 L 12 20 L 16 24 M 24 20 L 16 12 L 24 4 M 24 16 L 20 12 L 24 8',
			width: 24,
			height: 24,
			fill: false,
			style: { strokeWidth: '0.4px' },
		},
		{
			path: 'M10 2.52H0M0 7.48h10M7.48 10V0M2.52 0v10',
			style: { strokeWidth: '0.3px' },
			width: 5,
			height: 5,
		},
		{
			path: 'M-2.5 1.25l5 2.5L7.5 1.25l5 2.5 M-2.5 6.25l5 2.5 5-2.5 5 2.5 M-2.5 11.25l5 2.5 5-2.5 5 2.5 M-2.5 16.25l5 2.5 5-2.5 5 2.5',
			width: 10,
			height: 10,
			style: { strokeWidth: '0.3px' },
		},
		{
			path: 'M25 1.95v.26c-.79 0-1.43.64-1.43 1.43 0 .25.15.62.33.8l.31.31c.25.27.31.65.16.98l-.06.11c-.18.32-.5.52-.87.54h-4.56v4.56c.02.26.17.5.39.63l.11.06c.21.1.52.05.68-.11l.31-.31c.27-.24.61-.39.98-.4.93 0 1.69.76 1.69 1.69 0 .93-.76 1.69-1.69 1.69-.36-.02-.71-.16-.98-.4l-.31-.31a.63.63 0 0 0-.68-.11l-.11.06c-.23.13-.38.37-.39.63v4.56h4.56c.36.02.69.22.87.54l.06.11c.15.33.09.72-.16.98l-.31.31c-.2.22-.31.5-.33.8 0 .79.64 1.43 1.43 1.43v.26c-.93 0-1.69-.76-1.69-1.69.02-.36.16-.71.4-.98l.31-.31a.63.63 0 0 0 .11-.68l-.06-.11a.764.764 0 0 0-.63-.39h-4.56v4.56c-.02.36-.22.69-.54.87l-.11.06c-.33.15-.72.09-.98-.16l-.31-.31c-.22-.2-.5-.31-.8-.33-.79 0-1.43.64-1.43 1.43h-.26c0-.93.76-1.69 1.69-1.69.32 0 .75.18.98.4l.31.31c.19.17.45.21.68.11l.11-.06c.23-.13.38-.37.39-.63v-4.56h-4.56c-.36-.02-.69-.22-.87-.54l-.06-.11a.886.886 0 0 1 .16-.98l.31-.31c.2-.22.31-.5.33-.8a1.43 1.43 0 1 0-2.86 0c0 .25.15.62.33.8l.31.31c.25.27.31.65.16.98l-.06.11c-.18.32-.5.52-.87.54H6.38v4.56c.02.26.17.5.39.63l.11.06c.21.1.52.05.68-.11l.31-.31c.27-.24.61-.39.98-.4.93 0 1.69.76 1.7 1.69h-.26c0-.79-.64-1.43-1.43-1.43-.25 0-.62.15-.8.33l-.31.31c-.27.25-.65.31-.98.16l-.11-.06c-.32-.18-.52-.5-.54-.87v-4.56H1.56c-.26.02-.5.17-.63.39l-.06.11c-.1.21-.05.52.11.68l.31.31c.24.27.39.61.4.98 0 .93-.76 1.69-1.69 1.7v-.26c.79 0 1.43-.64 1.43-1.43 0-.25-.15-.62-.33-.8l-.31-.31a.888.888 0 0 1-.16-.98l.06-.11c.18-.32.5-.52.87-.54h4.56v-4.56a.812.812 0 0 0-.39-.63l-.11-.06a.647.647 0 0 0-.68.11l-.31.31c-.27.25-.62.39-.98.4-.93 0-1.69-.76-1.69-1.69s.76-1.69 1.69-1.69c.32 0 .75.18.98.4l.31.31c.19.17.45.21.68.11l.11-.06c.23-.13.38-.37.39-.63V6.38H1.56c-.36-.02-.69-.22-.87-.54l-.06-.11a.886.886 0 0 1 .16-.98l.31-.31c.2-.22.31-.5.33-.8 0-.79-.64-1.43-1.43-1.43v-.26c.93 0 1.69.76 1.69 1.69 0 .32-.18.75-.4.98l-.31.31a.63.63 0 0 0-.11.68l.06.11c.13.23.37.38.63.39h4.56V1.56c.02-.36.22-.69.54-.87l.11-.06c.33-.15.72-.09.98.16l.31.31c.22.2.5.31.8.33.79 0 1.43-.64 1.43-1.43h.26c0 .93-.76 1.69-1.69 1.69-.36-.02-.71-.16-.98-.4L7.57.98a.63.63 0 0 0-.68-.11l-.11.06c-.23.13-.38.37-.39.63v4.56h4.56c.36.02.69.22.87.54l.06.11c.15.33.09.72-.16.98l-.31.31c-.2.22-.31.5-.33.8a1.43 1.43 0 1 0 2.86 0c0-.25-.15-.62-.33-.8l-.31-.31a.888.888 0 0 1-.16-.98l.06-.11c.18-.32.5-.52.87-.54h4.56V1.56a.812.812 0 0 0-.39-.63l-.11-.06a.647.647 0 0 0-.68.11l-.31.31c-.27.25-.62.39-.98.4-.95 0-1.71-.76-1.71-1.69h.26c0 .79.64 1.43 1.43 1.43.25 0 .62-.15.8-.33l.31-.31c.27-.25.65-.31.98-.16l.11.06c.32.18.52.5.54.87v4.56h4.56c.26-.02.5-.17.63-.39l.06-.11c.1-.21.05-.52-.11-.68l-.31-.31c-.25-.27-.39-.62-.4-.98 0-.93.76-1.69 1.69-1.69ZM10.94 18.62c.26-.02.5-.17.63-.39l.06-.11c.1-.21.05-.52-.11-.68l-.31-.31c-.25-.27-.39-.62-.4-.98 0-.93.76-1.69 1.69-1.69s1.69.76 1.69 1.69c0 .32-.18.75-.4.98l-.31.31a.63.63 0 0 0-.11.68l.06.11c.13.23.37.38.63.39h4.56v-4.56c.02-.36.22-.69.54-.87l.11-.06c.33-.15.72-.09.98.16l.31.31c.22.2.5.31.8.33a1.43 1.43 0 1 0 0-2.86c-.25 0-.62.15-.8.33l-.31.31c-.27.25-.65.31-.98.16l-.11-.06c-.32-.18-.52-.5-.54-.87V6.38h-4.56c-.26.02-.5.17-.63.39l-.06.11c-.1.21-.05.52.11.68l.31.31c.24.27.39.61.4.98 0 .93-.76 1.69-1.69 1.69s-1.69-.76-1.69-1.69c.02-.36.16-.71.4-.98l.31-.31a.63.63 0 0 0 .11-.68l-.06-.11a.764.764 0 0 0-.63-.39H6.38v4.56c-.02.36-.22.69-.54.87l-.11.06c-.33.15-.72.09-.98-.16l-.31-.31c-.22-.2-.5-.31-.8-.33a1.43 1.43 0 1 0 0 2.86c.25 0 .62-.15.8-.33l.31-.31c.27-.25.65-.31.98-.16l.11.06c.32.18.52.5.54.87v4.56h4.56Z',
			width: 25,
			height: 25,
			fill: false,
			style: { strokeWidth: '0.3px' },
		},
		{
			path: 'M 0 8 L 8 0 L 12 4 L 4 12 Z M -2 2 L 2 6 M 2 -2 L 6 2 M 6 10 L 10 14 M 10 6 L 14 10',
			width: 12,
			height: 12,
			style: { strokeWidth: '0.5px' },
		},
		{
			path: 'M0 13.66 6.34 10 10 16.34 3.66 20zM0 6.34 3.66 0 10 3.66 6.34 10zM10 16.34 13.66 10 20 13.66 16.34 20zM10 3.66 16.34 0 20 6.34 13.66 10zM0 6.34v7.32M20 6.36v7.3M6.34 10h7.32',
			width: 20,
			height: 20,
			style: { strokeWidth: '0.3px' },
			fill: false,
		},
	];

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    getEelement(doc: Document, src: IPattern): Element {
        const elt = doc.createElementNS(SVGNS, 'pattern');
        const path = doc.createElementNS(SVGNS, 'path');
        let noFill = false;

        elt.setAttribute('id', src.id);
        elt.setAttribute('patternUnits', "userSpaceOnUse");
        path.classList.add('rct-pattern');

        if (+src.pattern >= 0) {
            const stock = Pattern.STOCK[(+src.pattern) % Pattern.STOCK.length];
            path.setAttribute('d', stock.path);
            if (stock.style) assign(path.style, stock.style);
            noFill = !stock.fill;
            elt.setAttribute('width', String(stock.width || 20));
            elt.setAttribute('height', String(stock.height || 20));
        } else if (isString(src.pattern)) {
            path.setAttribute('d', src.pattern);
            elt.setAttribute('width', String(src.width || src.height || 20));
            elt.setAttribute('height', String(src.height || src.width || 20));
        }

        if (isObject(src.style)) {
            assign(path.style, src.style);
        }
        if (noFill) {
            path.style.fill = 'none';
        }

        elt.append(path);
        return elt;
    }
}

/**
 * 색상 목록을 미리 지정하고 {@link config.base.series#pointcolors} 등에 적용할 수 있다.<br/>
 * 목록에서 색상을 꺼내오는 방식은 {@link mode} 속성으로 지정한다.
 * 
 * @config chart.asset[type=colors]
 */
export interface IColorList extends IAssetItem {
    /**
     * 색상 목록에서 색을 꺼내오는 방식.
     * 
     * @default PaletteMode.NORMAL
     * @config
     */
    mode?: PaletteMode;
    /**
     * 색상 목록.
     * 
     * @config
     */
    colors: string[];
}

export class ColorList extends AssetItem<IColorList> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly TYPE = 'colors';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _colors: string[];
    private _index: number;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepare(): ColorList {
        const src = this.source;

        this._colors = isArray(src.colors) ? src.colors.slice() : [];

        if (src.mode === PaletteMode.RANDOM) {
            this._index = -1;
        } else {
            if (src.mode === PaletteMode.SHUFFLE) {
                Utils.shuffle(this._colors);
            }
            this._index = 0;
        }
        return this;
    }

    getNext(): string {
        if (this._index < 0) {
            return this._colors[Math.floor(Math.random() * this._colors.length)];
        } else {
            return this._colors[this._index++ % this._colors.length];
        }
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    hasDef(): boolean {
        return false;
    }

    getEelement(doc: Document, source: IColorList): Element {
        this._colors = isArray(source.colors) ? source.colors : [];
        return;
    }
}

/**
 * @config chart.asset[type=images]
 */
export interface IImageList extends IAssetItem {
    rootUrl?: string;
    width?: number;
    height?: number;
    images: ({ name?: string, url: string } | string)[];
}

export class ImageList extends AssetItem<IImageList> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly TYPE = 'images';
    static readonly SIZE = 20;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    size: ISize;
    private _images: string[];
    private _map: any;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepare(): void {
        const root = this.source.rootUrl || '';

        this._images = [];
        this._map = {};

        this.source.images.forEach(item => {
            if (isString(item)) {
                this._images.push(item);
            } else {
                const url = root + item.url;

                if (item.name) {
                    this._map[item.name] = url;
                }
                this._images.push(url);
            }
        });
    }

    getImage(name: string | number): string {
        return isString(name) ? this._map[name] : this._images[name];
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    hasDef(): boolean {
        return false;
    }

    getEelement(doc: Document, source: IImageList): Element {
        this.size = Object.freeze({
            width: source.width || source.height || ImageList.SIZE,
            height: source.height || source.width || ImageList.SIZE
        });
        return;
    }
}

export interface IAssetOwner {
    addDef(element: Element): void;
    removeDef(element: string): void;
}

/**
 * 종류 구분없이 id는 유일하게 반드시 지정해야 한다.
 */
export class AssetCollection {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _items: AssetItem<IAssetItem>[] = [];
    private _map: {[id: string]: AssetItem<IAssetItem>} = {};

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(source: any): void {
        this._items = [];

        if (isArray(source)) {
            source.forEach(src => {
                const item = this.$_loadItem(src);
                if (item) {
                    if (item.hasDef()) {
                        this._items.push(item);
                    } else {
                        this._map[src.id] = item;
                    }
                }
            })
        } else if (isObject(source)) {
            const item = this.$_loadItem(source);
            if (item) {
                if (item.hasDef()) {
                    this._items.push(item);
                } else {
                    this._map[source.id] = item;
                }
            }
        }
    }

    register(doc: Document, owner: IAssetOwner): void {
        this._items.forEach(item => {
            const elt = item.getEelement(doc, item.source);
            elt.setAttribute(RcElement.ASSET_KEY, '1');
            owner.addDef(elt);
        })
    }

    unregister(doc: Document, owner: IAssetOwner): void {
        this._items.forEach(item => {
            owner.removeDef(item.source.id);
        })
    }

    get(id: string): AssetItem<IAssetItem> {
        return this._map[id];
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadItem(src: any): AssetItem<IAssetItem> {
        if (isObject(src) && src.id) {
            let t = src.type;

            if (!t) {
                if (src.pattern != null) {
                    t = Pattern.TYPE;
                } else if (isArray(src.colors)) {
                    t = ColorList.TYPE;
                } else if (isArray(src.images)) {
                    t = ImageList.TYPE;
                }
            }
            if (t) {
                switch (t.toLowerCase()) {
                    case LinearGradient.TYPE:
                        return new LinearGradient(src);
                    case RadialGradient.TYPE:
                        return new RadialGradient(src);
                    case Pattern.TYPE:
                        return new Pattern(src);
                    case ColorList.TYPE:
                        return new ColorList(src);
                    case ImageList.TYPE:
                        return new ImageList(src);
                }
            }
        }
    }
}
