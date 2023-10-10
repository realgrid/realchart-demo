////////////////////////////////////////////////////////////////////////////////
// CirclularGuageView.ts
// 2023. 09. 27. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { isNumber } from "../../common/Common";
import { NumberFormatter } from "../../common/NumberFormatter";
import { RectElement } from "../../common/impl/RectElement";
import { CircleGauge } from "../../model/gauge/CircleGauge";
import { CircularGauge } from "../../model/Gauge";
import { GaugeView, ValueGaugeView } from "../GaugeView";

export abstract class CircularGaugeView<T extends CircularGauge> extends ValueGaugeView<T> {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    valueOf = (target: CircleGauge, param: string, format: string): any => {
        const v = target.getParam(param);

        if (isNumber(v)) {
            return NumberFormatter.getFormatter(format || target.label.numberFormat).toStr(v);
        }
        return v;
    }

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, styleName: string) {
        super(doc, styleName);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _setBackgroundStyle(back: RectElement): void {
    }
}