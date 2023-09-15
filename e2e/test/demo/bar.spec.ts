////////////////////////////////////////////////////////////////////////////////
// bar.spec.ts
// 2023. 08. 22. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from '@playwright/test';
import { expect } from 'chai';
import { PWTester } from '../../pwtester';

/**
 * PlayWright Tests for bar.html
 */
test.describe('bar.html test', () => {
	const url = 'demo/bar.html';

	test.beforeEach(async ({ page }) => {
		await PWTester.goto(page, url);
	});

	test('init', async ({ page }) => {
		const container = await page.$('#realchart');
		expect(container).exist;

		const bars = await page.$$('.rct-point');
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
		await page.evaluate('config.yAxis.reversed = true; chart.update(config)');

		const bars = await page.$$('.rct-point');
		const rGrids = await PWTester.getGridBounds(page);

		// bar들이 상단의 x축에서 부터 아래쪽으로 커진다.
		bars.forEach(async (bar) => {
			const r = await PWTester.getBounds(bar);

			expect(PWTester.same(r.y, rGrids.y)).is.true;
			// expect(r.y).eq(rTop.y);
		});

		await page.evaluate('config.yAxis.reversed = false; chart.update(config)');
	});

	test('inverted', async ({ page }) => {
		await page.evaluate('config.inverted = true; chart.update(config)');

		const rGrids = await PWTester.getGridBounds(page);
		const bars = await page.$$('.rct-point');
		const config: any = await page.evaluate('config');
		const data = config.series.data;

		// 가로가 더 길어야 한다.
		bars.forEach(async (bar) => {
			const r = await PWTester.getBounds(bar);
			expect(r.width).gt(r.height);
		});

		// bar들이 왼쪽 Y축에서 부터 오른쪽 방향으로 커진다.
		bars.forEach(async (bar) => {
			const r = await PWTester.getBounds(bar);

			expect(r.x + r.width <= rGrids.x + rGrids.width).is.true;
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

		await page.evaluate('config.inverted = false; chart.update(config)');
	});
	test('title', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const title = await page.$('.rct-title');
		expect(title).exist;

		const Text = await title.$('text');
		const titleText = await page.evaluate((el) => el.textContent, Text);
		expect(titleText).eq(config.title);
	});
});
