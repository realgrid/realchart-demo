////////////////////////////////////////////////////////////////////////////////
// BumpSeriesGroup.spec.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BumpSeriesGroup } from '../../../src/model/series/BumpSeriesGroup';

/**
 * Tests for BumpSeriesGroup class.
 */
 describe("BumpSeriesGroup test", function() {

    it('init', () => {
        let series = new BumpSeriesGroup(null);

        expect(series).exist;
    });

    it('props', () => {
        let series = new BumpSeriesGroup(null);
    });
});
