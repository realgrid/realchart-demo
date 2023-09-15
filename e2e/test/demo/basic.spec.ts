////////////////////////////////////////////////////////////////////////////////
// basic.spec.ts
// 2023. 08. 23. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from '@playwright/test';
import { expect } from 'chai';
import { PWTester } from '../../pwtester';

/**
 * PlayWright Tests for basic.html
 */
test.describe('basic.html test', () => {
    const url = 'demo/basic.html';

    test.beforeEach(async ({ page }) => {
        await PWTester.goto(page, url);
    });

    test('init', async ({ page }) => {
        // container
        const container = await page.$('#realchart');
        expect(container).exist;

        // body
        const body = await page.$('.rct-plot');
        expect(body).exist;
        const rBody = await PWTester.getBounds(body);

        // title
        const title = await page.$('.rct-title');
        expect(title).exist;
        const rTitle = await PWTester.getBounds(title);
        // body 위쪽에
        expect(rTitle.y).lt(rBody.y);

        // legend
        const legend = await page.$('.rct-legend');
        expect(legend).exist;
        const rLegend = await PWTester.getBounds(legend);
        // body 아래쪽에
        expect(rLegend.y).gt(rBody.y);

        // x axis
        const xAxis = await PWTester.getAxis(page, 'x');
        expect(xAxis).exist;
        const rXAxis = await PWTester.getBounds(xAxis);
        // body 아래쪽에
        expect(rXAxis.y).gt(rBody.y);

        // y axis
        const yAxis = await PWTester.getAxis(page, 'y');
        expect(yAxis).exist;
        const rYAxis = await PWTester.getBounds(yAxis);
        // body 왼편에
        expect(rYAxis.x).lt(rBody.x);

        // series
        const bars = await page.$$('.rct-point');
        expect(bars.length > 0).is.true;

        const config: any = await page.evaluate('config');
        const data = config.series.data;
        expect(data.length).eq(bars.length);

        // await page.screenshot({path: 'out/ss/basic.png'});
    });
});
