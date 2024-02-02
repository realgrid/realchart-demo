import { ArrowHead } from './../../../../src/model/series/VectorSeries';
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

/** @TODO: 코드테스트 추가, col, noClip, row, */
test.describe('series, vector test', () => {
    const url = 'boundary/empty.html?debug';

    const createVectorData = (type) => {
        const data: Array<any> = [];
        let x, y, length, angle;

        for (x = 5; x < 100; x += 5) {
            for (y = 5; y < 100; y += 5) {
                length = Math.round(200 - (x + y));
                angle = Math.round(((x + y) / 200) * 360);
                switch (type) {
                    case 'y':
                        data.push(y);
                        break;
                    case 'noX':
                        data.push([y, length, angle]);
                        break;
                    case 'all':
                        data.push([x, y, length, angle]);
                        break;
                    case 'json':
                        data.push({
                            x,
                            y,
                            length,
                            angle
                        });
                        break;
                    case 'json2':
                        data.push({
                            a: x,
                            b: y,
                            c: length,
                            d: angle
                        });
                        break;
                }
                // data.push([x, y, length, angle].join(", "));
            }
        }

        return data;
    };

    let chart;

    let config: any;

    test.beforeEach(async ({ page }) => {
        config = {
            title: 'Boundary',
            series: {
                type: 'vector',
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
        const container = await page.$('#realchart');
        expect(container).exist;

        config.series.data = createVectorData('y');

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('dataform:noX', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;

        config.series.data = createVectorData('noX');

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('dataform:all', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;

        config.series.data = createVectorData('all');

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('dataform:json', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;

        config.series.data = createVectorData('json');

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('xField, yField, lengthField, angleField', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;

        config.series.data = createVectorData('json2');
        config.series.xField = 'a';
        config.series.yField = 'b';
        config.series.lengthField = 'c';
        config.series.angleField = 'd';

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });
    const arrowHeads = ['close', 'none', 'open'];

    for (let arrowHead of arrowHeads) {
        test('arrowHead: ' + arrowHead, async ({ page }, testInfo) => {
            const container = await page.$('#realchart');
            expect(container).exist;

            config.series.data = createVectorData('json');
            config.series.arrowHead = arrowHead;
            await page.evaluate((newConfig) => {
                chart.load(newConfig, false).render();
            }, config);

            await PWTester.testChartBySnapshot(page, testInfo);
        });
    }

    test('color', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;

        config.series.data = createVectorData('json');
        config.series.color = 'red';
        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('colorField', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;

        config.series.data = createVectorData('json').map((e, i) => {
            return { ...e, color: i % 2 === 0 ? 'red' : 'green' };
        });

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('hoverStyle', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;

        config.series.data = createVectorData('json');
        config.series.hoverStyle = {
            stroke: 'red'
        };

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await page.mouse.move(114, 479);
        await PWTester.sleep(300);
        await page.mouse.click(114, 479);
        await PWTester.sleep(300);

        await page.evaluate(() => {
            const elt = document.getElementsByClassName('rct-tooltip')[0] as HTMLElement;
            elt.style.visibility = 'visible';
        });

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('label', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;
        config.legend = true;

        config.series.data = createVectorData('json');
        config.series.label = 'new Label!';

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('maxLength', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;
        config.series.maxLength = 10;
        config.series.data = createVectorData('json');

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('name', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;
        config.legend = true;

        config.series.name = 'series name!';
        config.series.data = createVectorData('json');

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('onPointClick', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;
        config.series.data = createVectorData('json');

        await page.evaluate((newConfig) => {
            window.eventCnt = 0;
            newConfig.series.onPointClick = (args) => {
                window.eventCnt++;
            };
            chart.load(newConfig, false).render();
        }, config);

        const element = (await page.$$('.rct-point'))[0];
        await PWTester.mouseClick(page, element);
        await PWTester.mouseClick(page, element);
        await PWTester.mouseClick(page, element);

        const count = await page.evaluate(() => {
            return window.eventCnt;
        });

        expect(count).is.equal(3);
    });

    test('onPointHover', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;
        config.series.data = createVectorData('json');

        await page.evaluate((newConfig) => {
            window.eventCnt = 0;
            newConfig.series.onPointHover = (args) => {
                window.eventCnt++;
            };
            chart.load(newConfig, false).render();
        }, config);

        const element = await page.$$('.rct-point');
        await PWTester.mouseClick(page, element[0]);
        await page.mouse.click(0, 0);
        await PWTester.mouseClick(page, element[1]);
        await page.mouse.click(0, 0);
        await PWTester.mouseClick(page, element[2]);
        await page.mouse.click(0, 0);

        const count = await page.evaluate(() => {
            return window.eventCnt;
        });

        expect(count).is.equal(6);
    });

    test('pointColors', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;

        config.series.data = createVectorData('json');
        config.series.pointColors = ['black'];

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('pointStyle', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;

        config.series.data = createVectorData('json');
        config.series.pointStyle = {
            stroke: 'green'
        };

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('pointStyleCallback', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).to.exist;

        config.series.data = createVectorData('json');

        await page.evaluate((newConfig) => {
            newConfig.series.pointStyleCallback = (args) => {
                if (args.angle > 180) {
                    return {
                        stroke: 'green'
                    };
                }
            };
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('startAngle', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;

        config.series.data = createVectorData('json');
        config.series.startAngle = 180;

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('tooltipText', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;

        config.series.data = createVectorData('json');

        await page.evaluate((newConfig) => {
            newConfig.series.tooltipText = `%{x} %{y} %{length} %{angle}`;

            chart.load(newConfig, false).render();
        }, config);

        await page.mouse.move(114, 479);
        await PWTester.sleep(300);
        await page.mouse.click(114, 479);
        await PWTester.sleep(300);

        await page.evaluate(() => {
            const elt = document.getElementsByClassName('rct-tooltip')[0] as HTMLElement;
            elt.style.visibility = 'visible';
        });

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('viewRanges, viewRangeValue', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;

        config.series.data = createVectorData('json');
        config.series.viewRangeValue = 'y';
        config.series.viewRanges = [
            { fromValue: 0, toValue: 50, color: 'blue' },
            { fromValue: 50, toValue: 100, color: 'red' }
        ];

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('xStart', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;

        config.series.data = createVectorData('noX');
        config.series.xStart = 40;

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('xStep', async ({ page }, testInfo) => {
        const container = await page.$('#realchart');
        expect(container).exist;

        config.series.data = createVectorData('noX');
        config.series.xStart = 40;
        config.series.xStep = 2;

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });
});
