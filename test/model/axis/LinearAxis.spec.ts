////////////////////////////////////////////////////////////////////////////////
// LinearAxis.spec.ts
// 2023. 06. 23. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Chart } from '../../../src/model/Chart';
import { LinearAxis } from '../../../src/model/axis/LinearAxis';
import { Tester } from '../../Tester';

/**
 * Tests for LinearAxis class.
 */
 describe("LinearAxis test", function() {

    it('init', () => {
        let axis = new LinearAxis(null);

        expect(axis).exist;
    });

    it('props', () => {
        let name = 'main';
        let axis = new LinearAxis(null, name);

        expect(axis.name).eq(name);
        expect(axis.nullable).is.true;
    });

    it('calculate min max', () => {
        const json = Tester.loadChartJson("column-01");
        const chart = new Chart(json);
        const series = chart.series;
        const axis = chart.yAxis as LinearAxis;

        chart.prepareRender();

        expect(axis._range.min).eq(Math.min(...json.series.data));        
        expect(axis._range.max).eq(Math.max(...json.series.data));        
    });

    it('calculate min max 2', () => {
        const json = Tester.loadChartJson("column-02");
        const chart = new Chart(json);
        const axis = chart.yAxis as LinearAxis;

        chart.prepareRender();

        expect(axis._range.min).eq(Math.min(...json.series.data.map((v: number[]) => v[1])));                
        expect(axis._range.max).eq(Math.max(...json.series.data.map((v: number[]) => v[1])));        
    });

    it ('build ticks', () => {
        const json = Tester.loadChartJson("column-02");
        const chart = new Chart(json);
        const axis = chart.yAxis as LinearAxis;

        chart.prepareRender();
        chart.layoutAxes(500, 500, false, 1);
    })
});
