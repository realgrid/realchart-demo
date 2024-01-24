////////////////////////////////////////////////////////////////////////////////
// bar.spec.ts
// 2023. 08. 22. created by woori
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
 * PlayWright Tests for issue113
 */
test.describe('issue113 test', () => {
	const url = 'demo/bar.html?debug';

	test.beforeEach(async ({ page }) => {
		await PWTester.goto(page, url);
	});

	test('tooltip test', async ({ page }) => {
		const bars = await page.locator('.' + SeriesView.POINT_CLASS);
        const tooltip = await page.locator('.rct-tooltip');
        const barCount = await bars.count();
        await page.waitForTimeout(500);
        for (let i = 0; i < barCount; i++) {
            // 주의: 틀팁효과로 bar path 순서가 변경된다.
            const bar = await page.locator(`.${SeriesView.POINT_CLASS}[data-index="${i}"]`);
            await bar.hover();
            await page.waitForTimeout(Tooltip.HIDE_DELAY + 100);
            expect(await tooltip.isVisible()).is.true;
            const tb = await tooltip.boundingBox();
            const bb = await bar.boundingBox();
            expect(bb.y).gt(tb.y + tb.height, 'tooltip이 bar보다 더 위에 그려져야 한다.');
        }
	});
});
