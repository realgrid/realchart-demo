////////////////////////////////////////////////////////////////////////////////
// SeriesAnimation.ts
// 2023. 08. 04. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcAnimation, RcAnimationEndHandler } from "../../common/RcAnimation";
import { RcElement } from "../../common/RcControl";
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

    static grow(series: SeriesView<Series>, endHandler?: RcAnimationEndHandler): void {
        new GrowAnimation(series, endHandler);
    }

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(series: SeriesView<Series>, options?: any) {
        const ani = this._createAnimation(series, options);

        if (ani instanceof Animation) {
            ani.addEventListener('finish', () => {
                series._animationFinished(ani);
            });
            series._animationStarted(ani);
        }
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

        return v.dom.animate([
            start, end
        ], {
            duration: RcAnimation.DURATION,
            fill: 'none'
        });
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
        const cr = this.$_clipRect(v);
        let ani: Animation;

        switch (options &&options.from) {
            case 'top':
                ani = this.$_top(v, cr, options);
                break;
            case 'bottom':
                ani = this.$_bottom(v, cr, options);
                break;
            case 'right':
                ani = this.$_right(v, cr, options);
                break;
            default:
                ani = this.$_left(v, cr, options);
                break;
        }

        ani.addEventListener('finish', () => {
            cr.dom.remove();
        });
        return ani;
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

    private $_clipRect(v: SeriesView<Series>): RcElement {
        // plot area 경계에 걸친 point들이 표시되도록 infliate한다.
        return v.clipRect(-v.width * .1, -v.height * .1, v.width * 1.2, v.height * 1.2)
                .setTemporary();
        // return v.clipRect(0, 0, v.width, v.height)
        // .setTemporary();
    }

    private $_left(v: SeriesView<Series>, cr: RcElement, options: ISlideAnimation): Animation {
        return cr.dom.firstElementChild.animate([
            { width: '0'},
            { width: pixel(v.width)}
        ], this.$_aniOptions(options));
    }

    private $_right(v: SeriesView<Series>, cr: RcElement, options: ISlideAnimation): Animation {
        return cr.dom.firstElementChild.animate([
            { transform: `translateX(${v.width}px)` },
            { transform: '' }
        ], this.$_aniOptions(options));
    }

    private $_top(v: SeriesView<Series>, cr: RcElement, options: ISlideAnimation): Animation {
        return cr.dom.firstElementChild.animate([
            { height: '0'},
            { height: pixel(v.height)}
        ], this.$_aniOptions(options));
    }

    private $_bottom(v: SeriesView<Series>, cr: RcElement, options: ISlideAnimation): Animation {
        return cr.dom.firstElementChild.animate([
            { transform: `translateY(${v.height}px)` },
            { transform: '' }
        ], this.$_aniOptions(options));
    }
}

export abstract class PointAnimation extends RcAnimation {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    protected _series: SeriesView<Series>;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(series: SeriesView<Series>, endHandler: RcAnimationEndHandler) {
        super();

        this._series = series;
        this.endHandler = endHandler;
        this.start();
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doStop(): void {
        this._series = null;
    }
}

/**
 * bar의 크기를 줄인 상태에서 원복시킨다.
 */
export class GrowAnimation extends PointAnimation {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doUpdate(rate: number): boolean {
        if (this._series.parent) {
            this._series.setViewRate(rate);
            return true;
        }
        return false;
    }

    protected _doStop(): void {
        // animation 기간 중 제거됐을 수 있다.
        if (this._series.parent) {
            this._series.setViewRate(NaN);
        }
        super._doStop();
    }
}

/**
 * 원점 등에 포인트들을 모아 놓은 후 위치를 원복시킨다.
 */
export class UnfoldAnimation extends PointAnimation {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doUpdate(rate: number): boolean {
        if (this._series.parent) {
            this._series.setPosRate(rate);
            return true;
        }
        return false;
    }

    protected _doStop(): void {
        // animation 기간 중 제거됐을 수 있다.
        if (this._series.parent) {
            this._series.setPosRate(NaN);
        }
        super._doStop();
    }
}