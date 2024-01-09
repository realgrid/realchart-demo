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
 * 차트 제목(title) 설정 모델.<br/>
 * 기본적으로 차트 중앙 상단에 표시되지만 {@link align}, {@link verticalAlign} 등으로 위치를 변경할 수 있다.<br/>
 * {@link guide.title 타이틀 개요} 페이지를 참조한다.
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
    /**
     * 제목 텍스트.
     * 
     * @config 
     */
    text = 'Title';
    /**
     * 정렬 기준.
     * 시리즈들이 그려지는 plotting 영역이나,
     * 차트 전체 영역을 기준으로 할 수 있다. 
     * 또, {@link config.subtitle 부제목}인 경우 제목을 기준으로 위치를 지정할 수 있다.
     * 
     * @config
     */
    alignBase = AlignBase.BODY;
    /**
     * 수평 정렬.
     * 
     * @config
     */
    align = Align.CENTER;
    /**
     * 수직 정렬.
     * 
     * @config
     */
    verticalAlign = VerticalAlign.MIDDLE;
    /**
     * 배경 스타일셋 혹은 css selector.
     * 
     * @config
     */
    backgroundStyle: SVGStyleOrClass;
    /**
     * 주 제목과 부 제목이 표시되는 영역과 차트 본체 등 과의 간격.<br/>
     * 주 제목이 표시되면 (부 제목의 값은 무시되고)주 제목의 값을 사용하고,
     * 부 제목만 표시될 때는 부 제목의 값을 사용한다.
     * 
     * @config
     */
    gap = 10;

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

/**
 * 부제목 표시 위치.
 */
export enum SubtitlePosition {
    /**
     * 주제목 아래쪽에 표시.
     * 
     * @config
     */
    BOTTOM = 'bottom',
    /**
     * 주제목 오른쪽에 표시.
     * 
     * @config
     */
    RIGHT = 'right',
    /**
     * 주제목 왼쪽에 표시.
     * 
     * @config
     */
    LEFT = 'left',
    /**
     * 주제목 위쪽에 표시.
     * 
     * @config
     */
    TOP = 'top'
}

/**
 * 차트 부제목(subtitle) 설정 모델.<br/>
 * 기본적으로 주 제목(title)의 설정을 따르고, 몇가지 속성들이 추가된다.<br/>
 * {@link guide.subtitle 부제목 개요} 페이지를 참조한다.
 * 
 * @config chart.subtitle
 */
export class Subtitle extends Title {

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    verticalAlign = VerticalAlign.BOTTOM;

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    /**
     * 표시 위치.
     * 
     * @config
     */
    position = SubtitlePosition.BOTTOM;
    /**
     * 부제목 텍스트
     * 
     * @config
     */
    text = '';
    /**
     * 주 제목과 사이의 간격.
     * 
     * @config
     */
    titleGap = 2;
}