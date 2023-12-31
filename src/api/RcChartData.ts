////////////////////////////////////////////////////////////////////////////////
// RcChartData.ts
// 2023. 12. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartData } from "../data/ChartData";

/**
 * Char data model.
 */
export class RcChartData {

    private $_p: ChartData;

    /** 
     * @internal 
     */
    private constructor(control: ChartData) {
        this.$_p = control;
    }

    get rowCount(): number {
        return this.$_p._rows.length;
    }

    getValue(row: number, field: string): any {
        return this.$_p.getValue(row, field);
    }

    setValue(row: number, field: string, value: any): void {
        this.$_p.setValue(row, field, value);
    }

    getValues(field: string, fromRow = 0, toRow = -1): any[] {
        return this.$_p.getValues(field, fromRow, toRow);
    }

    getRow(row: number): any {
        return this.$_p.getRow(row);
    }

    addRow(values: any, row = -1): void {
        this.$_p.addRow(values, row);
    }

    deleteRow(row = -1): void {
        this.$_p.deleteRow(row);
    }
}