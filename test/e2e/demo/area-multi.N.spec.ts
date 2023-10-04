////////////////////////////////////////////////////////////////////////////////
// area-multi.N.spec.ts
// 2023. 08. 30. created by sangchul
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { SeriesView } from '../../../src/view/SeriesView';
import { TitleView } from '../../../src/view/TitleView';
import { AxisView } from '../../../src/view/AxisView';
import test from '@playwright/test';
import { PWTester } from '../PWTester';

/**
 * Puppeteer Tests for area-multi.html
 */
test.describe("area-multi.html test", () => {

    const url = "demo/area-multi.html?debug";

    test.beforeEach(async ({ page }) => {
        await PWTester.goto(page, url);
    });


    test('init', async ({ page }) => {

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
    test('title 의 존재유무와 값이 알맞은지 확인', async ({ page }) => {
        const config: any = await page.evaluate('config');

        const title = await page.$('.' + TitleView.TITLE_CLASS);
        const titleText = await page.evaluate((el) => el.textContent, title);
        expect(title).exist;
        expect(titleText).eq(config.title);
    });

    test('xTitle', async ({ page }) => {
        const config: any = await page.evaluate('config');

        const xAxis = await PWTester.getAxis(page, 'x');
        const xAxisText = await xAxis.$('text');
        const xaxisTitle = await page.evaluate((el) => el.textContent, xAxisText);
        expect(xaxisTitle).eq(config.xAxis.title);
    });

    test('yTitle', async ({ page }) => {
        const config: any = await page.evaluate('config');

        const yAxis = await PWTester.getAxis(page, 'y');
        const yAxisText = await yAxis.$('text');
        const yAxisTitle = await page.evaluate((el) => el.textContent, yAxisText);
        expect(yAxisTitle).eq(config.yAxis.title)
    });

    test('xtick', async ({ page }) => {
        const config:any = await page.evaluate('config');

        const xAxis = await PWTester.getAxis(page, 'x');
        const xAxisTICK = await xAxis.$$('.' + AxisView.TICK_CLASS);

        for(let i = 0; i < config.series.length; i++) {
            expect(xAxisTICK.length).eq(config.series[i].data.length);
        }


    });

    test('ytick 의 존재유무 확인', async ({ page }) => {
        const config:any = await page.evaluate('config');

        const yAxis = await PWTester.getAxis(page, 'y');
        const yAxisTICK = await yAxis.$$('.' + AxisView.TICK_CLASS);

        expect(yAxisTICK).exist;
    });

    test('legend', async ({ page }) => {
        const config: any = await page.evaluate('config');
        const legends = await page.$$('.rct-legend-item-label'); 

        expect(legends).exist;

        expect(legends.length).eq(config.series.length)

        for (let i = 0; i < legends.length; i++) {
           const data = await page.evaluate((el) => el.textContent, legends[i])
           expect(data).eq(config.series[i].name);
        }

    });

    test('legendMarker', async ({ page }) => {
        const config: any = await page.evaluate('config');

        const legend = await page.$$('.rct-legend-item');

        for(let i = 0; i < legend.length; i++) {
        const legendItem = await legend[i].$('.rct-legend-item-marker');
        expect(legendItem).exist;
        }

    });

    test('container', async({ page }) => {
        const config = await page.evaluate('config');

        const container = await page.$('.rct-series-container');
        expect(container).exist;
    });

    test('dataPoint', async ({ page }) => {
        const config: any = await page.evaluate('config');

        const dataPoints = await page.$$('.rct-series-points');
        expect(dataPoints).exist;

        for(let i = 0; i < dataPoints.length; i++) {
            const rctPoint = dataPoints[i]
            const point = await rctPoint.$$('.' + SeriesView.POINT_CLASS);
            expect(point.length).eq(config.series[i].data.length);
        }
    });

    test('labelPoint 의 값이 데이터의 값과 알맞은지 확인', async ({ page }) => {
        const config: any = await page.evaluate('config');

        const labelPoint = await page.$$('.rct-legend-item');

        for (let i = 0; i < labelPoint.length; i++) {
            const text = await labelPoint[i].$('text');
            const labelText = await page.evaluate((el) => el.textContent, text);
            expect(labelText).eq(config.series[i].name)
        }
    });

    test('itemMarker 의 실제 갯수와 데이터의 갯수가 알맞은지 확인', async ({ page }) => {
        const config: any = await page.evaluate('config');

        const itemMarker = await page.$$('.rct-legend-item-marker');
        expect(itemMarker).exist;
        expect(itemMarker.length).eq(config.series.length)
    });

    test('grid', async ({ page }) => {
        const config: any = await page.evaluate('config');

        const axisGrid = await page.$('.rct-axis-grid');
        expect(axisGrid).exist;
    });
});
