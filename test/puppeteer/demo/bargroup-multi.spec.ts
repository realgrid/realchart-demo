////////////////////////////////////////////////////////////////////////////////
// bargroup-multi.spec.ts
// 2023. 08. 24. created by woori
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
 * Puppeteer Tests for bargroup-multi.html
 */
 describe("area-multi.html test", async function() {

    const url = "http://localhost:6010/realchart/demo/bargroup-multi.html";
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

        const markers = await page.$$('.' + SeriesView.POINT_CLASS);
        expect(markers.length > 0).is.true;

        const config: any = await page.evaluate('config');
        const data = [];

        config.series.forEach(group => {
            for (let i = 0; i < group.children.length; i++) {
                data.push(...group.children[i].data);
            }
        })
        expect(data.length).eq(markers.length);        

        // await page.screenshot({path: 'out/ss/bargroup-multi.png'});
        page.close();
    });
});
