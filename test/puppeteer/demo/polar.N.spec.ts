////////////////////////////////////////////////////////////////////////////////
// polar.N.spec.ts
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

/**
 * Puppeteer Tests for polar.html
 */
describe("polar.html test", async function () {

    const url = "http://localhost:6010/realchart/demo/polar.html";
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

        // await page.screenshot({path: 'out/ss/polar.png'});
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

    it('axisLabel', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const axisLabel = await page.$('.rct-polar-axis-labels');
        const text = await axisLabel.$$('text');

        for (let i = 0; i < text.length; i++) {
            const labelText = await page.evaluate((el) => el.textContent, text[i])
            expect(labelText).eq(config.series[0].data[i][0]);
        }
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

    it('grid 의 존재유무와 데이터의 갯수와 같은지 확인', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const grid = await page.$('.rct-grids');
        expect(grid).exist;

        const axisGrid = await page.$('.rct-polar-axis-grids');
        expect(axisGrid).exist;

        const axisLine = await axisGrid.$$('.rct-polar-xaxis-grid-line');
        expect(axisLine.length).eq(config.series[0].data.length)
    });
});
