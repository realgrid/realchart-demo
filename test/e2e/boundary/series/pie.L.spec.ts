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
import { PieSeriesView } from '../../../../src/view/series/PieSeriesView';
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
            tooltip: {
                visible: false
            },
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

        const elt = (await page.$$('.rct-point'))[0];
        await PWTester.mouseClick(page, elt);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('clockwise: false', async ({ page }, testInfo) => {
        config.series.data = createPieData('json');
        config.series.clockwise = false;

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('color', async ({ page }, testInfo) => {
        config.series.data = createPieData('json');
        config.series.color = 'red';
        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('colorField', async ({ page }, testInfo) => {
        config.series.data = createPieData('json').map((e, i) => {
            return { ...e, color: i % 2 === 0 ? 'red' : 'green' };
        });

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('hoverStyle', async ({ page }, testInfo) => {
        config.series.data = createPieData('json');
        config.series.hoverStyle = {
            fill: 'green'
        };

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        const point = await page.locator(`.${PieSeriesView.POINT_CLASS}[data-index="1"]`);

        await point.hover({ force: true });

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('innerRadius', async ({ page }, testInfo) => {
        config.series.data = createPieData('json');
        config.series.innerRadius = 40;

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('name', async ({ page }, testInfo) => {
        const NAME = 'pie series';
        config.series.data = createPieData('json');
        config.series.name = NAME;

        expect(
            await page.evaluate((newConfig) => {
                chart.load(newConfig, false).render();

                return chart.series.get('name');
            }, config)
        ).to.equal(NAME);
    });

    test('onPointClick', async ({ page }, testInfo) => {
        const clickCount = 10;
        config.series.data = createPieData('json');

        await page.evaluate((newConfig) => {
            window.eventCnt = 0;
            newConfig.series.onPointClick = (args) => {
                window.eventCnt++;
            };
            chart.load(newConfig, false).render();
        }, config);

        const element = await page.locator(`.${PieSeriesView.POINT_CLASS}[data-index="1"]`);
        await element.click({ clickCount });

        const count = await page.evaluate(() => {
            return window.eventCnt;
        });

        expect(count).is.equal(clickCount);
    });

    test('onPointHover', async ({ page }, testInfo) => {
        const NAME = 'newName';
        config.series.data = createPieData('json');

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

        const point = await page.locator(`.${PieSeriesView.POINT_CLASS}[data-index="1"]`);

        await point.hover({ force: true });

        expect(await page.evaluate(() => chart.series.get('name'))).to.equal(NAME);
    });

    test('pointColors', async ({ page }, testInfo) => {
        config.series.data = createPieData('json');
        config.series.pointColors = ['black'];

        await page.evaluate(
            ({ config }) => {
                chart.load(config, false).render();
            },
            { config }
        );

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('pointStyle', async ({ page }, testInfo) => {
        config.series.data = createPieData('json');
        config.series.pointStyle = {
            stroke: 'green'
        };

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('pointStyleCallback', async ({ page }, testInfo) => {
        config.series.data = createPieData('json');

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
        config.series.data = createPieData('json');
        config.tooltip.visible = true;
        config.series.tooltipText = `%{x} %{y}`;

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await page.evaluate(() => {
            const elt = document.getElementsByClassName('rct-tooltip')[0] as HTMLElement;
            elt.style.visibility = 'visible';
            elt.style.opacity = "1";
            chart.render();
        });

    
        const point = await page.locator(`.${PieSeriesView.POINT_CLASS}[data-index="1"]`);
        await point.click({ force: true });
    
        expect( 
        await page.evaluate(() => {
           return document.getElementsByClassName("rct-tooltip-text")[0].innerHTML.includes("시리즈2") && 
          document.getElementsByClassName("rct-tooltip-text")[0].innerHTML.includes("10") 
        })).to.be.true;
    });

    test('totalAngle', async ({ page }, testInfo) => {
        config.series.data = createPieData('json');
        config.series.totalAngle = 180;

        await page.evaluate((newConfig) => {
            chart.load(newConfig, false).render();
        }, config);

        await PWTester.testChartBySnapshot(page, testInfo);
    });

    test('viewRanges, viewRangeValue', async ({ page }, testInfo) => {
        config.series.data = createPieData('json');
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

    
});
