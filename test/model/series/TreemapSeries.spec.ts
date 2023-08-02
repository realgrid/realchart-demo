////////////////////////////////////////////////////////////////////////////////
// TreemapSeries.spec.ts
// 2023. 08. 02. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TreemapSeries, TreemapSeriesPoint } from '../../../src/model/series/TreemapSeries';
import { Tester } from '../../Tester';
import { Chart } from '../../../src/model/Chart';

/**
 * Tests for TreemapSeries class.
 */
 describe("TreemapSeries test", function() {

    function loadSeries(file: string): TreemapSeries {
        const json = Tester.loadChartJson(file);
        const chart = new Chart(json);
        const series = chart.firstSeries;

        return series as TreemapSeries;
    }

    it('init', () => {
        const series = new TreemapSeries(null);

        expect(series).exist;
    });

    it('props', () => {
        const series = new TreemapSeries(null);
    });

    it('load', () => {
        const series = loadSeries("treemap-01");

        expect(series).instanceOf(TreemapSeries);
        expect(series.getPoints().count).gte(7);
    });

    it('prepare', () => {
        const series = loadSeries("treemap-01");

        series.chart._getSeries().prepareRender();
    });
});
