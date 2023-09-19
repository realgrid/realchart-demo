////////////////////////////////////////////////////////////////////////////////
// RcChartModel.ts
// 2023. 09. 19. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2021-2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Chart } from "../model/Chart";

const props = {
};
const funcs = {
};

/**
 * RealChart chart 모델.
 */
export class RcChartModel {

    private _proxy: Chart;

    constructor(model: Chart) {
        this._proxy = new Proxy(model, {
            get(target, key, receiver) {
                if (key in props) {
                    return target[key]
                }
                if (key in funcs) {
                    return target[key].bind(target);
                }
            }
        });
    }
}