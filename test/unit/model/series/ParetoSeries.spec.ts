////////////////////////////////////////////////////////////////////////////////
// ParetoSeries.spec.ts
// 2023. 08. 04. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ParetoSeries } from '../../../../src/model/series/ParetoSeries';

const config = {
    source: 'main',
    curved: true,
    data: []
};

/**
 * Tests for ParetoSeries class.
 */
 describe("ParetoSeries test", function() {

    it('init', () => {
        let series = new ParetoSeries(null);

        expect(series).exist;
        expect(series._type()).eq('pareto');
    });

    it('props', () => {
        let series = new ParetoSeries(null);

        expect(series.curved).is.false;

        series.load(config);
        expect(series.curved).is.true;
        expect(series.source).eq(config.source);

        config.curved = false;
        series.load(config);
        expect(series.curved).is.false;
    });
});
