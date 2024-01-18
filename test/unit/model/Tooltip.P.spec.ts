////////////////////////////////////////////////////////////////////////////////
// Tooltip.P.spec.ts
// 2023. 08. 23. created by wooriPbg
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';
import { Chart } from '../../../src/model/Chart';
import { Tester } from '../Tester';
import { Tooltip } from '../../../src/model/Tooltip';

const source = {
    html: Tester.srandom(1, 10),
    text: Tester.srandom(1, 10),
    offset: Tester.irandom(0, 1000),
    hideDelay: Tester.irandom(0, 10000),
    minWidth: Tester.irandom(0, 1000),
    minHeight: Tester.irandom(0, 1000),
}

/**
 * Tests for Tooltop class.
 */
describe('Tooltip test', function() {
    let tooltip: Tooltip;
    let json;
    let chart: Chart;
    beforeEach(() => {
        json = Object.assign({}, Tester.loadChartJson('axis'));
        chart = new Chart(json);
        tooltip = new Tooltip({chart: null, getTooltipContext: null});
        tooltip.load(source);
    });

    it('init', () => {
        const tooltip = new Tooltip({chart: null, getTooltipContext: null});

        expect(tooltip).exist;
    });

    it('html', () => {
        expect(tooltip.html).eq(source.html);
    });

    it('text', () => {
        expect(tooltip.text).eq(source.text);
    });

    it('offset', () => {
        expect(tooltip.offset).eq(source.offset);
    });

    it('hideDelay', () => {
        expect(tooltip.hideDelay).eq(source.hideDelay);
    });

    it('minWidth', () => {
        expect(tooltip.minWidth).eq(source.minWidth);
    });

    it('minHeight', () => {
        expect(tooltip.minHeight).eq(source.minHeight);
    });

    // TODO: 다시 작성하세요.
    // it('getValue()', () => {
    //     const param = Tester.arandom(['series', 'sereis.name', 'point.x', 'point', 'point.y']);
    //     const dp = new DataPoint({});
    //     switch (param) {
    //         case 'series':
    //         case 'series.name':
    //             expect(tooltip.getValue(dp, param)).eq(tooltip.series.displayName());
    //             break;
    //         case 'point.x':
    //             expect(tooltip.getValue(dp, param)).eq(dp.x);
    //             break;
    //         case 'point':
    //         case 'point.y':
    //             expect(tooltip.getValue(dp, param)).eq(dp.y);
    //             break;
    //         default:
    //             expect(tooltip.getValue(dp, param)).eq(param);
    //             break;
    //     }
    // });
});
