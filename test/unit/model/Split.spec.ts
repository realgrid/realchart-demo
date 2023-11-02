////////////////////////////////////////////////////////////////////////////////
// Split.spec.ts
// 2023. 10. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Split } from '../../../src/model/Split';
import { executablePath } from 'puppeteer';

/**
 * Tests for Split class.
 */
 describe("Split test", function() {

    it('init', () => {
        const split = new Split(null);

        expect(split).exist;
    });

    it('load simple', () => {
        const config = {
            rows: 2,
            cols: 2
        };
        const split = new Split(null);

        split.load(config);
        expect(split.rows).eq(config.rows);
        expect(split.cols).eq(config.cols);

        // for (let r = 0; r < split.rows; r++) {
        //     for (let c = 0; c < split.cols; c++) {
        //         const pane = split.getPane(r, c);

        //         expect(pane.row).eq(r);
        //         expect(pane.col).eq(c);
        //         expect(pane.width).eq(0.5);
        //         expect(pane.height).eq(0.5);
        //     }
        // }
    });

    it('load', () => {
        const config = {
            rows: [1, 1],
            cols: [1, 1],
            panes: [{
                col: 0,
                title: 'Pane 0'
            }, {
                col: 1,
                title: 'Pane 1'
            }]
        };
        const split = new Split(null);

        split.load(config);
        // expect(split.getPane(0, 0).title.text).eq(config.panes[0].title);
        // expect(split.getPane(0, 1).title.text).eq(config.panes[1].title);
    });
});
