////////////////////////////////////////////////////////////////////////////////
// BarSeriesGroup.spec.ts
// 2023. 09. 04. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BarSeriesGroup } from '../../../../src/model/series/BarSeries';

/**
 * Tests for BarSeriesGroup class.
 */
 describe("BarSeriesGroup test", function() {

    it('init', () => {
        let group = new BarSeriesGroup(null);

        expect(group).exist;
        expect(group._type()).eq('bargroup');
        expect(group._seriesType()).eq('bar');
    });

    it('props', () => {
        let group = new BarSeriesGroup(null);
    });
});
