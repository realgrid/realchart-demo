////////////////////////////////////////////////////////////////////////////////
// globals.ts
// 2021. 11. 25. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartControl } from "./ChartControl";
import { Chart } from "./model/Chart";

// [주의]main.ts에서 직접 구현하면 되지만, dldoc에서 global을 별도 구성할 수 있도록 자체 class에서 구현한다.
/**
 * RealGrid-Touch 모듈 global.
 * <br>
 * "RealTouch" namespace로 접근한다.
 * 
 * ```
 *  // 데이터소스를 생성한다.
 *  const data = RealTouch.createData('dsMain', {
 *      fields: []
 *  });
 *  // 리스트컨트롤을 생성한다.
 *  const list = RealTouch.createList(document, 'dlist');
 *  // 컨트롤 설정 및 옵션
 *  list.setConfig({
 *      props: {},
 *      options: {}
 *  });
 *  // 컨트롤에 데이터를 연결한다.
 *  list.data = data;
 * ```
 * 
 * @see concepts.about RealGrid-Touch 개요
 */
export class Globals {

    static getVersion(): string {
        return '$Version';
    }
    /**
     * {@link RtListControl 리스트 컨트롤}을 생성한다.
     * 
     * @see createListData
     * @see createDataView
     * @see createDataLink
     * 
     * @param doc
     * @param container 리스트컨트롤이 생성되는 div 엘리먼트나 id
     * @param renderMode 
     * @returns 
     */
    static createChartControl(doc: Document, container: string | HTMLDivElement): ChartControl {
        return new ChartControl(doc, container);
    }
    /**
     * 차트 객체를 생성한다.
     * 
     * @returns 
     */
    static loadChart(source: any): Chart {
        return new Chart(source);
    }
}