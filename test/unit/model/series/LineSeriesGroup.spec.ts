////////////////////////////////////////////////////////////////////////////////
// LineSeriesGroup.spec.ts
// 2023. 09. 04. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { LineSeriesGroup } from '../../../../src/model/series/LineSeries';

/**
 * Tests for LineSeriesGroup class.
 */
 describe("LineSeriesGroup test", function() {

    it('init', () => {
        let group = new LineSeriesGroup(null);

        expect(group).exist;
        expect(group._type()).eq('line');
        expect(group._seriesType()).eq('line');
    });

    it('props', () => {
        let group = new LineSeriesGroup(null);
    });
});
