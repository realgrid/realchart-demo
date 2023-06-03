////////////////////////////////////////////////////////////////////////////////
// ChartControl.ts
// 2023. 05. 28. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { RcControl } from "./common/RcControl";
import { RcEditTool } from "./common/RcEditTool";
import { IRect } from "./common/Rectangle";

export class ChartControl extends RcControl {

    //-------------------------------------------------------------------------
    // consts
    //-------------------------------------------------------------------------
    static readonly CLASS_NAME = 'rtc-control';

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document, container: string | HTMLDivElement) {
        super(doc, container, ChartControl.CLASS_NAME);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    useImage(src: string): void {
        throw new Error("Method not implemented.");
    }

    protected _creatDefaultTool(): RcEditTool {
        throw new Error("Method not implemented.");
    }

    protected _doInitModel(): void {
        throw new Error("Method not implemented.");
    }

    protected _doInitView(doc: Document): void {
        throw new Error("Method not implemented.");
    }

    protected _doRender(bounds: IRect): void {
        throw new Error("Method not implemented.");
    }
}