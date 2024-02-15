////////////////////////////////////////////////////////////////////////////////
// issue97.P.spec.ts
// 2024. 02. 15. created by wooriPbg
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import test from '@playwright/test';
import { PWTester } from '../PWTester';
/**
 * Puppeteer Tests for axis-guide.html
 */
test.describe('guide label displayInside test', async function () {
	const url = 'e2e-demo/axis-guide.html?debug';

	test.beforeEach(async ({ page }) => {
		await PWTester.goto(page, url);
	});

	test('displayInside: true & align: left', async ({ page }) => {
		await page.evaluate(`
        config.yAxis.guides[0].front = false;
        config.yAxis.guides[0].label.displayInside = true;
        config.yAxis.guides[0].label.align = 'left';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-axis-guide .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(gb.x).gt(bb.x);
	});

	test('displayInside: false & align: left', async ({ page }) => {
		await page.evaluate(`
        config.yAxis.guides[0].front = false;
        config.yAxis.guides[0].label.displayInside = false;
        config.yAxis.guides[0].label.align = 'left';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-axis-guide .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(bb.x).gt(gb.x + gb.width);
	});

	test('displayInside: true & align: right', async ({ page }) => {
		await page.evaluate(`
        config.yAxis.guides[0].front = false;
        config.yAxis.guides[0].label.displayInside = true;
        config.yAxis.guides[0].label.align = 'right';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-axis-guide .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(bb.x + bb.width).gt(gb.x + gb.width);
	});

	test('displayInside: false & align: right', async ({ page }) => {
		await page.evaluate(`
        config.yAxis.guides[0].front = false;
        config.yAxis.guides[0].label.displayInside = false;
        config.yAxis.guides[0].label.align = 'right';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-axis-guide .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(gb.x).gt(bb.x + bb.width);
	});

	test('inverted: true & displayInside: true & verticalAlign: top', async ({ page }) => {
		await page.evaluate(`
		config.inverted = true;
        config.yAxis.guides[0].front = false;
        config.yAxis.guides[0].label.displayInside = true;
        config.yAxis.guides[0].label.verticalAlign = 'top';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-axis-guide .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(gb.y).gt(bb.y);
	});

	test('inverted: true & displayInside: false & verticalAlign: top', async ({ page }) => {
		await page.evaluate(`
		config.inverted = true;
        config.yAxis.guides[0].front = false;
        config.yAxis.guides[0].label.displayInside = false;
        config.yAxis.guides[0].label.verticalAlign = 'top';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-axis-guide .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(bb.y).gt(gb.y + gb.height);
	});

	test('inverted: true & displayInside: true & verticalAlign: bottom', async ({ page }) => {
		await page.evaluate(`
		config.inverted = true;
        config.yAxis.guides[0].front = false;
        config.yAxis.guides[0].label.displayInside = true;
        config.yAxis.guides[0].label.verticalAlign = 'bottom';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-axis-guide .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(bb.y + bb.height).gt(gb.y + gb.height);
	});

	test('inverted: true & displayInside: false & verticalAlign: bottom', async ({ page }) => {
		await page.evaluate(`
		config.inverted = true;
        config.yAxis.guides[0].front = false;
        config.yAxis.guides[0].label.displayInside = false;
        config.yAxis.guides[0].label.verticalAlign = 'bottom';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-axis-guide .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(gb.y).gt(bb.y + bb.height);
	});
});
