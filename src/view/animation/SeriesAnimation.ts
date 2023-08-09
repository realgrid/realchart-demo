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
    static slide(series: SeriesView<Series>, options?: { from: string }): void {
        new SlideAnimation(series, options);
    }

    static fadeIn(series: SeriesView<Series>): void {
        new StyleAnimation(series, {prop: 'opacity', start: '0', end: '1'});
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
    constructor(series: SeriesView<Series>, options?: any) {
        this._createAnimation(series, options);
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected abstract _createAnimation(series: SeriesView<Series>, options?: any): Animation | RcAnimation;
}

export class StyleAnimation extends SeriesAnimation {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(series: SeriesView<Series>, options: {prop: string, start: string, end: string}) {
        super(series, options);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createAnimation(v: SeriesView<Series>, options: {prop: string, start: string, end: string}): Animation {
        const start = {};
        const end = {};
        start[options.prop] = options.start;
        end[options.prop] = options.end;
        const ani = v.dom.animate([
            start, end
        ], {
            duration: RcAnimation.DURATION,
            fill: 'none'
        });
        return ani;
    }   
}

export class SlideAnimation extends SeriesAnimation {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(series: SeriesView<Series>, options?: {from: string}) {
        super(series, options);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createAnimation(v: SeriesView<Series>, options: {from: string}): Animation {
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