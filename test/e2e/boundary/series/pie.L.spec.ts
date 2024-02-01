////////////////////////////////////////////////////////////////////////////////
// vector.L.spec.ts
// 2024. 01. 31. created by dltlghkd930217
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from '@playwright/test';
import { expect } from 'chai';
import { PWTester } from '../../PWTester';
declare global {
    var eventCnt: number;
}

/** @TODO: 코드테스트 추가,  */
test.describe('series, pie test', () => {
    const url = 'boundary/empty.html?debug';

    let chart;

    let config: any;
    const createPieData = (type) => {
        const data: any = [];
        let x, y, colors;

        for (let i = 1; i < 5; i++) {
            switch (type) {
                case 'y':
                    data.push(i * 5);
                    break;
                case 'array':
                    data.push([i * 5]);
                    break;
                case 'all':
                    data.push(['시리즈' + i, i * 5]);
                    break;
                case 'json':
                    data.push({
                        x: '시리즈' + i,
                        y: i * 5
                    });
                    break;
            }
        }
        return data;
    };

    test.beforeEach(async ({ page }) => {
        config = {
            title: 'Boundary',
            series: {
                type: 'pie',
                data: undefined
            }
        };
        await PWTester.goto(page, url);
    });

    test('init', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;
        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('dataform:y', async ({ page }, testInfo) => {
        config.series.data = createPieData('y');

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('dataform:array', async ({ page }, testInfo) => {
        config.series.data = createPieData('array');

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('dataform:all', async ({ page }, testInfo) => {
        config.series.data = createPieData('all');

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('dataform:json', async ({ page }, testInfo) => {
        config.series.data = createPieData('json');

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('autoSlice: true', async ({ page }, testInfo) => {
        config.series.data = createPieData('json');
        config.series.autoSlice = true;
        config.series.sliceDuration = 0;

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);


        const elt = (await page.$$(".rct-point"))[0];
        await PWTester.mouseClick(page, elt);


        await PWTester.testChartBySnapshot(page, testInfo);
    });
});
