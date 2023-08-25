////////////////////////////////////////////////////////////////////////////////
// CategoryAxis.spec.ts
// 2023. 06. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { CategoryAxis } from '../../../src/model/axis/CategoryAxis';
import { Chart } from '../../../src/model/Chart';
import { Tester } from '../../Tester';

/**
 * Tests for CategoryAxis class.
 */
 describe("CategoryAxis test", function() {

    it('init', () => {
        let axis = new CategoryAxis(null);

        expect(axis).exist;
    });

    it('props', () => {
        let name = 'main';
        let axis = new CategoryAxis(null, name);

        expect(axis.name).eq(name);
    });

    it('collect categories - numbers', () => {
        const json = Tester.loadChartJson("bar-01");
        const chart = new Chart(json);
        const axis = chart.xAxis;

        chart.prepareRender();

        expect(axis).instanceOf(CategoryAxis);
        expect((axis as CategoryAxis).getCategories().length).eq(0);
    });

    it('collect categories - number arrays', () => {
        const json = Tester.loadChartJson("bar-02");
        const chart = new Chart(json);
        const series = chart.firstSeries;
        const axis = chart.xAxis;

        chart.prepareRender();

        expect(axis).instanceOf(CategoryAxis);
        expect(series.getPoints().count).eq(json.series.data.length);
        expect((axis as CategoryAxis)._categories.length).eq(series.getPoints().count);
    });

    it('calculate min max', () => {
        const json = Tester.loadChartJson("bar-01");
        const chart = new Chart(json);
        const series = chart.firstSeries;
        const axis = chart.xAxis as CategoryAxis;

        chart.prepareRender();

        expect(axis._range.min).eq(0);        
        expect(axis._range.max).eq(series.getPoints().count - 1);        
    });

    it('calculate min max 2', () => {
        const json = Tester.loadChartJson("bar-02");
        const chart = new Chart(json);
        const series = chart.firstSeries;
        const axis = chart.xAxis as CategoryAxis;

        chart.prepareRender();

        expect(axis._range.min).eq(0);        
        expect(axis._range.max).eq(series.getPoints().count - 1);        
    });

    it('categories', () => {
        const json = {
            xAxis: {
                categories: ["aa", "bb", "cc", "dd"]
            },
            series: {
                data: [
                    ['a', 1], ['b', 2], ['c', 3]
                ]
            }
        };
        const chart = new Chart(json);
        const axis = chart.xAxis as CategoryAxis;

        chart.prepareRender();

        expect(axis).instanceof(CategoryAxis);
        expect(axis.categories).deep.eq(json.xAxis.categories);
    });

    it('number ticks', () => {
        const json = Tester.loadChartJson("bar-01");
        const chart = new Chart(json);
        const axis = chart.xAxis as CategoryAxis;

        chart.prepareRender();
        chart.layoutAxes(500, 500, false, 1);

        const series = chart.firstSeries;
        const ticks = axis._ticks;

        expect(ticks.length).gt(0);
        expect(ticks.length).eq(series.getPoints().count);

        ticks.forEach((t, i) => {
            expect(t.value).eq(i);
            expect(t.value).eq(series.getPoints().get(i).xValue);
            expect(t.value.toString()).eq(t.label);
        });
        expect(ticks[0].pos).gte(0);
    });
});
