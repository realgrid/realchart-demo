////////////////////////////////////////////////////////////////////////////////
// ChartData.spec.ts
// 2023. 12. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ChartData } from '../../../src/data/ChartData';

/**
 * Tests for ChartData class.
 */
 describe("ChartData test", function() {

    it('init', () => {
        const data = new ChartData(null, null);

        expect(data).exist;
    });
});
