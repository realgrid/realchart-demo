////////////////////////////////////////////////////////////////////////////////
// line-multi.N.spec.ts
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
import { AxisView } from '../../../src/view/AxisView';

/**
 * Puppeteer Tests for line-multi.html
 */
 describe("line-multi.html test", async function() {

    const url = "http://localhost:6010/realchart/demo/line-multi.html";
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

        for (let i = 0; i < config.series.length; i++) {
            data.push(...config.series[i].data);
        }
        expect(data.length).eq(markers.length);        

        // await page.screenshot({path: 'out/ss/line-multi.png'});
        page.close();
    });

    it('title', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const title = await page.$('.' + TitleView.TITLE_CLASS);
        const titleText = await page.evaluate((el) => el.textContent, title);
        expect(titleText).eq(config.title);

        expect(title).exist;
    });

    it('xTitle', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');
        
        const xAxis = await PPTester.getAxis(page, 'x');
        const xAxisText = await xAxis.$('text');
        const xaxisTitle = await page.evaluate((el) => el.textContent, xAxisText);
        expect(xaxisTitle).eq(config.xAxis.title);
    });

    it('yTitle', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const yAxis = await PPTester.getAxis(page, 'y');
        const yAxisText = await yAxis.$('text');
        const yAxisTitle = await page.evaluate((el) => el.textContent, yAxisText);
        expect(yAxisTitle).eq(config.yAxis.title)
    });

    it('legend', async() => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');
        const legends = await page.$$('.rct-legend-item-label'); 

        expect(legends).exist;

        expect(legends.length).eq(config.series.length)

        for (let i = 0; i < legends.length; i++) {
           const data = await page.evaluate((el) => el.textContent, legends[i])
           expect(data).eq(config.series[i].name);
        }

    });

    it('container', async() => {
        const page = await PPTester.newPage(browser, url);
        const config = await page.evaluate('config');

        const container = await page.$('.rct-series-container');
        expect(container).exist;
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
        const config = await page.evaluate('config');

        const grid = await page.$('.rct-grids');
        expect(grid).exist;

        const axisGrid = await page.$('.rct-axis-grid');
        expect(axisGrid).exist;
    });

    it('dataPoint', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const dataPoints = await page.$$('.rct-series-points');
        expect(dataPoints).exist;

        for(let i = 0; i < dataPoints.length; i++) {
            const rctPoint = dataPoints[i]
            const point = await rctPoint.$$('.' + SeriesView.POINT_CLASS);
            expect(point.length).eq(config.series[i].data.length);
        }
    });
});
