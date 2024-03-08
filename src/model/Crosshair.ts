////////////////////////////////////////////////////////////////////////////////
// Crosshair.ts
// 2023. 08. 07. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { IRcDataPoint } from '../api/RcChartModels';
import { isFunc } from "../common/Common";
import { DatetimeFormatter } from "../common/DatetimeFormatter";
import { NumberFormatter } from "../common/NumberFormatter";
import { SVGStyleOrClass, _undef } from "../common/Types";
import { IAxis } from "./Axis";
import { ChartItem } from "./ChartItem";
import { DataPoint } from "./DataPoint";

/**
 * 크로스헤어 표시 방식.<br/>
 * 
 * @config
 */
export enum CrosshairType {
    /**
     * 카테고리 축이면 bar, 연속 축이면 line으로 표시한다.
     * 
     * @config
     */
    AUTO = 'auto',
    /**
     * 항상 line으로 표시한다.
     * 
     * @config
     */
    LINE = 'line',
    // /**
    //  * 항상 bar로 표시한다.
    //  * 
    //  * @config
    //  */
    // BAR = 'bar'
}

/**
 * 축 상에 crosshair의 정보를 표시하는 view 설정 모델.
 * 
 * @config
 */
export class CrosshairFlag extends ChartItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    prefix: string;
    suffix: string;
    /**
     * flag에 표시될 텍스트 형식.
     * <br>
     * 별도로 지정하지 않으면 현재 위치에 해당하는 축 값을 표시한다.
     * Category 축인 경위 위치에 해당하는 category 이름을 표시한다.
     * 
     * @config
     */
    format: string;
    /**
     * flag에 표시되는 text의 스타일.
     * 
     * @config
     */
    textStyles: SVGStyleOrClass;
    minWidth = 50;
}

export interface ICrosshairCallbackArgs {
    axis: object;
    pos: number;
    flag: string;
    points: IRcDataPoint[];
}

export type CrosshairChangeCallback = (args: ICrosshairCallbackArgs) => void;

/**
 * 직선 또는 bar 형태로 축 위의 마우스 위치를 표시하는 구성 요소 모델.
 */
export class Crosshair extends ChartItem {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _args: ICrosshairCallbackArgs;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public axis: IAxis) {
        super(axis.chart, true);

        this.flag = new CrosshairFlag(axis.chart, true);
        this.visible = false;
        this._args = {
            axis: _undef,
            pos: _undef,
            flag: _undef,
            points: _undef
        };
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 축 상에 crosshair의 정보를 표시하는 view.
     * 
     * @config
     */
    readonly flag: CrosshairFlag;
    /**
     * 표시 방식.
     * 
     * @config
     */
    type = CrosshairType.AUTO;
    /**
     * true면 마우스 위치를 따라 항상 표시하고, false면 data point 위에 마우스가 있을 때만 표시한다.
     * 
     * @config
     */
    showAlways = true;
    /**
     * false면 type이 'line'인 경우 데이터포인트나 카테고리 단위로 이동한다.
     * 
     * @config
     */
    followPointer = true;
    /**
     * 표시되는 값이 숫자일 때 사용되는 표시 형식.
     * 
     * @config
     */
    numberFormat = '#,##0.#';
    /**
     * 표시되는 값이 날짜(시간)일 때 사용되는 표시 형식.
     * 
     * @config
     */
    timeFormat = 'yyyy-MM-dd HH:mm'
    onChange: any;
    /**
     * x축 crosshair 영역에 포함된 marker 데이터포인트들이
     * 마우스 아래 있을 때와 동일한 효과를 표시한다.
     * 
     * @config
     */
    markerHovering = false;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isBar(): boolean {
        return !this.axis.continuous() && this.type !== CrosshairType.LINE;
        // return !this.axis.continuous() && this.type === CrosshairType.AUTO;
        // return this.type === CrosshairType.BAR || !this.axis.continuous() && this.type === CrosshairType.AUTO;
    }

    getFlag(length: number, pos: number): string {
        const v = this.axis.axisValueAt(length, pos);

        if (v instanceof Date) {
            return DatetimeFormatter.getFormatter(this.timeFormat).toStr(new Date(v), this.chart.startOfWeek);
        } else {
            return NumberFormatter.getFormatter(this.numberFormat).toStr(v);
        }
    }

    moved(pos: number, flag: string, points: DataPoint[]): void {
        if (this.onChange) {
            this._args.pos = pos;
            this._args.flag = flag;
            this._args.points = points.map(p => p?.proxy());
            this.onChange(this._args);
        }
    }

    _setAxis(axis: any): void {
        this._args.axis = axis;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected override _doLoadSimple(source: any): boolean {
        if (isFunc(source)) {
            this.visible = true;
            this.onChange = source;
            return true;
        }
        return super._doLoadSimple(source);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}