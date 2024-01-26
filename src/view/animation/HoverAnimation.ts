////////////////////////////////////////////////////////////////////////////////
// HoverAnimation.ts
// 2024. 01. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023-2024 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcAnimation, RcAnimationEndHandler } from "../../common/RcAnimation";
import { Series } from "../../model/Series";
import { MarkerSeriesPointView, SeriesView } from "../SeriesView";

export class HoverAnimation extends RcAnimation {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _series: SeriesView<Series>;
    _focused: boolean;
    _marker: MarkerSeriesPointView;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(series: SeriesView<Series>, marker: MarkerSeriesPointView, focused: boolean, endHandler: RcAnimationEndHandler) {
        super();

        this.duration = focused ? 300 : 300;

        this._series = series;
        this._focused = focused;
        this._marker = marker;
        this.start(endHandler);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doStart(): void {
        this._marker.beginHover(this._series, this._focused);
    }

    protected _doUpdate(rate: number): boolean {
        if (this._marker.parent) {
            this._marker.setHoverRate(this._series, this._focused, rate);
            return true;
        }
        return false;
    }

    protected _doStop(): void {
        this._marker.setHoverRate(this._series, this._focused, NaN);
        this._marker = null;
    }
}
