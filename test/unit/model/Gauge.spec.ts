////////////////////////////////////////////////////////////////////////////////
// Gauge.spec.ts
// 2023. 09. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { CircularGauge, Gauge, ValueGauge } from '../../../src/model/Gauge';

/**
 * Tests for Gauge class.
 */
 describe("Gauge test", function() {

    it('buildRanges', () => {
        const min = 10;
        const max = 100;
        const src = [{
            toValue: 30,
            color: 'gray'
        }, {
            toValue: 70,
            color: 'black'
        }, {
            color: 'red'
        }];
        const ranges = ValueGauge.buildRanges(src, min, max);

        expect(ranges).instanceOf(Array);
        expect(ranges.length).eq(src.length);

        expect(ranges[0].fromValue).eq(min);
        expect(ranges[2].fromValue).eq(src[1].toValue);
        expect(ranges[2].toValue).eq(max);
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
