////////////////////////////////////////////////////////////////////////////////
// area-multi.N.spec.ts
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
import { LegendView } from '../../../src/view/LegendView';

/**
 * Puppeteer Tests for area-multi.html
 */
describe("area-multi.html test", async function () {

    const url = "http://localhost:6010/realchart/demo/area-multi.html";
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

        await page.screenshot({path: 'out/ss/area-multi.png'});
        page.close();
    });
    it('title 의 존재유무와 값이 알맞은지 확인', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const title = await page.$('.' + TitleView.TITLE_CLASS);
        const titleText = await page.evaluate((el) => el.textContent, title);
        expect(title).exist;
        expect(titleText).eq(config.title);
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

    it('xtick', async () => {
        const page = await PPTester.newPage(browser, url);
        const config:any = await page.evaluate('config');

        const xAxis = await PPTester.getAxis(page, 'x');
        const xAxisTICK = await xAxis.$$('.' + AxisView.TICK_CLASS);

        for(let i = 0; i < config.series.length; i++) {
            expect(xAxisTICK.length).eq(config.series[i].data.length);
        }


    });

    it('ytick 의 존재유무 확인', async () => {
        const page = await PPTester.newPage(browser, url);
        const config:any = await page.evaluate('config');

        const yAxis = await PPTester.getAxis(page, 'y');
        const yAxisTICK = await yAxis.$$('.' + AxisView.TICK_CLASS);

        expect(yAxisTICK).exist;
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

    it('legendMarker', async() => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const legend = await page.$$('.rct-legend-item');

        for(let i = 0; i < legend.length; i++) {
        const legendItem = await legend[i].$('.rct-legend-item-marker');
        expect(legendItem).exist;
        }

    });

    it('container', async() => {
        const page = await PPTester.newPage(browser, url);
        const config = await page.evaluate('config');

        const container = await page.$('.rct-series-container');
        expect(container).exist;
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

    it('labelPoint 의 값이 데이터의 값과 알맞은지 확인', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const labelPoint = await page.$$('.rct-legend-item');

        for (let i = 0; i < labelPoint.length; i++) {
            const text = await labelPoint[i].$('text');
            const labelText = await page.evaluate((el) => el.textContent, text);
            expect(labelText).eq(config.series[i].name)
        }
    });

    it('itemMarker 의 실제 갯수와 데이터의 갯수가 알맞은지 확인', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const itemMarker = await page.$$('.rct-legend-item-marker');
        expect(itemMarker).exist;
        expect(itemMarker.length).eq(config.series.length)
    });

    it('grid', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const axisGrid = await page.$('.rct-axis-grid');
        expect(axisGrid).exist;
    });
});
