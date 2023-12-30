////////////////////////////////////////////////////////////////////////////////
// Asset.spec.ts
// 2023. 09. 09. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { AssetCollection, ColorList, ImageList, LinearGradient, RadialGradient } from '../../../src/model/Asset';

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
 * Tests for ColorList class.
 */
describe("ColorList test", function() {

    const source = {
        id: 'c',
        colors: ['aaa', 'bbb', 'ccc', 'ddd', 'eee']
    };

    it('init', () => {
        const colors = new ColorList(source);

        expect(colors).exist;
    });

    it('getNext', () => {
        const colors = new ColorList(source);

        colors.getEelement(null, source);
        colors.prepare();
        for (let i = 0; i < source.colors.length; i++) {
            expect(colors.getNext()).eq(source.colors[i]);
        }
    });
});

/**
 * Tests for ImageList class.
 */
describe("ImageList test", function() {

    const source = {
        id: 'c',
        rootUrl: 'http://abc.com/',
        width: 32,
        images: [{
            name: 'aaa', url: 'aaa'
        }, {
            name: 'bbb', url: 'bbb'
        }]
    };

    it('init', () => {
        const images = new ImageList(source);

        expect(images).exist;
    });

    it('getNext', () => {
        const images = new ImageList(source);

        images.getEelement(null, source);
        images.prepare();
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
