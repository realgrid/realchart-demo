////////////////////////////////////////////////////////////////////////////////
// funnel.N.spec.ts
// 2023. 08. 30. created by sangchul
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Browser } from 'puppeteer';
import { PPTester } from '../../PPTester';
import { SeriesView } from '../../../src/view/SeriesView';
import { TitleView } from '../../../src/view/TitleView';
import test from '@playwright/test';
import { PWTester } from '../PWTester';
/**
 * Puppeteer Tests for funnel.html
 */

test.describe('funnel.html test', async function () {
	const url = 'demo/funnel.html?debug';

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

		// await page.screenshot({path: 'out/ss/funnel.png'});
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
	test('point 의 갯수가 실제 데이터와 맞는지 확인', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const seriesPoint = await page.$$('.rct-point');
		expect(seriesPoint.length).eq(config.series.data.length);
	});

	test('labelPoint 의 값이 데이터와 일치하는지 확인', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const labelPoint = await page.$('.rct-point-labels');
		const text = await labelPoint.$$('text[y="12"]');

		// 먼저, series.data 배열에서 name과 y 값을 합쳐 배열을 생성합니다.
		const combinedArray = config.series.data.map(
			(item) => `${item.name} (${item.y})`
		);

		for (let i = 0; i < text.length; i++) {
			const labelText = await page.evaluate(
				(el) => el.textContent,
				text[i]
			);
			expect(labelText).eq(combinedArray[i]);
		}
	});

	test('legend', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const legendItem = await page.$$('.rct-legend-item');
		const names = config.series.data.map((item) => item.name);

		for (let i = 0; i < legendItem.length; i++) {
			const text = await legendItem[i].$('.rct-legend-item-label');
			const labelText = await page.evaluate((el) => el.textContent, text);
			expect(labelText).eq(names[i]);
		}
	});
});
