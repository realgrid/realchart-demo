////////////////////////////////////////////////////////////////////////////////
// HeatmapSeries.spec.ts
// 2023. 08. 02. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { HeatmapSeries } from '../../../../src/model/series/HeatmapSeries';

/**
 * Tests for HeatmapSeries class.
 */
 describe("HeatmapSeries test", function() {

    it('init', () => {
        const series = new HeatmapSeries(null);

        expect(series).exist;
        expect(series._type()).eq('heatmap');
    });

    it('props', () => {
        const series = new HeatmapSeries(null);
    });
});
