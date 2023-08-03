////////////////////////////////////////////////////////////////////////////////
// TreemapSeriesView.ts
// 2023. 08. 02. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Color } from "../../common/Color";
import { ElementPool } from "../../common/ElementPool";
import { PathElement } from "../../common/RcControl";
import { SvgShapes } from "../../common/impl/SvgShape";
import { TreeNode, TreemapSeries, TreemapSeriesPoint } from "../../model/series/TreemapSeries";
import { PointLabelView, SeriesView } from "../SeriesView";

class NodeView extends PathElement {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    node: TreeNode

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-Treemap-series-marker');
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    render(): void {
        const n = this.node;

        this.setPath(SvgShapes.rect(this.node));
    }
}

export class TreemapSeriesView extends SeriesView<TreemapSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _nodeViews: ElementPool<NodeView>;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-Treemap-series')

        this._nodeViews = new ElementPool(this._pointContainer, NodeView);
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _prepareSeries(doc: Document, model: TreemapSeries): void {
    }

    protected _renderSeries(width: number, height: number): void {
        const series = this.model;
        const labels = series.pointLabel;
        const labelVis = labels.visible;
        const labelViews = this._labelContainer;
        const nodes = series.buildMap(width, height);
        const sum = series._sum;
        const color = new Color(series.color);
        let labelView: PointLabelView;

        this._nodeViews.prepare(nodes.length, (v, i, count) => {
            const m = nodes[i];

            v.node = m;
            v.setStyle('fill', color.brighten(m.index / count).toString());
            v.render();

            // label
            if (labelVis && (labelView = labelViews.get(m.point, 0))) {
                const r = labelView.getBBounds();

                labelView.translate(m.x + m.width / 2 - r.width / 2, m.y + m.height / 2 - r.height / 2);
            }
        })
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}