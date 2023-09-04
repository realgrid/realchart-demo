////////////////////////////////////////////////////////////////////////////////
// VectorSeries.spec.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { VectorSeries } from '../../../src/model/series/VectorSeries';

/**
 * Tests for VectorSeries class.
 */
 describe("VectorSeries test", function() {

    it('init', () => {
        let series = new VectorSeries(null);

        expect(series).exist;
        expect(series._type()).eq('vector');
    });

    it('props', () => {
        let series = new VectorSeries(null);
    });
});
