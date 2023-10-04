////////////////////////////////////////////////////////////////////////////////
// bump.N.spec.ts
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
 * Puppeteer Tests for bump.html
 */
test.describe('bump.html test', async function () {
	const url = 'demo/bump.html?debug';

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

		// await page.screenshot({path: 'out/ss/bump.png'});
		page.close();
	});

	test('title', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const title = await page.$('.' + TitleView.TITLE_CLASS);
		expect(title).exist;

		const text = await title.$('text');
		const titleText = await page.evaluate((el) => el.textContent, text);
		expect(titleText).eq(config.title.text);
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

	test('tick', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const xAxis = await PWTester.getAxis(page, 'x');
		const xAxisTick = await xAxis.$$('.rct-axis-tick');

		let maxLength = 0;
		for (let i = 0; i < config.series.children.length; i++) {
			if (maxLength < config.series.children[i].data.length) {
				maxLength = config.series.children[i].data.length;
			}
		}
		expect(maxLength).eq(xAxisTick.length);
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
	});

	test('seriesPoint', async ({ page }) => {
		const config: any = await page.evaluate('config');
		const seriesPoints = await page.$$('.rct-series-points');
		expect(seriesPoints).exist;
		for (let i = 0; i < seriesPoints.length; i++) {
			const points = await seriesPoints[i].$$('.rct-point');
			expect(points.length).eq(config.series.children[i].data.length);
		}
	});

	test('pointLabel', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const pointLabels = await page.$$('.rct-point-labels');

		for (let i = 0; i < pointLabels.length; i++) {
			const text = await pointLabels[i].$$('text[y="12"]');
			for (let j = 0; j < text.length; j++) {
				const pointText = await page.evaluate(
					(el) => el.textContent,
					text[j]
				);
				expect(Number(pointText)).eq(config.series.children[i].data[j]);
			}
		}
	});
});
