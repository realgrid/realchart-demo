////////////////////////////////////////////////////////////////////////////////
// ChartData.ts
// 2023. 12. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray } from "../common/Common";
import { locale } from "../common/RcLocale";
import { _undef, throwFormat } from "../common/Types";

export interface IChartDataListener {
    onDataValueChanged?(data: ChartData, row: number, field: string, value: any, oldValue: any): void;
    onDataRowUpdated?(data: ChartData, row: number, oldValues: any): void;
    onDataRowAdded?(data: ChartData, row: number): void;
    onDataRowDeleted?(data: ChartData, row: number): void;
    onDataChanged?(data: ChartData): void;
}

const isObj = function (v: any): boolean { return v && typeof v === 'object'; }

/**
 * 차트 생성 옵션들.
 */
export interface IRcChartDataOptions {
    /**
     * row가 배열이나 단일 값일 때 필드 이름들.
     */
    fieldNames?: string[];
}

/**
 */
export class ChartData {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _listeners: IChartDataListener[] = [];
    private _rows: any[] = [];
    private _fields: string[];
    private _fieldMap: {[name: string]: number};

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(options: IRcChartDataOptions, rows: any[]) {
        this.$_buildOptions(options);
        if (isArray(rows)) {
            rows.forEach(row => this._rows.push(row.slice(0)));
        }
    }

    private $_buildOptions(options: IRcChartDataOptions): void {
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    _internalValues(): any[] {
        return this._rows;
    }

    addListener(listener: IChartDataListener): void {
        if (listener && this._listeners.indexOf(listener) < 0) {
            this._listeners.push(listener);
        }
    }

    removeListener(listener: IChartDataListener): void {
        const i = this._listeners.indexOf(listener);
        if (i >= 0) {
            this._listeners.splice(i, 1);
        }
    }

    protected _getValue(vals: any, field: string): any {
        if (isObj(vals)) {
            return vals[field];
        } else if (isArray(vals)) {
            return vals[this._fieldMap[field]];
        } else if (field === this._fields[0]) {
            return vals;
        }
    }

    getValue(row: number, field: string): any {
        this._checkRow(row);
        return this._getValue(this._rows[row], field);
    }
    
    setValue(row: number, field: string, value: any): void {
        this._checkRow(row);

        const old = this._rows[row][field];

        if (value !== old) {
            this._rows[row][field] = value;
            this._fireEvent('onDataValueChanged', row, field, value, old);
        }
    }

    getValues(field: string, fromRow: number, toRow: number): any[] {
        const values = this._rows;
        const vals = [];

        if (isNaN(fromRow) || fromRow < 0) fromRow = 0;
        if (isNaN(toRow) || toRow < 0 || toRow > values.length) toRow = values.length; 

        for (let r = fromRow; r < toRow; r++) {
            vals.push(this._getValue(values, field));
        }
        return vals;
    }

    getRow(row: number): object {
        this._checkRow(row);

        const vals = this._rows[row];
        let ret = {};

        if (isObj(vals)) {
            Object.assign({}, vals);
        } else if (isArray(vals)) {
            for (let i = 0; i < vals.length; i++) {
                ret[this._fields[i]] = vals[i];
            }
        } else {
            ret[this._fields[0]] = vals;
        }
        return ret;
    }

    addRow(values: any, row: number): void {
        if (isNaN(row) || row < 0) row = this._rows.length;
        else this._checkRow(row);

        this._rows.splice(row, 0, values);
        this._fireEvent('onDataRowAdded', row);
    }

    deleteRow(row: number): void {
        this._checkRow(row);

        const old = this._rows[row];

        this._rows.splice(row, 1);
        this._fireEvent('onDataRowDeleted', row, old);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _checkRow(row: number): void {
        if (row < 0 || row > this._rows.length) {
            throwFormat(locale.invalidRowIndex, row);
        }
    }

    protected _fireEvent(event: string, ...args: any[]): any {
        const arr = Array.prototype.slice.call(arguments, 0);
        arr[0] = this;

        for (const listener of this._listeners) {
            const func = listener[event];
            if (func) {
                const rslt = func.apply(listener, arr);
                if (rslt !== void 0) {
                    return rslt;
                }
            }
        }
    }
}

export class ChartDataCollection {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _map: {[name: string]: ChartData} = {};

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    get(name: string): ChartData {
        return this._map[name];
    }

    load(source: any): void {
        for (const p in source) {
            const src = source[p];
            let d: ChartData;

            if (isArray(src)) {
                d = new ChartData({}, src);
            } else if (isObj(src) && isArray(src.values)) {
                d = new ChartData(src.options, src.values);
            }
            this._map[p] = d;
        }
    }
}
