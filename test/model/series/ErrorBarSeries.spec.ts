////////////////////////////////////////////////////////////////////////////////
// ErrorBarSeries.spec.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ErrorBarSeries } from '../../../src/model/series/ErrorBarSeries';

/**
 * Tests for ErrorBarSeries class.
 */
 describe("ErrorBarSeries test", function() {

    it('init', () => {
        let series = new ErrorBarSeries(null);

        expect(series).exist;
        expect(series._type()).eq('errorbar');
    });

    it('props', () => {
        let series = new ErrorBarSeries(null);

        expect(series.pointPadding).gt(0);
    });
});
