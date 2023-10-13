////////////////////////////////////////////////////////////////////////////////
// linearaxis.N.spec.ts
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
 * Puppeteer Tests for linearaxis.html
 */

test.describe('linearaxis.html test', async function () {
	const url = 'demo/linearaxis.html?debug';

	test.beforeEach(async ({ page }) => {
		await PWTester.goto(page, url);
	});

	test('init', async ({ page }) => {
		const container = await page.$('#realchart');
		expect(container).exist;

		const markers = await page.$$('.' + SeriesView.POINT_CLASS);
		expect(markers.length > 0).is.true;

		const config: any = await page.evaluate('config');
		const data = config.series.data;
		expect(data.length).eq(markers.length);

		// await page.screenshot({path: 'out/ss/linearaxis.png'});
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

	test('tick 틱의 갯수와 실제 최대 데이터의 갯수가 알맞는지 확인', async ({
		page,
	}) => {
		const config: any = await page.evaluate('config');

		const xAxis = await PWTester.getAxis(page, 'x');
		const xAxisTick = await xAxis.$$('.rct-axis-tick');
		expect(xAxisTick).exist;
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

		const grid = await page.$('.rct-grids');
		expect(grid).exist;

		const axisGrid = await page.$('.rct-axis-grid');
		expect(axisGrid).exist;
	});

	test('yTickLabel 의 존재유무 확인', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const yaxis = await PWTester.getAxis(page, 'y');
		const yTick = await yaxis.$$('.rct-axis-label');
		expect(yTick).exist;
	});

	test('point 의 갯수와 실제 데이터의 갯수가 일치하는지 확인', async ({
		page,
	}) => {
		const config: any = await page.evaluate('config');

		const bubblePoint = await page.$('.rct-bubble-series');
		const points = await bubblePoint.$$('.rct-point');
		const count = config.series.data.length;

		expect(points.length).eq(count);
	});
});
