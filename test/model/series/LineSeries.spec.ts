////////////////////////////////////////////////////////////////////////////////
// LineSeries.spec.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { LineSeries } from '../../../src/model/series/LineSeries';

/**
 * Tests for LineSeries class.
 */
 describe("LineSeries test", function() {

    it('init', () => {
        let series = new LineSeries(null);

        expect(series).exist;
    });

    it('props', () => {
        let series = new LineSeries(null);
    });
});
