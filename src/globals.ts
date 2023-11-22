////////////////////////////////////////////////////////////////////////////////
// globals.ts
// 2021. 11. 25. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartControl } from "./ChartControl";
import { RcChartControl } from "./api/RcChartControl";
import { RcControl, RcElement } from "./common/RcControl";
import { Chart } from "./model/Chart";

const clazz: any = RcChartControl;

// [주의]main.ts에서 직접 구현하면 되지만, dldoc에서 global을 별도 구성할 수 있도록 자체 class에서 구현한다.
/**
 * RealChart 모듈 global.
 */
export class Globals {

    /**
     * RealChart 라이브러리 버전 정보를 리턴한다.
     * 
     * ```js
     * console.log(RealChart.getVersion()); // '1.1.2'
     * ```
     * 
     * @returns 버전 문자열
     */
    static getVersion(): string {
        return '$Version';
    }
    /**
     * true로 지정하면 차트 요소별 디버그 경계를 표시한다.\
     * 기본은 false 상태다.
     * 
     * ```js
     * RealChart.setDebugging(true);
     * ```
     * 
     * @param debug 디버깅 상태 표시 여부
     */
    static setDebugging(debug: boolean): void {
        RcElement.DEBUGGING = debug;
    }
    /**
     * false로 지정하면 시리즈 시작 애니메이션 등을 포함,
     * 모든 애니메이션을 실행하지 않는다.\
     * 기본은 animation이 가능한 상태다.
     * 
     * ```js
     * RealChart.setAnimatable(false);
     * ```
     * 
     * @param value 애니메이션 실행 여부
     */
    static setAnimatable(value: boolean): void {
        RcControl._animatable = value;
    }
    /**
     * 차트 설정 모델을 기빈으로
     * {@link rc.RcChartControl Chart 컨트롤} svg를 생성한 후,
     * 지정된 div 엘리먼트의 유일한 자식으로 포함시킨다.\
     * div 스타일에 지정된 padding을 제외한 전체 영역의 크기대로 표시된다.
     * 
     * ```js
     * const chart = RealChart.createChart(document, 'realchart', config);
     * ```
     * 
     * 
     * @param doc
     * @param container 컨트롤이 생성되는 div 엘리먼트나 id
     * @param config 차트 모델 설정 JSON
     * @returns 생성된 차트 컨트롤 객체
     */
    static createChart(doc: Document, container: string | HTMLDivElement, config: any): RcChartControl {
        const c = new ChartControl(doc, container);
        c.model = new Chart(config);
        return new (RcChartControl as any)(c);
    }
}
