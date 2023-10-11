////////////////////////////////////////////////////////////////////////////////
// BulletGauge.spec.ts
// 2023. 10. 11. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BulletGauge } from '../../../../src/model/gauge/BulletGauge';

/**
 * Tests for BulletGauge class.
 */
 describe("BulletGauge test", function() {

    it('init', () => {
        const gauge = new BulletGauge(null);

        expect(gauge).is.exist;
    });
});
