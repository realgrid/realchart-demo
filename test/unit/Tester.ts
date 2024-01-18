////////////////////////////////////////////////////////////////////////////////
// Tester.ts
// 22020. 08. 10. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2020 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import * as fs from 'fs';
import { RcElement } from '../../src/common/RcControl';
import { TextElement } from '../../src/common/impl/TextElement';
import { ChartControl } from '../../src/ChartControl';

const CHART_CONTROL_ID = 'chart-control';

export class Tester {

    //-------------------------------------------------------------------------
    // static members
    //-------------------------------------------------------------------------
    static loadJson(path: string): any {
        if (!path.endsWith('.json')) path += '.json';
        const lines = fs.readFileSync(path).toString();
        const data = JSON.parse(lines);
        return data;
    }
    
    static loadChartJson(name: string): any {
        return Tester.loadJson("test/unit/assets/chart/" + name);
    }
    
    static loadFile(path: string): any {
        const s = fs.readFileSync(path).toString();
        return s;
    }
    
    static createControl(width?: number, height?: number): TestChartControl {
        RcElement.TESTING = true;
        RcElement.DEBUGGING = true;

        TextElement.prototype.getBBox = TextElement.prototype.getBBoundsTest;

        const container = document.getElementById(CHART_CONTROL_ID) as HTMLDivElement;
        container.style.width = (width || 700) + 'px';
        container.style.height = (height || 500) + 'px';
        const control = new TestChartControl(document, container);
        control['_dom'].style.width = (width || 700) + 'px';
        control['_dom'].style.height = (height || 500) + 'px';
        return control;
    }

    static irandom(min: number, max?: number): number {
        if (max !== undefined) {
            const v1 = min >> 0;
            const v2 = max >> 0;
            return (Math.random() * (v2 - v1) + v1) >>> 0;
        } else {
            const v = min >> 0;
            return (Math.random() * v) >> 0;
        }
    }
    
    static srandom(min: number, max: number): string {
        let s = '';
        const len = this.irandom(min, max);

        for (let i = 0; i < len; i++) {
            s += String.fromCharCode(this.irandom(97, 123))
        }
        return s;
    }

    static erandom(clazz: any): any {
        const vals = Object.values(clazz);
        return vals[this.irandom(vals.length)];
    }

    static brandom(): boolean {
        return Math.random() > 0.5 ? true : false;
    }

    static arandom(arr: any[]): any {
        return arr[(Math.random() * arr.length) >> 0];
    }

    static iarandom(min: number, max: number, count: number): number[] {
        const list = new Array<number>();
        for (let i = min; i < max; i++) {
            list.push(i);
        }
        while (list.length > count) {
            list.splice(Tester.irandom(list.length), 1);
        }
        return list;
    }
}

export class TestChartControl extends ChartControl {
    
    //-------------------------------------------------------------------------
    // testing methods
    //-------------------------------------------------------------------------
    testRender(force = false): TestChartControl {
        if (force || this['_dirty']) {
            this._render();
        }
        return this;
    }

}