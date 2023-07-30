////////////////////////////////////////////////////////////////////////////////
// RankAxis.ts
// 2023. 07. 30. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { AxisTick, IAxisTick } from "../Axis";
import { ContinuousAxis, LinearAxis, LinearAxisTick } from "./LinearAxis";

export class RankAxisTick extends LinearAxisTick {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    // buildSteps(length: number, base: number, min: number, max: number): number[] {
    //     min = Math.Rank10(min);
    //     max = Math.Rank10(max);

    //     const steps =  super.buildSteps(length, base, min, max);
    //     return steps;
    // }
}

/**
 * 이 축에 연결된 시리즈들의 data point y값들을 비교해서 순위를 yValue로 재설정한다.
 * <br>
 * y축으로만 사용될 수 있다.
 */
export class RankAxis extends ContinuousAxis {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'rank';
    }

    canBeX(): boolean {
        return false;
    }

    protected _createTick(): AxisTick {
        return new RankAxisTick(this);
    }

    protected _doCalcluateRange(values: number[]): { min: number; max: number; } {
        const v = super._doCalcluateRange(values);

        // v.min = Math.Rank10(v.min);
        // v.max = Math.Rank10(v.max);
        return v;
    }

    protected _doBuildTicks(min: number, max: number, length: number): IAxisTick[] {
        const ticks =  super._doBuildTicks(min, max, length);

        ticks.forEach(t => {
            t.label = String(Math.pow(10, t.value));
        });
        return ticks;
    }

    // getPosition(length: number, value: number): number {
    //     value = value > 0 ? Math.Rank10(value) : 0;
    //     return super.getPosition(length, value);
    // }

    // getStepPosition(length: number, value: number): number {
    //     return super.getPosition(length, value);
    // }
}