////////////////////////////////////////////////////////////////////////////////
// BarRangeSeries.spec.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BarRangeSeries } from '../../../src/model/series/BarRangeSeries';

/**
 * Tests for BarRangeSeries class.
 */
 describe("BarRangeSeries test", function() {

    it('init', () => {
        let series = new BarRangeSeries(null);

        expect(series).exist;
    });

    it('props', () => {
        let series = new BarRangeSeries(null);

        expect(series.pointPadding).undefined;
    });
});
