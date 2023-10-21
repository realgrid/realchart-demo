////////////////////////////////////////////////////////////////////////////////
// Plane.ts
// 2023. 10. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject } from "../common/Common";
import { ChartItem } from "./ChartItem";

/**
 * 다중 분할 평면.
 */
export class Plane extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _panes: Pane[][] = [];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    xPanes = 1;
    yPanes = 1;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getPane(x: number, y: number): Pane {
        return this._panes[x + '*' + y];
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoadProp(prop: string, value: any): boolean {
        if (prop === 'panes') {
            return true;
        }
    }

    load(source: any): ChartItem {
        if (isObject(source)) {
            const panes = source.panes;
            super.load(source);
            this.$_loadPanes(panes);
        }
        return this;
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_loadPanes(src: any): void {
        const x = Math.max(1, this.xPanes || 1);
        const y = Math.max(1, this.yPanes || 1);
        const panes: Pane[][] = new Array<Pane[]>(y);

        for (let i = 0; i < panes.length; i++) {
            panes[i] = [];
        }

        if (isArray(src)) {
            src.forEach(s => {
                const pane = this.$_loadPane(src);
                if (pane.x >= 0 && pane.x < x && pane.y >= 0 && pane.y < y) {
                    panes[pane.y][pane.x] = pane;
                }
            })
        } else if (isObject(src)) {
            const pane = this.$_loadPane(src);
            panes[pane.y][pane.x] = pane;
        }

        this._panes = panes;
    }

    private $_loadPane(src: any): Pane {
        if (isObject(src)) {
            const pane = new Pane(this.chart);
            pane.load(src);
            return pane;
        }
    }
}

export class Pane extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    x = 0;
    y = 0;

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}