////////////////////////////////////////////////////////////////////////////////
// dumbbell.N.spec.ts
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
 * Puppeteer Tests for dumbbell.html
 */

test.describe('dumbbell.html test', async function () {
	const url = 'demo/dumbbell.html?debug';

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

		// await page.screenshot({path: 'out/ss/dumbbell.png'});
		page.close();
	});

	test('title', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const title = await page.$('.' + TitleView.TITLE_CLASS);
		expect(title).exist;

		const titleText = await page.evaluate((el) => el.textContent, title);
		expect(titleText).eq(config.title);
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
			expect(tickLabel).eq(config.xAxis.categories[i]);
		}
	});

	test('yTickLabel', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const yaxis = await PWTester.getAxis(page, 'y');
		const yTick = await yaxis.$$('.rct-axis-label');
		expect(yTick).exist;
	});

	test('pointLabel', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const pointLabels = await page.$('.rct-point-labels');
		const text = await pointLabels.$$('text');
		const rearranged = [];

		config.series.data.forEach((pair) => {
			rearranged.push(pair[1]);
		});
		config.series.data.forEach((pair) => {
			rearranged.push(pair[0]);
		});
		for (let i = 0; i < text.length; i++) {
			const labelText = await page.evaluate(
				(el) => el.textContent,
				text[i]
			);
			expect(Number(labelText)).eq(rearranged[i]);
		}
	});

	test('location  point-marker의 y값 비교 즉,위치가 알맞은가 ', async ({
		page,
	}) => {
		const config: any = await page.evaluate('config');

		const points = await page.$$('.rct-point');
		for (let i = 0; i < points.length; i++) {
			const markerPoints = await points[i].$$(
				'.rct-dumbbell-point-marker'
			);
			const highPoint = markerPoints[0];
			const lowPoint = markerPoints[1];

			const rhigh = await PWTester.getBounds(highPoint);
			const rlow = await PWTester.getBounds(lowPoint);

			// rhigh.y가 rlow.y보다 작다
			expect(rhigh.y).lt(rlow.y);
		}
	});
});
