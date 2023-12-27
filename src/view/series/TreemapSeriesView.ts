////////////////////////////////////////////////////////////////////////////////
// TreemapSeriesView.ts
// 2023. 08. 02. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { Color } from "../../common/Color";
import { ElementPool } from "../../common/ElementPool";
import { RcElement } from "../../common/RcControl";
import { Align } from "../../common/Types";
import { RectElement } from "../../common/impl/RectElement";
import { DataPoint } from "../../model/DataPoint";
import { TreeNode, TreemapSeries } from "../../model/series/TreemapSeries";
import { IPointView, PointLabelView, SeriesView } from "../SeriesView";
import { SeriesAnimation } from "../animation/SeriesAnimation";

class NodeView extends RectElement implements IPointView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    node: TreeNode;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, SeriesView.POINT_CLASS);
    }

    //-------------------------------------------------------------------------
    // IPointView
    //-------------------------------------------------------------------------
    get point(): DataPoint {
        return this.node.point;
    }

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    render(): void {
        this.setRect(this.node);
    }
}

class GroupView extends NodeView {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
}

export class TreemapSeriesView extends SeriesView<TreemapSeries> {

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _nodeViews: ElementPool<NodeView>;
    private _rootView: GroupView;

    //-------------------------------------------------------------------------
    // constructor
    //-------------------------------------------------------------------------
    constructor(doc: Document) {
        super(doc, 'rct-treemap-series')

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
        this._pointContainer.invert(this._inverted, height);

        if (this._rootView) {
            this.$_renderGroups(width, height);
        } else {
            this.$_renderLeafs(width, height);
        }
    }

    protected _runShowEffect(firstTime: boolean): void {
        firstTime && SeriesAnimation.reveal(this);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_renderLeafs(width: number, height: number): void {
        const series = this.model;
        const xAxis = series._xAxisObj;
        const yAxis = series._yAxisObj
        const inverted = this._inverted;
        const labels = series.pointLabel;
        const labelViews = this._labelViews();
        const yLen = inverted ? width : height;
        const xLen = inverted ? height : width;
        const { roots, leafs } = series.buildMap(xLen, yLen);
        const color = new Color(series._calcedColor);
        let labelView: PointLabelView;

        // buildMap()으로 leafs가 결정돼야 한다.
        labelViews.prepare(this.doc, this);

        this._nodeViews.prepare(leafs.length, (v, i, count) => {
            const m = leafs[i];
            const p = m.point;
            const g = m.parent;
            let c = color;

            if (g) {
                if (!g._color && g.point.color) {
                    c = g._color = new Color(g.point.color);
                } else if (g._color) {
                    c = g._color;
                }
            }

            v.node = m;
            v.setStyle('fill', c.brighten(m.index / count).toString());

            if (xAxis.reversed) m.x = xLen - m.x - m.width;
            if (yAxis.reversed) m.y = yLen - m.y - m.height;
            if (inverted) m.y = m.y - yLen;
            v.render();

            let x = m.x + m.width / 2;
            let y = m.y + m.height / 2;
            p.xPos = inverted ? -m.y - (m.height / 2) : x;
            p.yPos = inverted ? xLen - m.x - (m.width / 2) : y;

            // label
            if (labelViews && (labelView = labelViews.get(p, 0))) {
                const r = labelView.getBBox();

                // 너비나 높이가 모두 한글자는 표시할 수 있을 정도가 돼야 표시.
                if (labelView.setVis(m.width >= r.height && m.height >= r.height)) {
                // if (labelView.setVisible(m.width >= r.width && m.height >= r.height)) {
                    if (inverted) {
                        x = -m.y - m.height / 2 - r.width / 2;// (m.height + r.width) / 2;
                        y = xLen - m.x - (m.width + r.height) / 2;
                    } else {
                        x -= r.width / 2;
                        y -= r.height / 2;
                    }

                    labelView.layout(Align.CENTER).translate(x, y);
                }
            }
        })
    }

    private $_renderGroups(width: number, height: number): void {
    }
}