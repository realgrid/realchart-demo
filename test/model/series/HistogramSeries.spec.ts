////////////////////////////////////////////////////////////////////////////////
// HistogramSeries.spec.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { HistogramSeries } from '../../../src/model/series/HistogramSeries';

/**
 * Tests for HistogramSeries class.
 */
 describe("HistogramSeries test", function() {

    it('init', () => {
        let series = new HistogramSeries(null);

        expect(series).exist;
    });

    it('props', () => {
        let series = new HistogramSeries(null);
    });
});
