////////////////////////////////////////////////////////////////////////////////
// CircleGaugeGroup.spec.ts
// 2023. 10. 14. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { CircleGaugeGroup } from '../../../../src/model/gauge/CircleGauge';
import { Chart } from '../../../../src/model/Chart';

/**
 * Tests for CircleGaugeGroup class.
 */
 describe("CircleGaugeGroup test", function() {

    it('init', () => {
        const gauge = new CircleGaugeGroup(null);

        expect(gauge).is.exist;
    });

    it('load', () => {
        const config = {
            gauge: {
                children: [{
                    value: 10
                }, {
                    value: 20
                }]
            }
        };
        const chart = new Chart(config);
        const gauges = chart._getGauges();
        const gauge = gauges.get(0);

        expect(gauge).instanceof(CircleGaugeGroup);
    });

    it('load children', () => {
        const gauge = new CircleGaugeGroup(null);
        const config = {
            children: [{
                value: 10
            }, {
                value: 20
            }]
        };

        gauge.load(config);
    });
});
