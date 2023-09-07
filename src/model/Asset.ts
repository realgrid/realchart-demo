////////////////////////////////////////////////////////////////////////////////
// Asset.ts
// 2023. 09. 08. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

export interface IAssetItem {

    id: string;
}

abstract class AssetItem<T extends IAssetItem> {

    source: IAssetItem;

    abstract getEelement(): Element;
}

export interface IGradient extends IAssetItem {

    color: string[];
    opacity?: string[];
    stop?: (number | string)[];
}

/**
 * @config chart.asset[type='lineargradient']
 */
export interface ILinearGradient extends IGradient {

    dir?: 'bottom' | 'top' | 'right' | 'left' | (string | number)[];
}

class LinearGradient extends AssetItem<ILinearGradient> {

    getEelement(): Element {
        return;
    }
}

/**
 * @config chart.asset[type='radialgradient']
 */
export interface IRadialGradient extends IGradient {

    cx: number | string;
    cy: number | string;
    rd: number | string;
    fx?: number | string;
    fy?: number | string;
}

class RadialGradient extends AssetItem<IRadialGradient> {

    getEelement(): Element {
        return;
    }
}

export interface IAssetOwner {
    addDef(element: Element): void;
    removeDef(element: Element): void;
}

export class AssetCollection {

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    load(src: any): void {
    }

    register(owner: IAssetOwner): void {
    }

    unregister(owner: IAssetOwner): void {
    }
}