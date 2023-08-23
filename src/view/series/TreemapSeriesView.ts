////////////////////////////////////////////////////////////////////////////////
// TreemapSeriesView.ts
// 2023. 08. 02. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Color } from "../../common/Color";
import { ElementPool } from "../../common/ElementPool";
import { PathElement, RcElement } from "../../common/RcControl";
import { SvgShapes } from "../../common/impl/SvgShape";
import { DataPoint } from "../../model/DataPoint";
import { TreeNode, TreemapSeries } from "../../model/series/TreemapSeries";
import { IPointView, PointLabelView, SeriesView } from "../SeriesView";
import { SlideAnimation } from "../animation/SeriesAnimation";

class NodeView extends PathElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    node: TreeNode;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS + ' rct-treemap-point');
    }

    get point(): DataPoint {
        return this.node.point;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    render(): void {
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
    protected _lazyPrepareLabels(): boolean {
        return true;
    }

    protected _getPointPool(): ElementPool<RcElement> {
        return this._nodeViews;
    }

    protected _prepareSeries(doc: Document, model: TreemapSeries): void {
    }

    protected _renderSeries(width: number, height: number): void {
        const series = this.model;
        const labels = series.pointLabel;
        const labelViews = this._labelViews();
        const nodes = series.buildMap(width, height);
        const color = new Color(series.color);
        let labelView: PointLabelView;

        // buildMap()으로 leafs가 결정돼야 한다.
        labelViews.prepare(this.doc, series);

        this._nodeViews.prepare(nodes.length, (v, i, count) => {
            const m = nodes[i];
            const g = m.parent;
            let c = color;

            if (g) {
                if (!g._color && g.point.color) {
                    c = g._color = new Color(g.point.color);
                }
                if (g._color) {
                    c = g._color;
                }
            }

            v.node = m;
            v.setStyle('fill', c.brighten(m.index / count).toString());
            v.render();
            m.point.xPos = m.x + m.width / 2;
            m.point.yPos = m.y + m.height / 2;

            // label
            if (labelViews && (labelView = labelViews.get(m.point, 0))) {
                const r = labelView.getBBounds();

                // 너비나 높이가 모두 한글자는 표시할 수 있을 정도가 돼야 표시.
                if (labelView.setVisible(m.width >= r.height && m.height >= r.height)) {
                // if (labelView.setVisible(m.width >= r.width && m.height >= r.height)) {
                    labelView.translate(m.x + m.width / 2 - r.width / 2, m.y + m.height / 2 - r.height / 2);
                }
            }
        })
    }

    protected _runShowEffect(firstTime: boolean): void {
        firstTime && new SlideAnimation(this);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
}