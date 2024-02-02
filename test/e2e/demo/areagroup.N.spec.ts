////////////////////////////////////////////////////////////////////////////////
// areagroup.N.spec.ts
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
 * Puppeteer Tests for areagroup.html
 */
test.describe('areagroup.html test', async function () {
	const url = 'e2e-demo/areagroup.html?debug';

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
		const group = config.series[0] || config.series;

		for (let i = 0; i < group.children.length; i++) {
			data.push(...group.children[i].data);
		}
		expect(data.length).eq(markers.length);

		// await page.screenshot({path: 'out/ss/areagroup.png'});
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

	test('legend', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const legend = await page.$('.' + LegendView.LEGEND_CLASS);
		expect(legend).exist;

		const legendMark = await page.$('.rct-legend-item-marker');
		expect(legendMark);

		const legendLabel = await legend.$('text');
		const legendText = await page.evaluate(
			(el) => el.textContent,
			legendLabel
		);
		expect(legendText).exist;
		console.log(legendText);
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

		const grid = await page.$('.rct-axis-grids');
		expect(grid).exist;

		const axisGrid = await page.$('.rct-axis-grid');
		expect(axisGrid).exist;
	});
});
