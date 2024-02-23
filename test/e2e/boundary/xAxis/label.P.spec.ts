////////////////////////////////////////////////////////////////////////////////
// label.P.spec.ts
// 2024. 02. 21. created by wooripbg
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from "@playwright/test";
import { expect } from "chai";
import { PWTester } from "../../PWTester";

const testCount = 5;

test.describe('xAxis label boundary Test', function () {
    let chart;
    let config: any;
    
    test.beforeEach(async ({ page }) => {
        const url = "boundary/empty.html?debug";
        const iran = PWTester.irandom(1, 100);
        const data = [];
        for (let i = 1; i < iran; i++) {
            data.push(i);
        }

        config = {
            title: "Boundary",
            xAxis: {
                    label: {
                        autoArrange: 'none'
                    },
            },
            series: [
                {
                name: "column1",
                data,
                },
            ],
        };

        await PWTester.goto(page, url);
    });

    for (let t = 0; t < testCount; t++) {
        test(`step-${t}`, async ({ page }) => {
            const data = config.series[0].data;
            const dataCount = data.length;
            const step = PWTester.irandom(-1, dataCount + 1);
            config.xAxis.label.step = step;
            
            await page.evaluate((newConfig) => {
              chart.load(newConfig, false).render();
            }, config);
    
            const labels = await page.locator('.rct-axis[xy=x] .rct-axis-labels .rct-axis-label');
            const count = await labels.count();
            if (step > 0) {
                expect(count).eq(Math.floor((dataCount - 1) / step) + 1, `(data: [${data}], step: ${step}, labelCount: ${count})`);
            } else {
                expect(count).eq(dataCount, `(data: [${data}], step: ${step}, labelCount: ${count})`);
            }
        });
    }
    
    for (let t = 0; t < testCount; t++) {
        test(`startStep-${t}`, async ({ page }) => {
            const data = config.series[0].data;
            const dataCount = data.length;
            const step = PWTester.irandom(-1, dataCount + 1);
            const startStep = PWTester.irandom(-1, dataCount + 1);
            config.xAxis.label.step = step;
            config.xAxis.label.startStep = startStep;
            
            await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
            }, config);

            const labels = await page.locator('.rct-axis[xy=x] .rct-axis-labels .rct-axis-label');
            const firstLabel = await labels.nth(0).textContent();
            const count = await labels.count();
            if (step >= 2 && startStep > 1) {
                if (step > startStep) {
                    expect(Number(firstLabel)).eq(startStep, `data: [${data}], step: ${step}, startStep${startStep}, 첫번째 라벨: ${firstLabel}`);
                } else {
                    expect(Number(firstLabel)).eq(step - 1, `data: [${data}], step: ${step}, startStep${startStep}, 첫번째 라벨: ${firstLabel}`);   
                }
                for (let i = 1; i < count; i++) {
                    const labelText = await labels.nth(i).textContent();
                    expect(Number(labelText)).eq((step * i) + Number(firstLabel), `data: [${data}], step: ${step}, startStep${startStep}, ${i + 1}번째 라벨의 값: ${labelText}`);
                }
            } else {
                if (startStep > step) {
                    expect(Number(firstLabel)).eq(step - 1, `data: [${data}], step: ${step}, startStep${startStep}, 첫번째 라벨: ${firstLabel}`);
                }
            }
        });
    }

    for (let t = 0; t < testCount; t++) {
        test(`rows-${t}`, async ({ page }) => {
            const data = config.series[0].data;
            const dataCount = data.length;
            const rows = PWTester.irandom(-10, dataCount + 10);
            config.xAxis.label.rows = rows;

            await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
            }, config);

            const labels = await page.locator('.rct-axis[xy=x] .rct-axis-labels .rct-axis-label');
            const max = Math.ceil(dataCount / rows);

            if (rows > dataCount || 0 > rows) {
                for (let i = 0; i < dataCount; i++) {
                    const labelText = await labels.nth(i).textContent();
                    expect(Number(labelText)).eq(i, `rows: ${rows}, dataCount: ${dataCount}`);
                }
            } else {
                for (let i = 0; i < max; i++) {
                    for (let j = 0; j < rows; j++) {
                        if (i === max - 1 && j === dataCount % rows) {
                            break;
                        };
                        let index = 0;
                        if (dataCount % rows === 0) {
                            index = i + (j * max)
                        } else {
                            index = j <= dataCount % rows ? i + (j * max) : ((dataCount % rows) * max) + (j - (dataCount % rows)) * (max - 1) + i;
                        }
                        const labelText = await labels.nth(index).textContent();
                        expect(Number(Number(labelText))).eq((i * rows) + j, `rows: ${rows}, dataCount: ${dataCount}, lable: ${labelText}, (${i}, ${j})`);
                    }
                }
            }
        });
    }
    
    for (let t = 0; t < testCount; t++) {
        test(`rotation-${t}`, async ({ page }) => {
            const data = config.series[0].data;
            const dataCount = data.length;
            const rotation = PWTester.irandom(-359, 359);
            config.xAxis.label.rotation = rotation;
            
            await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
            }, config);

            const labels = await page.locator('.rct-axis[xy=x] .rct-axis-labels .rct-axis-label');

            for (let i = 0; i < dataCount; i++) {
                const label = await labels.nth(i).locator('xpath=..');
                const transform = await label.getAttribute('transform');
                const match = transform.match(/rotate\(([^)]+)\)/);
                let rotateValue = null;
                if (match && match.length > 1) {
                    rotateValue = parseFloat(match[1]);
                    expect(rotation).eq(Number(rotateValue), `rotation: ${rotation}, transform: ${transform}`);
                }
            }
        });
    }

    for (let t = 0; t < testCount; t++) {
        test(`firstText-${t}`, async ({ page }) => {
            const data = config.series[0].data;
            const dataCount = data.length;
            const firstText = PWTester.srandom(1, 20);
            config.xAxis.label.firstText = firstText;
            
            await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
            }, config);

            const labels = await page.locator('.rct-axis[xy=x] .rct-axis-labels .rct-axis-label');

            for (let i = 0; i < dataCount; i++) {
                const labelText = await labels.nth(i).textContent();
                if (i === 0) {
                    expect(labelText).eq(firstText, `label: ${labelText}, firstText: ${firstText}, index: ${i}`);
                } else {
                    expect(Number(labelText)).eq(i, `label: ${labelText}, firstText: ${firstText}, index: ${i}`);
                }
            }
        });
    }

    for (let t = 0; t < testCount; t++) {
        test(`lastText-${t}`, async ({ page }) => {
            const data = config.series[0].data;
            const dataCount = data.length;
            const lastText = PWTester.srandom(1, 20);
            config.xAxis.label.lastText = lastText;
            
            await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
            }, config);

            const labels = await page.locator('.rct-axis[xy=x] .rct-axis-labels .rct-axis-label');

            for (let i = 0; i < dataCount; i++) {
                const labelText = await labels.nth(i).textContent();
                if (i === dataCount - 1) {
                    expect(labelText).eq(lastText, `dataCount: ${dataCount}, label: ${labelText}, firstText: ${lastText}, index: ${i}`);
                } else {
                    expect(Number(labelText)).eq(i, `dataCount: ${dataCount}, label: ${labelText}, firstText: ${lastText}, index: ${i}`);
                }
            }
        });
    }
});
