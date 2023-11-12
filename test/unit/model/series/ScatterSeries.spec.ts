////////////////////////////////////////////////////////////////////////////////
// ScatterSeries.spec.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ScatterSeries } from '../../../../src/model/series/ScatterSeries';

/**
 * Tests for ScatterSeries class.
 */
 describe("ScatterSeries test", function() {

    it('init', () => {
        let series = new ScatterSeries(null);

        expect(series).exist;
        expect(series._type()).eq('scatter');
    });

    it('props', () => {
        let series = new ScatterSeries(null);
    });
});
