////////////////////////////////////////////////////////////////////////////////
// Axis.spec.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Axis, AxisTick, IAxisTick } from '../../src/model/Axis';

class AxisImpl extends Axis {

    protected _createTick(): AxisTick {
        throw new Error('Method not implemented.');
    }
    type(): string { return 'test'; }
    protected _doPrepareRender(): void {}
    protected _doBuildTicks(min: number, max: number, length: number): IAxisTick[] { return [];}
    getPosition(length: number, value: number): number { return 0; }
    getUnitLength(length: number): number { return 0; }
    axisMin(): number { return; }
    axisMax(): number { return; }
}

/**
 * Tests for Axis class.
 */
 describe("Axis test", function() {

    it('init', () => {
        let axis = new AxisImpl(null);

        expect(axis).exist;
    });
});
