////////////////////////////////////////////////////////////////////////////////
// Split.spec.ts
// 2023. 10. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Pane, Split } from '../../../src/model/Split';
import { Chart } from '../../../src/model/Chart';
import { Utils } from '../../../src/common/Utils';
import { PaneAxisMatrix, PaneXAxisMatrix, PaneYAxisMatrix } from '../../../src/model/Axis';

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
        
        expect(split['_rows']).eq(config.rows);
        expect(split['_cols']).eq(config.cols);
        split['_widths'].forEach(w => expect((w as any).size).eq(1))
        split['_heights'].forEach(h => expect((h as any).size).eq(1))
        expect(Utils.isEmpty(split['_panes'])).is.true;
    });

    it('load', () => {
        const config = {
            rows: ['*', '*'],
            cols: ['*', '*'],
            panes: [{
                col: 0,
                title: 'Pane 0'
            }, {
                col: 1,
                title: 'Pane 1'
            }, {
                col: 2,
                title: 'Pane 2'
            }]
        };
        const split = new Split(null);

        split.load(config);

        const panes = split['_panes'];
        let pane = panes['0,0'];

        expect(pane).instanceOf(Pane);
        expect(pane.row).eq(0);
        expect(pane.col).eq(0);

        pane = panes['0,1'];

        expect(pane).instanceOf(Pane);
        expect(pane.row).eq(0);
        expect(pane.col).eq(1);

        pane = panes['1,0'];
        expect(pane).not.exist;

        // 범위를 벗어나면 생성되지 않는다.
        pane = panes['0,2'];

        expect(pane).not.exist;

        const widths = split['_widths'];
        const heights = split['_heights'];
        
        widths.forEach((w: any) => expect(w.size).eq(1));
        heights.forEach((h: any) => expect(h.size).eq(1));
    });

    it('prepare', () => {
        const chart = new Chart({
            xAxis: [{
                name: 'xAxis-1'
            }, {
                name: 'xAxis-2',
                col: 1
            }],
            yAxis: [{
                name: 'yAxis-1'
            }, {
                name: 'yAxis-2',
                col: 1
            }] 
        });
        const config = {
            rows: 5,
            cols: 5,
            panes: [{
                col: 0,
                title: 'Pane 0'
            }]
        };
        const split = new Split(chart);

        // split
        split.load(config);
        split.prepareRender();

        const panes = split['_vpanes'];

        expect(panes.length).eq(1);
        expect(panes[0].length).eq(2);

        expect(split._vrows).eq(1);
        expect(split._vcols).eq(2);

        const widths = split['_vwidths'];
        const heights = split['_vheights'];

        // axes matrix
        const xmatrix = new PaneXAxisMatrix(chart);
        const ymatrix = new PaneYAxisMatrix(chart);

        xmatrix.prepare(chart._getXAxes(), split._vrows, split._vcols);
        ymatrix.prepare(chart._getYAxes(), split._vrows, split._vcols);
        
        expect(xmatrix.rows()).eq(2);
        expect(xmatrix.cols()).eq(2);

        expect(ymatrix.rows()).eq(1);
        expect(ymatrix.cols()).eq(3);
    })

    it('prepare 2', () => {
        const chart = new Chart({
            xAxis: [{
            }, {
                col: 1
            }],
            yAxis: [{
            }, {
                row: 1
            }] 
        });
        const config = {
            rows: 5,
            cols: 5,
            panes: [{
                col: 0,
                title: 'Pane 0'
            }]
        };
        const split = new Split(chart);

        split.load(config);
        split.prepareRender();

        const panes = split['_vpanes'];

        expect(panes.length).eq(2);
        expect(panes[0].length).eq(2);
        expect(panes[0].length).eq(2);

        const widths = split['_vwidths'];
        const heights = split['_vheights'];

        // axes matrix
        const xmatrix = new PaneXAxisMatrix(chart);
        const ymatrix = new PaneYAxisMatrix(chart);

        xmatrix.prepare(chart._getXAxes(), split._vrows, split._vcols);
        ymatrix.prepare(chart._getYAxes(), split._vrows, split._vcols);
        
        expect(xmatrix.rows()).eq(3);
        expect(xmatrix.cols()).eq(2);

        expect(ymatrix.rows()).eq(2);
        expect(ymatrix.cols()).eq(3);
    })
});
