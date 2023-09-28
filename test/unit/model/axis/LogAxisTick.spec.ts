////////////////////////////////////////////////////////////////////////////////
// LogAxisTick.spec.ts
// 2023. 06. 26. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { LogAxisTick } from '../../../../src/model/axis/LogAxis';

/**
 * Tests for LogAxisTick class.
 */
 describe("LogAxisTick test", function() {

    it('init', () => {
        const model = new LogAxisTick(null);

        expect(model).exist;
    });

    it('build steps - steps', () => {
        const model = new LogAxisTick(null);
        model.steps = [1, 2, 3, 4];

        const steps = model.buildSteps(1000, 0, 0, 10);
        expect(steps).deep.eq(model.steps);
    });

    it('build steps - stepCount', () => {
        const model = new LogAxisTick(null);
        const base = NaN;
        const min = 1;
        const max = 163;
        const count = 5;

        model.stepCount = count;

        const steps = model.buildSteps(1000, base, min, max);
        console.log(steps);
    });

    it('build steps - based stepCount', () => {
        const model = new LogAxisTick(null);
        const base = NaN;
        const min = 5;//-19;
        const max = 163;
        const count = 5;

        model.stepCount = count;

        const steps = model.buildSteps(1000, 0, min, max);
        console.log(steps);
    });

    it('build steps - stepSize', () => {
        const model = new LogAxisTick(null);
        const min = 5;
        const max = 111;

        model.stepSize = 1;

        const steps = model.buildSteps(1000, 0, min, max);
        console.log(steps);
    });

    it('build steps - stepPixels', () => {
        const model = new LogAxisTick(null);
        const min = 15;
        const max = 111;

        model.stepPixels = 76;

        const steps = model.buildSteps(300, 0, min, max);
        console.log(steps);
    });
});
