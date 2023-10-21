////////////////////////////////////////////////////////////////////////////////
// Title.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isString } from "../common/Common";
import { Align, AlignBase, SVGStyleOrClass, VerticalAlign, isNull } from "../common/Types";
import { ChartItem } from "./ChartItem";

/**
 * 차트 타이틀 설정 모델.
 * 
 * @config chart.title
 */
export class Title extends ChartItem {

    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    /**
     * 제목 텍스트
     * @config 
     */
    text = 'Title';
    /**
     * 정렬 기준.
     * 
     * @config
     */
    alignBase = AlignBase.PLOT;
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
     * @config
     */
    text = '';
}