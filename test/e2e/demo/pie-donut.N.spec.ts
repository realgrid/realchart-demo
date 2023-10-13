////////////////////////////////////////////////////////////////////////////////
// pie-donut.N.spec.ts
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
import test from '@playwright/test';
import { PWTester } from '../PWTester';
/**
 * Puppeteer Tests for pie-donut.html
 */

test.describe('pie-donut.html test', async function () {
	const url = 'demo/pie-donut.html?debug';

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

		// await page.screenshot({path: 'out/ss/pie-donut.png'});
		page.close();
	});

	test('title 타이틀 존재 유무와 알맞은 값인지 확인', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const title = await page.$('.' + TitleView.TITLE_CLASS);
		expect(title).exist;

		const titleText = await page.evaluate((el) => el.textContent, title);
		expect(titleText).eq(config.title);
	});

	test('Chart 표시여부', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const chart = await page.$$('.rct-point');
		for (let i = 0; i < chart.length; i++) {
			const transformChart = await PWTester.getPathDValue(chart[i]);
			expect(transformChart).exist;
		}
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

	test('poin 의 갯수와 실제 데이터의 갯수가 일치하는지 확인', async ({
		page,
	}) => {
		const config: any = await page.evaluate('config');

		const piePoint = await page.$('.rct-pie-series');
		const seriesPoint = await piePoint.$$('.rct-point');

		expect(config.series.data.length).eq(seriesPoint.length);
	});

	test('labelPoint', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const piePoint = await page.$('.rct-pie-series');
		const text = await piePoint.$$('.rct-point-label[y="12"]');

		const yValues = config.series.data.map((item) => item.y);

		for (let i = 0; i < text.length; i++) {
			const labelText = await page.evaluate(
				(el) => el.textContent,
				text[i]
			);
			expect(Number(labelText)).eq(yValues[i]);
		}
	});
});
