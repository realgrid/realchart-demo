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
        const view = control.chartView();

        expect(view).exist;
    });

    it('measure empty', () => {
        const view = control.chartView();

        view.measure(control.doc(), null, 100, 100, 1);
        expect(view._emptyView).exist;
        expect(view._emptyView.visible).is.true;
    })
});
