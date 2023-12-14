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
import { Chart } from '../../../src/model/Chart';
import { ChartControl } from '../../../src/ChartControl';

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

    it('measure', () => {
        const json = Tester.loadChartJson("bar-01");
        const chart = new Chart(json);
        const cv = control.chartView();

        cv.measure(control.doc(), chart, 500, 500, 1);
        expect(chart.isEmpty()).is.false;

        expect(cv['_titleSectionView'].visible).is.true;
        expect(cv.titleView().visible).is.true;
        expect(cv.subtitleView().visible).is.false;

        // 기본적으로 시리즈가 하나면 legend가 표시되지 않는다.
        expect(cv['_legendSectionView'].visible).is.false;

        expect(cv.bodyView().visible).is.true;
    })
});
