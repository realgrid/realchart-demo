////////////////////////////////////////////////////////////////////////////////
// bar.N.spec.ts
// 2023. 08. 30. created by sangchul
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { SeriesView } from '../../../src/view/SeriesView';
import { TitleView } from '../../../src/view/TitleView';
import { AxisTitleView, AxisView } from '../../../src/view/AxisView';
import { CategoryAxis } from '../../../src/model/axis/CategoryAxis';
import test from '@playwright/test';
import { PWTester } from '../PWTester';
import { PPTester } from '../../PPTester';
/**
 * Puppeteer Tests for bar.html
 */
test.describe('bar.html test', async function () {
	const url = 'demo/bar.html?debug';

	test.beforeEach(async ({ page }) => {
		await PWTester.goto(page, url);
	});

	test('init', async ({ page }) => {
		const bars = await page.$$('.' + SeriesView.POINT_CLASS);
		expect(bars.length > 0).is.true;

		const config: any = await page.evaluate('config');
		const data = config.series.data;
		expect(data.length).eq(bars.length);

		// bar들이 x축에서 부터 위쪽으로 커진다.
		const yAxisLine = await PWTester.getAxisLine(page, 'y');
		const rAxis = await PWTester.getBounds(yAxisLine);

		bars.forEach(async (bar) => {
			const r = await PWTester.getBounds(bar);

			PWTester.same(r.y + r.height, rAxis.height);
		});

		// 값과 높이들을 비교한다.
		for (let i = 1; i < bars.length; i++) {
			const prev = bars[i - 1];
			const bar = bars[i];

			const rPrev = await PWTester.getBounds(prev);
			const rBar = await PWTester.getBounds(bar);

			if (data[i] >= data[i - 1]) {
				expect(rBar.height).gte(rPrev.height);
			} else {
				expect(rBar.height).lt(rPrev.height);
			}
		}

		// await page.screenshot({path: 'out/ss/bar.png'});
		// page.close();
	});

	test('Y-reversed', async ({ page }) => {
		await page.evaluate('config.yAxis.reversed = true; chart.load(config)');

		const bars = await page.$$('.' + SeriesView.POINT_CLASS);
		const grids = await page.$$('.rct-axis-grid');
		for (let i = 0; i < bars.length; i++) {
			let gridr, r;

			for (const grid of grids) {
				gridr = await PWTester.getBounds(grid);
			}

			for (const bar of bars) {
				r = await PWTester.getBounds(bar);
			}

			expect(gridr.y).eq(r.y);
		}

		await page.evaluate(
			'config.yAxis.reversed = false; chart.load(config)'
		);
	});

	test('inverted', async ({ page }) => {
		await page.evaluate('config.inverted = true; chart.load(config)');

		const xAxisLine = await PWTester.getAxisLine(page, 'x');
		const rAxis = await PWTester.getBounds(xAxisLine);
		const bars = await page.$$('.' + SeriesView.POINT_CLASS);
		const config: any = await page.evaluate('config');
		const data = config.series.data;
		const axisGrid = await page.$('.rct-axis-grid:last-child');
		const lastChild = await axisGrid.$('.rct-axis-grid-line-end');
		const GridEnd = await PWTester.getBounds(lastChild);

		// 가로가 더 길어야 한다.
		bars.forEach(async (bar) => {
			const r = await PWTester.getBounds(bar);
			expect(r.width).gt(r.height);
		});

		// bar들이 왼쪽 Y축에서 부터 오른쪽 방향으로 커진다.
		bars.forEach(async (bar) => {
			const r = await PWTester.getBounds(bar);
			const xAxis = await PWTester.getBounds(xAxisLine);
			expect(r.x).eq(xAxis.x);

			expect(r.width <= GridEnd.x - r.x).is.true;
		});

		// 값과 너비들을 비교한다.
		for (let i = 1; i < bars.length; i++) {
			const prev = bars[i - 1];
			const bar = bars[i];

			const rPrev = await PWTester.getBounds(prev);
			const rBar = await PWTester.getBounds(bar);

			if (data[i] >= data[i - 1]) {
				expect(rBar.width).gte(rPrev.width);
			} else {
				expect(rBar.width).lt(rPrev.width);
			}
		}

		await page.evaluate('config.inverted = false; chart.load(config)');
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
});
