////////////////////////////////////////////////////////////////////////////////
// Asset.ts
// 2023. 09. 08. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { SVGNS, isArray, isObject, isString } from "../common/Common";
import { RcElement } from "../common/RcControl";
import { SVGStyles, isNull } from "../common/Types";

export interface IAssetItem {

    id: string;
}

abstract class AssetItem<T extends IAssetItem> {

    constructor(public source: T) {}

    abstract getEelement(doc: Document, source: T): Element;
}

export interface IGradient extends IAssetItem {

    color: string[] | string;
    opacity?: number[] | number;
}

/**
 * @config chart.asset[type='lineargradient']
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
 * @config chart.asset[type='radialgradient']
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
    static readonly STOCK: {path: string, fill?: boolean, style?: SVGStyles}[] = [{ 
        path: 'M20.03.03-.5 20.45',
    }, { 
        path: 'm-.15 8.67 10.16 2.71 10.16-2.71',
        style: { strokeWidth: '1.24px' }
    }, { 
        path: 'M0 20c1.67-1.67 3.49.15 5.15-1.51C6.82 16.82 5 15 6.66 13.34c1.67-1.67 3.49.15 5.15-1.51 1.67-1.67-.15-3.49 1.51-5.16 1.67-1.67 3.49.15 5.16-1.51 1.67-1.67-.15-3.49 1.51-5.16',
    }, { 
        path: 'M 10 10 m 5 0 a 5 5 0 1 1 -10 0 a 5 5 0 1 1 10 0',
        fill: true
    }, { 
        path: 'M.61 7.19h4.95v4.95H.61z m12.38 9.669 3.5-3.5 3.5 3.5-3.5 3.5z',
        fill: true
    }, { 
        path: 'm18.3 5.18.02.02L10 10 1.68 5.2 10 .39l8.3 4.79M10 19.61 1.68 14.8V5.2 M1.68 5.2 10 10v9.61M10 19.15V10l8.32-4.8M18.32 5.2v9.6L10 19.61',
    }, { 
        path: 'M19.64 9.99h-6.46M14.81 1.64l-3.23 5.6M5.17 1.65 8.4 7.26M.36 10.01h6.46M5.19 18.36l3.23-5.6M14.83 18.35l-3.23-5.61',
    }, { 
        path: 'M20 5.04H0M0 14.96h20M14.96 20V0M5.04 0v20',
    }, { 
        path: 'M.59 18.15 10 1.85l9.41 16.3H.59z',
    }, { 
        path: 'm.005 8.165 1.83-3.17 3.17 1.83-1.83 3.17z m5.005 6.825 3.17-1.83 1.83 3.17-3.17 1.83z M.005 1.835l3.17-1.83 1.83 3.17-3.17 1.83z m5.005 3.175 1.83-3.17 3.17 1.83-1.83 3.17z m15.006 6.825 3.17-1.83 1.83 3.17-3.17 1.83z m10.005 8.165 1.83-3.17 3.17 1.83-1.83 3.17zM14.995 3.174l1.83-3.17 3.17 1.83-1.83 3.17z m9.995 1.835 3.17-1.83 1.83 3.17-3.17 1.83z M5 3.2v3.63M15 3.2v3.63M8.17 5h3.66',
    }, { 
        path: 'M-.529 13.948 13.203.216l6.562 6.562L6.033 20.51zM9.625 16.928l6.562-6.562L29.92 24.098l-6.562 6.562z',
    }, { 
        path: 'm7.98 6.42 7.85-13.59 7.84 13.59H7.98zM27.84 6.42 20 20 12.16 6.42h15.68z',
    }]

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
        elt.setAttribute('width', String(src.width || src.height || 20));
        elt.setAttribute('height', String(src.height || src.width || 20));
        elt.setAttribute('patternUnits', "userSpaceOnUse");

        if (+src.pattern >= 0) {
            const stock = Pattern.STOCK[(+src.pattern) % Pattern.STOCK.length];
            path.setAttribute('d', stock.path);
            if (stock.style) Object.assign(path.style, stock.style);
            noFill = !stock.fill;
        } else if (isString(src.pattern)) {
            path.setAttribute('d', src.pattern);
        }

        if (isObject(src.style)) {
            Object.assign(path.style, src.style);
        }
        if (noFill) {
            path.style.fill = 'none';
        }

        elt.append(path);
        return elt;
    }
}

export interface IAssetOwner {
    addDef(element: Element): void;
    removeDef(element: string): void;
}

export class AssetCollection {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _items: AssetItem<IAssetItem>[] = [];

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    count(): number {
        return this._items.length;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    get(index: number): AssetItem<IAssetItem> {
        return this._items[index];
    }

    load(source: any): void {
        this._items = [];

        if (isArray(source)) {
            source.forEach(src => {
                let item = this.$_loadItem(src);
                item && this._items.push(item);
            })
        } else if (isObject(source)) {
            let item = this.$_loadItem(source);
            item && this._items.push(item);
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

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadItem(src: any): AssetItem<IAssetItem> {
        if (isObject(src) && src.type && src.id) {
            if (src.pattern != null) {
                return new Pattern(src);
            } else if (src.type) {
                switch (src.type.toLowerCase()) {
                    case LinearGradient.TYPE:
                        return new LinearGradient(src);
                    case RadialGradient.TYPE:
                        return new RadialGradient(src);
                    case Pattern.TYPE:
                        return new Pattern(src);
                }
            }
        }
    }
}
