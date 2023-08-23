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
import { PPTester } from '../../Puppetear';

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

        const bars = await page.$$('.rct-data-point')
        expect(bars.length > 0).is.true;

        const config: any = await page.evaluate('config');
        const data = config.series.data;
        expect(data.length).eq(bars.length);        

        for (let i = 1; i < bars.length; i++) {
            const prev = bars[i - 1];
            const bar = bars[i];

            const rPrev = await page.evaluate((elt) => {
                const {x, y, width, height} = elt.getBoundingClientRect()
                return {x, y, width, height}
            }, prev)
            const rBar = await page.evaluate((elt) => {
                const {x, y, width, height} = elt.getBoundingClientRect()
                return {x, y, width, height}
            }, bar)

            if (data[i] >= data[i - 1]) {
                expect(rBar.height >= rPrev.height).is.true;
            } else {
                expect(rBar.height < rPrev.height).is.true;
            }
        }
        await page.screenshot({path: 'out/test.png'});
    });
});
