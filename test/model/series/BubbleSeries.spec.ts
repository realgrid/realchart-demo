////////////////////////////////////////////////////////////////////////////////
// BubbleSeries.spec.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BubbleSeries } from '../../../src/model/series/BubbleSeries';

/**
 * Tests for BubbleSeries class.
 */
 describe("BubbleSeries test", function() {

    it('init', () => {
        let series = new BubbleSeries(null);

        expect(series).exist;
        expect(series._type()).eq('bubble');
    });

    it('props', () => {
        let series = new BubbleSeries(null);
    });
});
