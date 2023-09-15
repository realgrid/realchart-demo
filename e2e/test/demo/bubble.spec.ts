////////////////////////////////////////////////////////////////////////////////
// bubble.spec.ts
// 2023. 08. 24. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from '@playwright/test';
import { expect } from 'chai';
import { PWTester } from '../../pwtester';

/**
 * PlayWright Tests for bubble.html
 */
test.describe('bubble.html test', () => {
	const url = 'demo/bubble.html';

	test.beforeEach(async ({ page }) => {
		await PWTester.goto(page, url);
	});

	test('init', async ({ page }) => {
		const container = await page.$('#realchart');
		expect(container).exist;

		const markers = await page.$$('.rct-point');
		expect(markers.length > 0).is.true;

		const config: any = await page.evaluate('config');
		const data = (config.series || config.series[0]).data;
		expect(data.length).eq(markers.length);

		// await page.screenshot({path: 'out/ss/bubble.png'});
	});

	test('title', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const title = await page.$('.rct-title');
		expect(title).exist;

		const titleText = await page.evaluate((el) => el.textContent, title);
		expect(titleText).eq(config.title);
	});

	test('xTitle', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const xAxis = await PWTester.getAxis(page, 'x');
		const xAxisText = await xAxis.$('text');
		expect(xAxis).exist;

		const xAxistTitle = await page.evaluate((el) => el.textContent, xAxisText);
		expect(xAxistTitle).eq(config.xAxis.title);
	});

	test('yTitle', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const yAxis = await PWTester.getAxis(page, 'y');
		const yAxisText = await yAxis.$('text');
		expect(yAxis).exist;

		const yAxistTitle = await page.evaluate((el) => el.textContent, yAxisText);
		expect(yAxistTitle).eq(config.yAxis.title);
	});

	test('tick', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const xAxis = await PWTester.getAxis(page, 'x');
		const xAxisTick = await xAxis.$$('.rct-axis-tick');

		expect(xAxisTick.length).gt(1);
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

	test('xTickLabel', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const axis = await PWTester.getAxis(page, 'x');
		const tickAxis = await axis.$$('.rct-axis-label');

		expect(tickAxis).exist;

		expect(tickAxis.length).gt(1);
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

		const dataPoint = await dataPoints.$$('.rct-point');
		expect(dataPoint.length).eq(config.series.data.length);
	});
});
