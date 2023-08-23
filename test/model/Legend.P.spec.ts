////////////////////////////////////////////////////////////////////////////////
// Legend.P.spec.ts
// 2023. 08. 22. created by wooriPbg
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Utils } from '../../src/common/Utils';
import { Legend, LegendItem, LegendLayout, LegendPosition } from '../../src/model/Legend';
import { Chart } from '../../src/main';
import { Tester } from '../Tester';

const source = {
    position: Utils.arandom(['bottom', 'top', 'right', 'left', 'plot', 'subplot']),
    layout: Utils.arandom(['auto', 'horizontal', 'vertical']),
    alignBase: Utils.arandom(['chart', 'plot']),
    left: Utils.irandom(-1000, 1000),
    right: Utils.irandom(-1000, 1000),
    top: Utils.irandom(-1000, 1000),
    bottom: Utils.irandom(-1000, 1000),
    itemGap: Utils.irandom(-1000, 1000),
    markerGap: Utils.irandom(-1000, 1000),
    backgroundStyles: {}
}

/**
 * Tests for Legend class.
 */
describe('LegendItem test', function() {
    it('init', () => {
        const json = Tester.loadChartJson('axis');
        const chart = new Chart(json);
        const item = new LegendItem(chart.legend, chart._getLegendSources()[0]);

        expect(item).exist;
    });

    it('text()', () => {
        const json = Tester.loadChartJson('axis');
        const chart = new Chart(json);
        const index = 0;
        const item = new LegendItem(chart.legend, chart._getLegendSources()[index]);

        expect(item.text()).eq(json.series[index].label);
    })
})

/**
 * Tests for Legend class.
 */
 describe('Legend test', function() {
    let legend: Legend;
    let json;
    beforeEach(() => {
        json = Tester.loadChartJson('axis');
        const chart = new Chart(json);
        chart.prepareRender();
        legend = new Legend(chart);
        legend.load(source);
    });

    it('init', () => {
        const lg = new Legend(new Chart());

        expect(lg).exist;
    });

    it('position', () => {
        expect(legend.position).eq(source.position);
    });

    it('layout', () => {
        expect(legend.layout).eq(source.layout);
    });

    it('alignBase', () => {
        expect(legend.alignBase).eq(source.alignBase);
    });

    it('left', () => {
        expect(legend.left).eq(source.left);
    });

    it('right', () => {
        expect(legend.right).eq(source.right);
    });

    it('top', () => {
        expect(legend.top).eq(source.top);
    });

    it('bottom', () => {
        expect(legend.bottom).eq(source.bottom);
    });

    it('itemGap', () => {
        expect(legend.itemGap).eq(source.itemGap);
    });

    it('markGap', () => {
        expect(legend.markerGap).eq(source.markerGap);
    });

    it('backgroundStyles', () => {
        expect(legend.backgroundStyles).eql(source.backgroundStyles);
    });

    it('items()', () => {
        legend.prepareRender();
        expect(legend.items().length).eq(json.series.length);
    });

    it('isEmpty()', () => {
        legend.prepareRender();
        expect(legend.isEmpty()).false;
    });

    it('getLayout()', () => {
        if (source.layout === 'auto' && source.position !== LegendPosition.PLOT) {
            switch(source.position) {
                case LegendPosition.BOTTOM:
                case LegendPosition.TOP:
                    expect(legend.getLayout()).eq(LegendLayout.HORIZONTAL);
                    break;
                default:
                    expect(legend.getLayout()).eq(LegendLayout.VERTICAL);
                    break;
            }
        } else {
            expect(legend.getLayout()).eq(source.layout);
        }
    });

    it('prepareRender()', () => {
        expect(legend['_items']).undefined;
        legend.prepareRender();
        expect(legend['_items'].length).eq(json.series.length);
    });

    it('$_collectItems()', () => {
        expect(legend['_items']).undefined;
        expect(legend['$_collectItems']().length).eq(json.series.length);
    });
});
