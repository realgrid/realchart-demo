////////////////////////////////////////////////////////////////////////////////
// bar-negative.spec.ts
// 2023. 08. 24. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from '@playwright/test';
import { expect } from 'chai';
import { PWTester } from '../../pwtester';
import { SeriesView } from '../../../src/view/SeriesView';

/**
 * PlayWright Tests for bar-negative.html
 */
test.describe('bar-negative.html test', () => {
    const url = 'demo/bar-negative.html';

    test.beforeEach(async ({ page }) => {
        await PWTester.goto(page, url);
    });

    test('init', async ({ page }) => {
        const container = await page.$('#realchart');
        expect(container).exist;

        const markers = await page.$$('.' + SeriesView.POINT_CLASS);
        expect(markers.length > 0).is.true;

        const config: any = await page.evaluate('config');
        const data = (config.series || config.series[0]).data;
        expect(data.length).eq(markers.length);

        // await page.screenshot({path: 'out/ss/bar-negative.png'});
    });
});
