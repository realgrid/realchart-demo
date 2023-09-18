////////////////////////////////////////////////////////////////////////////////
// pareto.N.spec.ts
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
 * Puppeteer Tests for pareto.html
 */
 describe("pareto.html test", async function() {

    const url = "http://localhost:6010/realchart/demo/pareto.html";
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

        // 'source' 시리즈로 부터 값을 계산한다.
        // for (let i = 0; i < config.series.length; i++) {
            data.push(...config.series[0].data);
        // }
        expect(data.length * 2).eq(markers.length);        

        // await page.screenshot({path: 'out/ss/pareto.png'});
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

    it('xTitle x축의 타이틀 존재 유무와 알맞은 값인지 확인', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const xAxis = await PPTester.getAxis(page, 'x');
        const xAxisText = await xAxis.$('text');
        expect(xAxis).exist;


        const xAxistTitle = await page.evaluate((el) => el.textContent, xAxisText);
        expect(xAxistTitle).eq(config.xAxis.title);
    });

    it('yTitle y축의 타이틀 존재 유무와 알맞은 값인지 확인', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const yAxis = await PPTester.getAxis(page, 'y');
        const yAxisText = await yAxis.$('text');
        expect(yAxis).exist;

        const yAxistTitle = await page.evaluate((el) => el.textContent, yAxisText);
        expect(yAxistTitle).eq(config.yAxis[0].title);
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
        const texts = await tickAxis.$$('text');

        for (let i = 0; i < texts.length; i++) {
            const textsLabel = await page.evaluate((el) => el.textContent, texts[i]);
            expect(Number(textsLabel)).eq(i) 

        }
    });

    it('yTickLabel 의 존재유무 확인', async () => {
        const page = await PPTester.newPage(browser, url);
        const config: any = await page.evaluate('config');

        const yaxis = await PPTester.getAxis(page, 'y');
        const yTick = await yaxis.$$('.rct-axis-label');
        expect(yTick).exist;
    });
});
