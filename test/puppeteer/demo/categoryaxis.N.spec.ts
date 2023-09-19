////////////////////////////////////////////////////////////////////////////////
// categoryaxis.N.spec.ts
// 2023. 08. 30. created by sangchul
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
import { TitleView } from '../../../src/view/TitleView';
import { LegendView } from '../../../src/view/LegendView';

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
        let pTick = await PPTester.getTranslate(ticks[0]);

        expect(markers.length).eq(ticks.length);
        expect(PPTester.same(pTick.x, rLine.width / ticks.length / 2)).is.true;

        // padding -> -0.5
        await page.evaluate('config.xAxis.padding = -0.5; chart.update(config)');

        pTick = await PPTester.getTranslate(ticks[0]);
        expect(PPTester.same(pTick.x, 0)).is.true;

        await page.evaluate('config.xAxis.padding = 0; chart.update(config)');
    });


    it('title', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const title = await page.$('.' + TitleView.TITLE_CLASS);
        expect(title).exist;
 
        const titleText = await page.evaluate((el) => el.textContent, title);
        expect(titleText).eq(config.title);
    });

    it('xTitle', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const xAxis = await PPTester.getAxis(page, 'x');
        const xAxisText = await xAxis.$('text');
        expect(xAxis).exist;


        const xAxistTitle = await page.evaluate((el) => el.textContent, xAxisText);
        expect(xAxistTitle).eq(config.xAxis.title.text);
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
        const xAxisTick = await xAxis.$$('.rct-axis-tick');
        let maxLength = 0;
        config.series.forEach((eachSeries) => {
            if(maxLength < eachSeries.data.length) {
                maxLength = eachSeries.data.length;
            }
        });
        expect(maxLength).eq(xAxisTick.length)
        
    });

    it('legend', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const legend = await page.$('.' + LegendView.LEGEND_CLASS);
        expect(legend).exist;

        const legendMark = await page.$('.rct-legend-item-marker');
        expect(legendMark);

        const legendLabel = await legend.$('text');
        const legendText = await page.evaluate((el) => el.textContent, legendLabel);
        expect(legendText).exist;
        console.log(legendText);
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

    it('xTickLabel', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const axis = await PPTester.getAxis(page, 'x');
        const tickAxis = await axis.$('.rct-axis-labels');
        const textElements = await tickAxis.$$('text');
        for(let i = 0; i < textElements.length; i++) {
            const tickText = await page.evaluate((el) => el.textContent, textElements[i]);
            expect(tickText).eq(config.xAxis.categories[i]);
        }  
    });

    it('yTickLabel', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const yaxis = await PPTester.getAxis(page,'y');
        const yTick = await yaxis.$$('.rct-axis-label');
        expect(yTick).exist;
    });

    it('point', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const dataPoints = await page.$('.rct-series-points');
        expect(dataPoints).exist;

        const linePoints = await page.$$('.rct-line-series .rct-point-label[y="12"]');
        expect(linePoints).exist;
        const barPoints = await page.$$('.rct-bar-series .rct-point-label[y="12"]');
        expect(barPoints).exist;
        let maxLength = 0;
        config.series.forEach((eachSeries) => {
            if(maxLength < eachSeries.data.length) {
                maxLength = eachSeries.data.length;
            }
        });
        expect(maxLength).eq(linePoints.length);
        expect(maxLength).eq(barPoints.length);

        const pointLabels = await page.$('.rct-point-labels' );
        expect(pointLabels).exist;
    });
});
