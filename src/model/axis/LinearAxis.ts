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
    /**
     * 계산된 최소값이 음수이고 최대값이 양수일 때,
     * min max를 그 중 큰 값(절대값 기준)으로 맞춘다.
     * 두 시리즈가 양쪽으로 벌어지는 컬럼/바 시리즈에 활용할 수 있다.
     */
    syncMinMax = false;

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

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    /**
     * @param interval 기준 interval
     * @returns <0~9: 0, 10~99: 1, 100~999: 2, ...
     */
    private $_getIntervalUnit(interval: number): number {
        return Math.pow(10, Math.floor(Math.log10(interval)));
    }
}