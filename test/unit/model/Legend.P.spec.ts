////////////////////////////////////////////////////////////////////////////////
// Legend.P.spec.ts
// 2023. 08. 22. created by wooriPbg
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Legend, LegendItem } from '../../../src/model/Legend';
import { Tester } from '../Tester';
import { Chart } from '../../../src/model/Chart';

const source = {
    location: Tester.arandom(['bottom', 'top', 'right', 'left', 'plot', 'subplot']),
    layout: Tester.arandom(['auto', 'horizontal', 'vertical']),
    alignBase: Tester.arandom(['chart', 'plot']),
    left: Tester.irandom(-1000, 1000),
    right: Tester.irandom(-1000, 1000),
    top: Tester.irandom(-1000, 1000),
    bottom: Tester.irandom(-1000, 1000),
    itemGap: Tester.irandom(-1000, 1000),
    markerGap: Tester.irandom(-1000, 1000),
    backgroundStyle: {}
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

    it('location', () => {
        expect(legend.location).eq(source.location);
    });

    it('layout', () => {
        expect(legend.layout).eq(source.layout);
    });

    it('alignBase', () => {
        expect(legend.alignBase).eq(source.alignBase);
    });

    it('itemGap', () => {
        expect(legend.itemGap).eq(source.itemGap);
    });

    it('markGap', () => {
        expect(legend.markerGap).eq(source.markerGap);
    });

    it('backgroundStyle', () => {
        expect(legend.backgroundStyle).eql(source.backgroundStyle);
    });

    it('items()', () => {
        legend.prepareRender();
        expect(legend.items().length).eq(json.series.length);
    });

    it('isEmpty()', () => {
        legend.prepareRender();
        expect(legend.isEmpty()).false;
    });

    // prepare 해야 한다...
    // it('getLayout()', () => {
    //     if (source.layout === 'auto' && source.position !== WidgetPosition.PLOT) {
    //         switch(source.position) {
    //             case WidgetPosition.BOTTOM:
    //             case WidgetPosition.TOP:
    //                 expect(legend.getLayout()).eq(LegendLayout.HORIZONTAL);
    //                 break;
    //             default:
    //                 expect(legend.getLayout()).eq(LegendLayout.VERTICAL);
    //                 break;
    //         }
    //     } else {
    //         expect(legend.getLayout()).eq(source.layout);
    //     }
    // });

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
