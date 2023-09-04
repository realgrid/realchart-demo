////////////////////////////////////////////////////////////////////////////////
// LollipopSeries.spec.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { LollipopSeries } from '../../../src/model/series/LollipopSeries';

/**
 * Tests for LollipopSeries class.
 */
 describe("LollipopSeries test", function() {

    it('init', () => {
        let series = new LollipopSeries(null);

        expect(series).exist;
        expect(series._type()).eq('lollipop');
    });

    it('props', () => {
        let series = new LollipopSeries(null);

        expect(series.pointPadding).undefined;
    });
});
