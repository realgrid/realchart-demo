////////////////////////////////////////////////////////////////////////////////
// Plane.spec.ts
// 2023. 10. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Plane } from '../../../src/model/Plane';
import { executablePath } from 'puppeteer';

/**
 * Tests for Plane class.
 */
 describe("Plane test", function() {

    it('init', () => {
        const plane = new Plane(null);

        expect(plane).exist;
    });

    it('load simple', () => {
        const config = {
            rows: 2,
            cols: 2
        };
        const plane = new Plane(null);

        plane.load(config);
        expect(plane.rows).eq(config.rows);
        expect(plane.cols).eq(config.cols);
        for (let r = 0; r < plane.rows; r++) {
            for (let c = 0; c < plane.cols; c++) {
                const pane = plane.getPane(r, c);

                expect(pane.row).eq(r);
                expect(pane.col).eq(c);
                expect(pane.width).eq(0.5);
                expect(pane.height).eq(0.5);
            }
        }
    });

    it('load', () => {
        const config = {
            rows: [1, 1],
            cols: [1, 1],
            panes: [{
                col: 0,
            }, {
                col: 1,
            }]
        };
        const plane = new Plane(null);

        plane.load(config);
    });
});
