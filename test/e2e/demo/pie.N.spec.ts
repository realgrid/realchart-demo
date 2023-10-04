////////////////////////////////////////////////////////////////////////////////
// pie.N.spec.ts
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
 * Puppeteer Tests for pie.html
 */

test.describe('pie.html test', async function () {
	const url = 'demo/pie.html?debug';

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

		// await page.screenshot({path: 'out/ss/pie.png'});
		page.close();
	});

	test('title 타이틀 존재 유무와 알맞은 값인지 확인', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const title = await page.$('.' + TitleView.TITLE_CLASS);
		expect(title).exist;

		const titleText = await page.evaluate((el) => el.textContent, title);
		expect(titleText).eq(config.title);
	});

	test('credit 의 존재 유무와 "RealCahrt"를 포함하는지 확인', async ({
		page,
	}) => {
		const config: any = await page.evaluate('config');

		const credit = await page.$('.rct-credits');
		expect(credit);

		const text = await credit.$('text');
		expect(text).exist;

		const creditText = await page.evaluate((el) => el.textContent, text);
		expect(creditText).contains('RealChart');
	});

	test('seriesPoint', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const seriesPoint = await page.$('.rct-series-points');
		const poins = await seriesPoint.$$('.rct-point');

		expect(poins.length).eq(config.series.data.length);
	});

	test('labelPoint', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const labelPoint = await page.$('.rct-point-labels');
		const text = await labelPoint.$$('text[y="12"]');
		const combinedData = config.series.data.map(
			(obj) => `${obj.name} (${obj.y})`
		);

		for (let i = 0; i < text.length; i++) {
			const labelText = await page.evaluate(
				(el) => el.textContent,
				text[i]
			);
			expect(labelText).eq(combinedData[i]);
		}
	});

	test('legend', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const legend = await page.$('.' + LegendView.LEGEND_CLASS);
		expect(legend).exist;

		const legendMark = await page.$('.rct-legend-item-marker');
		expect(legendMark);

		const combinedData = config.series.data.map((obj) => `${obj.name}`);
		const legendLabel = await legend.$$('text');

		for (let i = 0; i < legendLabel.length; i++) {
			const legendText = await page.evaluate(
				(el) => el.textContent,
				legendLabel[i]
			);
			expect(legendText).eq(combinedData[i]);
		}
	});
});
