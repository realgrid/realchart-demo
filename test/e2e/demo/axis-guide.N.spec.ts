////////////////////////////////////////////////////////////////////////////////
// axis-guide.N.spec.ts
// 2023. 08. 30. created by sangchul
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { SeriesView } from '../../../src/view/SeriesView';
import { TitleView } from '../../../src/view/TitleView';
import { AxisTitleView, AxisView } from '../../../src/view/AxisView';
import test from '@playwright/test';
import { PWTester } from '../PWTester';
/**
 * Puppeteer Tests for axis-guide.html
 */
test.describe('area.html test', async function () {
	const url = 'demo/axis-guide.html?debug';

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

		// await page.screenshot({path: 'out/ss/axis-guide.png'});
		page.close();
	});

	test('title', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const title = await page.$('.' + TitleView.TITLE_CLASS);
		expect(title).exist;

		const Text = await title.$('text');
		const titleText = await page.evaluate((el) => el.textContent, Text);
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

	test('xlabel', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const xAxis = await PWTester.getAxis(page, 'x');
		const label = await xAxis.$('.rct-axis-labels');
		const tickarr = [];
		const dataarr = [];
		const labelTexts = await label.$$('text');
		for (let i = 0; i < labelTexts.length; i++) {
			const tickLabels = await page.evaluate(
				(el) => el.textContent,
				labelTexts[i]
			);
			tickarr.push(tickLabels)
		}
		for(let j = 0; j < labelTexts.length; j++){
			dataarr.push(config.series.data[j][0])
		}
		for(let k = 0; k < labelTexts.length; k++){
			expect(tickarr[k]).eq(dataarr[k])
		}
	});


	test('ytick의 존재 확인', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const yAxis = await PWTester.getAxis(page, 'y');
		const label = await yAxis.$$('.' + AxisView.TICK_CLASS);

		if(config.yAxis.tick){
			expect(label).exist;
		}else{
			const displayValue = await yAxis.$eval('.rct-axis-ticks', el => el.style.display);
			expect(displayValue).eq("none");
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
		const config: any = await page.evaluate('config');

		const grid = await page.$('.rct-axis-grids');
		expect(grid).exist;

		const axisGrid = await page.$('.rct-axis-grid');
		expect(axisGrid).exist;
	});

	test('guide', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const range = await page.$('.rct-axis-guide-range');
		expect(range);

		const guideText = await page.$$('.rct-axis-guide-label');

		const lineText = guideText[0];

		const lineLabel = await page.evaluate((el) => el.textContent, lineText);
		const strRange = config.yAxis.guides[0].label.text;
		
		expect(lineLabel).eq(strRange);
	});
});
