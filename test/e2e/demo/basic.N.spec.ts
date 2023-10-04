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

		expect(xAxisTick.length).eq(config.series.data.length);
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
