////////////////////////////////////////////////////////////////////////////////
// SeriesAnimation.ts
// 2023. 08. 04. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcAnimation } from "../../common/RcAnimation";
import { Series } from "../../model/Series";
import { SeriesView } from "../SeriesView";

export abstract class SeriesAnimation {

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static slide(series: SeriesView<Series>): void {
        new SlideAnimation(series);
    }

    static grow(series: SeriesView<Series>): void {
        new GrowAnimation(series);
    }

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
    protected abstract _createAnimation(series: SeriesView<Series>): Animation | RcAnimation;
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
            duration: RcAnimation.DURATION,
            fill: 'none'
        });
        
        ani?.addEventListener('finish', () => {
            v.control.removeDef(cr);
        });
        return ani;
    }   
}

export class GrowAnimation extends RcAnimation {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _series: SeriesView<Series>;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(series: SeriesView<Series>) {
        super();

        this._series = series;
        this.start();
    }

    protected _doUpdate(rate: number): void {
        this._series.setViewRate(rate);
    }

    protected _doStop(): void {
        this._series.setViewRate(NaN);
        this._series = null;
    }
}