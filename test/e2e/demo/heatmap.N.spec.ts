////////////////////////////////////////////////////////////////////////////////
// heatmap.N.spec.ts
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
import { LegendView } from '../../../src/view/LegendView';
import test from '@playwright/test';
import { PWTester } from '../PWTester';
/**
 * Puppeteer Tests for heatmap.html
 */
test.describe('heatmap.html test', async function () {
	const url = 'e2e-demo/heatmap.html?debug';

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

		// await page.screenshot({path: 'out/ss/heatmap.png'});
		page.close();
	});

	test('title 타이틀 존재 유무와 알맞은 값인지 확인', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const title = await page.$('.' + TitleView.TITLE_CLASS);
		expect(title).exist;

		const titleText = await page.evaluate((el) => el.textContent, title);
		expect(titleText).eq(config.title.text);
	});


	test('yTitle y축의 타이틀 존재 유무와 알맞은 값인지 확인', async ({
		page,
	}) => {
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

	test('grid 의 존재유무 확인', async ({ page }) => {
		const config = await page.evaluate('config');

		const grid = await page.$('.rct-axis-grids');
		expect(grid).exist;

		const axisGrid = await page.$('.rct-axis-grid');
		expect(axisGrid).exist;
	});

	test('seriesPoint 의 갯수와 실제 데이터의 갯수 같나 확인', async ({
		page,
	}) => {
		const config: any = await page.evaluate('config');

		const seriesPoints = await page.$$('.rct-point');
		expect(seriesPoints.length).eq(config.series.data.length);
	});

	test('labelPoint', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const labelPoints = await page.$('.rct-point-labels');
		const texts = await labelPoints.$$('.rct-point-label[y="12"]');
		const thirdElements = config.series.data.map((item) => item[2]);
		for (let i = 0; i < texts.length; i++) {
			const labelText = await page.evaluate(
				(el) => el.textContent,
				texts[i]
			);
			expect(Number(labelText)).eq(thirdElements[i]);
		}
	});
});
