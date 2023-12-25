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

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(axis: AxisView, endHandler: RcAnimationEndHandler) {
        super();

        this._axis = axis;
        this.endHandler = endHandler;
        this.start();
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doUpdate(rate: number): boolean {
        if (this._axis.parent) {
            this._axis.setViewRate(rate);
            return true;
        }
        return false;
    }

    protected _doStop(): void {
        this._axis.setViewRate(NaN);
        this._axis = null;
    }
}
