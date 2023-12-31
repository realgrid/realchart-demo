////////////////////////////////////////////////////////////////////////////////
// ChartDataCollection.spec.ts
// 2023. 12. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ChartDataCollection } from '../../../src/data/ChartData';

/**
 * Tests for ChartDataCollection class.
 */
 describe("ChartDataCollection test", function() {

    it('init', () => {
        const coll = new ChartDataCollection();

        expect(coll).exist;
    });
});
