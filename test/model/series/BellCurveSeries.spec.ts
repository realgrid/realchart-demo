////////////////////////////////////////////////////////////////////////////////
// BellCurveSeries.spec.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BellCurveSeries } from '../../../src/model/series/BellCurveSeries';

/**
 * Tests for BellCurveSeries class.
 */
 describe("BellCurveSeries test", function() {

    it('init', () => {
        let series = new BellCurveSeries(null);

        expect(series).exist;
        expect(series._type()).eq('bellcurve');
    });

    it('props', () => {
        let series = new BellCurveSeries(null);
    });
});
