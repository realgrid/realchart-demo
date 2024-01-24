////////////////////////////////////////////////////////////////////////////////
// bar-multi.spec.ts
// 2023. 08. 24. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from '@playwright/test';
import { expect } from 'chai';
import { PWTester } from '../PWTester';
import { SeriesView } from '../../../src/view/SeriesView';

/**
 * PlayWright Tests for bar-multi.html
 */
test.describe('bar-multi.html test', () => {
    const url = 'demo/bar-multi.html?debug';

    test.beforeEach(async ({ page }) => {
        await PWTester.goto(page, url);
    });

    test('init', async ({ page }) => {
        const container = await page.$('#realchart');
        expect(container).exist;

        const bars = await page.$$('.' + SeriesView.POINT_CLASS);
        expect(bars.length > 0).is.true;

        const config: any = await page.evaluate('config');
        const data = config.series.reduce((acc, s) => acc.concat(s.data), []);
        expect(data.length).eq(bars.length);

        // await page.screenshot({path: 'out/ss/bar-multi.png'});
    });
});
