////////////////////////////////////////////////////////////////////////////////
// RcChartControl.ts
// 2023. 09. 15. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartControl } from "../ChartControl";
// import { RcChartModel } from "./RcChartModel";

const props = {
    // 'animatable': ''
};
const funcs = {
    'load': '',
    'refresh': '',
    'setAnimatable': '',
    'updateGauge': '',
    // 'chartView': ''
};

/**
 * RealChart 컨트롤.
 */
export class RcChartControl {

    private $_p: ChartControl;

    constructor(control: ChartControl) {
        // this.$_p = control;
        this.$_p = new Proxy(control, {
            get(target, key, receiver) {
                // if (key === 'model') {
                //     return target[key];
                // }
                // if (key in props) {
                //     return target[key];
                // } else 
                if (key in funcs) {
                    return target[key].bind(target);
                }
            },
            // set(target, p, newValue, receiver): boolean {
            //     if (p in props) {
            //         target[p] = newValue;
            //         return true;
            //     }
            // },
            has(target, key): boolean {
                return key in funcs;
            }
        });
    }

    /**
     * 기존 설정 모델을 제거하고 새로운 config로 차트를 구성한다.
     */
    load(config: any, animate?: boolean): void {
        this.$_p.load(config, animate);
    }

    /**
     * 차트를 다시 그린다.
     */
    refresh(): void {
        this.$_p.refresh();
    }

    /**
     * 게이지의 값들을 변경한다.
     */
    updateGauge(gauge: string, values: any): void {
        this.$_p.updateGauge(gauge, values);
    }
}