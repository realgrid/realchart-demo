////////////////////////////////////////////////////////////////////////////////
// bar.N.spec.ts
// 2023. 08. 30. created by sangchul
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { SeriesView } from '../../../src/view/SeriesView';
import { TitleView } from '../../../src/view/TitleView';
import { AxisTitleView, AxisView } from '../../../src/view/AxisView';
import { CategoryAxis } from '../../../src/model/axis/CategoryAxis';
import test from '@playwright/test';
import { PWTester } from '../PWTester';
/**
 * Puppeteer Tests for bar.html
 */
test.describe('bar.html test', async function () {
	let chart: any = null, config: any = null;
	let nodeConfig: any = null
	const url = 'demo/bar.html?debug';

	test.beforeEach(async ({ page }) => {
		await PWTester.goto(page, url);
	});

	test('init', async ({ page }) => {
		const container = await page.$('#realchart');
		expect(container).exist;

		const bars = await page.$$('.' + SeriesView.POINT_CLASS);
		expect(bars.length > 0).is.true;

		const config: any = await page.evaluate('config');
		const data = (config.series.data || config.series[0].data);
		expect(data.length).eq(bars.length);

		// bar들이 x축에서 부터 위쪽으로 커진다.
		const yAxisLine = await PWTester.getAxisLine(page, 'y');
		const rAxis = await PWTester.getBounds(yAxisLine);

		bars.forEach(async (bar) => {
			const r = await PWTester.getBounds(bar);

			PWTester.same(r.y + r.height, rAxis.height);
		});

		// 값과 높이들을 비교한다.
		for (let i = 1; i < bars.length; i++) {
			const prev = bars[i - 1];
			const bar = bars[i];

			const rPrev = await PWTester.getBounds(prev);
			const rBar = await PWTester.getBounds(bar);

			if (data[i] >= data[i - 1]) {
				expect(rBar.height).gte(rPrev.height);
			} else {
				expect(rBar.height).lt(rPrev.height);
			}
		}

		// await page.screenshot({path: 'out/ss/bar.png'});
		// page.close();
	});

	test('x axis tick의 갯수와 존재 하는지 확인', async({ page }) => {
		nodeConfig = await page.evaluate(() => {
			config.xAxis.tick = true;

			chart.load(config, false);

			return config;
		});
	
		const xAxis = await PWTester.getAxis(page, "x");
		const ticks = (await xAxis.$$(".rct-axis-tick")).length;

		const datas = nodeConfig.series[0].data.length
		expect(ticks).eq(datas)
	});
	
	test('legend가 있는지 확인', async({ page }) => {
		nodeConfig = await page.evaluate(() => {
			config.legend = true;
			chart.load(config, false)
			return config
		});

		const series = await page.$('.rct-series rct-bar-series');
		
			
		

		const marker = await page.$('.rct-legend-item-marker');
		expect(marker).exist;
	});

	test('Y-reversed', async ({ page }) => {
		await page.evaluate('config.yAxis.reversed = true; chart.load(config)');

		const bars = await page.$$('.' + SeriesView.POINT_CLASS);
		const grids = await page.$$('.rct-axis-grid');
		for (let i = 0; i < bars.length; i++) {
			let gridr, r;

			for (const grid of grids) {
				gridr = await PWTester.getBounds(grid);
			}

			for (const bar of bars) {
				r = await PWTester.getBounds(bar);
			}

			PWTester.same(gridr.y, r.y);
		}

		await page.evaluate(
			'config.yAxis.reversed = false; chart.load(config)'
		);
	});

	test('inverted', async ({ page }) => {
		await page.evaluate('config.inverted = true; chart.load(config)');

		const rGrids = await PWTester.getGridBounds(page);
		const bars = await page.$$('.' + SeriesView.POINT_CLASS);
		const config: any = await page.evaluate('config');
		const data = config.series.data;

		// 가로가 더 길어야 한다.
		bars.forEach(async (bar) => {
			const r = await PWTester.getBounds(bar);
			expect(r.width).gt(r.height);
		});

		// bar들이 왼쪽 Y축에서 부터 오른쪽 방향으로 커진다.
		bars.forEach(async (bar) => {
			const r = await PWTester.getBounds(bar);

			expect(r.x + r.width <= rGrids.x + rGrids.width).is.true;
		});

		// 값과 너비들을 비교한다.
		for (let i = 1; i < bars.length; i++) {
			const prev = bars[i - 1];
			const bar = bars[i];

			const rPrev = await PWTester.getBounds(prev);
			const rBar = await PWTester.getBounds(bar);

		PWTester.same(rPrev.x, rBar.x);
		};
	});
		
	test('title', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const title = await page.$('.' + TitleView.TITLE_CLASS);
		expect(title).exist;

		const Text = await title.$('text');
		const titleText = await page.evaluate((el) => el.textContent, Text);
		expect(titleText).eq(config.title);
	});

	test('xTitle', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const xAxis = await PWTester.getAxis(page, 'x');
		const xAxisText = await xAxis.$('text');

		const xAxisTitle = await page.evaluate(
			(el) => el.textContent,
			xAxisText
		);
		if(config.xAxis.title){
			const obj = config.xAxis.title;
			const value = obj.text;
			if(config.xAxis.title.visible){
				expect(xAxisTitle).eq(value);
			}else if(typeof(config.xAxis.title) === 'string'){
				expect(xAxisTitle).eq(config.xAxis.title)
			}else{
                expect(true, "This should be false").to.be.false; // AssertionError: This should be false: expected true to be false 잘못된 값 입력함
            }
		}else{
			const displayValue = await xAxis.$eval('.rct-axis-title', el => el.style.display);
			expect(displayValue).to.equal('none');
		}
	});

	test('yTitle', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const yAxis = await PWTester.getAxis(page, 'y');
		const yAxisText = await yAxis.$('text');

		const yAxisTitle = await page.evaluate(
			(el) => el.textContent,
			yAxisText
		);
		if(config.yAxis.title){
			const obj = config.yAxis.title;
			const value = obj.text;
			let htmlString = config.yAxis.title;
			const textOnly = htmlString.replace(/<[^>]*>/g, '');
			if(config.yAxis.title.visible){
				expect(yAxisTitle).eq(value);
			}else if(typeof(textOnly) === 'string'){
				for(let i = 0; i < textOnly.length; i++){
					expect(textOnly.charCodeAt(i)).eq(textOnly.charCodeAt(i))
				}
			}else{
                expect(true, "This should be false").to.be.false; // AssertionError: This should be false: expected true to be false 잘못된 값 입력함
            }
		}else{
			const displayValue = await yAxis.$eval('.rct-axis-title', el => el.style.display);
			expect(displayValue).to.equal('none');
		}
	});

	test('xAxis tick', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const xAxis = await PWTester.getAxis(page, 'x');
		const xAxisTick = await xAxis.$$('.rct-axis-tick');
		if(config.xAxis.tick){
			expect(xAxisTick.length).eq(config.series.data.length);
		}else{
			const displayValue = await xAxis.$eval('.rct-axis-ticks', el => el.style.display);
			expect(displayValue).to.equal('none');
		}
			
	});

	test('x.Label', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const xAxis = await PWTester.getAxis(page, 'x');
		const label = await xAxis.$('.rct-axis-labels');

		const labelTexts = await label.$$('text');
		for (let i = 0; i < labelTexts.length; i++) {
			const tickLabels = await page.evaluate(
				(el) => el.textContent,
				labelTexts[i]
			);
			expect(tickLabels).eq(i.toString());
		}
	});

	test('legend', async ({ page }) => {
		const config: any = await page.evaluate('config');

		const xAxis = await PWTester.getAxis(page, 'x');
		const legend = await xAxis.$('.' + AxisTitleView.TITLE_CLASS);
		expect(legend).exist;

		const legendText = await page.evaluate((el) => el.textContent, legend);
		expect(legendText).eq(config.xAxis.title);
	});

	test('credit', async ({ page }) => {
		const credit = await page.$('.rct-credits');
		expect(credit);

		const creditText = await credit.$('text');
		expect(creditText).exist;
	});

	test('grid', async ({ page }) => {
		const grid = await page.$('.rct-axis-grids');
		expect(grid).exist;

		const axisGrid = await page.$('.rct-axis-grid');
		expect(axisGrid).exist;
	});
});
