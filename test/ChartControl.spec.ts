////////////////////////////////////////////////////////////////////////////////
// ChartControl.spec.ts
// 2023. 06. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Tester } from './Tester';
import { Chart } from '../src/model/Chart';

/**
 * Tests for ChartControl class.
 */
 describe("ChartControl test", function() {

    it('init', () => {
        const control = Tester.createControl();

        expect(control).exist;
        expect(control.chartView()).exist;
    });

    it('render empty', () => {
        const control = Tester.createControl();
        const chartView = control.chartView();

        control.testRender(true);
        expect(chartView._emptyView.visible).is.true;
    })

    it('render empty series', () => {
        const json = Tester.loadChartJson("chart-01");
        const chart = new Chart(json);
        const control = Tester.createControl();
        const chartView = control.chartView();

        control.model = chart;
        control.testRender();
        expect(chartView._emptyView.visible).is.true;
    })

    it('render', () => {
        const json = Tester.loadChartJson("bar-01");
        const chart = new Chart(json);
        const control = Tester.createControl();
        const chartView = control.chartView();

        control.model = chart;
        control.testRender();
        expect(chartView._emptyView).not.exist;
    })
});
