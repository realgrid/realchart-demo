////////////////////////////////////////////////////////////////////////////////
// histogram.N.spec.ts
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
import { Chart } from '../../../src/main';
import { HistogramSeries } from '../../../src/model/series/HistogramSeries';
import { TitleView } from '../../../src/view/TitleView';
import { LegendView } from '../../../src/view/LegendView';

/**
 * Puppeteer Tests for histogram.html
 */
describe("histogram.html test", async function () {

    const url = "http://localhost:6010/realchart/demo/histogram.html";
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
        const data = (config.series || config.series[0]).data;

        const chart = new Chart(config);
        const series = chart.firstSeries as HistogramSeries;
        const bins = series.getBinCount(data.length);

        expect(bins).eq(bars.length);

        // await page.screenshot({path: 'out/ss/histogram.png'});
        page.close();
    });


    it('title 타이틀 존재 유무와 알맞은 값인지 확인', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const title = await page.$('.' + TitleView.TITLE_CLASS);
        expect(title).exist;

        const titleText = await page.evaluate((el) => el.textContent, title);
        expect(titleText).eq(config.title);
    });

    it('tick 틱의 존재유무 확인', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const xAxis = await PPTester.getAxis(page, 'x');
        const xAxisTick = await xAxis.$$('.rct-axis-tick');
        expect(xAxisTick).exist
    });

    it('credit 의 존재 유무와 "RealCahrt"를 포함하는지 확인', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const credit = await page.$('.rct-credits');
        expect(credit);

        const text = await credit.$('text')
        expect(Text).exist;

        const creditText = await page.evaluate((el) => el.textContent, text);
        expect(creditText).contains('RealChart')


    });

    it('grid 의 존재유무 확인', async () => {
        const page = await PPTester.newPage(browser, url);
        const config = await page.evaluate('config');

        const grid = await page.$('.rct-grids');
        expect(grid).exist;

        const axisGrid = await page.$('.rct-axis-grid');
        expect(axisGrid).exist;
    });

    it('xTickLabel 의 값이 알맞은 값인지 확인', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const axis = await PPTester.getAxis(page, 'x');
        const tickAxis = await axis.$('.rct-axis-labels');
        expect(tickAxis).exist;
    });

    it('yTickLabel 의 존재유무 확인', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const yaxis = await PPTester.getAxis(page, 'y');
        const yTick = await yaxis.$$('.rct-axis-label');
        expect(yTick).exist;
    });

});
