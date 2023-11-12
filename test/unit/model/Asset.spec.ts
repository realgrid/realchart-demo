////////////////////////////////////////////////////////////////////////////////
// Asset.spec.ts
// 2023. 09. 09. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { AssetCollection, LinearGradient, RadialGradient } from '../../../src/model/Asset';

/**
 * Tests for LinearGradient class.
 */
 describe("LinearGradient test", function() {

    it('init', () => {
        const asset = new LinearGradient(null);

        expect(asset).exist;
    });
});

/**
 * Tests for RadialGradient class.
 */
describe("RadialGradient test", function() {

    it('init', () => {
        const asset = new RadialGradient(null);

        expect(asset).exist;
    });
});

/**
 * Tests for AssetCollection class.
 */
describe("AssetCollection test", function() {

    it('init', () => {
        const Assets = new AssetCollection();

        expect(Assets).exist;
    });
});
