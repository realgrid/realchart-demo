////////////////////////////////////////////////////////////////////////////////
// AreaRangeSeries.spec.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { AreaRangeSeries } from '../../../src/model/series/LineSeries';

/**
 * Tests for AreaRangeSeries class.
 */
 describe("AreaRangeSeries test", function() {

    it('init', () => {
        let series = new AreaRangeSeries(null);

        expect(series).exist;
        expect(series._type()).eq('arearange')
    });

    it('props', () => {
        let series = new AreaRangeSeries(null);

    });
});
