////////////////////////////////////////////////////////////////////////////////
// treemap-level.N.spec.ts
// 2023. 08. 30. created by sangchul
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { SeriesView } from '../../../src/view/SeriesView';
import test from '@playwright/test';
import { PWTester } from '../PWTester';
/**
 * Puppeteer Tests for treemap-level.html
 */

test.describe('treemap-level.html test', async function () {
	const url = 'demo/treemap-level.html?debug';

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

		// TODO: check leafs
		// expect(data.length).eq(markers.length);
		expect(markers.length).lt(data.length);

		// await page.screenshot({path: 'out/ss/treemap-level.png'});
		page.close();
	});
});
