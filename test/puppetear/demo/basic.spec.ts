////////////////////////////////////////////////////////////////////////////////
// basic.spec.ts
// 2023. 08. 23. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Browser } from 'puppeteer';
import { PPTester } from '../../PPTester';
import { TitleView } from '../../../src/view/TitleView';
import { SeriesView } from '../../../src/view/SeriesView';
import { LegendView } from '../../../src/view/LegendView';
import { AxisView } from '../../../src/view/AxisView';
import { BodyView } from '../../../src/view/BodyView';

/**
 * Puppetear Tests for basic.html
 */
 describe("basic.html test", async function() {

    const url = "http://localhost:6010/realchart/demo/basic.html";
    let browser: Browser;

    before(async () => {
        browser = await PPTester.init();
    });

    after(async () => {
        browser.close();
    });

    it('init', async () => {
        const page = await PPTester.newPage(browser, url);

        // container
        const container = await page.$('#realchart');
        expect(container).exist;

        // body
        const body = await page.$('.' + BodyView.BODY_CLASS);
        expect(body).exist;
        const rBody = await PPTester.getBounds(body);

        // title
        const title = await page.$('.' + TitleView.TITLE_CLASS);
        expect(title).exist;
        const rTitle = await PPTester.getBounds(title);
        // body 위쪽에
        expect(rTitle.y).lt(rBody.y);

        // legend
        const legend = await page.$('.' + LegendView.LEGEND_CLASS);
        expect(legend).exist;
        const rLegend = await PPTester.getBounds(legend);
        // body 아래쪽에
        expect(rLegend.y).gt(rBody.y);

        // x axis
        const xAxis = await page.$('.' + AxisView.AXIS_CLASS + '[xy="x"]');
        expect(xAxis).exist;
        const rXAxis = await PPTester.getBounds(xAxis);
        // body 아래쪽에
        expect(rXAxis.y).gt(rBody.y);

        // y axis
        const yAxis = await page.$('.' + AxisView.AXIS_CLASS + '[xy="y"]');
        expect(yAxis).exist;
        const rYAxis = await PPTester.getBounds(yAxis);
        // body 왼편에
        expect(rYAxis.x).lt(rBody.x);

        // series
        const bars = await page.$$('.' + SeriesView.POINT_CLASS);
        expect(bars.length > 0).is.true;

        const config: any = await page.evaluate('config');
        const data = config.series.data;
        expect(data.length).eq(bars.length);        
    });
});
