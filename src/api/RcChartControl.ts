////////////////////////////////////////////////////////////////////////////////
// RcChartControl.ts
// 2023. 09. 15. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ChartControl } from "../ChartControl";

const funcs = {
    'update': ''
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

    update(config: any, animate?: boolean): void {
        this._proxy.update(config, animate);
    }
}