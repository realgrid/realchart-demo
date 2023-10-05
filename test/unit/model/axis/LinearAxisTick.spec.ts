////////////////////////////////////////////////////////////////////////////////
// LinearAxisTick.spec.ts
// 2023. 06. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ContinuousAxisTick } from '../../../../src/model/axis/LinearAxis';

/**
 * Tests for LinearAxisTick class.
 */
 describe("LinearAxisTick test", function() {

    it('init', () => {
        const model = new ContinuousAxisTick(null);

        expect(model).exist;
    });

    it('build steps - steps', () => {
        const model = new ContinuousAxisTick(null);
        model.steps = [1, 2, 3, 4];

        const steps = model.buildSteps(1000, 0, 0, 10);
        expect(steps).deep.eq(model.steps);
    });

    it('build steps - stepCount', () => {
        const model = new ContinuousAxisTick(null);
        const base = NaN;
        const min = -19;
        const max = 163;
        const count = 5;

        model.stepCount = count;

        const steps = model.buildSteps(1000, base, min, max);
        console.log(steps);
    });

    it('build steps - based stepCount', () => {
        const model = new ContinuousAxisTick(null);
        const base = NaN;
        const min = 5;//-19;
        const max = 163;
        const count = 5;

        model.stepCount = count;

        const steps = model.buildSteps(1000, 0, min, max);
        console.log(steps);
    });

    it('build steps - stepSize', () => {
        const model = new ContinuousAxisTick(null);
        const min = 5;
        const max = 111;

        model.stepInterval = 20;

        const steps = model.buildSteps(1000, 0, min, max);
        console.log(steps);
    });

    it('build steps - stepPixels', () => {
        const model = new ContinuousAxisTick(null);
        const min = 15;
        const max = 111;

        model.stepPixels = 76;

        const steps = model.buildSteps(300, 0, min, max);
        console.log(steps);
    });
});
