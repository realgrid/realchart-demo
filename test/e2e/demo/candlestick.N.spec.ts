////////////////////////////////////////////////////////////////////////////////
// candlestick.N.spec.ts
// 2023. 08. 30. created by sangchul
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { SeriesView } from '../../../src/view/SeriesView';
import { TitleView } from '../../../src/view/TitleView';
import { LegendView } from '../../../src/view/LegendView';
import test from '@playwright/test';
import { PWTester } from '../PWTester';
/**
 * Puppeteer Tests for candlestick.html
 */

test.describe('candlestick.html test', async function () {
	const url = 'demo/candlestick.html?debug';

	test.beforeEach(async ({ page }) => {
		await PWTester.goto(page, url);
	});

	test('init', async ({ page }) => {
		const container = await page.$('#realchart');
		expect(container).exist;

		const markers = await page.$$('.' + SeriesView.POINT_CLASS);
		expect(markers.length > 0).is.true;

		const config: any = await page.evaluate('config');
		const data = (config.series || config.series[0]).data;
		expect(data.length).eq(markers.length);

		// await page.screenshot({path: 'out/ss/candlestick.png'});
		page.close();
	});

	test('title', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const title = await page.$('.' + TitleView.TITLE_CLASS);
		expect(title).exist;

		const titleText = await page.evaluate((el) => el.textContent, title);
		expect(titleText).eq(config.title);
	});

	test('xTitle', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const xAxis = await PWTester.getAxis(page, 'x');
		const xAxisText = await xAxis.$('text');

		const xAxisTitle = await page.evaluate(
			(el) => el.textContent,
			xAxisText
		);
		if(config.xAxis.title){
			const obj = config.xAxis.title;
			const value = obj.text;
			if(config.xAxis.title.visible){
				expect(xAxisTitle).eq(value);
			}else if(typeof(config.xAxis.title) === 'string'){
				expect(xAxisTitle).eq(config.xAxis.title)
			}else{
                expect(true, "This should be false").to.be.false; // AssertionError: This should be false: expected true to be false 잘못된 값 입력함
            }
		}else{
			const displayValue = await xAxis.$eval('.rct-axis-title', el => el.style.display);
			expect(displayValue).to.equal('none');
		}
	});

	test('yTitle', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const yAxis = await PWTester.getAxis(page, 'y');
		const yAxisText = await yAxis.$('text');

		const yAxisTitle = await page.evaluate(
			(el) => el.textContent,
			yAxisText
		);
		if(config.yAxis.title){
			const obj = config.yAxis.title;
			const value = obj.text;
			if(config.yAxis.title.visible){
				expect(yAxisTitle).eq(value);
			}else if(typeof(config.yAxis.title) === 'string'){
				expect(yAxisTitle).eq(config.yAxis.title)
			}else{
                expect(true, "This should be false").to.be.false; // AssertionError: This should be false: expected true to be false 잘못된 값 입력함
            }
		}else{
			const displayValue = await yAxis.$eval('.rct-axis-title', el => el.style.display);
			expect(displayValue).to.equal('none');
		}
		
	});

	test('xAxis tick', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const xAxis = await PWTester.getAxis(page, 'x');
		const xAxisTick = await xAxis.$$('.rct-axis-tick');
		if(config.xAxis.tick){
			expect(xAxisTick.length).eq(config.series.data.length);
		}else{
			const displayValue = await xAxis.$eval('.rct-axis-ticks', el => el.style.display);
			expect(displayValue).to.equal('none');
		}
			
	});

	test('credit', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const credit = await page.$('.rct-credits');
		expect(credit);

		const creditText = await credit.$('text');
		expect(creditText).exist;
	});

	test('grid', async ({ page }) => {
		const config = await page.evaluate('config');

		const grid = await page.$('.rct-grids');
		expect(grid).exist;

		const axisGrid = await page.$('.rct-axis-grid');
		expect(axisGrid).exist;
	});

	test('xTickLabel 사용자가 지정하지 않은 경우', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const axis = await PWTester.getAxis(page, 'x');
		const tickAxis = await axis.$('.rct-axis-labels');
		const text = await tickAxis.$$('text');
		for (let i = 0; i < text.length; i++) {
			const tickText = await page.evaluate(
				(el) => el.textContent,
				text[i]
			);
			expect(Number(tickText)).eq(i);
		}
	});

	test('yTickLabel', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const yaxis = await PWTester.getAxis(page, 'y');
		const yTick = await yaxis.$$('.rct-axis-label');
		expect(yTick).exist;
	});
	test('dataPoint', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const dataPoints = await page.$('.rct-series-points');
		expect(dataPoints).exist;

		const dataPoint = await dataPoints.$$('.' + SeriesView.POINT_CLASS);
		expect(dataPoint.length).eq(config.series.data.length);
	});
});
