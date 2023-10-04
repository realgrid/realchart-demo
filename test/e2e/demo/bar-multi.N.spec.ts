////////////////////////////////////////////////////////////////////////////////
// bar-multi.N.spec.ts
// 2023. 08. 30. created by sangchul
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { Browser } from 'puppeteer';
import { SeriesView } from '../../../src/view/SeriesView';
import { TitleView } from '../../../src/view/TitleView';
import { AxisTitleView, AxisView } from '../../../src/view/AxisView';
import test from '@playwright/test';
import { PWTester } from '../PWTester';
/**
 * Puppeteer Tests for bar-multi.html
 */
test.describe('bar-multi.html test', async function () {
	const url = 'demo/bar-multi.html?debug';
	let browser: Browser;

	test.beforeEach(async ({ page }) => {
		await PWTester.goto(page, url);
	});

	test('init', async ({ page }) => {
		const container = await page.$('#realchart');
		expect(container).exist;

		const bars = await page.$$('.' + SeriesView.POINT_CLASS);
		expect(bars.length > 0).is.true;

		const config: any = await page.evaluate('config');
		const data = [];

		for (let i = 0; i < config.series.length; i++) {
			data.push(...config.series[i].data);
		}
		expect(data.length).eq(bars.length);

		// await page.screenshot({path: 'out/ss/bar-multi.png'});
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
		expect(xAxis).exist;

		const xAxistTitle = await page.evaluate(
			(el) => el.textContent,
			xAxisText
		);
		expect(xAxistTitle).eq(config.xAxis.title);
	});

	test('yTitle', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const yAxis = await PWTester.getAxis(page, 'y');
		const yAxisText = await yAxis.$('text');
		expect(yAxis).exist;

		const yAxistTitle = await page.evaluate(
			(el) => el.textContent,
			yAxisText
		);
		expect(yAxistTitle).eq(config.yAxis.title);
	});

	test('xtick', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const xAxis = await PWTester.getAxis(page, 'x');
		const xAxisTick = await xAxis.$$('.' + AxisView.TICK_CLASS);

		expect(xAxisTick.length).eq(config.xAxis.categories.length);
	});

	test('xlabel', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const xAxis = await PWTester.getAxis(page, 'x');
		const label = await xAxis.$('.' + AxisView.TICK_CLASS);

		const labelTexts = await label.$$('text');
		for (let i = 0; i < labelTexts.length; i++) {
			const tickLabels = await page.evaluate(
				(el) => el.textContent,
				labelTexts[i]
			);
			expect(tickLabels).eq(config.xAxis.categories[i]);
		}
	});

	test('ytick', async ({ page }) => {
		const config: any = await page.$('config');

		const yAxis = await PWTester.getAxis(page, 'y');
		const label = await yAxis.$('.' + AxisView.TICK_CLASS);

		const labelTexts = await label.$$('text');
		for (let i = 0; i < labelTexts.length; i++) {
			const tickLabel = await page.evaluate(
				(el) => el.textContent,
				labelTexts[i]
			);
			expect(tickLabel).exist;
		}
	});

	test('legend', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const xAxis = await PWTester.getAxis(page, 'x');
		const legend = await xAxis.$('.' + AxisTitleView.TITLE_CLASS);
		expect(legend).exist;

		const legendText = await page.evaluate((el) => el.textContent, legend);
		expect(legendText).eq(config.xAxis.title);
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

		const grid = await page.$('.rct-grids');
		expect(grid).exist;

		const axisGrid = await page.$('.rct-axis-grid');
		expect(axisGrid).exist;
	});
	test('pointLabel', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const labels = await page.$$('.rct-point-labels');
		for (let k = 0; k < labels.length; k++) {
			const pointLables = await labels[k].$$('text[y="12"]');
			expect(pointLables.length).eq(config.series[k].data.length);
			for (let j = 0; j < pointLables.length; j++) {
				const labelText = await page.evaluate(
					(el) => el.textContent,
					pointLables[j]
				);
				expect(Number(labelText)).eq(config.series[k].data[j]);
			}
		}
	});
});
