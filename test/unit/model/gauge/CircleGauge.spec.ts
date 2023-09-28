////////////////////////////////////////////////////////////////////////////////
// CircleGauge.spec.ts
// 2023. 09. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { CircleGauge } from '../../../../src/model/gauge/CircleGauge';

/**
 * Tests for CircleGauge class.
 */
 describe("CircleGauge test", function() {

    it('init', () => {
        const gauge = new CircleGauge(null);

        expect(gauge).is.exist;
    });
});
