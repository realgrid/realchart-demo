////////////////////////////////////////////////////////////////////////////////
// TreemapSeries.spec.ts
// 2023. 08. 02. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TreemapSeries, TreemapSeriesPoint } from '../../../../src/model/series/TreemapSeries';
import { Tester } from '../../Tester';
import { Chart } from '../../../../src/model/Chart';

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
        expect(series._type()).eq('treemap');
    });

    it('props', () => {
        const series = new TreemapSeries(null);
    });

    it('load', () => {
        const series = loadSeries("treemap-01");

        expect(series).instanceOf(TreemapSeries);
        series.prepareRender();
        expect(series.getPoints().count).gte(7);
    });

    it('prepare', () => {
        const series = loadSeries("treemap-01");

        series.chart._getSeries().prepareRender();
    });

    it('prepare leveled', () => {
        const series = loadSeries("treemap-02");

        series.chart._getSeries().prepareRender();
        expect(series._roots.length).lt(series.getPoints().count);
    });

    it('buildMap - squarify', () => {
        const series = loadSeries("treemap-01");

        series.chart._getSeries().prepareRender();
        series.buildMap(500, 400);
        expect(series._leafs.length).eq(series.getPoints().count);
    });

    it('buildMap - level - squarify', () => {
        const series = loadSeries("treemap-02");

        series.chart._getSeries().prepareRender();
        series.buildMap(500, 400);
    });

    it('buildMap - sliceDice', () => {
        const series = loadSeries("treemap-01");

        series.chart._getSeries().prepareRender();
        series.alternate = false;
        series.buildMap(500, 400);
    });

    it('buildMap - level - sliceDice', () => {
        const series = loadSeries("treemap-02");

        series.chart._getSeries().prepareRender();
        series.buildMap(500, 400);
    });

    it('buildMap - sliceDice alternate', () => {
        const series = loadSeries("treemap-01");

        series.chart._getSeries().prepareRender();
        series.buildMap(500, 400);
    });

    it('buildMap - level - sliceDice alternate', () => {
        const series = loadSeries("treemap-02");

        series.chart._getSeries().prepareRender();
        series.buildMap(500, 400);
    });
});
