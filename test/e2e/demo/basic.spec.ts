////////////////////////////////////////////////////////////////////////////////
// basic.spec.ts
// 2023. 08. 23. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from '@playwright/test';
import { expect } from 'chai';
import { PWTester } from '../PWTester';
import { SeriesView } from '../../../src/view/SeriesView';
import { TitleView } from '../../../src/view/TitleView';
import { LegendView } from '../../../src/view/LegendView';
import { BodyView } from '../../../src/view/BodyView';
import { BarSeries } from '../../../src/model/series/BarSeries';
import { CategoryAxis } from '../../../src/model/axis/CategoryAxis';
import { LinearAxis } from '../../../src/model/axis/LinearAxis';

/**
 * PlayWright Tests for basic.html
 */
test.describe('basic.html test', () => {
    
    const url = 'demo/basic.html?debug';

    test.beforeEach(async ({ page }) => {
        await PWTester.goto(page, url);
    });

    test('model', async ({ page }) => {
        const chart = await PWTester.getConfig(page);
        const series = chart.firstSeries;

        expect(series).instanceOf(BarSeries);
        expect(series._xAxisObj).instanceOf(CategoryAxis);
        expect(series._yAxisObj).instanceOf(LinearAxis);
    });

    test('init', async ({ page }) => {
        // container
        const container = await page.$('#realchart');
        expect(container).exist;

        // body
        const body = await page.$('.' + BodyView.BODY_CLASS);
        expect(body).exist;
        const rBody = await PWTester.getBounds(body as any);

        // title
        const title = await page.$('.' + TitleView.TITLE_CLASS);
        expect(title).exist;
        const rTitle = await PWTester.getBounds(title as any);
        // body 위쪽에
        expect(rTitle.y).lt(rBody.y);

        // legend
        const legend = await page.$('.' + LegendView.LEGEND_CLASS);
        expect(legend).exist;
        const rLegend = await PWTester.getBounds(legend as any);
        // body 아래쪽에
        expect(rLegend.y).gt(rBody.y);

        // x axis
        const xAxis = await PWTester.getAxis(page, 'x');
        expect(xAxis).exist;
        const rXAxis = await PWTester.getBounds(xAxis);
        // body 아래쪽에
        expect(rXAxis.y).gt(rBody.y);

        // y axis
        const yAxis = await PWTester.getAxis(page, 'y');
        expect(yAxis).exist;
        const rYAxis = await PWTester.getBounds(yAxis);
        // body 왼편에
        expect(rYAxis.x).lt(rBody.x);

        // series
        const bars = await page.$$('.' + SeriesView.POINT_CLASS);
        expect(bars.length > 0).is.true;

        const config: any = await page.evaluate('config');
        const data = config.series.data;
        expect(data.length).eq(bars.length);

        // await page.screenshot({path: 'out/ss/basic.png'});
    });
});
