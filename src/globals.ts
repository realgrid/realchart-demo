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

// [주의]main.ts에서 직접 구현하면 되지만, dldoc에서 global을 별도 구성할 수 있도록 자체 class에서 구현한다.
/**
 * RealChart 모듈 global.
 */
export class Globals {

    static getVersion(): string {
        return '$Version';
    }
    static setDebugging(debug: boolean): void {
        RcElement.DEBUGGING = debug;
    }
    static setAnimatable(value: boolean): void {
        RcControl._animatable = value;
    }
    /**
     * {@link ChartControl Chart 컨트롤}을 생성한다.
     * 
     * ```
     * const chart = RealChart.createChart(document, 'realchart', config);
     * ```
     * 
     * @param doc
     * @param container 컨트롤이 생성되는 div 엘리먼트나 id
     * @param config 차트 모델 설정 JSON
     * @returns 생성된 차트 컨트롤 객체
     */
    static createChart(doc: Document, container: string | HTMLDivElement, config: any): RcChartControl {
        const c = new ChartControl(doc, container);
        c.model = new Chart(config);
        return new RcChartControl(c);
    }
}