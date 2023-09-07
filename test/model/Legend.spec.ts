////////////////////////////////////////////////////////////////////////////////
// Legend.spec.ts
// 2023. 06. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Legend } from '../../src/model/Legend';

/**
 * Tests for Legend class.
 */
 describe("Legend test", function() {

    it('init', () => {
        const legend = new Legend(null);

        expect(legend).exist;
    });

    it('position & layout', () => {

    });
});
