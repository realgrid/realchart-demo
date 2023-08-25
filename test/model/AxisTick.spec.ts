////////////////////////////////////////////////////////////////////////////////
// AxisTick.spec.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { AxisTick, AxisTickLabel } from '../../src/model/Axis';

class TestAxisTick extends AxisTick {

    protected _createLabel(): AxisTickLabel {
        return;
    }
}

/**
 * Tests for AxisTick class.
 */
 describe("AxisTick test", function() {

    it('init', () => {
        const ticks = new TestAxisTick(null);

        expect(ticks).exist;
    });
});
