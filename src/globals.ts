////////////////////////////////////////////////////////////////////////////////
// globals.ts
// 2021. 11. 25. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartControl } from "./ChartControl";
import { RcChartControl } from "./api/RcChartControl";
import { RcChartData } from "./api/RcChartData";
import { RcDebug } from "./common/Common";
import { RcControl, RcElement } from "./common/RcControl";
import { $_registerLocale, $_setLocale, IRcLocale } from "./common/RcLocale";
import { Utils } from "./common/Utils";
import { ChartData, IRcChartDataOptions } from "./data/ChartData";

// const clazz: any = RcChartControl;

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
    static setLocale(lang: string, config?: IRcLocale): void {
        if (config) {
            $_registerLocale(lang, config);    
        }
        $_setLocale(lang);
    }
    static registerLocale(lang: string, config: IRcLocale): void {
        $_registerLocale(lang, config);
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
        RcElement.DEBUGGING = RcDebug._debugging = debug;
    }
    /**
     * true로 지정하면 라이브러리 내부 메시지를 출력한다.
     * 
     * @param logging 로그 메시지 표시 여부
     */
    static setLogging(logging: boolean): void {
        Utils.LOGGING = logging;
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
     * div 전체 영역의 크기로 표시된다.
     * 
     * ```js
     * const chart = RealChart.createChart(document, 'realchart', config);
     * ```
     * 
     * @param doc
     * @param container 컨트롤이 생성되는 div 엘리먼트나 id
     * @param config 차트 모델 설정 JSON
     * @param animate 첫 로딩 animation을 실행한다.
     * @param calllback 차트가 모두 로드되고 첫 렌더링이 완료된 후 호출되는 콜백 함수.
     * @returns 생성된 차트 컨트롤 객체
     */
    static createChart(doc: Document, container: string | HTMLDivElement, config: any, animate = true, callback?: () => void): RcChartControl {
        const c =  new (RcChartControl as any)(new ChartControl(doc, container));
        c.load(config, animate, callback);
        return c;
    }
    /**
     * 차트 시리즈에 연결할 수 있는 데이터 저장소.<br/>
     * 저장되는 행은 json, array 또는 단일값일 수 있다.
     * 기본적으로 한 필드의 모든 행이 시리즈의 데이터로 연결되어 표시된다.
     * **rows**로 전달된 배열이 초기 데이터로 저장된다.
     * 이 때, rows 배열 항목들의 사본(shallow copy)이 저장되므로,
     * 차트 렌더링에 불필요한 값들은 최소화 해야 한다.
     * 
     * @param options 데이터 생성 옵션들.
     * @param rows 행 목록. 각 행은 json, array 또는 단일값일 수 있다.
     * @returns 차트데이터 객체.
     */
    static createData(options?: IRcChartDataOptions, rows?: any[]): RcChartData {
        return new (RcChartData as any)(new ChartData(options || {}, rows));
    }
}
