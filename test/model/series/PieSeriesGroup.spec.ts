////////////////////////////////////////////////////////////////////////////////
// PieSeriesGroup.spec.ts
// 2023. 09. 04. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { PieSeriesGroup } from '../../../src/model/series/PieSeries';

/**
 * Tests for PieSeriesGroup class.
 */
 describe("PieSeriesGroup test", function() {

    it('init', () => {
        let group = new PieSeriesGroup(null);

        expect(group).exist;
        expect(group._type()).eq('pie');
        expect(group._seriesType()).eq('pie');
    });

    it('props', () => {
        let group = new PieSeriesGroup(null);
    });
});
