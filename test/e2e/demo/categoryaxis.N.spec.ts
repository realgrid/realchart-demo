////////////////////////////////////////////////////////////////////////////////
// categoryaxis.N.spec.ts
// 2023. 08. 30. created by sangchul
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { Browser, Page } from 'puppeteer';
import { SeriesView } from '../../../src/view/SeriesView';
import { AxisView } from '../../../src/view/AxisView';
import { LineSeriesView } from '../../../src/view/series/LineSeriesView';
import { TitleView } from '../../../src/view/TitleView';
import { LegendView } from '../../../src/view/LegendView';
import test from '@playwright/test';
import { PWTester } from '../PWTester';
/**
 * Puppeteer Tests for categoryaxis.html
 */
test.describe('categoryaxis.html test', async function () {
	const url = 'e2e-demo/categoryaxis.html?debug';
	let browser: Browser;
	let page: Page;

	test.beforeEach(async ({ page }) => {
		await PWTester.goto(page, url);
	});

	test('init', async ({ page }) => {
		const container = await page.$('#realchart');
		expect(container).exist;

		const bars = await page.$$('.' + SeriesView.POINT_CLASS);
		expect(bars.length > 0).is.true;

		const r = await PWTester.getBounds(bars[0]);
		expect(r.height).gt(100);

		const config: any = await page.evaluate('config');
		const data = [];

		for (let i = 0; i < config.series.length; i++) {
			data.push(...config.series[i].data);
		}
		expect(data.length).eq(bars.length);

		// await page.screenshot({path: 'out/ss/categoryaxis.png'});
		// page.close();
	});

	// test('padding', async ({ page }) => {
	// 	const series = await page.$('.' + LineSeriesView.CLASS);
	// 	const markers = await series.$$('.' + SeriesView.POINT_CLASS);
	// 	const axis = await PWTester.getAxis(page, 'x');
	// 	const line = await axis.$('.' + AxisView.LINE_CLASS);
	// 	let ticks = await axis.$$('.' + AxisView.TICK_CLASS);
	// 	const rLine = await PWTester.getBounds(line);
	// 	let pTick = await PWTester.getTranslate(ticks[0]);

	// 	expect(markers.length).eq(ticks.length);
	// 	expect(PWTester.same(pTick.x, rLine.width / ticks.length / 2)).is.true;

	// 	// padding -> -0.5
	// 	await page.evaluate('config.xAxis.padding = -0.5; chart.load(config)');

	// 	ticks = await axis.$$('.' + AxisView.TICK_CLASS);
	// 	pTick = await PWTester.getTranslate(ticks[0]);
	// 	expect(PWTester.same(pTick.x, 0)).is.true;

	// 	await page.evaluate('config.xAxis.padding = 0; chart.load(config)');
	// });

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
		expect(xAxis).exist;

		const xAxistTitle = await page.evaluate(
			(el) => el.textContent,
			xAxisText
		);
		expect(xAxistTitle).eq(config.xAxis.title.text);
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
		const tickAxis = await axis.$('.rct-axis-labels');
		const textElements = await tickAxis.$$('text');
		for (let i = 0; i < textElements.length; i++) {
			const tickText = await page.evaluate(
				(el) => el.textContent,
				textElements[i]
			);
			expect(tickText).eq(config.xAxis.categories[i]);
		}
	});

	test('yTickLabel', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const yaxis = await PWTester.getAxis(page, 'y');
		const yTick = await yaxis.$$('.rct-axis-label');
		expect(yTick).exist;
	});

	test('point', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const dataPoints = await page.$$('.rct-series-points');
		expect(dataPoints).exist;

		const seriesPoint = await dataPoints[1].$$('.rct-point');

		const barPoint = await dataPoints[0].$$('.rct-point')
		const linePoints = await page.$$('.rct-line-series');
		expect(linePoints).exist;

		const barPoints = await page.$$('.rct-bar-series');
		expect(barPoints).exist;

		let maxLength = 0;
		config.series.forEach((eachSeries) => {
			if (maxLength < eachSeries.data.length) {
				maxLength = eachSeries.data.length;
			}
		});
		expect(maxLength).eq(seriesPoint.length);
		expect(maxLength).eq(barPoint.length);

		const pointLabels = await page.$('.rct-point-labels');
		expect(pointLabels).exist;
	});
});
