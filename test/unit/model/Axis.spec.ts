////////////////////////////////////////////////////////////////////////////////
// Axis.spec.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Axis, AxisGrid, AxisLabel, AxisTick, IAxisTick } from '../../../src/model/Axis';

class AxisImpl extends Axis {

    protected _createGrid(): AxisGrid { return }
    protected _createTickModel(): AxisTick { return }
    protected _createLabel(): AxisLabel { return }
    _type(): string { return 'test'; }
    protected _doPrepareRender(): void {}
    protected _doBuildTicks(min: number, max: number, length: number): IAxisTick[] { return [];}
    getPos(length: number, value: number): number { return 0; }
    getUnitLen(length: number): number { return 0; }
    axisMin(): number { return; }
    axisMax(): number { return; }
    continuous(): boolean { return false }
    valueAt(length: number, pos: number): number { return; }
    xValueAt(pos: number): number { return }
}

/**
 * Tests for Axis class.
 */
 describe("Axis test", function() {

    it('init', () => {
        let axis = new AxisImpl(null, false);

        expect(axis).exist;
    });
});
