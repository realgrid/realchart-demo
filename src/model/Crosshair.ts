////////////////////////////////////////////////////////////////////////////////
// Crosshair.ts
// 2023. 08. 07. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { NumberFormatter } from "../common/NumberFormatter";
import { SVGStyleOrClass } from "../common/Types";
import { IAxis } from "./Axis";
import { ChartItem } from "./ChartItem";

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
    LINE = 'line'
}

/**
 * 축 상에 crosshair의 정보를 표시하는 view 설정 모델.
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

export class Crosshair extends ChartItem {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    /**
     * 축 상에 crosshair의 정보를 표시하는 view.
     * 
     * @config
     */
    readonly flag: CrosshairFlag;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(public axis: IAxis) {
        super(axis.chart);

        this.flag = new CrosshairFlag(axis.chart);
        this.visible = false;
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
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
    numberFormat = '#,##0.#';

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    isBar(): boolean {
        return !this.axis.isContinuous() && this.type === CrosshairType.AUTO;
    }

    getFlag(length: number, pos: number): string {
        const v = this.axis.getValueAt(length, pos);
        return NumberFormatter.getFormatter(this.numberFormat).toStr(v);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}