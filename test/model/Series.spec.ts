////////////////////////////////////////////////////////////////////////////////
// Series.spec.ts
// 2023. 06. 22. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Chart } from '../../src/model/Chart';
import { loadChartJson } from '../Tester';
import { ColumnSeries } from '../../src/model/series/BarSeries';
import { Series } from '../../src/model/Series';
import { CategoryAxis } from '../../src/model/axis/CategoryAxis';
import { LinearAxis } from '../../src/model/axis/LinearAxis';

/**
 * Tests for Series class.
 */
 describe("Series test", function() {

    it('init', () => {
        let chart = new Chart();

        expect(chart.series).not.exist;
    });

    it ('load simple', () => {
        const json = loadChartJson("column-01");
        const chart = new Chart(json);
        const series = chart.series;

        expect(series).instanceOf(ColumnSeries);
        expect(series.getPoints().count).eq(json.series.data.length);
    });

    it ('prepare', () => {
        const json = loadChartJson("column-01");
        const chart = new Chart(json);
        const series = chart.series as Series;

        series.prepareRender();
        
        const xAxis = series['_xAxisObj'];
        const yAxis = series['_yyAxisObj'];

        expect(xAxis).instanceOf(CategoryAxis);
        expect(yAxis).instanceOf(LinearAxis);
    })

    it ('prepare points', () => {
        const json = loadChartJson("column-01");
        const chart = new Chart(json);
        const series = chart.series;
        const points = series.getPoints

    })
});
