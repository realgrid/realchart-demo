////////////////////////////////////////////////////////////////////////////////
// issue530.L.spec.ts
// 2024. 01. 30. created by dltlghkd930217
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from '@playwright/test';
import { expect } from 'chai';
import { PWTester } from '../PWTester';

/**
 * PlayWright Tests for issue550
 */
test.describe('issue550 test', () => {
    let chart: any;
    const url = 'boundary/empty.html?debug';
    const config = {
        title: '경기도 성남시 인구 현황',
        legend: true,
        series: {
            data: [
                ['신흥1동', 13904],
                ['신흥2동', 19796],
                ['신흥3동', 10995],
                ['태평1동', 14625],
                ['태평2동', 14627],
                ['태평3동', 12649],
                ['태평4동', 12279]
            ]
        }
    };

    test.beforeEach(async ({ page }) => {
        await PWTester.goto(page, url);

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);
    });

    test('visible', async ({ page }, testInfo) => {
        let isError: boolean;
        isError = await page.evaluate(() => {
            try {
                chart.series.set('visible', false);
                chart.render();
                return true;
            } catch (e) {
                return false;
            }
        });
        expect(isError).is.true;
    });
});