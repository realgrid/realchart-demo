////////////////////////////////////////////////////////////////////////////////
// axis-guide.N.spec.ts
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
 * Puppeteer Tests for axis-guide.html
 */
 describe("area.N.html test", async function() {

    const url = "http://localhost:6010/realchart/demo/axis-guide.html";
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

        // await page.screenshot({path: 'out/ss/axis-guide.png'});
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

    it('guide', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        
        const range = await page.$('.rct-axis-guide-range');
        expect(range);

        const guideText = await page.$$('.rct-axis-guide-label');
        
        const lineText = guideText[0];
        const rangeText = guideText[1];

        const lineLabel = await page.evaluate((el) => el.textContent, lineText);
        const rangeLabel = await page.evaluate((el) => el.textContent, rangeText);

        expect(lineLabel).eq(config.yAxis.guide[0].label);
        expect(rangeLabel).eq(config.yAxis.guide[1].label.text);

    });
});
