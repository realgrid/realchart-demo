////////////////////////////////////////////////////////////////////////////////
// Gauge.spec.ts
// 2023. 09. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { CircularGauge, Gauge } from '../../../src/model/Gauge';

/**
 * Tests for Gauge class.
 */
 describe("Gauge test", function() {

    it('buildRanges', () => {
        const min = 10;
        const max = 100;
        const src = [{
            endValue: 30,
            color: 'gray'
        }, {
            endValue: 70,
            color: 'black'
        }, {
            color: 'red'
        }];
        const ranges = Gauge.buildRanges(src, min, max);

        expect(ranges).instanceOf(Array);
        expect(ranges.length).eq(src.length);

        expect(ranges[0].startValue).eq(min);
        expect(ranges[2].startValue).eq(src[1].endValue);
        expect(ranges[2].endValue).eq(max);
    });
});

class CircularGaugeImpl extends CircularGauge {
}

/**
 * Tests for CircularGauge class.
 */
describe("CircularGauge test", function() {

    it('init', () => {
        const gauge = new CircularGaugeImpl(null);

        expect(gauge).is.exist;
    });
});
