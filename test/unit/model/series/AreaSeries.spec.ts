////////////////////////////////////////////////////////////////////////////////
// AreaSeries.spec.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { AreaSeries } from '../../../../src/model/series/LineSeries';

/**
 * Tests for AreaSeries class.
 */
 describe("AreaSeries test", function() {

    it('init', () => {
        let series = new AreaSeries(null);

        expect(series).exist;
        expect(series._type()).eq('area');
    });

    it('props', () => {
        let series = new AreaSeries(null);

    });
});
