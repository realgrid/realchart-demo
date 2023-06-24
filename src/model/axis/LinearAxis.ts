////////////////////////////////////////////////////////////////////////////////
// LinearAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Axis, IAxisTick } from "../Axis";

export class LinearAxis extends Axis {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * data point의 이 축 값이 NaN일 때도 point를 표시할 지 여부.
     */
    nullable = true;
    /**
     * 적어도 이 값이 최소값으로 표시된다.
     */
    baseValue = 0;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    contains(value: number): boolean {
        return (this.nullable && isNaN(value)) || super.contains(value);
    }

    protected _doPrepareRender(): void {
    }

    protected _doBuildTicks(min: number, max: number, length: number): IAxisTick[] {
        return;
    }
}