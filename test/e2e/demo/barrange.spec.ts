////////////////////////////////////////////////////////////////////////////////
// barrange.spec.ts
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
 * PlayWright Tests for barrange.html
 */
test.describe('barrange.html test', () => {
    const url = 'demo/barrange.html?debug';

    test.beforeEach(async ({ page }) => {
        await PWTester.goto(page, url);
    });

    test('init', async ({ page }, info) => {
        const container = await page.$('#realchart');
        expect(container).exist;

        const bars = await page.$$('.' + SeriesView.POINT_CLASS);
        expect(bars.length > 0).is.true;

        const config: any = await page.evaluate('config');
        const data = config.series.data;
        expect(data.length).eq(bars.length);

        for (let i = 1; i < bars.length; i++) {
            const prev = bars[i - 1];
            const bar = bars[i];

            const rPrev = await PWTester.getBounds(prev);
            const rBar = await PWTester.getBounds(bar);
            console.log(rPrev.height, rBar.height);

            if (data[i][1] - data[i][0] >= data[i - 1][1] - data[i - 1][0]) {
                expect(rBar.height >= rPrev.height).is.true;
            } else {
                expect(rBar.height < rPrev.height).is.true;
            }
        }

        // await page.screenshot({path: 'out/ss/barrange.png'});
    });
});
