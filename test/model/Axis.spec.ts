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

    calcluateRange(): { min: number; max: number; } {
        return;
    }

    protected _doPrepareTicks(min: number, max: number, length: number): IAxisTick[] {
        return [];
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
