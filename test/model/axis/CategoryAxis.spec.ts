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
import { loadChartJson } from '../../Tester';
import { Chart } from '../../../src/model/Chart';

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
        const json = loadChartJson("column-01");
        const chart = new Chart(json);
        const axis = chart.xAxis;

        chart.prepareRender();

        expect(axis).instanceOf(CategoryAxis);
        expect((axis as CategoryAxis).getCategories().length).eq(0);
    });

    it('collect categories - number arrays', () => {
        const json = loadChartJson("column-02");
        const chart = new Chart(json);
        const series = chart.series;
        const axis = chart.xAxis;

        chart.prepareRender();

        expect(axis).instanceOf(CategoryAxis);
        expect((axis as CategoryAxis).getCategories().length).eq(series.getPoints().count);
    });
});
