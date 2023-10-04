////////////////////////////////////////////////////////////////////////////////
// line-multi.N.spec.ts
// 2023. 08. 30. created by sangchul
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Browser } from 'puppeteer';
import { SeriesView } from '../../../src/view/SeriesView';
import { TitleView } from '../../../src/view/TitleView';
import { AxisView } from '../../../src/view/AxisView';
import test from '@playwright/test';
import { PWTester } from '../PWTester';
/**
 * Puppeteer Tests for line-multi.html
 */

test.describe('line-multi.html test', async function () {
	const url = 'demo/line-multi.html?debug';

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

		for (let i = 0; i < config.series.length; i++) {
			data.push(...config.series[i].data);
		}
		expect(data.length).eq(markers.length);

		// await page.screenshot({path: 'out/ss/line-multi.png'});
		page.close();
	});

	test('title', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const title = await page.$('.' + TitleView.TITLE_CLASS);
		const titleText = await page.evaluate((el) => el.textContent, title);
		expect(titleText).eq(config.title);

		expect(title).exist;
	});

	test('xTitle', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const xAxis = await PWTester.getAxis(page, 'x');
		const xAxisText = await xAxis.$('text');
		const xaxisTitle = await page.evaluate(
			(el) => el.textContent,
			xAxisText
		);
		expect(xaxisTitle).eq(config.xAxis.title);
	});

	test('yTitle', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const yAxis = await PWTester.getAxis(page, 'y');
		const yAxisText = await yAxis.$('text');
		const yAxisTitle = await page.evaluate(
			(el) => el.textContent,
			yAxisText
		);
		expect(yAxisTitle).eq(config.yAxis.title);
	});

	test('legend', async ({ page }) => {
		const config: any = await page.evaluate('config');
		const legends = await page.$$('.rct-legend-item-label');

		expect(legends).exist;

		expect(legends.length).eq(config.series.length);

		for (let i = 0; i < legends.length; i++) {
			const data = await page.evaluate(
				(el) => el.textContent,
				legends[i]
			);
			expect(data).eq(config.series[i].name);
		}
	});

	test('container', async ({ page }) => {
		const config = await page.evaluate('config');

		const container = await page.$('.rct-series-container');
		expect(container).exist;
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

	test('dataPoint', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const dataPoints = await page.$$('.rct-series-points');
		expect(dataPoints).exist;

		for (let i = 0; i < dataPoints.length; i++) {
			const rctPoint = dataPoints[i];
			const point = await rctPoint.$$('.' + SeriesView.POINT_CLASS);
			expect(point.length).eq(config.series[i].data.length);
		}
	});
});
