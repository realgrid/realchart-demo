////////////////////////////////////////////////////////////////////////////////
// Asset.ts
// 2023. 09. 08. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { SVGNS, isArray, isObject } from "../common/Common";
import { isNull } from "../common/Types";

export interface IAssetItem {

    id: string;
}

abstract class AssetItem<T extends IAssetItem> {

    constructor(public source: T) {}

    abstract getEelement(doc: Document): Element;
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

    getEelement(doc: Document): Element {
        const elt = doc.createElementNS(SVGNS, 'linearGradient');
        let {x1, x2, y1, y2} = {x1: 0, x2: 0, y1: 0, y2: 0};

        this._setStops(doc, elt);

        switch (this.source.dir) {
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

    getEelement(doc: Document): Element {
        const src = this.source;
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
    get count(): number {
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
            owner.addDef(item.getEelement(doc));
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
            switch (src.type.toLowerCase()) {
                case LinearGradient.TYPE:
                    return new LinearGradient(src);
                case RadialGradient.TYPE:
                    return new RadialGradient(src);
            }
        }
    }
}