////////////////////////////////////////////////////////////////////////////////
// bar.spec.ts
// 2023. 08. 22. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Browser, Page } from 'puppeteer';
import { PPTester } from '../../PPTester';
import { SeriesView } from '../../../src/view/SeriesView';
import { TitleView } from '../../../src/view/TitleView';

/**
 * Puppeteer Tests for bar.html
 */
 describe("bar.html test", async function() {

    const url = "http://localhost:6010/realchart/demo/bar.html";
    let browser: Browser;
    let page: Page;

    before(async () => {
        browser = await PPTester.init();
        page = await PPTester.newPage(browser, url);
    });

    after(async () => {
        browser.close();
    });

    it('init', async () => {
        const container = await page.$('#realchart');
        expect(container).exist;

        const bars = await page.$$('.' + SeriesView.POINT_CLASS);
        expect(bars.length > 0).is.true;

        const config: any = await page.evaluate('config');
        const data = config.series.data;
        expect(data.length).eq(bars.length);        

        // bar들이 x축에서 부터 위쪽으로 커진다.
        const yAxisLine = await PPTester.getAxisLine(page, 'y');
        const rAxis = await PPTester.getBounds(yAxisLine);

        bars.forEach(async bar => {
            const r = await PPTester.getBounds(bar);

            PPTester.same(r.y + r.height, rAxis.height);
        });

        // 값과 높이들을 비교한다.
        for (let i = 1; i < bars.length; i++) {
            const prev = bars[i - 1];
            const bar = bars[i];

            const rPrev = await PPTester.getBounds(prev);
            const rBar = await PPTester.getBounds(bar);

            if (data[i] >= data[i - 1]) {
                expect(rBar.height).gte(rPrev.height);
            } else {
                expect(rBar.height).lt(rPrev.height);
            }
        }

        // await page.screenshot({path: 'out/ss/bar.png'});
        // page.close();
    });
 
    it('Y-reversed', async () => {
        await page.evaluate('config.yAxis.reversed = true; chart.update(config)');

        const bars = await page.$$('.' + SeriesView.POINT_CLASS);

        // bar들이 상단의 x축에서 부터 아래쪽으로 커진다.
        bars.forEach(async bar => {
            const r = await PPTester.getBounds(bar);

            expect(r.y).eq(0);
        })
        
        await page.evaluate('config.yAxis.reversed = false; chart.update(config)');
    });
 
    it('inverted', async () => {
        await page.evaluate('config.inverted = true; chart.update(config)');

        const xAxisLine = await PPTester.getAxisLine(page, 'x');
        const rAxis = await PPTester.getBounds(xAxisLine);
        const bars = await page.$$('.' + SeriesView.POINT_CLASS);
        const config: any = await page.evaluate('config');
        const data = config.series.data;

        // 가로가 더 길어야 한다.
        bars.forEach(async bar => {
            const r = await PPTester.getBounds(bar);
            expect(r.width).gt(r.height);
        })

        // bar들이 왼쪽 Y축에서 부터 오른쪽 방향으로 커진다.
        bars.forEach(async bar => {
            const r = await PPTester.getBounds(bar);

            expect(r.x).eq(0);
            expect(r.x + r.width <= rAxis.width).is.true;
        })

        // 값과 너비들을 비교한다.
        for (let i = 1; i < bars.length; i++) {
            const prev = bars[i - 1];
            const bar = bars[i];

            const rPrev = await PPTester.getBounds(prev);
            const rBar = await PPTester.getBounds(bar);

            if (data[i] >= data[i - 1]) {
                expect(rBar.width).gte(rPrev.width);
            } else {
                expect(rBar.width).lt(rPrev.width);
            }
        }

        await page.evaluate('config.inverted = false; chart.update(config)');
    });
    it('title', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const title = await page.$('.' + TitleView.TITLE_CLASS);
        expect(title).exist;

        const Text = await title.$('text');
        const titleText = await page.evaluate((el) => el.textContent, Text);
        console.log(titleText);


    });
});
