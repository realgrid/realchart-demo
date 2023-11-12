////////////////////////////////////////////////////////////////////////////////
// AreaSeriesGroup.spec.ts
// 2023. 09. 04. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { AreaSeriesGroup } from '../../../../src/model/series/LineSeries';

/**
 * Tests for AreaSeriesGroup class.
 */
 describe("AreaSeriesGroup test", function() {

    it('init', () => {
        let group = new AreaSeriesGroup(null);

        expect(group).exist;
        expect(group._type()).eq('areagroup');
        expect(group._seriesType()).eq('area');
    });

    it('props', () => {
        let group = new AreaSeriesGroup(null);
    });
});
