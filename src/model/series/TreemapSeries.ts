////////////////////////////////////////////////////////////////////////////////
// TreemapSeries.ts
// 2023. 08. 01. created by woori
// -----------------------------------------------------------------------------
// Copyright (c) 2023 Wooritech Inc.
// All rights reserved.
////////////////////////////////////////////////////////////////////////////////

import { toStr } from "../../common/Types";
import { DataPoint } from "../DataPoint";
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

interface IArea {
    width: number;
    height: number;
}

export class TreeNode {
    parent: TreeNode;
    children: TreeNode[];
    index: number;
    value: number;
    x: number;
    y: number;
    width: number;
    height: number;

    area: IArea;

    constructor(public point: TreemapSeriesPoint) {}
}

export enum TreemapAlgorithm {
    /**
     * 최대한 정사각형에 가까운 비율을 유지한다.
     * <br>
     * 사용자가 크기를 비교하기에 유리하다.
     */
    SQUARIFY = 'squarify',
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
    algorithm = TreemapAlgorithm.SQUARIFY;
    /**
     * 수직, 수평으로 방향을 바꾸어 가며 배치한다.
     */
    alternate = true;
    /**
     * 시작 방향.
     * <br>
     * 지정하지 않으면 ploting 영역의 너비/높이 비율 기준으로 정해진다.
     */
    startDir: 'vertical' | 'horizontal';

    //-------------------------------------------------------------------------
    // fields
    //-------------------------------------------------------------------------
    _roots: TreeNode[];
    _leafs: TreeNode[];
    private _map: {[id: string]: TreeNode} = {};
    _sum = 0;

    //-------------------------------------------------------------------------
    // methods
    //-------------------------------------------------------------------------
    buildMap(width: number, height: number): TreeNode[] {

        function visit(node: TreeNode): void {
            if (node.children) {
                let sum = 0;

                node.children.forEach((c, i) => {
                    c.index = i;
                    visit(c);
                    sum += c.value;
                })
                node.value = sum;
                node.children = node.children.sort((n1, n2) => n1.value - n2.value);
            } else {
                leafs.push(node);
                node.value = node.point ? node.point.yValue : 0;
            }
        }

        const vertical = this.startDir === 'vertical' || height > width;
        const leafs = this._leafs = [];

        this._sum = 0;
        this._roots = this._roots.sort((n1, n2) => n1.value - n2.value);
        this._roots.forEach((node, i) => {
            node.index = i;
            visit(node);
            this._sum += node.value;
        });

        (this[this.algorithm] || this.squarify).call(this, this._roots, width, height, vertical);
        return this._leafs;
    }

    //-------------------------------------------------------------------------
    // overriden members
    //-------------------------------------------------------------------------
    type(): string {
        return 'treemap';
    }

    needAxes(): boolean {
        return false;
    }

    protected _createPoint(source: any): DataPoint {
        return new TreemapSeriesPoint(source);
    }

    protected _doPrepareRender(): void {
        super._doPrepareRender();

        this._roots = this.$_buildTree(this._visPoints as TreemapSeriesPoint[]);
    }

    //-------------------------------------------------------------------------
    // internal members
    //-------------------------------------------------------------------------
    private $_buildTree(pts: TreemapSeriesPoint[]): TreeNode[] {
        const roots: TreeNode[] = [];
        const leafs = [];
        const map = this._map;

        pts.forEach(p => {
            const node = new TreeNode(p);

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

    private $_squarify(nodes: TreeNode[], x: number, y: number, width: number, height: number, dir: number, total: number): void {
        const n = nodes.length;
        const totalArea = width * height;
        let prevRate = Number.MAX_VALUE;
        let node: TreeNode;
        let x1 = x;
        let y1 = y;
        let w = width;
        let h = height;
        const list: TreeNode[] = [];
        let wNode: number;
        let hNode: number;
        let area: number;
        let rate: number;
        let sum: number;

        for (let i = 0; i < n; i++) {
            node = nodes[i];

            if (list.length == 0) {
                area = node.value * totalArea / total;
                if (dir === 1) {
                    hNode = h;
                    wNode = area / hNode;
                } else {
                    wNode = w;
                    hNode = area / wNode;
                }
                sum = node.value;
            } else {
                sum += node.value;
                area = sum * totalArea / total;
                if (dir === 1) {
                    wNode = area / h;
                    hNode = h * node.value / sum;
                } else {
                    hNode = area / w;
                    wNode = w * node.value / sum;
                }
            }
            rate = Math.max(wNode / hNode, hNode / wNode);

            if (i < n - 1 && rate > prevRate) {
                sum -= node.value;
                area = totalArea * sum / total;

                if (dir === 1) {
                    hNode = h;
                    wNode = area / hNode;
                } else {
                    wNode = w;
                    hNode = area / wNode;
                }

                list.forEach(node => {
                    if (dir === 1) {
                        node.y = y;
                        node.x = x1;
                        node.height = h * node.value / sum;
                        node.width = wNode;
                        y += node.height;
                    } else {
                        node.x = x;
                        node.y = y1;
                        node.width = w * node.value / sum;
                        node.height = hNode;
                        x += node.width;
                    }
                })

                // 초기화
                list.length = 0;
                prevRate = Number.MAX_VALUE;
                if (dir === 1) {
                    y = y1;
                    x1 += wNode;
                } else {
                    x = x1;
                    y1 += hNode;
                }
                i--;
                // dir = 1 - dir;
            } else if (i === n - 1) {
                area = totalArea * sum / total;
                if (dir === 1) {
                    hNode = h;
                    wNode = area / hNode;
                } else {
                    wNode = w;
                    hNode = area / wNode;
                }

                list.push(node);
                list.forEach(node => {
                    if (dir === 1) {
                        node.y = y;
                        node.x = x1;
                        node.height = h * node.value / sum;
                        node.width = wNode;
                        y += node.height;
                    } else {
                        node.x = x;
                        node.y = y1;
                        node.width = w * node.value / sum;
                        node.height = hNode;
                        x += node.width;
                    }
                })
            } else {
                prevRate = rate;
                list.push(node);
            }
        }
    }

    private squarify(roots: TreeNode[], width: number, height: number, vertical: boolean): void {
        this.$_squarify(roots, 0, 0, width, height, vertical ? 1 : 0, this._sum);
    }

    private $_slice(nodes: TreeNode[], width: number, height: number, dir: number, sum: number): void {
        const n = nodes.length;
        let node: TreeNode;

        if (dir === 1) { // vertical
            let y = 0;
            let h = height;

            for (let i = 0; i < n - 1; i++) {
                node = nodes[i];
                const h2 = height * node.value / sum;

                node.x = 0;
                node.y = y;
                node.height = h2;
                node.width = width;
                h -= h2;
                y += h2;
            }
            node = nodes[n - 1];
            node.y = y;
            node.x = 0;
            node.height = h;
            node.width = width;
        } else {
            let x = 0;
            let w = width;

            for (let i = 0; i < n - 1; i++) {
                node = nodes[i];
                const w2 = width * node.value / sum;

                node.x = x;
                node.y = 0;
                node.width = w2;
                node.height = height;
                w -= w2;
                x += w2;
            }
            node = nodes[n - 1];
            node.x = x;
            node.y = 0;
            node.width = w;
            node.height = height;
        }
    }

    private sliceDice(roots: TreeNode[], width: number, height: number, vertical: boolean): void {
        this.$_slice(roots, width, height, vertical ? 1 : 0, this._sum);
    }
}