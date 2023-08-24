////////////////////////////////////////////////////////////////////////////////
// bar.spec.ts
// 2023. 08. 22. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Browser } from 'puppeteer';
import { PPTester } from '../../PPTester';
import { SeriesView } from '../../../src/view/SeriesView';

/**
 * Puppetear Tests for bar.html
 */
 describe("bar.html test", async function() {

    const url = "http://localhost:6010/realchart/demo/bar.html";
    let browser: Browser;

    before(async () => {
        browser = await PPTester.init();
    });

    after(async () => {
        browser.close();
    });

    it('init', async () => {
        const page = await PPTester.newPage(browser, url);

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

            const rPrev = await PPTester.getBounds(prev);
            const rBar = await PPTester.getBounds(bar);

            if (data[i] >= data[i - 1]) {
                expect(rBar.height >= rPrev.height).is.true;
            } else {
                expect(rBar.height < rPrev.height).is.true;
            }
        }

        // await page.screenshot({path: 'out/ss/bar.png'});
        page.close();
    });
});
