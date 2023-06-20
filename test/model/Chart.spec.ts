////////////////////////////////////////////////////////////////////////////////
// Chart.spec.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Chart } from '../../src/model/Chart';

/**
 * Tests for Chart class.
 */
 describe("Chart test", function() {

    it('init', () => {
        let chart = new Chart();

        expect(chart).exist;
    });
});
