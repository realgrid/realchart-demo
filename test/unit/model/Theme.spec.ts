////////////////////////////////////////////////////////////////////////////////
// Theme.spec.ts
// 2023. 09. 09. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Theme, ThemeCollection } from '../../../src/model/Theme';
import { LinearGradient } from '../../../src/model/Asset';

/**
 * Tests for Theme class.
 */
 describe("Theme test", function() {

    it('init', () => {
        const theme = new Theme(null);

        expect(theme).exist;
    });

    it('load', () => {
        const src = {
            name: 'orange',
            palette: 'gray',
            assets: [{
                type: 'lineargradient',
                id: 'gradient-01'
            }]
        };
        const theme = new Theme(src);

        expect(theme.name).eq(src.name);
        expect(theme.palette).eq(src.palette);
        expect(theme.assets.count).eq(src.assets.length);
        expect(theme.assets.get(0)).instanceof(LinearGradient);
    });
});

/**
 * Tests for ThemeCollection class.
 */
describe("ThemeCollection test", function() {

    it('init', () => {
        const themes = new ThemeCollection();

        expect(themes).exist;
    });
});
