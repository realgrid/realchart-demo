////////////////////////////////////////////////////////////////////////////////
// ImageLoader.ts
// 2021. 12. 22. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

/**
 * @internal
 *
 * Image loader.
 */
export class ImageLoader {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _images: {[url: string]: HTMLImageElement} = {};
    private $_loadHandler = (ev: Event) => {
        this._callback?.((ev.target as HTMLImageElement).src);
    }
    private _callback: (url: string) => void;
    
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(callback: (url: string) => void) {
        this._callback = callback;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    add(url: string): HTMLImageElement {
        let elt = this._images[url];
        if (elt) {
            elt = document.createElement('img');
            elt.crossOrigin = '*';
            elt.onload = this.$_loadHandler;
            elt.src = url;
            this._images[url] = elt;
        }
        return elt;
    }

    claer(): void {
        this._images = {};
    }
}
