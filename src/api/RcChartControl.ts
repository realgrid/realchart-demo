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
    'setAnimatable': ''
};

/**
 * RealChart 컨트롤.
 */
export class RcChartControl {

    private _proxy: ChartControl;

    constructor(control: ChartControl) {
        this._proxy = new Proxy(control, {
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
        });
    }

    /**
     * 기존 설정을 지우고 새로운 config로 차트를 구성한다.
     */
    load(config: any, animate?: boolean): void {
        this._proxy.load(config, animate);
    }

    /**
     * 차트를 다시 그린다.
     */
    refresh(): void {
        this._proxy.refresh();
    }
}