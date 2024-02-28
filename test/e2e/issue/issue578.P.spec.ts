////////////////////////////////////////////////////////////////////////////////
// issue578.P.spec.ts
// 2024. 02. 26. created by wooriPbg
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from '@playwright/test';
import { expect } from 'chai';
import { PWTester } from '../PWTester';
import { RcChartControl } from '../../../src/api/RcChartControl';

/**
 * PlayWright Tests for issue578
 */
test.describe('issue578 test', () => {
	let config: any;
	let chart: RcChartControl;
	const url = 'demo/axis-label.html?debug';
	const data = [100];

	test.beforeEach(async ({ page }) => {
		await PWTester.goto(page, url);
	});

	test('데이터가 한 개일 경우 firstText 동작 test', async ({ page }) => {
		const firstText = 'first';
		await page.evaluate((prop) => {
			config.series.data = prop.data;
			config.xAxis.label = {};
			config.xAxis.label.firstText = prop.firstText;
			chart.load(config, false);
		}, {data, firstText});
		const xAxis = await PWTester.getAxis(page, 'x');
    const label = await xAxis.$('.rct-axis-label');
		const labelText = await label.textContent();
		expect(labelText).eq(firstText);
	});

	test('데이터가 한 개일 경우 lastText 동작 test', async ({ page }) => {
		const lastText = 'last';
		await page.evaluate((prop) => {
			config.series.data = prop.data;
			config.xAxis.label = {};
			config.xAxis.label.lastText = prop.lastText;
			chart.load(config, false);
		}, {data, lastText});
		const xAxis = await PWTester.getAxis(page, 'x');
        const label = await xAxis.$('.rct-axis-label');
		const labelText = await label.textContent();
		expect(labelText).eq(lastText);
	});

	test('데이터가 한 개일 경우 firstText, lastText 우선순위 test', async ({ page }) => {
		const firstText = 'first';
		const lastText = 'last';
		await page.evaluate((prop) => {
			config.series.data = prop.data;
			config.xAxis.label = {};
			config.xAxis.label.firstText = prop.firstText;
			config.xAxis.label.lastText = prop.lastText;
			chart.load(config, false);
		}, {data, firstText, lastText});
		const xAxis = await PWTester.getAxis(page, 'x');
    const label = await xAxis.$('.rct-axis-label');
		const labelText = await label.textContent();
		expect(labelText).eq(lastText);
	});

	test('데이터가 한 개일 경우 firstStyle 동작 test', async ({ page }) => {
		const firstStyle = {
			fill: 'red'
		};
		await page.evaluate((prop) => {
			config.series.data = prop.data;
			config.xAxis.label = {};
			config.xAxis.label.firstStyle = prop.firstStyle;
			chart.load(config, false);
		}, {data, firstStyle});
		const xAxis = await PWTester.getAxis(page, 'x');
    const label = await xAxis.$('.rct-axis-label');
		const labelFill = await label.evaluate((element) => {
			return element.parentElement.style.fill;
		});
		expect(labelFill).eq(firstStyle.fill);
	});

	test('데이터가 한 개일 경우 lastStyle 동작 test', async ({ page }) => {
		const lastStyle = {
			fill: 'blue'
		};
		await page.evaluate((prop) => {
			config.series.data = prop.data;
			config.xAxis.label = {};
			config.xAxis.label.lastStyle = prop.lastStyle;
			chart.load(config, false);
		}, {data, lastStyle});
		const xAxis = await PWTester.getAxis(page, 'x');
    const label = await xAxis.$('.rct-axis-label');
		const labelFill = await label.evaluate((element) => {
			return element.parentElement.style.fill;
		});
		expect(labelFill).eq(lastStyle.fill);
	});

	test('데이터가 한 개일 경우 firstStyle, lastStyle 우선순위 test', async ({ page }) => {
		const firstStyle = {
			fill: 'red'
		};
		const lastStyle = {
			fill: 'blue'
		};
		await page.evaluate((prop) => {
			config.series.data = prop.data;
			config.xAxis.label = {};
			config.xAxis.label.firstStyle = prop.firstStyle;
			config.xAxis.label.lastStyle = prop.lastStyle;
			chart.load(config, false);
		}, {data, firstStyle, lastStyle});
		const xAxis = await PWTester.getAxis(page, 'x');
    const label = await xAxis.$('.rct-axis-label');
		const labelFill = await label.evaluate((element) => {
			return element.parentElement.style.fill;
		});
		expect(labelFill).eq(lastStyle.fill);
	});
});
