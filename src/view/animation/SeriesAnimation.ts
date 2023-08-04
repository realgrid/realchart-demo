////////////////////////////////////////////////////////////////////////////////
// SeriesAnimation.ts
// 2023. 08. 04. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Series } from "../../model/Series";
import { SeriesView } from "../SeriesView";

export abstract class SeriesAnimation {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(series: SeriesView<Series>) {
        this._createAnimation(series);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _createAnimation(series: SeriesView<Series>): Animation;
}

export class SlideAnimation extends SeriesAnimation {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createAnimation(v: SeriesView<Series>): Animation {
        const cr = v.clipRect(0, -v.height / 2, v.width, v.height * 2);
        const ani = cr.dom.firstElementChild.animate([
            { width: '0'},
            { width: v.width + 'px'}
        ], {
            duration: 700,
            fill: 'none'
        });
        
        ani?.addEventListener('finish', () => {
            v.control.removeDef(cr);
        });
        return ani;
    }   
}