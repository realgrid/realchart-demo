////////////////////////////////////////////////////////////////////////////////
// Plane.ts
// 2023. 10. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, isString } from "../common/Common";
import { Align, SVGStyleOrClass, isNull } from "../common/Types";
import { IChart } from "./Chart";
import { ChartItem } from "./ChartItem";

/**
 * 다중 분할 평면.\
 * 각 pane에 해당하는 xAxis, yAxis가 반드시 존재해야 한다.
 * 시리즈는 axis 위치에 따라 자동으로 pane이 결정된다.
 */
export class Plane extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _cols = 1;
    private _rows = 1;
    private _panes: Pane[][] = [];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    get rows(): number {
        return this._rows;
    }

    get cols(): number {
        return this._cols;
    }

    count(): number {
        return this._rows * this._cols;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getPane(row: number, col: number): Pane {
        return this._panes[row][col];
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoadProp(prop: string, value: any): boolean {
        if (['panes', 'cols', 'rows'].indexOf(prop) >= 0) {
            return true;
        }
    }

    load(source: any): ChartItem {
        if (isObject(source)) {
            const rows = source.rows;
            const cols = source.cols;
            const panes = source.panes;

            super.load(source);
            
            this._panes = this.$_buildPanes(rows, cols);
            this.$_loadPanes(this._panes, panes);
        }
        return this;
    }

    protected _doPrepareRender(chart: IChart): void {
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_parseSizes(sizes: any): number[] {
        if (isArray(sizes) && sizes.length > 1) {
            const list: number[] = [];
            let sum = 0;

            for (let i = 0; i < sizes.length; i++) {
                const sz = +sizes[i] || 1;
                list.push(sz);
                sum += sz;
            }
            for (let i = 0; i < sizes.length; i++) {
                list[i] = list[i] / sum;
            }
            return list;
        } else if (sizes > 0) {
            const list: number[] = [];
            for (let i = 0; i < sizes; i++) {
                list.push(1 / sizes);
            }            
            return list;
        } else  {
            return [1];
        }
    }

    private $_buildPanes(rows: any, cols: any): Pane[][] {
        const szRows = this.$_parseSizes(rows);
        const szCols = this.$_parseSizes(cols);
        const panes = [];

        for (let r = 0; r < szRows.length; r++) {
            panes.push([]);
            for (let c = 0; c < szCols.length; c++) {
                panes[r].push(new Pane(this.chart, r, c, szCols[c], szRows[r]));
            }
        }
        this._cols = szCols.length;
        this._rows = szRows.length;
        return panes;
    }

    private $_loadPanes(panes: Pane[][], src: any): void {
        src = isArray(src) ? src : isObject(src) ? [src] : null;

        if (isArray(src)) {
            src.forEach(s => {
                const row = +s.row || 0;
                const col = +s.col || 0;
                if (col >= 0 && col < this._cols && row >= 0 && row < this._rows) {
                    panes[row][col].load(s);
                }
            });
        }
    }
}

export class PaneTitle extends ChartItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public pane: Pane) {
        super(pane.chart);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 제목 텍스트
     * @config 
     */
    text: string;
    align = Align.CENTER;
    backgroundStyle: SVGStyleOrClass;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isVisible(): boolean {
        return this.visible && !isNull(this.text);
    }
    
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoadSimple(source: any): boolean {
        if (isString(source)) {
            this.text = source;
            return true;
        }
        return super._doLoadSimple(source);
    }
}

export class Pane extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, public row: number, public col: number, public width: number, public height: number) {
        super(chart);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    title = new PaneTitle(this);

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
}