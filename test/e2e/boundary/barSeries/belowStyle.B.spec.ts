////////////////////////////////////////////////////////////////////////////////
// belowStyle.B.spec.ts
// 2024. 02. 06. created by benny
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Page, test } from '@playwright/test';
import { expect } from 'chai';
import { PWTester } from '../../PWTester';

/**
 * baseValue에 따른 dataPoint별 belowStyle을 테스트한다.
 * @marginErr 허용 오차
 */
const testBelowStyle = async ({ page, chart, config, marginErr = 0.0001 }: { page: Page, chart: any, config: any, marginErr?:number }) => {
    await page.evaluate(({chart, config}) => {
        chart?.load(config, false).render();
    }, {chart, config});

    const points = await page.$('.rct-series-points');
        expect(points).exist;

        const { data }  = config.series;
        for (const [i, v] of data.entries()) {
            const point = await points?.$(`.rct-point[data-index="${i}"]`);
            const fill = await point?.evaluate(e => {
                console.log(window.getComputedStyle(e).fill)
                // return e && window.getComputedStyle(e);
                const { fill } = window.getComputedStyle(e);
                return fill
            });

            if (v < 0) {
                expect(fill).to.eq('rgb(255, 0, 0)');
            } else {
                expect(fill).to.eq('rgb(0, 0, 255)');
            }
        }
}

test.describe('barSeries.belowStyle test', () => {
    const url = 'boundary/empty.html?debug';
    let chart, config;

    test.beforeEach(async ({ page, browserName }) => {
        await PWTester.goto(page, url);
        
        config = {
            title: 'Bar.BelowStyle',
            yAxis: { 
                tick: { 
                    visible: true, 
                    // steps: Array(20).fill(0).map((v, i) => i * 10),
                    steps: [0],
                    style: {
                        strokeWidth: 0
                    }
                },
            },
            series: {
                type: 'bar',
                name: 'Integer(int)',
                style: {
                    strokeWidth: 0
                },
                color: 'blue',
                belowStyle: {
                    fill: 'red'
                },
                data: [
                    10, -20, 30, -40, 50
                ]
            }
        };
        chart = await page.evaluateHandle('chart');
    });

    test("basic - negative dataPoint looks red color fill", async ({ page }, testInfo) => {
        expect(chart).exist;
        await testBelowStyle({ page, chart, config });
    });

    PWTester.range(5).map((i) => {
        test(`random:${i} - belowStyle fill equals red`, async ({ page }, testInfo) => {
            // const container = await page.$("#realchart");
            expect(chart).exist;

            const rows = PWTester.irandom(5, 10);
            config.series.data = PWTester.iarandom(-180, 180, rows);

            await testBelowStyle({ page, chart, config })
        });
    });
});
