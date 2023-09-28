////////////////////////////////////////////////////////////////////////////////
// BumpSeriesGroup.spec.ts
// 2023. 08. 03. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BumpSeriesGroup } from '../../../../src/model/series/BumpSeriesGroup';

/**
 * Tests for BumpSeriesGroup class.
 */
 describe("BumpSeriesGroup test", function() {

    it('init', () => {
        let group = new BumpSeriesGroup(null);

        expect(group).exist;
        expect(group._type()).eq('bump');
        expect(group._seriesType()).eq('line');
    });

    it('props', () => {
        let group = new BumpSeriesGroup(null);
    });
});
