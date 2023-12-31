////////////////////////////////////////////////////////////////////////////////
// ChartData.ts
// 2023. 12. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isObject } from "../common/Common";
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
 */
export class ChartData {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * row가 단일 값일 때 필드 이름.
     */
    fieldName = 'y';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _listeners: IChartDataListener[] = [];

    name: string;
    private _values: any[] = [];

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(name: string, values: any[]) {
        this.name = name;
        if (isArray(values)) {
            values.forEach(row => this._values.push(row.slice(0)));
        }
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    _internalValues(): any[] {
        return this._values;
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
        return isObj(vals) ? vals[field] : field === this.fieldName ? vals : _undef;
    }

    getValue(row: number, field: string): any {
        this._checkRow(row);
        return this._getValue(this._values[row], field);
    }
    
    setValue(row: number, field: string, value: any): void {
        this._checkRow(row);

        const old = this._values[row][field];

        if (value !== old) {
            this._values[row][field] = value;
            this._fireEvent('onDataValueChanged', row, field, value, old);
        }
    }

    getValues(field: string, fromRow: number, toRow: number): any[] {
        const values = this._values;
        const vals = [];

        if (isNaN(fromRow) || fromRow < 0) fromRow = 0;
        if (isNaN(toRow) || toRow < 0 || toRow > values.length) toRow = values.length; 

        for (let r = fromRow; r < toRow; r++) {
            vals.push(this._getValue(values, field));
        }
        return vals;
    }

    getRow(row: number): any {
        this._checkRow(row);

        const v = this._values[row];
        if (isObj(v)) {
            return Object.assign({}, this._values[row]);
        } else if (this.fieldName) {
            const obj: any = {};
            obj.fieldName = v;
            return obj;
        } else {
            return v;
        }
    }

    addRow(values: any, row: number): void {
        if (isNaN(row) || row < 0) row = this._values.length;
        else this._checkRow(row);

        this._values.splice(row, 0, values);
        this._fireEvent('onDataRowAdded', row);
    }

    deleteRow(row: number): void {
        this._checkRow(row);

        const old = this._values[row];

        this._values.splice(row, 1);
        this._fireEvent('onDataRowDeleted', row, old);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    protected _checkRow(row: number): void {
        if (row < 0 || row > this._values.length) {
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
                d = new ChartData(p, src);
            } else if (isObj(src) && isArray(src.values)) {
                d = new ChartData(p, src.values);
                if (src.fieldName) d = src.fieldName;
            }
            this._map[p] = d;
        }
    }
}
