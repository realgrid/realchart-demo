////////////////////////////////////////////////////////////////////////////////
// CategoryAxis.spec.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { CategoryAxis } from '../../../src/model/axis/CategoryAxis';

/**
 * Tests for CategoryAxis class.
 */
 describe("CategoryAxis test", function() {

    it('init', () => {
        let axis = new CategoryAxis(null);

        expect(axis).exist;
    });

    it('props', () => {
        let name = 'main';
        let axis = new CategoryAxis(null, name);

        expect(axis.unit).eq(1);
        expect(axis.name).eq(name);
    });

    it('collect categories', () => {
        let axis = new CategoryAxis(null);
    });
});
