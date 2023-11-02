////////////////////////////////////////////////////////////////////////////////
// Split.ts
// 2023. 10. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, isString } from "../common/Common";
import { Align, SVGStyleOrClass, isNull } from "../common/Types";
import { IChart } from "./Chart";
import { ChartItem } from "./ChartItem";

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
    constructor(chart: IChart, public row: number, public col: number) {
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

/**
 * 다중 분할 panes.\
 * 각 pane에 해당하는 xAxis, yAxis가 반드시 존재해야 한다.
 * 시리즈는 axis 위치에 따라 자동으로 pane이 결정된다.
 */
export class Split extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _cols = 1;
    private _rows = 1;
    private _colWidths: (string | number)[];
    private _rowHeights: (string | number)[];
    private _panes: {[pos: string]: Pane} = {};

    private _vcols = 1;
    private _vrows = 1;
    private _vcolWidths: number[];
    private _vrowHeights: number[];
    private _vpanes: Pane[][] = [];

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
        return this._vrows * this._vcols;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getPane(row: number, col: number): Pane {
        return this._vpanes[row][col];
    }

    layoutPanes(width: number, height: number, inverted: boolean, phase: number): void {
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

            this.$_parsePanes(source.rows, source.cols);
            this._panes = this.$_loadPanes(source.panes);
        }
        return this;
    }

    protected _doPrepareRender(chart: IChart): void {
        this._vpanes = this.$_buildPanes();
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    /**
     * (number | `${number}*` | '*')[] // '*'은 '1*'과 동일.
     */
    private $_parseSizes(sizes: any): (number | string)[] {
        let list: (string | number)[];

        if (isArray(sizes) && sizes.length > 0) {
            list = sizes.slice(0);
        } else if (sizes > 0) {
            list = new Array(sizes).fill('1');
        } else  {
            list = ['1'];
        }
        return list;
    }

    private $_parsePanes(rows: any, cols: any): void {
        this._colWidths = this.$_parseSizes(rows);
        this._rowHeights = this.$_parseSizes(cols);
        this._cols = this._colWidths.length;
        this._rows = this._rowHeights.length;
    }

    private $_loadPanes(src: any): {[pos: string]: Pane} {
        const panes = {};

        src = isArray(src) ? src : isObject(src) ? [src] : null;

        if (isArray(src)) {
            src.forEach(s => {
                const row = +s.row || 0;
                const col = +s.col || 0;

                if (col >= 0 && col < this._cols && row >= 0 && row < this._rows) {
                    const pane = new Pane(this.chart, row, col);

                    pane.load(s);
                    panes[row + ',' + col] = pane;
                }
            });
        }
        return panes;
    }

    private $_buildPanes(): Pane[][] {
        return;
    }
}
