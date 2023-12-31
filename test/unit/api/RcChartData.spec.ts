////////////////////////////////////////////////////////////////////////////////
// RcChartData.spec.ts
// 2023. 12. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { RcChartData } from '../../../src/main';
import { Globals } from '../../../src/globals';

/**
 * Tests for RcChartData class.
 */
 describe("RcChartData test", function() {

    it('init', () => {
        const data = Globals.createData();

        expect(data).instanceOf(RcChartData);
    });
});
