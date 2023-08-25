////////////////////////////////////////////////////////////////////////////////
// categoryaxis.spec.ts
// 2023. 08. 24. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Browser, Page } from 'puppeteer';
import { PPTester } from '../../PPTester';
import { SeriesView } from '../../../src/view/SeriesView';
import { AxisView } from '../../../src/view/AxisView';
import { LineSeriesView } from '../../../src/view/series/LineSeriesView';

/**
 * Puppeteer Tests for categoryaxis.html
 */
 describe("categoryaxis.html test", async function() {

    const url = "http://localhost:6010/realchart/demo/categoryaxis.html";
    let browser: Browser;
    let page: Page;

    before(async () => {
        browser = await PPTester.init();
    });

    after(async () => {
        browser.close();
    });

    it('init', async () => {
        page = await PPTester.newPage(browser, url);

        const container = await page.$('#realchart');
        expect(container).exist;

        const bars = await page.$$('.' + SeriesView.POINT_CLASS);
        expect(bars.length > 0).is.true;

        const r = await PPTester.getBounds(bars[0]);
        expect(r.height).gt(100);

        const config: any = await page.evaluate('config');
        const data = [];

        for (let i = 0; i < config.series.length; i++) {
            data.push(...config.series[i].data);
        }
        expect(data.length).eq(bars.length);        

        // await page.screenshot({path: 'out/ss/categoryaxis.png'});
        // page.close();
    });

    it('padding', async () => {
        const series = await page.$('.' + LineSeriesView.CLASS);
        const markers = await series.$$('.' + SeriesView.POINT_CLASS);
        const axis = await PPTester.getAxis(page, 'x');
        const line = await axis.$('.' + AxisView.LINE_CLASS);
        const ticks = await axis.$$('.' + AxisView.TICK_CLASS);
        const rLine = await PPTester.getBounds(line);
        const pTick = await PPTester.getTranslate(ticks[0]);

        expect(markers.length).eq(ticks.length);
        expect(PPTester.same(pTick.x, rLine.width / ticks.length / 2)).is.true;

        // padding -> -0.5
    });
});
