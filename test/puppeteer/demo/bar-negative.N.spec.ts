////////////////////////////////////////////////////////////////////////////////
// bar-negative.N.spec.ts
// 2023. 08. 30. created by sangchul
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Browser } from 'puppeteer';
import { PPTester } from '../../PPTester';
import { SeriesView } from '../../../src/view/SeriesView';
import { TitleView } from '../../../src/view/TitleView';
import { AxisTitleView, AxisView } from '../../../src/view/AxisView';

/**
 * Puppeteer Tests for bar-negative.html
 */
 describe("bar-negative.N.html test", async function() {

    const url = "http://localhost:6010/realchart/demo/bar-negative.html";
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
        const data = (config.series || config.series[0]).data;
        expect(data.length).eq(markers.length);        

        // await page.screenshot({path: 'out/ss/bar-negative.png'});
        page.close();
    });

    it('title', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const title = await page.$('.' + TitleView.TITLE_CLASS);
        expect(title).exist;

        const Text = await title.$('text');
        const titleText = await page.evaluate((el) => el.textContent, Text);
        expect(titleText).eq(config.title);
    });

    it('xtick', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const xAxis = await PPTester.getAxis(page,'x');
        const xAxisTick = await xAxis.$$('.' + AxisView.TICK_CLASS);

        expect(xAxisTick.length).eq(config.series.data.length);
        
    });

    it('xlabel', async () => {
        const page = await PPTester.newPage(browser,url);
        const config: any = await page.evaluate('config');

        const xAxis = await PPTester.getAxis(page, 'x');
        const label = await xAxis.$('.' + AxisView.TICK_CLASS);

        const labelTexts = await label.$$('text');
        for(let i = 0; i < labelTexts.length; i++){
            const tickLabels = await page.evaluate((el) => el.textContent, labelTexts[i]);
            expect(tickLabels).eq(config.series.data[i][0])
        }
    });

    it('ytick', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.$('config');

        const yAxis = await PPTester.getAxis(page, 'y');
        const label = await yAxis.$('.' + AxisView.TICK_CLASS);

        const labelTexts = await label.$$('text')
        for(let i = 0; i < labelTexts.length; i++){
            const tickLabel = await page.evaluate((el) => el.textContent, labelTexts[i]);
            expect(tickLabel).exist;
        }
    });

    it('credit', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const credit = await page.$('.rct-credits');
        expect(credit);

        const creditText = await credit.$('text')
        expect(creditText).exist;

    });
    
    it('grid', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const grid = await page.$('.rct-grids');
        expect(grid).exist;

        const axisGrid = await page.$('.rct-axis-grid');
        expect(axisGrid).exist;
    });
});
