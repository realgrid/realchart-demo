////////////////////////////////////////////////////////////////////////////////
// ChartView.spec.ts
// 2023. 06. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Tester } from '../Tester';
import { Chart } from '../../src/model/Chart';
import { ChartControl } from '../../src/main';

/**
 * Tests for ChartView class.
 */
 describe("ChartView test", function() {

    let control: ChartControl;

    this.beforeEach(() => {
        control = Tester.createControl();
    });

    it('init', () => {
        const cv = control.chartView();

        expect(cv).exist;
    });

    it('measure empty', () => {
        const cv = control.chartView();

        cv.measure(control.doc(), null, 100, 100, 1);
        expect(cv._emptyView).exist;
        expect(cv._emptyView.visible).is.true;
    })

    it('measure - empty', () => {
        const json = Tester.loadChartJson("chart-01");
        const chart = new Chart(json);
        const cv = control.chartView();

        cv.measure(control.doc(), chart, 500, 500, 1);
        expect(cv._emptyView).exist;
        expect(chart.isEmpty()).is.true;
    })

    it('measure', () => {
        const json = Tester.loadChartJson("bar-01");
        const chart = new Chart(json);
        const cv = control.chartView();

        cv.measure(control.doc(), chart, 500, 500, 1);
        expect(cv._emptyView).not.exist;
        expect(chart.isEmpty()).is.false;

        expect(cv['_titleSectionView'].visible).is.true;
        expect(cv.titleView().visible).is.true;
        expect(cv.subtitleView().visible).is.false;

        expect(cv['_legendSectionView'].visible).is.true;

        expect(cv.bodyView().visible).is.true;
    })
});
