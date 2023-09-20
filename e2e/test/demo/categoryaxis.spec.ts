////////////////////////////////////////////////////////////////////////////////
// categoryaxis.spec.ts
// 2023. 08. 24. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from '@playwright/test';
import { expect } from 'chai';
import { PWTester } from '../../pwtester';
import { SeriesView } from '../../../src/view/SeriesView';
import { AxisView } from '../../../src/view/AxisView';
import { LineSeriesView } from '../../../src/view/series/LineSeriesView';

/**
 * PlayWright Tests for categoryaxis.html
 */
test.describe('categoryaxis.html test', () => {
	const url = 'demo/categoryaxis.html';

	test.beforeEach(async ({ page }) => {
		await PWTester.goto(page, url);
	});

	test('init', async ({ page }) => {
		const container = await page.$('#realchart');
		expect(container).exist;

		// const bars = await page.$$('.' + SeriesView.POINT_CLASS);
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

	test('padding', async ({ page }) => {
		const series = await page.$('.' + LineSeriesView.CLASS);
		const markers = await series.$$('.' + SeriesView.POINT_CLASS);
		const axis = await PWTester.getAxis(page, 'x');
		const line = await axis.$('.' + AxisView.LINE_CLASS);
		let ticks = await axis.$$('.' + AxisView.TICK_CLASS);
		const rLine = await PWTester.getBounds(line);
		let pTick = await PWTester.getTranslate(ticks[0]);

		expect(markers.length).eq(ticks.length);
		expect(PWTester.same(pTick.x, rLine.width / ticks.length / 2)).is.true;

		// padding -> -0.5
		await page.evaluate('config.xAxis.padding = -0.5; chart.update(config)');

		ticks = await axis.$$('.' + AxisView.TICK_CLASS);
		pTick = await PWTester.getTranslate(ticks[0]);
		expect(PWTester.same(pTick.x, 0)).is.true;

		await page.evaluate('config.xAxis.padding = 0; chart.update(config)');
	});
});
