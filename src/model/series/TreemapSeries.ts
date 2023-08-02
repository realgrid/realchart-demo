////////////////////////////////////////////////////////////////////////////////
// TreemapSeries.ts
// 2023. 08. 01. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { pickProp } from "../../common/Common";
import { toStr } from "../../common/Types";
import { DataPoint } from "../DataPoint";
import { ISeries, SeriesMarker } from "../Series";
import { BoxSeries } from "./BarSeries";

export class TreemapSeriesPoint extends DataPoint {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    id: string;
    group: string;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // properties
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    protected _readArray(series: TreemapSeries, v: any[]): void {
        super._readArray(series, v);

        this.id = toStr(v[+series.idField]);
        this.group = toStr(v[+series.groupField]);
    }

    protected _readObject(series: TreemapSeries, v: any): void {
        super._readObject(series, v);

        this.id = toStr(v[series.idField]);
        this.group = toStr(v[series.groupField]);
    }
}

class Node {
    parent: Node;
    children: Node[];

    constructor(public point: TreemapSeriesPoint) {}
}

export enum TreemapAlgorithm {
    /**
     * 최대한 정사각형에 가까운 비율을 유지한다.
     * <br>
     * 사용자가 크기를 비교하기에 유리하다.
     */
    SQUARIFY = 'squarify',
    STRIP = 'strip',
    SLICE_DICE = 'sliceDice'
}

/**
 * 1. 본래 하드 드라이브의 파일 분포 상태를 표시하기 위해 고안됨.
 * 2. node & link 스타일의 전통적 표시 방식은 공간을 많이 필요로 한다.
 * 3. 일정 표시 공간을 100% 사용한다.
 * 4. 초기 공간을 재귀적으로 나누어 가면서 구성한다.
 * 
 * [알고리즘]
 * 1. slice and dice
 *    - 가장 단순하다.
 *    - 각 level에서 자르는 방향을 바꾼다.
 */
export class TreemapSeries extends BoxSeries {

    //-------------------------------------------------------------------------
    // property fields
    //-------------------------------------------------------------------------
    idField = 'id';
    groupField = 'group';
    algorithm = TreemapAlgorithm.SLICE_DICE;

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    private _roots: Node[];
    private _leafs: Node[];
    private _map: {[id: string]: Node} = {};

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'treemap';
    }

    canCategorized(): boolean {
        return true;
    }

    protected _createPoint(source: any): DataPoint {
        return new TreemapSeriesPoint(source);
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        this.$_buildMap(this._visPoints as TreemapSeriesPoint[]);
    }


    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_buildMap(pts: TreemapSeriesPoint[]): void {
        const roots = this._roots = this.$_buildTree(pts);
        console.log(roots, this._leafs);
    }

    private $_buildTree(pts: TreemapSeriesPoint[]): Node[] {
        const roots: Node[] = [];
        const leafs = this._leafs = [];
        const map = this._map;

        pts.forEach(p => {
            const node = new Node(p);

            if (p.id) {
                map[p.id] = node;
            } 
            if (p.group) {
                leafs.push(node);
            } else {
                roots.push(node);
            }
        })

        for (let i = leafs.length - 1; i >= 0; i--) {
            const node = leafs[i];
            const g = map[node.point.group];

            if (node.parent = g) {
                if (!g.children) g.children = [];
                g.children.push(node);
                if (node.children) leafs.splice(i, 1);
            } else {
                roots.push(node);
                leafs.splice(i, 1);
            }
        };
        return roots;
    }
}