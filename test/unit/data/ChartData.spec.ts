////////////////////////////////////////////////////////////////////////////////
// ChartData.spec.ts
// 2023. 12. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ChartData } from '../../../src/data/ChartData';
import { Tester } from '../Tester';

/**
 * Tests for ChartData class.
 */
 describe("ChartData test", function() {

    it('init', () => {
        const data = new ChartData(null, null);

        expect(data).exist;
    });

    it('단일값 data', () => {
        const values = [1, 2, 3, 4, 5];
        const data = new ChartData(null, values);

        expect(data._rows.length).eq(values.length);
        for (let r = 0; r < values.length; r++) {
            expect(data.getValue(r, 'y')).eq(values[r]);
        }

        // setValue
        let r = 0;
        let f = 'y';
        let v = Tester.irandom(100000);

        data.setValue(r, f, v);
        expect(data.getValue(r, f)).eq(v);
    });

    it('배열 data', () => {
        const values = [[1, 10], [2, 20], [3, 30]];
        const data = new ChartData(null, values);

        expect(data._rows.length).eq(values.length);

        // getValue
        for (let r = 0; r < values.length; r++) {
            expect(data.getValue(r, 'x')).eq(values[r][0]);
            expect(data.getValue(r, 'y')).eq(values[r][1]);
        }

        // setValue
        let r = 0;
        let f = 'x';
        let v = Tester.irandom(100000);

        data.setValue(r, f, v);
        expect(data.getValue(r, f)).eq(v);
    });

    it('json data', () => {
        const values = [{x: 1, y: 10}, {x: 2, y: 20}, {x: 3, y: 30}];
        const data = new ChartData(null, values);

        expect(data._rows.length).eq(values.length);
        for (let r = 0; r < values.length; r++) {
            expect(data.getValue(r, 'x')).eq(values[r].x);
            expect(data.getValue(r, 'y')).eq(values[r].y);
        }

        // setValue
        let r = 0;
        let f = 'x';
        let v = Tester.irandom(100000);

        data.setValue(r, f, v);
        expect(data.getValue(r, f)).eq(v);
    });
});
