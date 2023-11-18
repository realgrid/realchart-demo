////////////////////////////////////////////////////////////////////////////////
// Split.ts
// 2023. 10. 21. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject, isString, pickNum } from "../common/Common";
import { Align, SVGStyleOrClass, _undefined, isNull } from "../common/Types";
import { PaneAxisMatrix } from "./Axis";
import { Body } from "./Body";
import { IChart } from "./Chart";
import { ChartItem } from "./ChartItem";

export class PaneTitle extends ChartItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public pane: Pane) {
        super(pane.chart, true);
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

export class PaneBody extends Body {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public pane: Pane) {
        super(pane.chart);

        this.radius = _undefined;
        this.centerX = _undefined;
        this.centerY = _undefined;
        this.startAngle = _undefined;
    }

    //-------------------------------------------------------------------------
    // overiden members
    //-------------------------------------------------------------------------
}

export class Pane extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    width: number;
    height: number;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart, public row: number, public col: number) {
        super(chart, true);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    title = new PaneTitle(this);
    body = new PaneBody(this);

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    prepareRender(): void {
        this.body.prepareRender();
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoad(source: any): void {
        super._doLoad(source);
    }
}

interface IRelativeSize {
    size: number;
}

/**
 * 다중 분할 panes.\
 * 각 pane에 해당하는 x, y축이 반드시 존재해야 한다.
 * axis는 {@link Axis.row row}, {@link Axis.col col} 속성으로 위치를 지정한다.
 * 시리즈는 {@link Series.row row}, {@link Series.col col} 속성으로 지정하거나, 아니면 axis 위치에 따라 자동으로 결정된다.
 * 시리즈그룹은 {@link SeriesGroup.row row}, {@link SeriesGroup.col col} 속성으로 지정하거나, 아니면 axis 위치에 따라 자동으로 결정된다.
 */
export class Split extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _cols = 1;
    private _rows = 1;
    private _widths: (IRelativeSize | number)[];
    private _heights: (IRelativeSize | number)[];
    private _panes: {[pos: string]: Pane} = {};

    private _xAxes: PaneAxisMatrix;
    private _yAxes: PaneAxisMatrix;
    _vcols = 1;
    _vrows = 1;
    private _vwidths: number[];
    private _vheights: number[];
    private _vpanes: Pane[][] = [];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart, false)
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    // /**
    //  * @default false
    //  * @config
    //  */
    // 'visible': boolean;

    /**
     * y축 분할을 지정한다.\
     * 숫자로 지정하면 동일한 높이를 갖는 pane들로 표시된다.
     * 배열로 지정하면 각 항목은 고정 크기 수자, 혹은 '*'로 끝나는 상대 크기.
     */
    rows: number | (number | `${number}*` | '*')[];
    /**
     * x축 분할을 지정한다.\
     * 숫자로 지정하면 동일한 너비를 갖는 pane들로 표시된다.
     * 배열로 지정하면 각 항목은 고정 크기 수자, 혹은 '*'로 끝나는 상대 크기.
     */
    cols: number | (number | `${number}*` | '*')[];

    // 실제 표시되는 pane 수.
    count(): number {
        return this._vrows * this._vcols;
    }

    rowCount(): number {
        return this._vrows;
    }

    colCount(): number {
        return this._vcols;
    }

    paneCount(): number {
        // TODO: pane들이 병합될 수 있다.
        return this._vrows * this._vcols;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    getPane(row: number, col: number): Pane {
        return this._vpanes[row][col];
    }

    getRow(row: number): Pane[] {
        return this._vpanes[row];
    }

    getColumn(col: number): Pane[] {
        return this._vpanes.map(v => v[col]);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _doLoadSimple(source: any): boolean {
        if (isArray(source) && source.length > 0) {
            this.rows = Math.max(1, +source[0]);
            this.cols = Math.max(1, pickNum(+source[1], this.rows));
            if (this.rows > 0 && this.cols > 0) {
                this.$_parsePanes(this.rows, this.cols);
                this.visible = true;
            }
            return true;
        }
        return super._doLoadSimple(source);
    }

    protected _doLoadProp(prop: string, value: any): boolean {
        if (['panes', 'cols', 'rows'].indexOf(prop) >= 0) {
            return true;
        }
    }

    load(source: any): ChartItem {
        super.load(source);

        if (isObject(source)) {
            this.$_parsePanes(this.rows = source.rows, this.cols = source.cols);
            this._panes = this.$_loadPanes(source.panes);
        }
        return this;
    }

    protected _doPrepareRender(chart: IChart): void {
        this._xAxes = chart._xPaneAxes;
        this._yAxes = chart._yPaneAxes;
        this._vpanes = this.$_collectPanes(chart);
        this._vpanes.forEach(panes => panes.forEach(pane => pane.prepareRender()));

    }

    getXLens(length: number): number[] {
        return new Array<number>(this._vcols).fill(length / this._vcols);
    }

    getYLens(length: number): number[] {
        return new Array<number>(this._vrows).fill(length / this._vrows);
    }

    // 여러번 호출될 수 있다.
    layoutAxes(width: number, height: number, inverted: boolean, phase: number): void {
        const xLens = this.getXLens(inverted ? height : width);
        this._xAxes.buildTicks(xLens);

        const yLens = this.getYLens(inverted ? width : height);
        this._yAxes.buildTicks(yLens);

        this.$_calcAxesPoints(xLens, yLens, 0);
    }

    private $_calcAxesPoints(xLens: number[], yLens: number[], phase: number): void {
        this._xAxes.calcPoints(xLens, phase);
        this._yAxes.calcPoints(yLens, phase);
    }

    calcAxesPoints(xLens: number[], yLens: number[]): void {
        this.$_calcAxesPoints(xLens, yLens, 1);
    }

    /**
     * body들의 표시 크기를 계산한다.
     */
    calcSizes(width: number, height: number): void {
        this._widths = this.$_calcSizes(width, this._widths);
        this._heights = this.$_calcSizes(height, this._heights);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    /**
     * number | (`${number}*` | '*')[] // '*'은 '1*'과 동일.
     */
    private $_parseSizes(sizes: any): (IRelativeSize | number)[] {
        let list: (string | number)[];

        if (isArray(sizes) && sizes.length > 0) {
            list = sizes.slice(0);
        } else if (sizes > 0) {
            list = new Array(sizes).fill('*');
        } else  {
            list = ['*'];
        }
        return list.map(v => {
            if (isString(v)) {
                const s = v.trim();
                return { size: s === '*' ? 1 : parseFloat(s) };
            }
            return +v || { size: 1 };
        })
    }

    private $_parsePanes(rows: any, cols: any): void {
        this._widths = this.$_parseSizes(cols);
        this._heights = this.$_parseSizes(rows);
        this._cols = this._widths.length;
        this._rows = this._heights.length;
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

    /**
     * 축이 연결되지 않은 pane들은 skip한다.
     */
    private $_collectPanes(chart: IChart): Pane[][] {
        const xAxes = chart._getXAxes().internalItems();
        const yAxes = chart._getYAxes().internalItems();
        const xPanes: number[] = [];
        const yPanes: number[] = [];
        const panes = [];

        xAxes.concat(yAxes).forEach(axis => {
            const r = axis.row || 0;
            const c = axis.col || 0;

            axis._row = r;
            axis._col = c;

            if (c >= 0 && c < this._cols) {
                if (xPanes.indexOf(c) < 0) {
                    xPanes.push(c);
                }
            }
            if (r >= 0 && r < this._rows) {
                if (yPanes.indexOf(r) < 0) {
                    yPanes.push(r);
                }
            }
        })
        xPanes.sort();
        yPanes.sort();

        for (let r = 0; r < yPanes.length; r++) {
            const list: Pane[] = [];

            for (let c = 0; c < xPanes.length; c++) {
                const pane = this._panes[r + ',' + c] || new Pane(chart, r, c);
                list.push(pane);
            }
            panes.push(list);
        }

        this._vrows = panes.length;
        this._vcols = panes[0].length;

        return panes;
    }

    private $_calcSizes(domain: number, sizes: (IRelativeSize | number)[]): number[] {
        let sum = 0;
        let sumRel = 0;
        return
    }
}
