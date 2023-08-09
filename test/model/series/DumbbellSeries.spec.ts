////////////////////////////////////////////////////////////////////////////////
// DumbbellSeries.spec.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { DumbbellSeries } from '../../../src/model/series/DumbbellSeries';

/**
 * Tests for DumbbellSeries class.
 */
 describe("DumbbellSeries test", function() {

    it('init', () => {
        let series = new DumbbellSeries(null);

        expect(series).exist;
    });

    it('props', () => {
        let series = new DumbbellSeries(null);

        expect(series.pointPadding).undefined;
    });
});
