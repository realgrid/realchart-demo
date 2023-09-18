////////////////////////////////////////////////////////////////////////////////
// bar-multi.N.spec.ts
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
 * Puppeteer Tests for bar-multi.html
 */
 describe("bar-multi.html test", async function() {

    const url = "http://localhost:6010/realchart/demo/bar-multi.html";
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
        const data = [];

        for (let i = 0; i < config.series.length; i++) {
            data.push(...config.series[i].data);
        }
        expect(data.length).eq(bars.length);        

        // await page.screenshot({path: 'out/ss/bar-multi.png'});
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

    it('xTitle', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const xAxis = await PPTester.getAxis(page, 'x');
        const xAxisText = await xAxis.$('text');
        expect(xAxis).exist;


        const xAxistTitle = await page.evaluate((el) => el.textContent, xAxisText);
        expect(xAxistTitle).eq(config.xAxis.title);
    });

    it('yTitle', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const yAxis = await PPTester.getAxis(page,'y');
        const yAxisText = await yAxis.$('text');
        expect(yAxis).exist;

        const yAxistTitle = await page.evaluate((el) => el.textContent, yAxisText);
        expect(yAxistTitle).eq(config.yAxis.title);
    });

    it('xtick', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const xAxis = await PPTester.getAxis(page,'x');
        const xAxisTick = await xAxis.$$('.' + AxisView.TICK_CLASS);

        expect(xAxisTick.length).eq(config.xAxis.categories.length);
    });

    it('xlabel', async () => {
        const page = await PPTester.newPage(browser,url);
        const config: any = await page.evaluate('config');

        const xAxis = await PPTester.getAxis(page, 'x');
        const label = await xAxis.$('.' + AxisView.TICK_CLASS);

        const labelTexts = await label.$$('text');
        for(let i = 0; i < labelTexts.length; i++){
            const tickLabels = await page.evaluate((el) => el.textContent, labelTexts[i]);
            expect(tickLabels).eq(config.xAxis.categories[i])
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

    it('legend', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const xAxis = await PPTester.getAxis(page, 'x');
        const legend = await xAxis.$('.' + AxisTitleView.TITLE_CLASS);
        expect(legend).exist;

        const legendText = await page.evaluate((el) => el.textContent, legend);
        expect(legendText).eq(config.xAxis.title)
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
    it('pointLabel', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const labels = await page.$$('.rct-point-labels');
        for(let k = 0; k < labels.length; k++) {
            const pointLables = await labels[k].$$('text[y="12"]');
            expect(pointLables.length).eq(config.series[k].data.length);
            for(let j = 0; j < pointLables.length; j++) {
                const labelText = await page.evaluate((el) => el.textContent, pointLables[j]);
                expect(Number(labelText)).eq(config.series[k].data[j])
            }
        }
    });
});
