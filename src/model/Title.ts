////////////////////////////////////////////////////////////////////////////////
// Title.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isString } from "../common/Common";
import { Align, AlignBase, SVGStyleOrClass, VerticalAlign, isNull } from "../common/Types";
import { IChart } from "./Chart";
import { ChartItem } from "./ChartItem";

/**
 * 차트 타이틀 설정 모델.
 * 
 * @config chart.title
 */
export class Title extends ChartItem {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(chart: IChart) {
        super(chart, true);
    }

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    verticalAlign = VerticalAlign.MIDDLE;
    /**
     * 제목 텍스트.
     * 
     * @config 
     */
    text = 'Title';
    /**
     * 정렬 기준.
     * 
     * @config
     */
    alignBase = AlignBase.PLOT;
    /**
     * 정렬.
     * 
     * @config
     */
    align = Align.CENTER;
    /**
     * 배경 스타일 셋.
     * 
     * @config
     */
    backgroundStyle: SVGStyleOrClass;
    /**
     * 타이틀과 부제목이 표시되는 영역과 차트 본체 등 과의 간격.
     */
    sectionGap = 10;

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

export enum SubtitlePosition {
    BOTTOM = 'bottom',
    RIGHT = 'right',
    LEFT = 'left',
    TOP = 'top'
}

/**
 * 차트 sub 타이틀 설정 모델.
 * 
 * @config chart.subtitle
 */
export class Subtitle extends Title {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    position = SubtitlePosition.BOTTOM;
    verticalAlign = VerticalAlign.BOTTOM;
    /**
     * 부제목 텍스트
     * 
     * @config
     */
    text = '';
    /**
     * 제목과 사이의 간격.
     * 
     * @config
     */
    gap = 2;
}