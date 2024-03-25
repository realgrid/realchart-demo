import { StyleProps } from './../../../../src/common/Types';
////////////////////////////////////////////////////////////////////////////////
// line.L.spec.ts
// 2024. 01. 31. created by dltlghkd930217
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from '@playwright/test';
import { expect } from 'chai';
import { PWTester } from '../../PWTester';
import { LineSeries, LineStepDirection } from '../../../../src/model/series/LineSeries';
import { LineSeriesView } from '../../../../src/view/series/LineSeriesView';
declare global {
    var eventCnt: number;
}

/** @TODO: 코드테스트 추가,  */
test.describe('series, line test', () => {
    const url = 'boundary/empty.html?debug';

    let chart;

    let config: any;
    const createJsonData = (type) => {
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
                    data.push([i, i * 5]);
                    break;
                case 'json':
                    data.push({
                        x: i,
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
            tooltip: {
                visible: false
            },
            series: {
                type: 'line',
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
        config.series.data = createJsonData('y');

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('dataform:array', async ({ page }, testInfo) => {
        config.series.data = createJsonData('array');

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('dataform:all', async ({ page }, testInfo) => {
        config.series.data = createJsonData('all');

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('dataform:json', async ({ page }, testInfo) => {
        config.series.data = createJsonData('json');

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('baseValue', async ({ page }, testInfo) => {
        config.series.data = createJsonData('json');
        config.series.baseValue = 10;

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('belowStyle', async ({ page }, testInfo) => {
        config.series.data = createJsonData('json');
        config.series.baseValue = 10;
        config.series.belowStyle = {
            fill: 'red',
            stroke: 'red'
        };

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('color', async ({ page }, testInfo) => {
        config.series.data = createJsonData('json');
        config.series.color = 'red';
        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('colorField', async ({ page }, testInfo) => {
        config.series.data = createJsonData('json').map((e, i) => {
            return { ...e, color: i % 2 === 0 ? 'red' : 'green' };
        });

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('connectNullPoints - false', async ({ page }, testInfo) => {
        config.series.connectNullPoints = false;
        config.series.data = [5, 10, null, 15, 20, null, 30, 40];

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('connectNullPoints - true', async ({ page }, testInfo) => {
        config.series.connectNullPoints = false;
        config.series.data = [5, 10, null, 15, 20, null, 30, 40];

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });
    
    test('name', async ({ page }, testInfo) => {
        const NAME = 'line series name';
        config.series.data = createJsonData('json');
        config.series.name = NAME;
        config.legend = true;
        const exName = await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();

            return document.getElementsByClassName('rct-legend-item-label')[0].innerHTML;
        }, config);

        expect(exName).to.equal(NAME);
    });

    test('label', async ({ page }, testInfo) => {
        const LABEL = 'line series label';
        config.series.data = createJsonData('json');
        config.series.label = LABEL;
        config.legend = true;

        const exLabel = await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();

            return document.getElementsByClassName('rct-legend-item-label')[0].innerHTML;
        }, config);

        expect(exLabel).to.equal(LABEL);
    });

    test('spline', async ({ page }, testInfo) => {
        config.series.data = [5, 20, 10, 15, 30, 20, 70, 40];
        config.series.lineType = 'spline';

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('step', async ({ page }, testInfo) => {
        config.series.data = [5, 20, 10, 15, 30, 20, 70, 40];
        config.series.lineType = 'step';

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('lineStepDirection', async ({ page }, testInfo) => {
        config.series.data = [5, 20, 10, 15, 30, 20, 70, 40];
        config.series.lineType = 'step';
        config.series.stepDir = LineStepDirection.BACKWARD;

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('onPointClick', async ({ page }, testInfo) => {
        const clickCount = 10;
        config.series.data = createJsonData('json');

        await page.evaluate((newConfig) => {
            window.eventCnt = 0;
            newConfig.series.onPointClick = (args) => {
                window.eventCnt++;
            };
            chart.load(newConfig, false).render();
        }, config);

        const element = await page.locator(`.${LineSeriesView.POINT_CLASS}[data-index="1"]`);
        await element.click({ clickCount });

        const count = await page.evaluate(() => {
            return window.eventCnt;
        });

        expect(count).is.equal(clickCount);
    });

    test('onPointHover', async ({ page }, testInfo) => {
        const NAME = 'newName';
        config.series.data = createJsonData('json');

        await page.evaluate(
            ({ config, NAME }) => {
                window.eventCnt = 0;
                config.series.onPointHover = (args) => {
                    chart.series.set('name', NAME);
                    chart.render();
                };
                chart.load(config, false).render();
            },
            { config, NAME }
        );

        expect(await page.evaluate(() => chart.series.get('name'))).to.equal('Series 1');

        const point = await page.locator(`.${LineSeriesView.POINT_CLASS}[data-index="1"]`);

        await point.hover({ force: true });

        expect(await page.evaluate(() => chart.series.get('name'))).to.equal(NAME);
    });

    test('pointStyle', async ({ page }, testInfo) => {
        config.series.data = createJsonData('json');
        config.series.pointStyle = {
            stroke: 'green',
            fill: 'red'
        };

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('pointColors', async ({ page }, testInfo) => {
        config.series.data = createJsonData('json');
        config.series.pointColors = ['black'];

        await page.evaluate((config) => {
            chart.load(config, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('pointStyleCallback', async ({ page }, testInfo) => {
        config.series.data = createJsonData('json');

        await page.evaluate((newConfig) => {
            newConfig.series.pointStyleCallback = (args) => {
                if (args.y > 10) {
                    return {
                        fill: 'black'
                    };
                }
            };
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('tooltipText', async ({ page }, testInfo) => {
        config.series.data = createJsonData('json');
        config.tooltip.visible = true;
        config.series.tooltipText = `Tooltip Text`;

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await page.evaluate(() => {
            const elt = document.getElementsByClassName('rct-tooltip')[0] as HTMLElement;
            elt.style.visibility = 'visible';
            elt.style.opacity = '1';
            chart.render();
        });

        const point = await page.locator(`.${LineSeriesView.POINT_CLASS}[data-index="1"]`);
        await point.click({ force: true });

        expect(
            await page.evaluate(() => {
                return document.getElementsByClassName('rct-tooltip-text')[0].innerHTML.includes('Tooltip Text');
            })
        ).to.be.true;
    });

    test('viewRanges, viewRangeValue', async ({ page }, testInfo) => {
        config.series.data = createJsonData('json');
        config.series.viewRangeValue = 'y';
        config.series.viewRanges = [
            { fromValue: 0, toValue: 10, color: 'blue' },
            { fromValue: 10, toValue: 20, color: 'red' }
        ];

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('visible', async ({ page }, testInfo) => {
        config.series.data = createJsonData('json');
        config.series.visible = false;

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    


});
