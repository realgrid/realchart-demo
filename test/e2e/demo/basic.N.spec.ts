////////////////////////////////////////////////////////////////////////////////
// basic.N.spec.ts
// 2023. 08. 30. created by sangchul
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { TitleView } from '../../../src/view/TitleView';
import { SeriesView } from '../../../src/view/SeriesView';
import { LegendView } from '../../../src/view/LegendView';
import { AxisTitleView, AxisView } from '../../../src/view/AxisView';
import { BodyView } from '../../../src/view/BodyView';
import test from '@playwright/test';
import { PWTester } from '../PWTester';
/**
 * Puppeteer Tests for basic.html
 */

test.describe('basic.html test', async function () {
	const url = 'demo/basic.html?debug';

	test.beforeEach(async ({ page }) => {
		await PWTester.goto(page, url);
	});

	test('init', async ({ page }) => {
		// container
		const container = await page.$('#realchart');
		expect(container).exist;

		// body
		const body = await page.$('.' + BodyView.BODY_CLASS);
		expect(body).exist;
		const rBody = await PWTester.getBounds(body);

		// title
		const title = await page.$('.' + TitleView.TITLE_CLASS);
		expect(title).exist;
		const rTitle = await PWTester.getBounds(title);
		// body 위쪽에
		expect(rTitle.y).lt(rBody.y);

		// legend
		const legend = await page.$('.' + LegendView.LEGEND_CLASS);
		expect(legend).exist;
		const rLegend = await PWTester.getBounds(legend);
		// body 아래쪽에
		expect(rLegend.y).gt(rBody.y);

		// x axis
		const xAxis = await page.$('.' + AxisView.AXIS_CLASS + '[xy="x"]');
		expect(xAxis).exist;
		const rXAxis = await PWTester.getBounds(xAxis);
		// body 아래쪽에
		expect(rXAxis.y).gt(rBody.y);

		// y axis
		const yAxis = await page.$('.' + AxisView.AXIS_CLASS + '[xy="y"]');
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
		page.close();
	});

	test('inverted', async ({ page }) => {
		await page.evaluate('config.inverted = true; chart.load(config)');

		const bars = await page.$$('.' + SeriesView.POINT_CLASS);
		const line = await PWTester.getAxisLine(page, 'x');
		const rline = await PWTester.getBounds(line);

		for (const bar of bars) {
			const rbar = await PWTester.getBounds(bar);
			PWTester.same(rbar.x, rline.x);
		}
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
			if(!config.xAxis.title.visible){
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
			if(!config.yAxis.title.visible){
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

	test('xTickLabel', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const axis = await PWTester.getAxis(page, 'x');
		const tickAxis = await axis.$$('.rct-axis-label');

		expect(tickAxis).exist;

		expect(tickAxis.length).eq(config.series.data.length);

		for (let i = 0; i < tickAxis.length; i++) {
			const tickLabel = await page.evaluate(
				(el) => el.textContent,
				tickAxis[i]
			);
			expect(tickLabel).eq(config.series.data[i][0]);
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
