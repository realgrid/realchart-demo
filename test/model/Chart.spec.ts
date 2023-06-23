////////////////////////////////////////////////////////////////////////////////
// Chart.spec.ts
// 2023. 06. 20. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Chart } from '../../src/model/Chart';
import { loadChartJson } from '../Tester';
import { ColumnSeries } from '../../src/model/series/BarSeries';
import { CategoryAxis } from '../../src/model/axis/CategoryAxis';
import { LinearAxis } from '../../src/model/axis/LinearAxis';

/**
 * Tests for Chart class.
 */
 describe("Chart test", function() {

    it('init', () => {
        let chart = new Chart();

        expect(chart).exist;
    });

    it ('load simple', () => {
        const json = loadChartJson("chart-01");
        const chart = new Chart(json);

        expect(chart.series).instanceOf(ColumnSeries);
        expect(chart.xAxis).instanceOf(CategoryAxis);
        expect(chart.yAxis).instanceOf(LinearAxis);
    });

    it ('축은 반드시 존재해야 한다.', () => {
        const json = {
            series: { data: [1, 2, 3] }
        };
        const chart = new Chart(json)

        expect(chart.xAxis).instanceOf(CategoryAxis);
        expect(chart.yAxis).instanceOf(LinearAxis);
    })
});
