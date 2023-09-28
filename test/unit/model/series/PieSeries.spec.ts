////////////////////////////////////////////////////////////////////////////////
// PieSeries.spec.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { PieSeries } from '../../../../src/model/series/PieSeries';

/**
 * Tests for PieSeries class.
 */
 describe("PieSeries test", function() {

    it('init', () => {
        let series = new PieSeries(null);

        expect(series).exist;
        expect(series._type()).eq('pie');
    });

    it('props', () => {
        let series = new PieSeries(null);
    });
});
