////////////////////////////////////////////////////////////////////////////////
// Axis.P.spec.ts
// 2023. 08. 16. created by wooriPbg
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { expect } from 'chai';
import { Test, beforeEach, describe, it } from 'mocha';
import { Axis, AxisGrid, AxisLabel, AxisTick, IAxisTick } from '../../../src/model/Axis';
import { Tester } from '../Tester';
import { Chart } from '../../../src/model/Chart';
import { Utils } from '../../../src/common/Utils';
import { LinearAxisLabel } from '../../../src/model/axis/LinearAxis';

const type = 'test'

const source = {
    type: '',
    title: {
        text: 'axis title',
        gap: 10,
        backgroundStyle: {
            fill: 'red'
        }
    },
    tick: {
        mark: 10,
        prefix: '강',
        suffix: ''
    },
    grid: {
        circular: true,
        statVisible: false,
        endVisible: true,
        visible: true
    },
    guide: [{
        type: 'line',
        value: 12,
        label: 'line guide'
    }, {
        type: 'range',
        start: 3,
        end: 6,
        label: {
            text: 'range guide',
            align: 'right',
            style: {
                fill: 'red'
            }
        }
    }],
    crosshair: true,
    reversed: false,
    position: 'normal',
    minValue: 0,
    maxValue: 20,
    minPadding: 10,
    maxPadding: 0,
    padding: 0,
    marginNear: 0,
    marginFar: 0,
    tickStart: true,
    tickEnd: true
}

class AxisImpl extends Axis {
    protected _createGrid(): AxisGrid { return }
    protected _createTickModel(): AxisTick { return }
    protected _createLabel(): AxisLabel { return new LinearAxisLabel(this); }
    _type(): string { return type; }
    protected _doPrepareRender(): void {}
    protected _doBuildTicks(min: number, max: number, length: number): IAxisTick[] { return [];}
    getPos(length: number, value: number): number { return 0; }
    getUnitLen(length: number): number { return 0; }
    override axisMin(): number { return; }
    override axisMax(): number { return; }
    continuous(): boolean { return false }
    valueAt(length: number, pos: number): number { return; }
    xValueAt(pos: number): number { return }
}

/**
 * Tests for Axis class.
 */
 describe("Axis test", function() {
    let json;
    let axis: Axis;
    let chart: Chart;
    beforeEach(() => {
        json = Tester.loadChartJson('axis');
        chart = new Chart();
        chart.prepareRender();
        axis = new AxisImpl(chart, false, 'test').init();
        axis.load(source);
    })

    it('init', () => {
        const axis = new AxisImpl(null, false);

        expect(axis).exist;
    });

    it('type', () => {
        expect(axis._type()).eq(type);
    });

    it('position', () => {
        expect(axis.position).eq(source.position);
    });

    it('reversed', () => {
        expect(axis.reversed).eq(source.reversed);
    });

    it('min', () => {
        expect(axis.minValue).eq(source.minValue);
    });

    it('max', () => {
        expect(axis.maxValue).eq(source.maxValue);
    });

    it('marginNear', () => {
        expect(axis.marginNear).eq(source.marginNear);
    });

    it('marginFar', () => {
        expect(axis.marginFar).eq(source.marginFar);
    });

    it('isEmpty()', () => {
        chart.load(json);
        chart.prepareRender();
        chart._getSeries().series().map((series) => {
            axis._connect(series);
        })
        expect(axis.isEmpty()).eq(json.series.length < 1);
    });

    it('disconnect()', () => {
        chart.load(json);
        chart.prepareRender();
        chart._getSeries().series().map((series) => {
            axis._connect(series);
        })
        expect(axis['_series'].length > 0).true;
        expect(axis.disconnect());
        expect(axis['_series'].length === 0).true;
    });

    it('prepareRender()');

    it('buildTicks()');

    it('getValue()', () => {
        const i = Tester.irandom(0, 10000);
        expect(axis.getValue(i.toString())).to.be.a('number');
    });

    it('contains()', () => {
        let min = Number.MAX_SAFE_INTEGER;
        let max = Number.MIN_SAFE_INTEGER;
        json.series[0].data.map((d) => {
            const value = d[1]
            if (value < min) min = value;
            if (value > max) max = value;
        });
        const i = Tester.irandom(0, 10000);
        axis.prepareRender();
        expect(axis.contains(i)).eq(i >= min && i <= max);
    });

    it('_connect()', () => {
        chart.load(json);
        chart.prepareRender();
        chart._getSeries().series().map((series) => {
            axis._connect(series);
        });
        expect(axis['_series'].length).eq(json.series.length);
        expect(axis.isEmpty()).false;
    });

});
