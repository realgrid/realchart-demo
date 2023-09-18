////////////////////////////////////////////////////////////////////////////////
// RcChartControl.ts
// 2023. 09. 15. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartControl } from "../ChartControl";

const funcs = {
    'load': '',
    'refresh': ''
}

/**
 * RealChart 컨트롤.
 */
export class RcChartControl {

    private _proxy: ChartControl;

    constructor(control: ChartControl) {
        this._proxy = new Proxy(control, {
            get(target, key, receiver) {
                if (key in funcs) {
                    return target[key].bind(target);
                }
            }
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