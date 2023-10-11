////////////////////////////////////////////////////////////////////////////////
// LinearGauge.spec.ts
// 2023. 10. 11. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { LinearGauge } from '../../../../src/model/gauge/LinearGauge';

/**
 * Tests for LinearGauge class.
 */
 describe("LinearGauge test", function() {

    it('init', () => {
        const gauge = new LinearGauge(null);

        expect(gauge).is.exist;
    });
});
