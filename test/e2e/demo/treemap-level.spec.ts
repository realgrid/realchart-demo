////////////////////////////////////////////////////////////////////////////////
// treemap-level.spec.ts
// 2023. 08. 24. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from '@playwright/test';
import { expect } from 'chai';
import { PWTester } from '../PWTester';
import { SeriesView } from '../../../src/view/SeriesView';

/**
 * PlayWright Tests for treemap-level.html
 */
test.describe('treemap-level.html test', () => {
	const url = 'e2e-demo/treemap-level.html?debug';

	test.beforeEach(async ({ page }) => {
		await PWTester.goto(page, url);
	});

	test('init', async ({ page }) => {
		const container = await page.$('#realchart');
		expect(container).exist;

		const points = await page.$$('.' + SeriesView.POINT_CLASS);
		expect(points.length > 0).is.true;

		const config: any = await page.evaluate('config');
		const data = (config.series || config.series[0]).data;
		let dataCount = 0;
		data.forEach(v => {
			v?.value > 0 && dataCount++;
		});
		expect(dataCount).eq(points.length);

		// await page.screenshot({path: 'out/ss/treemap-level.png'});
	});
});
