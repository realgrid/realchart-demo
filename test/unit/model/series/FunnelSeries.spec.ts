////////////////////////////////////////////////////////////////////////////////
// FunnelSeries.spec.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { FunnelSeries } from '../../../../src/model/series/FunnelSeries';

/**
 * Tests for FunnelSeries class.
 */
 describe("FunnelSeries test", function() {

    it('init', () => {
        let series = new FunnelSeries(null);

        expect(series).exist;
        expect(series._type()).eq('funnel');
    });

    it('props', () => {
        let series = new FunnelSeries(null);
    });
});
