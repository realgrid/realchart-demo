////////////////////////////////////////////////////////////////////////////////
// legend.N.spec.ts
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
 * Puppeteer Tests for legend.html
 */
test.describe('legend.html test', async function () {
	const url = 'demo/legend.html?debug';

	test.beforeEach(async ({ page }) => {
		await PWTester.goto(page, url);
	});

	test('init', async ({ page }) => {
		const container = await page.$('#realchart');
		expect(container).to.not.be.null;
		const config = await page.evaluate(() => {
			return typeof config !== 'undefined' ? config : null;
		});
		expect(config).to.not.be.null;

		const bars = await page.$$('.rct-point');
		expect(bars.length > 0).is.true;

		const data = [];

		if (config && config.series) {
			for (let i = 0; i < config.series.length; i++) {
				data.push(...config.series[i].data);
			}
		}
		expect(data.length).eq(bars.length);
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

	test('tick 틱의 갯수와 실제 최대 데이터의 갯수가 알맞는지 확인', async ({
		page,
	}) => {
		const config: any = await page.evaluate('config');

		const xAxis = await PWTester.getAxis(page, 'x');
		const xAxisTick = await xAxis.$$('.rct-axis-tick');
		let maxLength = 0;

		config.series.forEach((s1) => {
			if (maxLength < s1.data.length) {
				maxLength = s1.data.length;
			}
		});

		expect(maxLength).eq(xAxisTick.length);
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

	test('xTickLabel 의 값이 알맞은 값인지 확인', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const axis = await PWTester.getAxis(page, 'x');
		const tickAxis = await axis.$('.rct-axis-labels');
		const texts = await tickAxis.$$('text');

		for (let i = 0; i < texts.length; i++) {
			const textsLabel = await page.evaluate(
				(el) => el.textContent,
				texts[i]
			);
			expect(textsLabel).eq(config.xAxis.categories[i]);
		}
	});

	test('yTickLabel 의 존재유무 확인', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const yaxis = await PWTester.getAxis(page, 'y');
		const yTick = await yaxis.$$('.rct-axis-label');
		expect(yTick).exist;
	});

	test('seriespoint 의 갯수가 데이터의 쵀대 갯수와 일치하는지 확인', async ({
		page,
	}) => {
		const config: any = await page.evaluate('config');

		const seriesPoints = await page.$(
			'.rct-series-container .rct-line-series'
		);
		const point = await seriesPoints.$$('.rct-point');
		let maxLength = 0;

		config.series.forEach((s1) => {
			if (maxLength < s1.data.length) {
				maxLength = s1.data.length;
			}
		});
		expect(point.length).eq(maxLength);
	});

	test('seriesLine 의 존재유무 확인', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const line = await page.$('.rct-line-series-lines');
		expect(line).exist;
	});
});
