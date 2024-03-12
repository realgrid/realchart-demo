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

	test('line position: inside & align: left', async ({ page }) => {
		await page.evaluate(`
        config.yAxis.guides[0].visible = true;
        config.yAxis.guides[0].type = 'line';
        config.yAxis.guides[0].front = false;
        config.yAxis.guides[0].label.position = 'inside';
        config.yAxis.guides[0].label.align = 'left';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-axis-guide .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(gb.x).gt(bb.x);
	});

	test('line position: outside & align: left', async ({ page }) => {
		await page.evaluate(`
		config.yAxis.guides[0].visible = true;
        config.yAxis.guides[0].type = 'line';
        config.yAxis.guides[0].front = false;
        config.yAxis.guides[0].label.position = 'outside';
        config.yAxis.guides[0].label.align = 'left';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-axis-guide .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(bb.x).gt(gb.x + gb.width);
	});

	test('line position: inside & align: right', async ({ page }) => {
		await page.evaluate(`
		config.yAxis.guides[0].visible = true;
        config.yAxis.guides[0].type = 'line';
        config.yAxis.guides[0].front = false;
        config.yAxis.guides[0].label.position = 'inside';
        config.yAxis.guides[0].label.align = 'right';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-axis-guide .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(bb.x + bb.width).gt(gb.x + gb.width);
	});

	test('line position: outside3 & align: right', async ({ page }) => {
		await page.evaluate(`
		config.yAxis.guides[0].visible = true;
        config.yAxis.guides[0].type = 'line';
        config.yAxis.guides[0].front = false;
        config.yAxis.guides[0].label.position = 'outside';
        config.yAxis.guides[0].label.align = 'right';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-axis-guide .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(gb.x).gt(bb.x + bb.width);
	});

	test('line inverted: true & position: inside & verticalAlign: top', async ({ page }) => {
		await page.evaluate(`
		config.inverted = true;
		config.yAxis.guides[0].visible = true;
        config.yAxis.guides[0].type = 'line';
        config.yAxis.guides[0].front = false;
        config.yAxis.guides[0].label.position = 'inside';
        config.yAxis.guides[0].label.verticalAlign = 'top';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-axis-guide .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(gb.y).gt(bb.y);
	});

	test('line inverted: true & position: outside & verticalAlign: top', async ({ page }) => {
		await page.evaluate(`
		config.inverted = true;
		config.yAxis.guides[0].visible = true;
        config.yAxis.guides[0].type = 'line';
        config.yAxis.guides[0].front = false;
        config.yAxis.guides[0].label.position = 'outside';
        config.yAxis.guides[0].label.verticalAlign = 'top';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-axis-guide .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(bb.y).gt(gb.y + gb.height);
	});

	test('line inverted: true & position: inside & verticalAlign: bottom', async ({ page }) => {
		await page.evaluate(`
		config.inverted = true;
		config.yAxis.guides[0].visible = true;
        config.yAxis.guides[0].type = 'line';
        config.yAxis.guides[0].front = false;
        config.yAxis.guides[0].label.position = 'inside';
        config.yAxis.guides[0].label.verticalAlign = 'bottom';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-axis-guide .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(bb.y + bb.height).gt(gb.y + gb.height);
	});

	test('line inverted: true & position: outside & verticalAlign: bottom', async ({ page }) => {
		await page.evaluate(`
		config.inverted = true;
		config.yAxis.guides[0].visible = true;
        config.yAxis.guides[0].type = 'line';
        config.yAxis.guides[0].front = false;
        config.yAxis.guides[0].label.position = 'outside';
        config.yAxis.guides[0].label.verticalAlign = 'bottom';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-axis-guide .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(gb.y).gt(bb.y + bb.height);
	});

	test('range position: inside & align: left', async ({ page }) => {
		await page.evaluate(`
		config.yAxis.guides[1].visible = true;
        config.yAxis.guides[1].type = 'range';
        config.yAxis.guides[1].front = true;
        config.yAxis.guides[1].label.position = 'inside';
        config.yAxis.guides[1].label.align = 'left';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-front-axis-guides .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(gb.x).gt(bb.x);
	});

	test('range position: outside & align: left', async ({ page }) => {
		await page.evaluate(`
		config.yAxis.guides[1].visible = true;
        config.yAxis.guides[1].type = 'range';
        config.yAxis.guides[1].front = true;
        config.yAxis.guides[1].label.position = 'outside';
        config.yAxis.guides[1].label.align = 'left';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-front-axis-guides .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(bb.x).gt(gb.x + gb.width);
	});

	test('range position: inside & align: right', async ({ page }) => {
		await page.evaluate(`
		config.yAxis.guides[1].visible = true;
        config.yAxis.guides[1].type = 'range';
        config.yAxis.guides[1].front = true;
        config.yAxis.guides[1].label.position = 'inside';
        config.yAxis.guides[1].label.align = 'right';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-front-axis-guides .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(bb.x + bb.width).gt(gb.x + gb.width);
	});

	test('range position: outside3 & align: right', async ({ page }) => {
		await page.evaluate(`
		config.yAxis.guides[1].visible = true;
        config.yAxis.guides[1].type = 'range';
        config.yAxis.guides[1].front = true;
        config.yAxis.guides[1].label.position = 'outside';
        config.yAxis.guides[1].label.align = 'right';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-front-axis-guides .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(gb.x).gt(bb.x + bb.width);
	});

	test('range inverted: true & position: inside & verticalAlign: top', async ({ page }) => {
		await page.evaluate(`
		config.inverted = true;
		config.yAxis.guides[1].visible = true;
        config.yAxis.guides[1].type = 'range';
        config.yAxis.guides[1].front = true;
        config.yAxis.guides[1].label.position = 'inside';
        config.yAxis.guides[1].label.verticalAlign = 'top';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-front-axis-guides .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(gb.y).gt(bb.y);
	});

	test('range inverted: true & position: outside & verticalAlign: top', async ({ page }) => {
		await page.evaluate(`
		config.inverted = true;
		config.yAxis.guides[1].visible = true;
        config.yAxis.guides[1].type = 'range';
        config.yAxis.guides[1].front = true;
        config.yAxis.guides[1].label.position = 'outside';
        config.yAxis.guides[1].label.verticalAlign = 'top';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-front-axis-guides .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(bb.y).gt(gb.y + gb.height);
	});

	test('range inverted: true & position: inside & verticalAlign: bottom', async ({ page }) => {
		await page.evaluate(`
		config.inverted = true;
		config.yAxis.guides[1].visible = true;
        config.yAxis.guides[1].type = 'range';
        config.yAxis.guides[1].front = true;
        config.yAxis.guides[1].label.position = 'inside';
        config.yAxis.guides[1].label.verticalAlign = 'bottom';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-front-axis-guides .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(bb.y + bb.height).gt(gb.y + gb.height);
	});

	test('range inverted: true & position: outside & verticalAlign: bottom', async ({ page }) => {
		await page.evaluate(`
		config.inverted = true;
		config.yAxis.guides[1].visible = true;
        config.yAxis.guides[1].type = 'range';
        config.yAxis.guides[1].front = true;
        config.yAxis.guides[1].label.position = 'outside';
        config.yAxis.guides[1].label.verticalAlign = 'bottom';
        chart.load(config, false)`);
		
		const body = await page.$('.rct-body rect');
		const guideLabel = await page.$('.rct-front-axis-guides .rct-axis-guide-label');

		const bb = await body.boundingBox();
		const gb = await guideLabel.boundingBox();
		expect(gb.y).gt(bb.y + bb.height);
	});
});
