////////////////////////////////////////////////////////////////////////////////
// AxisAnimation.ts
// 2023. 12. 25. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcAnimation, RcAnimationEndHandler } from "../../common/RcAnimation";
import { AxisView } from "../AxisView";

export class AxisAnimation extends RcAnimation {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _axis: AxisView;
    private _prevMin: number;
    private _prevMax: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: AxisView, prevMin: number, prevMax: number, endHandler: RcAnimationEndHandler) {
        super();

        this._axis = axis;
        this._prevMin = prevMin;
        this._prevMax = prevMax;
        this.endHandler = endHandler;
        this.start();
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doUpdate(rate: number): boolean {
        if (this._axis.parent) {
            const prev = this._prevMax - this._prevMin;
            const next = this._axis.model.axisMax() - this._axis.model.axisMin();
            const start = next / prev;

            rate = start + (1 - start) * rate;
            this._axis.model.setPrevRate(rate);
            this._axis.invalidate();
            return true;
        }
        return false;
    }

    protected _doStop(): void {
        this._axis.model.setPrevRate(NaN);
        this._axis = null;
    }
}
