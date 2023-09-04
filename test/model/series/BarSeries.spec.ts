////////////////////////////////////////////////////////////////////////////////
// BarSeries.spec.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BarSeries } from '../../../src/model/series/BarSeries';

/**
 * Tests for BarSeries class.
 */
 describe("BarSeries test", function() {

    it('init', () => {
        let series = new BarSeries(null);

        expect(series).exist;
        expect(series._type()).eq('bar');
    });

    it('props', () => {
        let series = new BarSeries(null);

        expect(series.pointPadding).undefined;
    });
});
