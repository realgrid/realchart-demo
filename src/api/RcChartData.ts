////////////////////////////////////////////////////////////////////////////////
// RcChartData.ts
// 2023. 12. 31. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartData } from "../data/ChartData";

/**
 * 차트 전용 데이터 소스 모델.<br/>
 * 시리즈 {@link config.base.series#data data} 속성에 값 배열을 직접 지정하는 대신,
 * 이 데이터소스를 참조할 수 있다.
 */
export class RcChartData {

    private $_p: ChartData;

    /** 
     * @internal 
     */
    private constructor(control: ChartData) {
        this.$_p = control;
    }

    /**
     * 행 수.
     */
    get rowCount(): number {
        return this.$_p._rows.length;
    }
    /**
     * 지정한 행의 필드 값을 리턴한다.
     * 
     * ```js
     * console.log(data.getValue(0, 'name'));
     * ```
     * 
     * @param row 행 번호
     * @param field 필드 이름
     * @returns 필드 값
     */
    getValue(row: number, field: string): any {
        return this.$_p.getValue(row, field);
    }
    /**
     * 지정한 행의 필드 값을 변경한다.<br/>
     * 이 데이터에 연결된 시리즈의 해당 데이터포인트의 값이 변경된다.
     * 
     * ```js
     * const {row, field} = getField();
     * data.setValue(row, field, data.getValue(row, field) + 1);
     * ```
     * 
     * @param row 행 번호
     * @param field 필드 이름
     */
    setValue(row: number, field: string, value: any): void {
        this.$_p.setValue(row, field, value);
    }
    getValues(field: string, fromRow = 0, toRow = -1): any[] {
        return this.$_p.getValues(field, fromRow, toRow);
    }
    getRow(row: number): any {
        return this.$_p.getRow(row);
    }
    /**
     * 지정한 필드 값 목록으로 구성된 신규 행을 지정한 위치에 추가한다.<br/>
     * 이 데이터에 연결된 시리즈의 데이터포인트가 추가된다.
     * 
     * ```js
     * data.addRow({
     *   field1: 'value1',
     *   field2: 123,
     *   ...
     * });
     * ```
     * 
     * @param values 필드 값 목록.
     * @param row 행 번호. 기본값 -1. 0보다 작은 값이면 마지막 행 다음에 추가한다.
     */
    addRow(values: any, row = -1): void {
        this.$_p.addRow(values, row);
    }
    /**
     * 지정한 위치의 행이 삭제된다.<br/>
     * 이 데이터에 연결된 시리즈의 해당 데이터포인트가 제거된다.
     * 
     * ```js
     * data.deleteRow(data.rowCount - 1);
     * ```
     * 
     * @param row 행 번호. 기본값 -1. 0보다 작은 값이면 마지막 행이 삭제된다.
     */
    deleteRow(row = -1): void {
        this.$_p.deleteRow(row);
    }
}