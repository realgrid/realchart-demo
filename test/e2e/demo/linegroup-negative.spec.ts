////////////////////////////////////////////////////////////////////////////////
// linegroup-negative.spec.ts
// 2023. 08. 22. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from '@playwright/test';
import { expect } from 'chai';
import { PWTester } from '../PWTester';
import { SeriesView } from '../../../src/view/SeriesView';

/**
 * PlayWright Tests for linegroup-negative.html
 */
test.describe('linegroup-negative.html test', () => {
	const url = 'e2e-demo/linegroup-negative.html?debug';

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

		// await page.screenshot({path: 'out/ss/linegroup-negative.png'});
	});
});
