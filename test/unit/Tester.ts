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