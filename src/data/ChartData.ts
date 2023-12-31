////////////////////////////////////////////////////////////////////////////////
// ChartData.ts
// 2023. 12. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isArray, isString } from "../common/Common";
import { locale } from "../common/RcLocale";
import { RcEventProvider } from "../common/RcObject";
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
 * 
 * @config
 */
export interface IRcChartDataOptions {
    /**
     * 배열로 row 값들로 지정될 때, 각 항목에 해당되는 필드 이름들.\
     * 이 이름들을 속성으로 갖는 json 객체로 저장된다.
     * 
     * 기본값은 ['x', 'y', 'z'];
     */
    fields?: string[];
    /**
     * row가 단일 값일 때 필드 이름.\
     * 이 필드 이름 속성을 갖는 json 객체로 저장된다.
     * 
     * 기본값은 'y'.
     * 
     * @config
     */
    field?: string;
}

/**
 */
export class ChartData extends RcEventProvider<IChartDataListener> {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _rows: any[] = [];
    private _fields: string[];
    private _field: string;
    private _fieldMap: {[name: string]: number};

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(options: IRcChartDataOptions, rows: any[]) {
        super();

        this.$_buildOptions(options || {});

        if (isArray(rows)) {
            rows.forEach(row => this._rows.push(this.$_readRow(row)));
        }
    }

    private $_buildOptions(options: IRcChartDataOptions): void {
        const f = options.fields;
        let flds: string[];

        if (isArray(f)) {
            flds = f.slice();
        } else if (isString(f)) {
            flds = [f];
        } else {
            flds = ['x', 'y', 'z'];
        }
        this._fields = flds;
        this._field = options.field || 'y';
        this._fieldMap = {};
        for (let i = 0; i < flds.length; i++) {
            this._fieldMap[flds[i]] = i;
        }
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

    private $_readRow(vals: any): object {
        let row = {};

        if (isArray(vals)) {
            for (let i = 0; i < this._fields.length; i++) {
                row[this._fields[i]] = vals[i];
            }
        } else if (isObj(vals)) {
            Object.assign(row, vals);
        } else {
            row[this._field] = vals;
        }
        return row;
    }

    getValue(row: number, field: string): any {
        this._checkRow(row);
        return this._rows[row][field];
    }
    
    // row를 json으로 변경한다.
    setValue(row: number, field: string, value: any): void {
        this._checkRow(row);

        const vals = this._rows[row];
        const old = vals[field];

        if (value !== old) {
            vals[field] = value;
            this._rows[row] = vals;
            this._fireEvent('onDataValueChanged', row, field, value, old);
            this._changed();
        }
    }

    getValues(field: string, fromRow: number, toRow: number): any[] {
        const rows = this._rows;
        const vals = [];

        if (isNaN(fromRow) || fromRow < 0) fromRow = 0;
        if (isNaN(toRow) || toRow < 0 || toRow > rows.length) toRow = rows.length; 

        for (let r = fromRow; r < toRow; r++) {
            vals.push(rows[r][field]);
        }
        return vals;
    }

    getRow(row: number): object {
        this._checkRow(row);

        return Object.assign({}, this._rows[row]);
    }

    addRow(values: any, row: number): void {
        if (isNaN(row) || row < 0) row = this._rows.length;
        else this._checkRow(row);

        this._rows.splice(row, 0, values);
        this._fireEvent('onDataRowAdded', row);
        this._changed();
    }

    deleteRow(row: number): void {
        this._checkRow(row);

        const old = this._rows[row];

        this._rows.splice(row, 1);
        this._fireEvent('onDataRowDeleted', row, old);
        this._changed();
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

    protected _changed(): void {
        this._fireEvent('onDataChanged');
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
