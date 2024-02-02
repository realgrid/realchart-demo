////////////////////////////////////////////////////////////////////////////////
// baseValue.B.spec.ts
// 2024. 02. 01. created by dltlghkd930217
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Page, test } from '@playwright/test';
import { expect } from 'chai';
import { PWTester } from '../../PWTester';

/**
 * baseValue에 따른 tick, dataPoint의 위치를 확인한다.
 * @marginErr 허용 오차
 */
const testBaseValue = async ({ page, chart, config, marginErr = 0.0001 }: { page: Page, chart: any, config: any, marginErr?:number }) => {
    await page.evaluate(({chart, config}) => {
        chart?.load(config, false).render();
    }, {chart, config});

    // point bottom위치가 yAxis 틱의 위치와 같아야 한다.

    const points = await page.$('.rct-series-points');
    expect(points).exist;

    const pointsRect = await points?.evaluate((e) => {
        console.log({e})
        return e.getBoundingClientRect();
    });

    const yAxis = await PWTester.getAxis(page, 'y');
    const tick = await yAxis.$('.rct-axis-tick');
    expect(tick).exist;

    const tickRect = await tick?.evaluate((e) => {
        console.log({e})
        return e.getBoundingClientRect();
    });

    const data:Array<number> = config.series.data
    const min = Math.min(...data);

    if (pointsRect && tickRect) {
        // value가 baseValue 보다 작으면, 해당 값을 표현하는 GraphicElement의 y값으로 비교
        const idx = data.findIndex((v) => v < config.series.baseValue);
        if (idx == -1) {
            const diff = Math.abs(pointsRect.bottom - tickRect.bottom)
            expect(diff).lessThan(marginErr);
            console.debug({diff})
            // expect(pointsRect.bottom.toFixed(3)).to.eq(tickRect.bottom.toFixed(3));
        } else {
            const point = await points?.$(`.rct-point[data-index="${idx}"]`);
            expect(point).exist;
            if (point) {
                const pointRect = await point?.evaluate((e) => {
                    return e.getBoundingClientRect();
                })
                const diff = pointRect.y - tickRect.bottom;
                expect(diff).lessThan(marginErr);
                console.debug({diff})
            }
            // expect(pointRect?.y.toFixed(3)).to.eq(tickRect.bottom.toFixed(3));
        }
    } else {
        expect.fail('Failed to get a boundingClientRect');
    }
}

test.describe('barSeries.baseValue test', () => {
    const url = 'boundary/empty.html?debug';
    let chart, config, marginErr;

    test.beforeEach(async ({ page, browserName }) => {
        marginErr = browserName == 'firefox' ? 0.05 : 0.001;
        await PWTester.goto(page, url);
        
        config = {
            title: 'Bar.BaseValue',
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
                name: '대기질(AQI)',
                style: {
                    stroke: 'red',
                    strokeWidth: 0
                }
            }
        };
        chart = await page.evaluateHandle('chart');
    });

    test("default - xAxis.line y equals to yAxis.tick y", async ({ page }, testInfo) => {
        // const container = await page.$("#realchart");
        expect(chart).exist;
        // config.series.baseValue = 0;
        const rows = PWTester.irandom(5, 10);
        config.xAxis = { style: { strokeWidth: 0 }};
        config.series.data = PWTester.iarandom(80, 180, rows);
        await page.evaluate(({chart, config}) => {
            chart?.load(config, false).render();
        }, {chart, config});

        // xAxis line위치가 yAxis 0 틱의 위치와 같아야 한다.

        const xAxis = await PWTester.getAxis(page, 'x');
        const line = await xAxis.$('.rct-axis-line');
        expect(line).exist;
        const lineRect = await line?.evaluate((e) => {
            return e.getBoundingClientRect();
        });

        const yAxis = await PWTester.getAxis(page, 'y');
        const tick = await yAxis.$('.rct-axis-tick');
        expect(tick).exist;
        const tickRect = await tick?.evaluate((e) => {
            return e.getBoundingClientRect();
        });
        
        if (lineRect && tickRect) {
            // line의 기본 높이가 4.
            const diff = Math.abs(tickRect.y - (lineRect.y + lineRect.height/2));
            expect(diff).lessThan(marginErr);
            console.debug({diff})
        } else {
            expect.fail('Failed to get boundingClientRect');
        }
        // expect(lineRect.y.toFixed(3)).to.eq(tickRect?.y.toFixed(3));

        // await PWTester.testChartBySnapshot(page, testInfo);
    });

    PWTester.range(5).map((i) => {
        test(`random:${i} - point bottom equals to yAxis.tick y`, async ({ page }, testInfo) => {
            // const container = await page.$("#realchart");
            expect(chart).exist;

            const rows = PWTester.irandom(5, 10);
            config.series.data = PWTester.iarandom(80, 180, rows);

            const baseValue = Math.floor(Math.random() * 50);
            config.series.baseValue = baseValue;
            config.yAxis.tick.steps = [baseValue];
            config.yAxis.strictMin = 0;
            
            await testBaseValue({ page, chart, config, marginErr })
        });
    });

    PWTester.range(5).map((i) => {
        test(`(-)random:${i} - point y equals to yAxis.tick y`, async ({ page }, testInfo) => {
            // const container = await page.$("#realchart");
            expect(chart).exist;
            const baseValue = -PWTester.irandom(10, 50);
            config.series.baseValue = baseValue;
            config.yAxis.tick.steps = [baseValue, 0];

            const rows = PWTester.irandom(5, 10);
            const data = PWTester.iarandom(-180, 180, rows);
            config.series.data = data;
            await testBaseValue({ page, chart, config, marginErr })
        });
    });
});
