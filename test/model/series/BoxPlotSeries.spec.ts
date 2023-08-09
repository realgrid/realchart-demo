////////////////////////////////////////////////////////////////////////////////
// BoxPlotSeries.spec.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BoxPlotSeries } from '../../../src/model/series/BoxPlotSeries';

/**
 * Tests for BoxPlotSeries class.
 */
 describe("BoxPlotSeries test", function() {

    it('init', () => {
        let series = new BoxPlotSeries(null);

        expect(series).exist;
    });

    it('props', () => {
        let series = new BoxPlotSeries(null);

        expect(series.pointPadding).undefined;
    });
});
