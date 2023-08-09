////////////////////////////////////////////////////////////////////////////////
// WaterfallSeries.spec.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { WaterfallSeries } from '../../../src/model/series/WaterfallSeries';

/**
 * Tests for WaterfallSeries class.
 */
 describe("WaterfallSeries test", function() {

    it('init', () => {
        let series = new WaterfallSeries(null);

        expect(series).exist;
    });

    it('props', () => {
        let series = new WaterfallSeries(null);

        expect(series.pointPadding).undefined;
    });
});
