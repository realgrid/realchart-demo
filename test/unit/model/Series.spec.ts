////////////////////////////////////////////////////////////////////////////////
// Series.spec.ts
// 2023. 06. 22. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Chart } from '../../../src/model/Chart';
import { CategoryAxis } from '../../../src/model/axis/CategoryAxis';
import { LinearAxis } from '../../../src/model/axis/LinearAxis';
import { Tester } from '../Tester';
import { BarSeries } from '../../../src/model/series/BarSeries';

/**
 * Tests for Series class.
 */
 describe("Series test", function() {

    it('init', () => {
        let chart = new Chart();

        expect(chart.firstSeries).not.exist;
    });

    it ('load simple', () => {
        const json = Tester.loadChartJson("bar-01");
        const chart = new Chart(json);
        const series = chart.firstSeries;

        expect(series).instanceOf(BarSeries);
        expect(series.getPoints().count).eq(json.series.data.length);
    });

    it ('prepare', () => {
        const json = Tester.loadChartJson("bar-01");
        const chart = new Chart(json);
        const series = chart.firstSeries;

        chart.prepareRender();
        
        const xAxis = series['_xAxisObj'];
        const yAxis = series['_yAxisObj'];

        expect(xAxis).instanceOf(CategoryAxis);
        expect(yAxis).instanceOf(LinearAxis);
    })

    it ('prepare points', () => {
        const json = Tester.loadChartJson("bar-01");
        const chart = new Chart(json);
        const series = chart.firstSeries;
        const points = series.getPoints();

        chart.prepareRender();

        expect(json.series.data.length).gte(5);
        expect(points.count).eq(json.series.data.length);

        // series data가 숫자 배열이다.
        points.forEach((p, i) => {
            expect(p.x).undefined;
            expect(p.y).eq(p.source);
        })
    })
});
