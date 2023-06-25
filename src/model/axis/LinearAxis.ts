////////////////////////////////////////////////////////////////////////////////
// LinearAxis.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Axis, AxisTick, IAxisTick } from "../Axis";

export class LinearAxisTick extends AxisTick {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    stepSize: number;
    stepPixels = 72;
    stepCount: number;
    steps: number[];

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}

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
    minValue: number;
    maxValue: number;
    /**
     * baseValue가 설정되고,
     * 계산된 최소값이 baseValue보다 작고 최대값이 baseValue보다 클 때,
     * min max를 둘 중 큰 절대값으로 맞춘다.
     * 두 시리즈가 양쪽으로 벌어지는 컬럼/바 시리즈에 활용할 수 있다.
     */
    syncMinMax = false;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _hardMin: number;
    private _hardMax: number;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    contains(value: number): boolean {
        return (this.nullable && isNaN(value)) || super.contains(value);
    }

    protected _createTick(): AxisTick {
        return new LinearAxisTick(this);
    }

    protected _doPrepareRender(): void {
        this._hardMin = this.minValue;
    }

    protected _doBuildTicks(calcedMin: number, calcedMax: number, length: number): IAxisTick[] {
        const tick = this.tick as LinearAxisTick;
        const { min, max } = this.$_adjustMinMax(calcedMin, calcedMax);
        let steps: number[];

        if (Array.isArray(tick.steps)) {
            steps = tick.steps.slice(0);
        } else if (tick.stepCount > 0) {
            steps = this._getStepsByCount(tick.stepCount, min, max);
        } else if (tick.stepSize > 0) {
            steps = this._getStepsBySize(tick.stepSize, min, max);
        } else if (tick.stepPixels > 0) {
            steps = this._getStepsByPixels(length, tick.stepPixels, min, max);
        } else {
            steps = [min, max];
        }
        return;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_adjustMinMax(min: number, max: number): { min: number, max: number } {
        const base = this.baseValue;
        const minPad = this.minPadding;
        const maxPad = this.maxPadding;

        if (!isNaN(base)) {
            if (this.syncMinMax && min <= base && max >= base) {
                const v = Math.max(Math.abs(min), Math.abs(max));
    
                max = base + v;
                min = base - v;
            } 
         
            if (!isNaN(this._hardMin)) {
                min = this._hardMin;
            }
            if (!isNaN(this._hardMax)) {
                max = this._hardMax;
            }
        }

        let len = Math.max(0, max - min);

        if (!isNaN(minPad)) {
            min -= len * minPad;
        }
        if (!isNaN(maxPad)) {
            max += len * maxPad;
        }

        return { min, max };
    }

    private _getStepsByCount(count: number, min: number, max: number): number[] {
        return;
    }

    private _getStepsBySize(size: number, min: number, max: number): number[] {
        const unit = Math.pow(10, Math.floor(Math.log10(size)));

        return;
    }

    private _getStepsByPixels(length: number, pixels: number, min: number, max: number): number[] {
        return;
    }
}