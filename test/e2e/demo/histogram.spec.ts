////////////////////////////////////////////////////////////////////////////////
// histogram.spec.ts
// 2023. 08. 24. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { test } from '@playwright/test';
import { expect } from 'chai';
import { PWTester } from '../PWTester';
import { Chart } from '../../../src/model/Chart';
import { HistogramSeries } from '../../../src/model/series/HistogramSeries';
import { SeriesView } from '../../../src/view/SeriesView';

/**
 * PlayWright Tests for histogram.html
 */
test.describe('histogram.html test', () => {
    const url = 'demo/histogram.html';

    test.beforeEach(async({ page }) => {
        await PWTester.goto(page, url);
    });

    test('init', async ({ page }) => {
        const container = await page.$('#realchart');
        expect(container).exist;

        const bars = await page.$$('.' + SeriesView.POINT_CLASS);
        expect(bars.length > 0).is.true;

        const config: any = await page.evaluate('config');
        const data = (config.series || config.series[0]).data;

        const chart = new Chart(config);
        const series = chart.firstSeries as HistogramSeries;
        const bins = series.getBinCount(data.length);

        expect(bins).eq(bars.length);

        // await page.screenshot({path: 'out/ss/histogram.png'});
    });
});
