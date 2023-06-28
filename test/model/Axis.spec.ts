////////////////////////////////////////////////////////////////////////////////
// Axis.spec.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Axis, IAxisTick } from '../../src/model/Axis';

class AxisImpl extends Axis {

    protected _doPrepareRender(): void {
    }

    protected _doBuildTicks(min: number, max: number, length: number): IAxisTick[] {
        return [];
    }

    getPosition(length: number, value: number): number {
        return 0;
    }
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
