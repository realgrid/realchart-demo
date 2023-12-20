////////////////////////////////////////////////////////////////////////////////
// CircleBarSeriesView.ts
// 2023. 11. 23. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { ElementPool } from "../../common/ElementPool";
import { PathBuilder } from "../../common/PathBuilder";
import { RcElement } from "../../common/RcControl";
import { CircleBarSeries } from "../../model/series/CircleBarSeries";
import { PointElement } from "../SeriesView";
import { BarSeriesViewBase } from "./BarSeriesView";

class CircleBarElement extends PointElement {

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    layout(cx: number, cy: number, rd: number): void {
        const pb = new PathBuilder();

        pb.circle(cx, cy, rd);
        this.setPath(pb.end());
    }
}

export abstract class CircleBarSeriesView extends BarSeriesViewBase<CircleBarSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-circlebar-series')
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _createBarPool(container: RcElement): ElementPool<PointElement> {
        return new ElementPool(container, CircleBarElement);
    }

    protected _layoutPointView(view: CircleBarElement, i: number, x: number, y: number, wPoint: number, hPoint: number): void {
        view.layout(x, y - hPoint / 2, hPoint / 2 - 1);
    }
}