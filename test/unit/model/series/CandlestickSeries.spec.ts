////////////////////////////////////////////////////////////////////////////////
// CandlestickSeries.spec.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { CandlestickSeries } from '../../../../src/model/series/CandlestickSeries';

/**
 * Tests for CandlestickSeries class.
 */
 describe("CandlestickSeries test", function() {

    it('init', () => {
        let series = new CandlestickSeries(null);

        expect(series).exist;
        expect(series._type()).eq('candlestick');
    });

    it('props', () => {
        let series = new CandlestickSeries(null);

        expect(series.pointPadding).undefined;
    });
});
