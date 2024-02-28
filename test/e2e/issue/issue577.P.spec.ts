////////////////////////////////////////////////////////////////////////////////
// issue577.P.spec.ts
// 2024. 02. 26. created by wooriPbg
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from '@playwright/test';
import { expect } from 'chai';
import { PWTester } from '../PWTester';
import { SeriesView } from '../../../src/view/SeriesView';
import { Tooltip } from '../../../src/model/Tooltip';

/**
 * PlayWright Tests for issue577
 */
test.describe('issue577 test', () => {
	const url = 'demo/line.html?debug';

	test.beforeEach(async ({ page }) => {
		await PWTester.goto(page, url);
	});

    test('marker.visible: false', async ({ page }) => {
        await page.evaluate(`
            config.series.marker.visible = false;
            chart.load(config, false)`);
		const firstMarker = page.locator('.rct-series-points').locator('.' + SeriesView.POINT_CLASS).first();
        let opacity = await firstMarker.evaluate(element => {
            return element.style.opacity;
        });
        expect(opacity).eq('0');
        const lastMarker = page.locator('.rct-series-points').locator('.' + SeriesView.POINT_CLASS).last();
        opacity = await lastMarker.evaluate(element => {
            return element.style.opacity;
        });
        expect(opacity).eq('0');
	});

	test('marker.visible: true & marker.firstVisible: true', async ({ page }) => {
        await page.evaluate(`
            config.series.marker.visible = true;
            config.series.marker.firstVisible = true;
            chart.load(config, false)`);
		const firstMarker = page.locator('.rct-series-points').locator('.' + SeriesView.POINT_CLASS).first();
        const opacity = await firstMarker.evaluate(element => {
            return element.style.opacity;
        })
        expect(opacity).eq('1');
	});

	test('marker.visible: true & marker.firstVisible: false', async ({ page }) => {
        await page.evaluate(`
            config.series.marker.visible = true;
            config.series.marker.firstVisible = false;
            chart.load(config, false)`);
		const firstMarker = page.locator('.rct-series-points').locator('.' + SeriesView.POINT_CLASS).first();
        const opacity = await firstMarker.evaluate(element => {
            return element.style.opacity;
        })
        expect(opacity).eq('0');
	});

	test('marker.visible: false & marker.firstVisible: true', async ({ page }) => {
        await page.evaluate(`
            config.series.marker.visible = false;
            config.series.marker.firstVisible = true;
            chart.load(config, false)`);
		const firstMarker = page.locator('.rct-series-points').locator('.' + SeriesView.POINT_CLASS).first();
        const opacity = await firstMarker.evaluate(element => {
            return element.style.opacity;
        })
        expect(opacity).eq('1');
	});

	test('marker.visible: true & marker.lastVisible: true', async ({ page }) => {
        await page.evaluate(`
        config.series.marker.visible = true;
        config.series.marker.lastVisible = true;
        chart.load(config, false)`);
		const firstMarker = page.locator('.rct-series-points').locator('.' + SeriesView.POINT_CLASS).last();
        const opacity = await firstMarker.evaluate(element => {
            return element.style.opacity;
        })
        expect(opacity).eq('1');
	});

	test('marker.visible: true & marker.lastVisible: false', async ({ page }) => {
        await page.evaluate(`
            config.series.marker.visible = true;
            config.series.marker.lastVisible = false;
            chart.load(config, false)`);
		const firstMarker = page.locator('.rct-series-points').locator('.' + SeriesView.POINT_CLASS).last();
        const opacity = await firstMarker.evaluate(element => {
            return element.style.opacity;
        })
        expect(opacity).eq('0');
	});

	test('marker.visible: false & marker.lastVisible: true', async ({ page }) => {
        await page.evaluate(`
            config.series.marker.visible = false;
            config.series.marker.lastVisible = true;
            chart.load(config, false)`);
		const firstMarker = page.locator('.rct-series-points').locator('.' + SeriesView.POINT_CLASS).last();
        const opacity = await firstMarker.evaluate(element => {
            return element.style.opacity;
        })
        expect(opacity).eq('1');
	});
});
