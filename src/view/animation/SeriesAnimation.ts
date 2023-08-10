////////////////////////////////////////////////////////////////////////////////
// SeriesAnimation.ts
// 2023. 08. 04. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcAnimation } from "../../common/RcAnimation";
import { pixel } from "../../common/Types";
import { Series } from "../../model/Series";
import { SeriesView } from "../SeriesView";

export abstract class SeriesAnimation {

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static slide(series: SeriesView<Series>, options?: ISlideAnimation): void {
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

export interface ISlideAnimation {
    from: 'left' | 'right' | 'top' | 'bottom';
}

export class SlideAnimation extends SeriesAnimation {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(series: SeriesView<Series>, options?: ISlideAnimation) {
        super(series, options);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createAnimation(v: SeriesView<Series>, options: ISlideAnimation): Animation {
        switch (options.from) {
            case 'top':
                return this.$_top(v, options);
            case 'bottom':
                return this.$_bottom(v, options);
            default:
                return this.$_left(v, options);
        }
    }   

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_aniOptions(options: ISlideAnimation): KeyframeAnimationOptions {
        return {
            duration: RcAnimation.DURATION,
            fill: 'none'
        };
    }

    private $_left(v: SeriesView<Series>, options: ISlideAnimation): Animation {
        const cr = v.clipRect(0, -v.height / 2, v.width, v.height * 2);

        return cr.dom.firstElementChild.animate([
            { width: '0'},
            { width: pixel(v.width)}
        ], this.$_aniOptions(options));
    }

    private $_top(v: SeriesView<Series>, options: ISlideAnimation): Animation {
        const cr = v.clipRect(0, 0, v.width, v.height);

        return cr.dom.firstElementChild.animate([
            { height: '0'},
            { height: pixel(v.height)}
        ], this.$_aniOptions(options));
    }

    private $_bottom(v: SeriesView<Series>, options: ISlideAnimation): Animation {
        const cr = v.clipRect(0, 0, v.width, v.height);

        return cr.dom.firstElementChild.animate([
            { transform: `translateY(${v.height}px)` },
            { transform: 'tranlsateY(0)' }
        ], this.$_aniOptions(options));
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