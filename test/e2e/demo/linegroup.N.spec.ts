////////////////////////////////////////////////////////////////////////////////
// linegroup.N.spec.ts
// 2023. 08. 30. created by sangchul
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { SeriesView } from '../../../src/view/SeriesView';
import { TitleView } from '../../../src/view/TitleView';
import test from '@playwright/test';
import { PWTester } from '../PWTester';
/**
 * Puppeteer Tests for linegroup.html
 */

test.describe('linegroup.html test', async function () {
	const url = 'demo/linegroup.html?debug';

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

		// await page.screenshot({path: 'out/ss/linegroup.png'});
		page.close();
	});

	test('title 타이틀 존재 유무와 알맞은 값인지 확인', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const title = await page.$('.' + TitleView.TITLE_CLASS);
		expect(title).exist;

		const titleText = await page.evaluate((el) => el.textContent, title);
		expect(titleText).eq(config.title);
	});

	test('xTitle x축의 타이틀 존재 유무와 알맞은 값인지 확인', async ({
		page,
	}) => {
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

	test('tickPoint 의 갯수와 실제 최대 데이터의 갯수가 알맞는지 확인', async ({
		page,
	}) => {
		const config: any = await page.evaluate('config');

		const lineTicks = await page.$$('.rct-line-series');
		for (let i = 0; i < lineTicks.length; i++) {
			const seriesPoints = await lineTicks[i].$$('.rct-point');
			expect(seriesPoints.length).eq(
				config.series.children[i].data.length
			);
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

	test('grid 의 존재유무 확인', async ({ page }) => {
		const config = await page.evaluate('config');

		const grid = await page.$('.rct-axis-grids');
		expect(grid).exist;

		const axisGrid = await page.$('.rct-axis-grid');
		expect(axisGrid).exist;
	});

	test('xTickLabel 의 값이 알맞은 값인지 확인', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const axis = await PWTester.getAxis(page, 'x');
		const tickAxis = await axis.$('.rct-axis-labels');
		const texts = await tickAxis.$$('text');

		expect(texts).exist;
	});

	test('yTickLabel 의 존재유무 확인', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const yaxis = await PWTester.getAxis(page, 'y');
		const yTick = await yaxis.$$('.rct-axis-label');
		expect(yTick).exist;
	});
});
